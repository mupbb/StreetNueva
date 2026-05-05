import os
import httpx
import time
import logging
import hashlib

logger = logging.getLogger(__name__)

async def send_capi_event(event_name, user_data=None):
    """
    Envía un evento de conversión a Meta vía API.
    """
    pixel_id = os.environ.get("META_PIXEL_ID", "1227206209564785")
    access_token = os.environ.get("META_ACCESS_TOKEN")
    
    if not access_token:
        logger.warning("⚠️ No hay META_ACCESS_TOKEN configurado para CAPI.")
        return

    url = f"https://graph.facebook.com/v18.0/{pixel_id}/events"
    
    # Datos básicos del evento
    event_data = {
        "event_name": event_name,
        "event_time": int(time.time()),
        "action_source": "system_generated",
        "user_data": {
            "client_user_agent": "Alberto-AI-Agent",
        }
    }

    # Si tenemos el teléfono, lo hasheamos (requisito de Meta por privacidad)
    if user_data and "phone" in user_data:
        phone = str(user_data["phone"]).replace("+", "").strip()
        event_data["user_data"]["ph"] = [hashlib.sha256(phone.encode()).hexdigest()]

    payload = {
        "data": [event_data],
        "access_token": access_token
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload)
            if response.status_code == 200:
                logger.info(f"✅ Evento CAPI '{event_name}' enviado con éxito a Meta.")
            else:
                logger.error(f"❌ Error enviando CAPI: {response.text}")
    except Exception as e:
        logger.error(f"❌ Error de conexión CAPI: {e}")
