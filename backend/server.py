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

# Scheduler for daily posts
scheduler = AsyncIOScheduler()

@app.on_event("startup")
async def startup_event():
    await db_manager.connect()
    # 9:00 AM - Educational
    scheduler.add_job(publish_daily_post, 'cron', hour=9, minute=0, args=[0])
    # 2:00 PM - Commercial
    scheduler.add_job(publish_daily_post, 'cron', hour=14, minute=0, args=[1])
    # 7:00 PM - Tip
    scheduler.add_job(publish_daily_post, 'cron', hour=19, minute=0, args=[2])
    
    scheduler.start()
    logger.info("📅 APScheduler iniciado: 3 posts diarios configurados.")

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
    """Obtiene la lista de clientes/prospectos"""
    db = await db_manager.get_db()
    leads = await db.leads.find().sort("last_update", -1).to_list(100)
    for lead in leads:
        lead["_id"] = str(lead["_id"])
        if isinstance(lead["last_update"], datetime):
            lead["last_update"] = lead["last_update"].isoformat()
    return leads

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

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)