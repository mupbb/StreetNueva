from fastapi import FastAPI, APIRouter, HTTPException, Request, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
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

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db_name = os.environ.get('DB_NAME', 'DetailAutomotriz')
db = client[db_name]

# Create the main app
app = FastAPI()

# Scheduler for daily posts
scheduler = AsyncIOScheduler()

@app.on_event("startup")
async def start_scheduler():
    # 9:00 AM - Educational
    scheduler.add_job(publish_daily_post, 'cron', hour=9, minute=0, args=[0])
    # 2:00 PM - Commercial
    scheduler.add_job(publish_daily_post, 'cron', hour=14, minute=0, args=[1])
    # 7:00 PM - Tip
    scheduler.add_job(publish_daily_post, 'cron', hour=19, minute=0, args=[2])
    
    scheduler.start()
    logger.info("📅 APScheduler iniciado: 3 posts diarios configurados.")

# Middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"DEBUG: Incoming {request.method} request to {request.url}")
    response = await call_next(request)
    return response

api_router = APIRouter(prefix="/api")

# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

@api_router.get("/")
async def root():
    return {"message": "Street Prime Detail API", "status": "active"}

# Google Places API configuration
GOOGLE_PLACES_API_KEY = os.environ.get('GOOGLE_PLACES_API_KEY', '')
PLACE_ID = os.environ.get('GOOGLE_PLACE_ID', 'ChIJRwXRS8oB0oURmfGB_siofDU')

# Google Reviews Models
class GoogleReview(BaseModel):
    author_name: str
    rating: int
    text: str
    time: str
    profile_photo_url: Optional[str] = None
    relative_time_description: Optional[str] = None

class GooglePlaceInfo(BaseModel):
    name: str
    rating: float
    user_ratings_total: int
    formatted_address: str
    reviews: List[GoogleReview]

@api_router.get("/google-reviews", response_model=GooglePlaceInfo)
async def get_google_reviews():
    """Fetch reviews from Google Places API (New) with fallback"""
    if not GOOGLE_PLACES_API_KEY:
        logger.info("No Google Places API key configured, returning fallback reviews")
        return FALLBACK_PLACE_INFO
    
    try:
        cache_doc = await db.cache.find_one({"type": "google_reviews"})
        if cache_doc:
            cached_time = datetime.fromisoformat(cache_doc['timestamp'])
            if (datetime.now(timezone.utc) - cached_time).total_seconds() < 86400:
                return GooglePlaceInfo(**cache_doc['data'])
    except Exception as e:
        logger.warning(f"Cache read error: {e}")

    url = f"https://places.googleapis.com/v1/places/{PLACE_ID}"
    headers = {"X-Goog-Api-Key": GOOGLE_PLACES_API_KEY, "X-Goog-FieldMask": "displayName,rating,userRatingCount,formattedAddress,reviews"}
    
    try:
        async with httpx.AsyncClient() as http_client:
            response = await http_client.get(url, headers=headers, params={"languageCode": "es"})
            if response.status_code != 200:
                return FALLBACK_PLACE_INFO
            
            data = response.json()
            reviews = data.get("reviews", [])
            if not reviews:
                return FALLBACK_PLACE_INFO
            
            formatted_reviews = []
            for review in reviews:
                author = review.get("authorAttribution", {})
                formatted_reviews.append(GoogleReview(
                    author_name=author.get("displayName", "Anónimo"),
                    rating=review.get("rating", 5),
                    text=review.get("text", {}).get("text", "") if isinstance(review.get("text"), dict) else review.get("text", ""),
                    time=review.get("publishTime", ""),
                    profile_photo_url=author.get("photoUri"),
                    relative_time_description=review.get("relativePublishTimeDescription")
                ))
            
            result = GooglePlaceInfo(
                name=data.get("displayName", {}).get("text", "Street Prime Detail") if isinstance(data.get("displayName"), dict) else data.get("displayName", "Street Prime Detail"),
                rating=data.get("rating", 5.0),
                user_ratings_total=data.get("userRatingCount", 0),
                formatted_address=data.get("formattedAddress", ""),
                reviews=formatted_reviews
            )

            await db.cache.update_one({"type": "google_reviews"}, {"$set": {"timestamp": datetime.now(timezone.utc).isoformat(), "data": result.model_dump()}}, upsert=True)
            return result
    except Exception as e:
        logger.warning(f"Error fetching Google Reviews: {e}")
        return FALLBACK_PLACE_INFO

FALLBACK_REVIEWS = [
    GoogleReview(author_name="Carlos Mendoza", rating=5, text="Excelente servicio, mi auto quedó como nuevo.", time="2024-01-15"),
    GoogleReview(author_name="Ana García", rating=5, text="Increíble la atención y el resultado.", time="2024-01-10")
]

FALLBACK_PLACE_INFO = GooglePlaceInfo(
    name="Street Prime Detail",
    rating=5.0,
    user_ratings_total=4,
    formatted_address="Prol. San Diego 110B, San Bartolo Ameyalco, Álvaro Obregón, CDMX",
    reviews=FALLBACK_REVIEWS
)

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

# =====================================================
# META WEBHOOK INTEGRATION (UNIFIED)
# =====================================================

VERIFY_TOKEN = os.environ.get('META_VERIFY_TOKEN', 'alberto_social_v1')

@api_router.get("/webhook")
async def verify_webhook(request: Request):
    params = request.query_params
    mode = params.get("hub.mode")
    token = params.get("hub.verify_token")
    challenge = params.get("hub.challenge")

    if mode == "subscribe" and token == VERIFY_TOKEN:
        logger.info("✅ Webhook verificado correctamente.")
        return Response(content=challenge, media_type="text/plain")
    
    return Response(content="Verification failed", status_code=403)

@api_router.post("/webhook")
async def handle_webhook(request: Request):
    try:
        data = await request.json()
        logger.info(f"📩 Webhook recibido: {json.dumps(data)}")

        if data.get("object") == "whatsapp_business_account":
            for entry in data.get("entry", []):
                for change in entry.get("changes", []):
                    value = change.get("value", {})
                    metadata = value.get("metadata", {})
                    
                    phone_number_id = metadata.get("phone_number_id")
                    if phone_number_id:
                        os.environ["WHATSAPP_PHONE_NUMBER_ID"] = phone_number_id
                    
                    messages = value.get("messages", [])
                    for msg in messages:
                        from_phone = msg.get("from")
                        text_body = msg.get("text", {}).get("body")
                        if text_body:
                            await process_alberto_message(from_phone, text_body)

        return {"status": "ok"}
    except Exception as e:
        logger.error(f"Error en webhook: {str(e)}")
        return {"status": "error", "message": str(e)}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown():
    scheduler.shutdown()
    client.close()