import os
import logging
import httpx
from datetime import datetime, timezone
from .db import db_manager

logger = logging.getLogger(__name__)

class ValentinaAgent:
    """
    Valentina: Tu Especialista en TikTok.
    Se encarga de la educación masiva y viralidad de los servicios de Street Prime.
    """
    
    def __init__(self):
        self.api_url = "https://open-api.tiktok.com"
        # Valentina usará tokens de TikTok Business cuando estén configurados
        self.access_token = os.environ.get("TIKTOK_ACCESS_TOKEN")

    async def get_today_script(self):
        """Obtiene el guion de Valentina para el video de hoy"""
        db = await db_manager.get_db()
        config = await db.config.find_one({"key": "valentina_strategy_start"})
        if not config:
            start_date = datetime.now(timezone.utc)
            await db.config.update_one(
                {"key": "valentina_strategy_start"},
                {"$set": {"value": start_date.isoformat()}},
                upsert=True
            )
        else:
            start_date = datetime.fromisoformat(config["value"])

        delta = (datetime.now(timezone.utc) - start_date).days
        day_number = (delta % 30) + 1
        
        script = await db.tiktok_calendar.find_one({"day": day_number})
        return script

    async def initialize_calendar(self, scripts_json):
        """Carga los guiones de Valentina al sistema"""
        db = await db_manager.get_db()
        await db.tiktok_calendar.delete_many({})
        await db.tiktok_calendar.insert_many(scripts_json)
        logger.info(f"🎵 Valentina ha cargado su enciclopedia de 30 videos.")

    async def prepare_metadata(self, day):
        """Prepara los hashtags y descripción optimizada para TikTok"""
        script = await self.get_today_script()
        if not script: return None
        
        tags = "#Detailing #StreetPrime #CarCare #CDMX #DetailingLife #TikTokCars"
        description = f"{script['title']} 🚗✨\n\n{script['hook']}\n\n{tags}"
        return description

valentina = ValentinaAgent()
