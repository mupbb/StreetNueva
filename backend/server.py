from fastapi import FastAPI, APIRouter, HTTPException
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


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World", "status": "healthy"}

@api_router.post("/")
async def root_post():
    """Health check endpoint for POST requests"""
    return {"message": "Hello World", "status": "healthy"}

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

# Fallback reviews data when Google Places API is not available
FALLBACK_REVIEWS = [
    GoogleReview(
        author_name="Carlos Mendoza",
        rating=5,
        text="Excelente servicio, mi auto quedó como nuevo. Muy profesionales y puntuales. Totalmente recomendados.",
        time="2024-01-15",
        profile_photo_url=None,
        relative_time_description="hace 1 mes"
    ),
    GoogleReview(
        author_name="Ana García",
        rating=5,
        text="Increíble la atención y el resultado. El detallado premium vale cada peso. Ya es mi servicio de confianza.",
        time="2024-01-10",
        profile_photo_url=None,
        relative_time_description="hace 2 meses"
    ),
    GoogleReview(
        author_name="Roberto Sánchez",
        rating=5,
        text="Muy conveniente que vengan a domicilio. El interior de mi camioneta quedó impecable. Volveré a contratar.",
        time="2024-01-05",
        profile_photo_url=None,
        relative_time_description="hace 2 meses"
    ),
    GoogleReview(
        author_name="María López",
        rating=5,
        text="El mejor servicio de detallado que he probado. Profesionales, amables y con resultados espectaculares.",
        time="2024-01-01",
        profile_photo_url=None,
        relative_time_description="hace 3 meses"
    )
]

FALLBACK_PLACE_INFO = GooglePlaceInfo(
    name="Street Prime Detail",
    rating=5.0,
    user_ratings_total=4,
    formatted_address="Prol. San Diego 110B, San Bartolo Ameyalco, Álvaro Obregón, CDMX",
    reviews=FALLBACK_REVIEWS
)

@api_router.get("/google-reviews", response_model=GooglePlaceInfo)
async def get_google_reviews():
    """Fetch reviews from Google Places API (New) with fallback"""
    # Return fallback if no API key configured
    if not GOOGLE_PLACES_API_KEY:
        logger.info("No Google Places API key configured, returning fallback reviews")
        return FALLBACK_PLACE_INFO
    
    # 1. Try to get from Cache first (24h validity)
    try:
        cache_doc = await db.cache.find_one({"type": "google_reviews"})
        if cache_doc:
            cached_time = datetime.fromisoformat(cache_doc['timestamp'])
            # If cache is less than 24 hours old, return it
            if (datetime.now(timezone.utc) - cached_time).total_seconds() < 86400:
                logger.info("Returning Google Reviews from cache")
                return GooglePlaceInfo(**cache_doc['data'])
    except Exception as e:
        logger.warning(f"Cache read error: {e}")

    # 2. If no cache or expired, fetch from Google
    url = f"https://places.googleapis.com/v1/places/{PLACE_ID}"
    headers = {
        "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": "displayName,rating,userRatingCount,formattedAddress,reviews"
    }
    params = {
        "languageCode": "es"
    }
    
    try:
        async with httpx.AsyncClient() as http_client:
            response = await http_client.get(url, headers=headers, params=params)
            
            if response.status_code != 200:
                logger.warning(f"Google Places API error: {response.status_code}, returning fallback reviews")
                return FALLBACK_PLACE_INFO
            
            data = response.json()
            reviews = data.get("reviews", [])
            
            # If no reviews from API, return fallback
            if not reviews:
                logger.info("No reviews from Google Places API, returning fallback reviews")
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

            # 3. Update Cache (Async update, don't wait for success for response)
            try:
                await db.cache.update_one(
                    {"type": "google_reviews"},
                    {
                        "$set": {
                            "timestamp": datetime.now(timezone.utc).isoformat(),
                            "data": result.model_dump()
                        }
                    },
                    upsert=True
                )
                logger.info("Google Reviews cache updated")
            except Exception as ce:
                logger.warning(f"Cache update error: {ce}")

            return result
    except Exception as e:
        logger.warning(f"Error fetching Google Places reviews: {e}, returning fallback reviews")
        return FALLBACK_PLACE_INFO

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# =====================================================
# META CONVERSIONS API INTEGRATION
# =====================================================

# Meta API Configuration
META_ACCESS_TOKEN = os.environ.get('META_ACCESS_TOKEN', '')
META_PIXEL_ID = os.environ.get('META_PIXEL_ID', '')
META_API_VERSION = "v18.0"

# Request/Response Models for Meta Events
class MetaEventRequest(BaseModel):
    event_name: str = Field(..., description="Event name: Purchase, Lead, Contact, etc.")
    value: float = Field(..., description="Event value/amount")
    currency: str = Field(default="MXN", description="Currency code (MXN, USD, etc.)")
    email: Optional[str] = Field(None, description="User email (will be hashed)")
    phone: Optional[str] = Field(None, description="User phone (will be hashed)")
    event_id: Optional[str] = Field(None, description="Unique event ID for deduplication")
    test_event_code: Optional[str] = Field(None, description="Test event code for testing mode")
    
    model_config = ConfigDict(json_schema_extra={
        "example": {
            "event_name": "Purchase",
            "value": 999.00,
            "currency": "MXN",
            "email": "cliente@ejemplo.com",
            "phone": "5512345678",
            "event_id": "evt_123456",
            "test_event_code": None
        }
    })

class MetaEventResponse(BaseModel):
    success: bool
    event_id: str
    events_received: Optional[int] = None
    messages: Optional[List[str]] = None
    fbtrace_id: Optional[str] = None
    error: Optional[str] = None

def hash_sha256(value: str) -> str:
    """Hash a value using SHA256 (Meta requirement)"""
    if not value:
        return None
    # Normalize: lowercase, strip whitespace
    normalized = value.lower().strip()
    return hashlib.sha256(normalized.encode('utf-8')).hexdigest()

def normalize_phone(phone: str) -> str:
    """Normalize phone number for hashing"""
    if not phone:
        return None
    # Remove spaces, dashes, parentheses, and + sign
    import re
    cleaned = re.sub(r'[\s\-\(\)\+]', '', phone)
    # Add country code if not present (Mexico = 52)
    if len(cleaned) == 10:
        cleaned = "52" + cleaned
    return cleaned

async def send_meta_event(
    event_name: str,
    email: Optional[str] = None,
    phone: Optional[str] = None,
    value: float = 0,
    currency: str = "MXN",
    event_id: Optional[str] = None,
    test_event_code: Optional[str] = None
) -> dict:
    """
    Send event to Meta Conversions API
    
    Args:
        event_name: Event type (Purchase, Lead, Contact, etc.)
        email: User email (unhashed)
        phone: User phone (unhashed)
        value: Transaction value
        currency: Currency code
        event_id: Unique ID for deduplication
        test_event_code: Optional test mode code
    
    Returns:
        dict with success status and Meta response
    """
    if not META_ACCESS_TOKEN or not META_PIXEL_ID:
        logger.error("Meta API credentials not configured")
        return {"success": False, "error": "Meta API credentials not configured"}
    
    # Generate event_id if not provided
    if not event_id:
        event_id = f"evt_{uuid.uuid4().hex[:12]}_{int(time.time())}"
    
    # Generate current timestamp in seconds
    event_time = int(time.time())
    
    # Hash user data
    user_data = {}
    if email:
        user_data["em"] = [hash_sha256(email)]
    if phone:
        normalized_phone = normalize_phone(phone)
        if normalized_phone:
            user_data["ph"] = [hash_sha256(normalized_phone)]
    
    # Build event payload
    event_payload = {
        "event_name": event_name,
        "event_time": event_time,
        "event_id": event_id,
        "action_source": "website",
        "user_data": user_data,
        "custom_data": {
            "currency": currency,
            "value": str(value)
        }
    }
    
    # Build request body
    request_body = {
        "data": [event_payload]
    }
    
    # Add test event code if provided
    if test_event_code:
        request_body["test_event_code"] = test_event_code
    
    # Meta API endpoint
    url = f"https://graph.facebook.com/{META_API_VERSION}/{META_PIXEL_ID}/events"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                params={"access_token": META_ACCESS_TOKEN},
                json=request_body,
                timeout=30.0
            )
            
            response_data = response.json()
            
            if response.status_code == 200:
                logger.info(f"Meta event sent successfully: {event_name}, event_id: {event_id}, response: {response_data}")
                return {
                    "success": True,
                    "event_id": event_id,
                    "events_received": response_data.get("events_received"),
                    "messages": response_data.get("messages"),
                    "fbtrace_id": response_data.get("fbtrace_id")
                }
            else:
                error_msg = response_data.get("error", {}).get("message", "Unknown error")
                logger.error(f"Meta API error: {response.status_code} - {error_msg}")
                return {
                    "success": False,
                    "event_id": event_id,
                    "error": error_msg
                }
                
    except Exception as e:
        logger.error(f"Error sending Meta event: {str(e)}")
        return {
            "success": False,
            "event_id": event_id,
            "error": str(e)
        }

@api_router.post("/meta-event", response_model=MetaEventResponse)
async def create_meta_event(request: MetaEventRequest):
    """
    Send conversion event to Meta Conversions API
    
    Use this endpoint to track:
    - Purchase: When a sale is completed
    - Lead: When a user submits contact info
    - Contact: When a user initiates contact
    - InitiateCheckout: When a user starts checkout
    - AddToCart: When a user adds to cart
    
    Example request:
    ```json
    {
        "event_name": "Purchase",
        "value": 999.00,
        "currency": "MXN",
        "email": "cliente@ejemplo.com",
        "phone": "5512345678"
    }
    ```
    """
    result = await send_meta_event(
        event_name=request.event_name,
        email=request.email,
        phone=request.phone,
        value=request.value,
        currency=request.currency,
        event_id=request.event_id,
        test_event_code=request.test_event_code
    )
    
    return MetaEventResponse(**result)

@api_router.post("/track-lead")
async def track_lead(
    email: Optional[str] = None,
    phone: Optional[str] = None,
    value: float = 0
):
    """Quick endpoint to track Lead events"""
    result = await send_meta_event(
        event_name="Lead",
        email=email,
        phone=phone,
        value=value,
        currency="MXN"
    )
    return result

@api_router.post("/track-purchase")
async def track_purchase(
    email: Optional[str] = None,
    phone: Optional[str] = None,
    value: float = 0,
    currency: str = "MXN"
):
    """Quick endpoint to track Purchase events"""
    result = await send_meta_event(
        event_name="Purchase",
        email=email,
        phone=phone,
        value=value,
        currency=currency
    )
    return result

# Include the router in the main app
app.include_router(api_router)

# Root-level health check for Kubernetes/deployment
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()