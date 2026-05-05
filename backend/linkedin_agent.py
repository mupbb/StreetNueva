import os
import logging
from datetime import datetime, timezone
from .db import db_manager

logger = logging.getLogger(__name__)

class LuceroAgent:
    """
    Lucero: Tu Especialista en Estrategia y Publicación en LinkedIn.
    Se encarga EXCLUSIVAMENTE de gestionar el calendario editorial y publicar contenido.
    No interfiere con Alberto ni con WhatsApp.
    """
    
    @staticmethod
    async def get_today_post():
        """Calcula el post de Lucero para hoy basado en el calendario de 30 días"""
        db = await db_manager.get_db()
        # Buscamos la fecha de inicio oficial de Lucero
        config = await db.config.find_one({"key": "lucero_strategy_start"})
        if not config:
            # Empezamos hoy de nuevo como algo totalmente nuevo
            start_date = datetime.now(timezone.utc)
            await db.config.update_one(
                {"key": "lucero_strategy_start"},
                {"$set": {"value": start_date.isoformat()}},
                upsert=True
            )
        else:
            start_date = datetime.fromisoformat(config["value"])

        delta = (datetime.now(timezone.utc) - start_date).days
        day_number = (delta % 30) + 1
        
        post = await db.linkedin_calendar.find_one({"day": day_number})
        return post

    @staticmethod
    async def initialize_calendar(posts_json):
        """Inicializa el calendario de Lucero desde cero"""
        db = await db_manager.get_db()
        await db.linkedin_calendar.delete_many({}) # Limpieza total
        await db.linkedin_calendar.insert_many(posts_json)
        logger.info(f"✨ Lucero ha inicializado el calendario con {len(posts_json)} días de contenido.")

lucero = LuceroAgent()
