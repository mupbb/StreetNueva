from fastapi import FastAPI, APIRouter, HTTPException, Request, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import httpx
import hashlib
import time
import json
from apscheduler.schedulers.asyncio import AsyncIOScheduler

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from .alberto_agent import process_alberto_message
from .social_agent import publish_daily_post
from .db import db_manager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Scheduler for daily posts
scheduler = AsyncIOScheduler()

from .meta_agent import estela

# --- ESTELA (META FB/IG) ENDPOINTS ---

@api_router.get("/meta/today")
async def get_meta_today():
    """Obtiene el post que Estela tiene preparado para hoy"""
    post = await estela.get_today_post()
    if not post:
        return {"message": "Estela no tiene posts para hoy"}
    post["_id"] = str(post["_id"])
    return post

@api_router.post("/meta/post-now")
async def post_meta_now(platform: str = "facebook"):
    """Ordena a Estela publicar hoy mismo"""
    post = await estela.get_today_post()
    if not post: return {"error": "No hay post hoy"}
    
    if platform == "facebook":
        return await estela.post_to_facebook(post["content"])
    else:
        # Nota: Instagram requiere una URL de imagen válida para el API
        return {"error": "Publicación de Instagram requiere media hosting"}

@app.on_event("startup")
async def startup_event():
    await db_manager.connect()
    # 9:00 AM - Educational
    scheduler.add_job(publish_daily_post, 'cron', hour=9, minute=0, args=[0])
    # 2:00 PM - Commercial
    scheduler.add_job(publish_daily_post, 'cron', hour=14, minute=0, args=[1])
    # 9:00 PM - Tip (Estrategia Nocturna CDMX)
    scheduler.add_job(publish_daily_post, 'cron', hour=21, minute=0, args=[2])
    
    # --- AUTONOMÍA DE LUCERO & ESTELA ---
    scheduler.add_job(check_and_run_lucero, 'cron', hour=6, minute=0)
    scheduler.add_job(check_and_run_estela, 'cron', hour=7, minute=0) # Estela publica a las 7 AM
    
    scheduler.start()
    logger.info("📅 APScheduler: Alberto, Lucero, Estela y Social Agent activos.")

async def check_and_run_estela():
    """Función autónoma de Estela: Publica en FB/IG cada mañana"""
    logger.info("🤖 Estela: Revisando calendario...")
    post = await estela.get_today_post()
    if post and post.get("status") != "published":
        res = await estela.post_to_facebook(post["content"])
        if res.get("success"):
            db = await db_manager.get_db()
            await db.meta_calendar.update_one({"day": post["day"]}, {"$set": {"status": "published"}})
            logger.info("✨ Estela publicó automáticamente en Facebook.")

async def check_and_run_lucero():
    """Función autónoma de Lucero: Revisa el calendario y publica si toca hoy"""
    logger.info("🤖 Lucero: Revisando calendario para publicación autónoma...")
    post = await lucero.get_today_post()
    if post and post.get("status") != "published":
        result = await lucero.post_to_linkedin(post["content"])
        if result.get("success"):
            db = await db_manager.get_db()
            await db.linkedin_calendar.update_one({"day": post["day"]}, {"$set": {"status": "published"}})
            logger.info(f"✨ Lucero publicó automáticamente el Día {post['day']}")

@api_router.post("/social/post-now")
async def post_social_now(post_type: int = 2):
    """Dispara una publicación en Threads inmediatamente"""
    result = await publish_daily_post(post_type)
    return result

@app.on_event("shutdown")
async def shutdown_event():
    scheduler.shutdown()

# Middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"DEBUG: Incoming {request.method} request to {request.url}")
    response = await call_next(request)
    return response

api_router = APIRouter(prefix="/api")

# --- ADMIN ENDPOINTS (SECRET URL) ---

@api_router.get("/conversations")
async def get_conversations(phone: Optional[str] = None):
    """Obtiene el historial de chats"""
    db = await db_manager.get_db()
    query = {"phone": phone} if phone else {}
    chats = await db.conversations.find(query).sort("timestamp", -1).to_list(500)
    # Convertir ObjectId y datetime a string para JSON
    for chat in chats:
        chat["_id"] = str(chat["_id"])
        if isinstance(chat["timestamp"], datetime):
            chat["timestamp"] = chat["timestamp"].isoformat()
    return chats

@api_router.get("/leads")
async def get_leads():
    """Obtiene la lista de clientes/prospectos basándose en las conversaciones"""
    db = await db_manager.get_db()
    
    # Obtenemos los números únicos de la colección de conversaciones
    unique_phones = await db.conversations.distinct("phone")
    
    results = []
    for phone in unique_phones:
        # Buscamos si tiene una ficha de lead
        lead_data = await db.leads.find_one({"phone": phone})
        # Buscamos el último mensaje para mostrar la hora de actividad
        last_msg = await db.conversations.find_one({"phone": phone}, sort=[("timestamp", -1)])
        
        results.append({
            "phone": phone,
            "name": lead_data.get("name") if lead_data else "Cliente Nuevo",
            "status": lead_data.get("status") if lead_data else "CHATEANDO",
            "last_update": last_msg.get("timestamp").isoformat() if last_msg else datetime.now(timezone.utc).isoformat()
        })
    
    # Ordenar por el más reciente
    results.sort(key=lambda x: x["last_update"], reverse=True)
    return results

# --- GOOGLE REVIEWS FALLBACK ---
# (Keeping your existing reviews logic)
FALLBACK_REVIEWS = [
    {"author_name": "Carlos Mendoza", "rating": 5, "text": "Excelente servicio, mi auto quedó como nuevo.", "time": "2024-01-15"},
    {"author_name": "Ana García", "rating": 5, "text": "Increíble la atención y el resultado.", "time": "2024-01-10"}
]

@api_router.get("/google-reviews")
async def get_google_reviews():
    return {
        "name": "Street Prime Detail",
        "rating": 5.0,
        "user_ratings_total": 4,
        "formatted_address": "Álvaro Obregón, CDMX",
        "reviews": FALLBACK_REVIEWS
    }

# --- WEBHOOKS ---

VERIFY_TOKEN = os.environ.get('META_VERIFY_TOKEN', 'alberto_social_v1')

@api_router.get("/webhook")
async def verify_webhook(request: Request):
    params = request.query_params
    if params.get("hub.mode") == "subscribe" and params.get("hub.verify_token") == VERIFY_TOKEN:
        return Response(content=params.get("hub.challenge"), media_type="text/plain")
    return Response(content="Verification failed", status_code=403)

@api_router.post("/webhook")
async def handle_webhook(request: Request):
    try:
        data = await request.json()
        if data.get("object") == "whatsapp_business_account":
            for entry in data.get("entry", []):
                for change in entry.get("changes", []):
                    value = change.get("value", {})
                    messages = value.get("messages", [])
                    for msg in messages:
                        from_phone = msg.get("from")
                        text_body = msg.get("text", {}).get("body")
                        if text_body:
                            await process_alberto_message(from_phone, text_body)
        return {"status": "ok"}
    except Exception as e:
        logger.error(f"Error en webhook: {str(e)}")
        return {"status": "error"}

from fastapi.responses import HTMLResponse

@app.get("/alberto-admin", response_class=HTMLResponse)
async def get_admin_dashboard():
    return """
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Alberto Admin | Street Prime</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
        <style>
            body { margin: 0; font-family: 'Inter', sans-serif; background: #0a0a0a; color: white; display: flex; height: 100vh; }
            #sidebar { width: 350px; border-right: 1px solid #333; background: #111; overflow-y: auto; }
            #chat-area { flex: 1; display: flex; flexDirection: column; background: #0a0a0a; }
            .header { padding: 20px; border-bottom: 1px solid #333; }
            .header h1 { margin: 0; font-size: 1.2rem; color: #ffd700; }
            .lead-item { padding: 15px 20px; cursor: pointer; border-bottom: 1px solid #222; transition: 0.2s; }
            .lead-item:hover { background: #222; }
            .lead-item.active { background: #333; border-left: 4px solid #ffd700; }
            .chat-window { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
            .msg { max-width: 75%; padding: 12px 16px; borderRadius: 15px; font-size: 0.95rem; line-height: 1.4; position: relative; }
            .msg.user { align-self: flex-start; background: #333; border-radius: 15px 15px 15px 0; }
            .msg.alberto { align-self: flex-end; background: #ffd700; color: black; border-radius: 15px 15px 0 15px; }
            .msg-time { font-size: 0.6rem; margin-top: 5px; opacity: 0.6; text-align: right; }
            #empty-state { flex: 1; display: flex; align-items: center; justify-content: center; color: #555; }
        </style>
    </head>
    <body>
        <div id="sidebar">
            <div class="header"><h1>Alberto Admin</h1><p style="font-size:0.8rem;color:#888">Control en tiempo real</p></div>
            <div id="leads-list"></div>
        </div>
        <div id="chat-area">
            <div id="chat-header" class="header" style="display:none">
                <h3 id="chat-title" style="margin:0"></h3>
            </div>
            <div id="chat-window" class="chat-window">
                <div id="empty-state">Selecciona un cliente para ver el chat</div>
            </div>
        </div>

        <script>
            let selectedPhone = null;

            async function fetchLeads() {
                const res = await fetch('/api/leads');
                const leads = await res.json();
                const list = document.getElementById('leads-list');
                list.innerHTML = leads.map(l => `
                    <div class="lead-item ${selectedPhone === l.phone ? 'active' : ''}" onclick="selectLead('${l.phone}')">
                        <div style="font-weight:bold">${l.name || 'Cliente Nuevo'}</div>
                        <div style="font-size:0.8rem;color:#888">${l.phone}</div>
                        <div style="font-size:0.7rem;color:#ffd700;margin-top:4px">${l.status || 'PROSPECTO'}</div>
                    </div>
                `).join('');
            }

            async function fetchMessages() {
                if (!selectedPhone) return;
                const res = await fetch('/api/conversations?phone=' + selectedPhone);
                const msgs = await res.json();
                const window = document.getElementById('chat-window');
                document.getElementById('empty-state').style.display = 'none';
                document.getElementById('chat-header').style.display = 'block';
                document.getElementById('chat-title').innerText = 'Chat con ' + selectedPhone;
                
                window.innerHTML = msgs.reverse().map(m => `
                    <div class="msg ${m.role}">
                        ${m.message}
                        <div class="msg-time">${new Date(m.timestamp).toLocaleTimeString()}</div>
                    </div>
                `).join('');
                window.scrollTop = window.scrollHeight;
            }

            function selectLead(phone) {
                selectedPhone = phone;
                fetchLeads();
                fetchMessages();
            }

            setInterval(fetchLeads, 10000);
            setInterval(fetchMessages, 3000);
            fetchLeads();
        </script>
    </body>
    </html>
    """

from .linkedin_agent import lucero

# --- LUCERO (LINKEDIN) ENDPOINTS ---

@api_router.get("/linkedin/today")
async def get_linkedin_today():
    """Obtiene el post que Lucero tiene preparado para hoy"""
    post = await lucero.get_today_post()
    if not post:
        return {"message": "Lucero no tiene posts programados para hoy"}
    post["_id"] = str(post["_id"])
    return post

@api_router.post("/linkedin/post-now")
async def post_linkedin_now():
    """Ordena a Lucero publicar el post de hoy inmediatamente"""
    post = await lucero.get_today_post()
    if not post:
        return {"success": False, "error": "No hay post programado para hoy."}
    
    result = await lucero.post_to_linkedin(post["content"])
    return result

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)