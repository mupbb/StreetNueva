import os
import logging
import httpx
from datetime import datetime, timezone
from .db import db_manager

logger = logging.getLogger(__name__)

class LuceroAgent:
    """
    Lucero: Tu Especialista en Estrategia y Publicación en LinkedIn.
    Se encarga EXCLUSIVAMENTE de gestionar el calendario editorial y publicar contenido.
    """
    
    def __init__(self):
        self.api_url = "https://api.linkedin.com/v2"

    async def get_my_urn(self):
        """Obtiene el identificador único (URN) del usuario de LinkedIn"""
        token = os.environ.get("LINKEDIN_ACCESS_TOKEN")
        headers = {"Authorization": f"Bearer {token}"}
        async with httpx.AsyncClient() as client:
            res = await client.get(f"{self.api_url}/me", headers=headers)
            if res.status_code == 200:
                return f"urn:li:person:{res.json()['id']}"
            else:
                logger.error(f"❌ Error obteniendo URN: {res.text}")
                return None

    async def post_to_linkedin(self, content):
        """Publica un post en el feed del usuario"""
        token = os.environ.get("LINKEDIN_ACCESS_TOKEN")
        author_urn = await self.get_my_urn()
        
        if not author_urn:
            return {"success": False, "error": "No se pudo identificar al usuario de LinkedIn."}

        headers = {
            "Authorization": f"Bearer {token}",
            "X-Restli-Protocol-Version": "2.0.0",
            "Content-Type": "application/json"
        }
        
        payload = {
            "author": author_urn,
            "lifecycleState": "PUBLISHED",
            "specificContent": {
                "com.linkedin.ugc.ShareContent": {
                    "shareCommentary": {"text": content},
                    "shareMediaCategory": "NONE"
                }
            },
            "visibility": {"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"}
        }

        async with httpx.AsyncClient() as client:
            res = await client.post(f"{self.api_url}/ugcPosts", headers=headers, json=payload)
            if res.status_code == 201:
                logger.info("✅ Post publicado exitosamente en LinkedIn.")
                return {"success": True, "data": res.json()}
            else:
                logger.error(f"❌ Error al publicar: {res.text}")
                return {"success": False, "error": res.text}

    async def get_today_post(self):
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
