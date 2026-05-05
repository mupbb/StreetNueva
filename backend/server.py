import os
import logging
import httpx
from datetime import datetime, timezone
from fastapi import FastAPI, Request, APIRouter, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from .db import db_manager
from .alberto_agent import process_alberto_message
from .linkedin_agent import lucero
from .meta_agent import estela
from .social_agent import publish_daily_post
from .tiktok_agent import valentina

# Configuración de Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Street Prime Multi-Agent API")
api_router = APIRouter(prefix="/api")

# --- SCHEDULER (Automatización) ---
scheduler = AsyncIOScheduler()

async def daily_social_tasks():
    logger.info("🚀 Iniciando tareas diarias de agentes sociales...")
    # Lucero a las 6:00 AM (Post LinkedIn)
    post_li = await lucero.get_today_post()
    if post_li: await lucero.post_to_linkedin(post_li["content"])
    
    # Estela a las 7:00 AM (Post Meta)
    post_meta = await estela.get_today_post()
    if post_meta: await estela.post_to_meta(post_meta["content"])
    
    # Threads (Ejemplo: publicación comercial a las 2 PM)
    await publish_daily_post(1)

# --- ENDPOINTS GENERALES ---

@app.get("/")
async def root():
    return {"status": "Street Prime API is Running", "agents": ["Alberto", "Lucero", "Estela", "Valentina", "Threads"]}

@api_router.get("/leads")
async def get_leads():
    db = await db_manager.get_db()
    leads = await db.leads.find().to_list(100)
    results = []
    for lead in leads:
        phone = lead["phone"]
        last_msg = await db.conversations.find_one({"phone": phone}, sort=[("timestamp", -1)])
        results.append({
            "phone": phone,
            "name": lead.get("name", "Cliente Nuevo"),
            "status": lead.get("status", "CHATEANDO"),
            "last_update": last_msg.get("timestamp").isoformat() if last_msg else datetime.now(timezone.utc).isoformat()
        })
    results.sort(key=lambda x: x["last_update"], reverse=True)
    return results

@api_router.get("/conversations")
async def get_conversations(phone: str):
    db = await db_manager.get_db()
    msgs = await db.conversations.find({"phone": phone}).sort("timestamp", -1).to_list(50)
    for m in msgs: m["_id"] = str(m["_id"])
    return msgs

# --- AGENT ENDPOINTS (LinkedIn, Meta, TikTok, Threads) ---

@api_router.get("/linkedin/today")
async def get_li():
    p = await lucero.get_today_post()
    if p: p["_id"] = str(p["_id"])
    return p or {"message": "Sin post hoy"}

@api_router.get("/meta/today")
async def get_mt():
    p = await estela.get_today_post()
    if p: p["_id"] = str(p["_id"])
    return p or {"message": "Sin post hoy"}

@api_router.get("/tiktok/today")
async def get_tk():
    p = await valentina.get_today_script()
    if p: p["_id"] = str(p["_id"])
    return p or {"message": "Sin guion hoy"}

@api_router.post("/{agent}/post-now")
async def post_now(agent: str):
    if agent == "threads": 
        await publish_daily_post(1)
        return {"status": "Post de Threads enviado"}
    return {"status": "Petición enviada"}

# --- WEBHOOKS (WhatsApp) ---
VERIFY_TOKEN = os.environ.get('META_VERIFY_TOKEN', 'alberto_social_v1')

@api_router.get("/webhook")
async def verify(request: Request):
    params = request.query_params
    if params.get("hub.verify_token") == VERIFY_TOKEN:
        return Response(content=params.get("hub.challenge"), media_type="text/plain")
    return Response(status_code=403)

@api_router.post("/webhook")
async def handle_webhook(request: Request):
    try:
        data = await request.json()
        messages = data.get("entry", [{}])[0].get("changes", [{}])[0].get("value", {}).get("messages", [])
        for m in messages:
            await process_alberto_message(m["from"], m.get("text", {}).get("body"))
    except: pass
    return {"status": "ok"}

# --- DASHBOARD HTML (Multi-Agent) ---

@app.get("/alberto-admin", response_class=HTMLResponse)
async def get_admin_dashboard():
    return """
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>STREET PRIME EMPIRE V1.0</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
        <style>
            body { margin: 0; font-family: 'Inter', sans-serif; background: #050505; color: white; display: flex; height: 100vh; overflow: hidden; }
            #nav { width: 80px; background: #000; display: flex; flex-direction: column; align-items: center; padding: 20px 0; border-right: 1px solid #222; }
            .icon { padding: 20px; cursor: pointer; opacity: 0.4; transition: 0.3s; font-size: 1.6rem; }
            .icon.active { opacity: 1; transform: scale(1.1); filter: drop-shadow(0 0 5px #ffd700); }
            #main { flex: 1; display: flex; background: #080808; overflow: hidden; }
            #sidebar { width: 350px; border-right: 1px solid #222; background: #0a0a0a; overflow-y: auto; }
            #chat { flex: 1; display: flex; flex-direction: column; padding: 20px; overflow-y: auto; gap: 10px; background: #050505; }
            .header { padding: 20px; border-bottom: 1px solid #222; background: #000; }
            .header h1 { margin: 0; font-size: 1.1rem; color: #ffd700; }
            .lead { padding: 15px 20px; cursor: pointer; border-bottom: 1px solid #111; transition: 0.2s; }
            .lead.active { background: #1a1a1a; border-left: 3px solid #ffd700; }
            .msg { max-width: 70%; padding: 12px 16px; border-radius: 15px; font-size: 0.9rem; margin-bottom: 5px; }
            .msg.user { align-self: flex-start; background: #222; border-radius: 15px 15px 15px 0; }
            .msg.alberto { align-self: flex-end; background: #ffd700; color: #000; border-radius: 15px 15px 0 15px; }
            .view { flex: 1; padding: 40px; overflow-y: auto; display: none; }
            .view.active { display: block; }
            .card { background: #111; padding: 30px; border-radius: 20px; border: 1px solid #333; margin-top: 20px; }
            .btn { background: #ffd700; color: #000; border: none; padding: 12px 25px; border-radius: 10px; font-weight: bold; cursor: pointer; margin-top: 15px; }
            .prompt { background: #000; padding: 15px; border-radius: 10px; border: 1px dashed #555; margin: 15px 0; color: #aaa; font-style: italic; }
            pre { white-space: pre-wrap; color: #ccc; font-size: 0.9rem; background: #000; padding: 15px; border-radius: 8px; border: 1px solid #222; }
        </style>
    </head>
    <body>
        <nav id="nav">
            <div class="icon active" onclick="tab('whatsapp')">📱</div>
            <div class="icon" onclick="tab('linkedin')">💼</div>
            <div class="icon" onclick="tab('meta')">📸</div>
            <div class="icon" onclick="tab('tiktok')">🎵</div>
            <div class="icon" onclick="tab('threads')">🧵</div>
        </nav>
        <main id="main">
            <div id="v-whatsapp" style="display: flex; width: 100%;">
                <div id="sidebar"><div class="header"><h1>WhatsApp (Alberto)</h1></div><div id="leads"></div></div>
                <div id="chat"><div style="margin:auto;color:#333">Selecciona un cliente</div></div>
            </div>
            <div id="v-linkedin" class="view"><h1 style="color:#ffd700">Lucero (LinkedIn)</h1><div id="li-data" class="card"></div></div>
            <div id="v-meta" class="view"><h1 style="color:#1F6AE1">Estela (Meta FB/IG)</h1><div id="mt-data" class="card"></div></div>
            <div id="v-tiktok" class="view"><h1 style="color:#ff0050">Valentina (TikTok)</h1><div id="tk-data" class="card"></div></div>
            <div id="v-threads" class="view"><h1 style="color:#fff">Threads</h1><div class="card"><button class="btn" onclick="post('threads')">Publicar en Threads</button></div></div>
        </main>
        <script>
            let current = 'whatsapp'; let selPhone = null;
            function tab(t) {
                current = t;
                document.querySelectorAll('.icon').forEach(i => i.classList.remove('active'));
                document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
                document.getElementById('v-whatsapp').style.display = t === 'whatsapp' ? 'flex' : 'none';
                if(event) event.target.classList.add('active');
                if(t !== 'whatsapp') { document.getElementById('v-' + t).classList.add('active'); load(t); }
            }
            async function load(a) {
                const res = await fetch(`/api/${a}/today`); const d = await res.json();
                const c = document.getElementById(a.substring(0,2) + '-data');
                if(!d || d.message) {
                    c.innerHTML = `<p style="color:#666;text-align:center;padding:20px;">☕ ${d.message || 'Sin contenido hoy.'}</p>`;
                    return;
                }
                if(a === 'tiktok') {
                    c.innerHTML = `<h2>Dia ${d.day}: ${d.service}</h2><div class="prompt"><p style="color:#ff0050;font-weight:bold;font-size:0.7rem;margin:0">NANO BANANA PROMPT:</p>"Hyper-realistic cinematic detailing of ${d.service}, macro shots, vertical 9:16, 4k."</div><pre>${d.body}</pre><button class="btn" onclick="copyText('tk-b')">Copiar Guion</button><div id="tk-b" style="display:none">${d.body}</div>`;
                } else {
                    c.innerHTML = `<h2>Dia ${d.day || 1}</h2><pre>${d.content || d.body}</pre><button class="btn" onclick="copyText('${a}-c')">Copiar</button><div id="${a}-c" style="display:none">${d.content || d.body}</div>`;
                }
            }
            async function fetchLeads() {
                const res = await fetch('/api/leads'); const leads = await res.json();
                document.getElementById('leads').innerHTML = leads.map(l => `<div class="lead ${selPhone === l.phone ? 'active' : ''}" onclick="sel('${l.phone}')"><b>${l.name}</b><br><small>${l.phone}</small></div>`).join('');
            }
            async function sel(p) {
                selPhone = p; fetchLeads();
                const res = await fetch(`/api/conversations?phone=${p}`); const msgs = await res.json();
                const win = document.getElementById('chat');
                win.innerHTML = msgs.reverse().map(m => `<div class="msg ${m.role}">${m.message}</div>`).join('');
                win.scrollTop = win.scrollHeight;
            }
            function copyText(id) { navigator.clipboard.writeText(document.getElementById(id).innerText); alert("¡Copiado!"); }
            async function post(a) { await fetch(`/api/${a}/post-now`, {method:'POST'}); alert("Enviado"); }
            setInterval(() => { if(current === 'whatsapp') fetchLeads(); }, 10000);
            fetchLeads();
        </script>
    </body>
    </html>
    """

app.include_router(api_router)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.on_event("startup")
async def startup():
    await db_manager.connect()
    scheduler.start()
    scheduler.add_job(daily_social_tasks, 'cron', hour=7, minute=0)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))