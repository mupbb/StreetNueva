import os
import logging
import httpx
from datetime import datetime, timezone
from .db import db_manager

logger = logging.getLogger(__name__)

class EstelaAgent:
    """
    Estela: Tu Especialista en Facebook e Instagram.
    Se encarga de la monetización en FB y consolidación de comunidad en IG.
    """
    
    def __init__(self):
        self.api_url = "https://graph.facebook.com/v19.0"
        self.access_token = os.environ.get("META_ACCESS_TOKEN")
        self.page_id = os.environ.get("META_PAGE_ID") # ID de tu FanPage de Facebook
        self.ig_user_id = os.environ.get("META_IG_USER_ID") # ID de tu cuenta Business de Instagram

    async def post_to_facebook(self, message, link=None):
        """Publica un post en la página de Facebook"""
        url = f"{self.api_url}/{self.page_id}/feed"
        payload = {
            "message": message,
            "access_token": self.access_token
        }
        if link:
            payload["link"] = link
            
        async with httpx.AsyncClient() as client:
            res = await client.post(url, data=payload)
            if res.status_code == 200:
                logger.info("✅ Estela publicó exitosamente en Facebook.")
                return {"success": True, "id": res.json().get("id")}
            else:
                logger.error(f"❌ Error en Facebook: {res.text}")
                return {"success": False, "error": res.text}

    async def post_to_instagram(self, image_url, caption):
        """Publica una imagen/video en Instagram (requiere hosting de imagen)"""
        # 1. Crear el contenedor de media
        url_container = f"{self.api_url}/{self.ig_user_id}/media"
        payload_container = {
            "image_url": image_url,
            "caption": caption,
            "access_token": self.access_token
        }
        
        async with httpx.AsyncClient() as client:
            res = await client.post(url_container, data=payload_container)
            if res.status_code != 200:
                return {"success": False, "error": f"Error contenedor IG: {res.text}"}
            
            creation_id = res.json().get("id")
            
            # 2. Publicar el contenedor
            url_publish = f"{self.api_url}/{self.ig_user_id}/media_publish"
            payload_publish = {
                "creation_id": creation_id,
                "access_token": self.access_token
            }
            res_pub = await client.post(url_publish, data=payload_publish)
            if res_pub.status_code == 200:
                logger.info("✅ Estela publicó exitosamente en Instagram.")
                return {"success": True, "id": res_pub.json().get("id")}
            else:
                return {"success": False, "error": f"Error publicación IG: {res_pub.text}"}

    async def get_today_post(self):
        """Calcula el post de Estela para hoy basado en el calendario de 30 días"""
        db = await db_manager.get_db()
        config = await db.config.find_one({"key": "estela_strategy_start"})
        if not config:
            start_date = datetime.now(timezone.utc)
            await db.config.update_one(
                {"key": "estela_strategy_start"},
                {"$set": {"value": start_date.isoformat()}},
                upsert=True
            )
        else:
            start_date = datetime.fromisoformat(config["value"])

        delta = (datetime.now(timezone.utc) - start_date).days
        day_number = (delta % 30) + 1
        
        post = await db.meta_calendar.find_one({"day": day_number})
        return post

    async def initialize_calendar(self, posts_json):
        """Carga los posts del calendario de Estela"""
        db = await db_manager.get_db()
        await db.meta_calendar.delete_many({})
        await db.meta_calendar.insert_many(posts_json)
        logger.info(f"✨ Estela ha cargado su calendario de 30 días.")

estela = EstelaAgent()
