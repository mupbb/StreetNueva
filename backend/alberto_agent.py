from openai import AsyncOpenAI
import os
import logging
import json
import re
import time
from datetime import datetime, timezone
from .threads_api import publish_to_threads
from .whatsapp_api import send_whatsapp_message
from .google_calendar import CalendarManager
from .db import db_manager

logger = logging.getLogger(__name__)

# Initialize OpenAI client
client = AsyncOpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# Initialize Calendar Manager
try:
    calendar_bot = CalendarManager(
        credentials_path=os.path.join(os.path.dirname(__file__), 'credentials_google.json'),
        token_path=os.path.join(os.path.dirname(__file__), 'token_google.pickle')
    )
except Exception as e:
    logger.warning(f"Google Calendar initialization failed: {e}")
    calendar_bot = None

async def save_to_history(phone, role, message):
    """Guarda el historial en MongoDB"""
    try:
        db = await db_manager.get_db()
        await db.conversations.insert_one({
            "phone": phone,
            "role": role,
            "message": message,
            "timestamp": datetime.now(timezone.utc)
        })
    except Exception as e:
        logger.error(f"Error guardando historial: {e}")

async def save_lead(phone, data):
    """Guarda o actualiza la ficha del cliente en MongoDB"""
    try:
        db = await db_manager.get_db()
        await db.leads.update_one(
            {"phone": phone},
            {"$set": {
                **data,
                "last_update": datetime.now(timezone.utc)
            }},
            upsert=True
        )
        logger.info(f"Ficha de lead actualizada para {phone}")
    except Exception as e:
        logger.error(f"Error guardando lead: {e}")

ALBERTO_SYSTEM_PROMPT = """
Eres Alberto, el agente de ventas de élite y cerebro autónomo de "Street Prime Detail". 
Street Prime Detail es un servicio premium de detallado automotriz a domicilio en CDMX.

TU OBJETIVO:
Captación de clientes de ticket alto y cierre de servicios. Tu trato debe ser MUY HUMANO, profesional y convincente.

COMANDOS DISPONIBLES (SIEMPRE responde en formato JSON):
- {"action": "publish_threads", "content": "texto del post"}
- {"action": "agendar", "titulo": "...", "fecha": "YYYY-MM-DD", "hora": "HH:MM"}
- {"action": "save_lead", "nombre": "...", "vehiculo": "...", "servicio": "...", "estatus": "PROSPECTO/CITA/CONTRATADO"}
- {"action": "reply_whatsapp", "content": "mensaje para el cliente"}

IMPORTANTE: 
- Tu sitio web es www.streetprimedetail.com
- Tu WhatsApp es 55 7250 2791.
"""

async def process_alberto_message(from_phone: str, message_text: str):
    """Procesa mensajes entrantes y los guarda en la base de datos"""
    # 1. Guardar mensaje del cliente
    await save_to_history(from_phone, "user", message_text)
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": ALBERTO_SYSTEM_PROMPT},
                {"role": "user", "content": message_text}
            ],
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        action = result.get("action")
        content = result.get("content", "")
        
        if action == "publish_threads":
            await publish_to_threads(content)
            reply = f"¡Hecho! He publicado esto en Threads: \"{content}\""
            await send_whatsapp_message(from_phone, reply)
            await save_to_history(from_phone, "alberto", reply)
            
        elif action == "agendar":
            titulo = result.get("titulo")
            fecha = result.get("fecha")
            hora = result.get("hora")
            if calendar_bot:
                calendar_bot.create_event(titulo, "Agendado por Alberto", f"{fecha}T{hora}:00")
                reply = f"¡Perfecto! He agendado tu cita para el {fecha} a las {hora}. ¿Algo más?"
            else:
                reply = "Tengo un problema con el calendario, pero ya anoté tu cita manualmente."
            
            await send_whatsapp_message(from_phone, reply)
            await save_to_history(from_phone, "alberto", reply)

        elif action == "save_lead":
            data = {
                "name": result.get("nombre"),
                "vehicle": result.get("vehiculo"),
                "service": result.get("servicio"),
                "status": result.get("estatus")
            }
            await save_lead(from_phone, data)
            reply = f"Gracias {data['name']}, he registrado tu interés. Estaremos en contacto."
            await send_whatsapp_message(from_phone, reply)
            await save_to_history(from_phone, "alberto", reply)

        elif action == "reply_whatsapp":
            await send_whatsapp_message(from_phone, content)
            await save_to_history(from_phone, "alberto", content)
            
        return {"status": "processed", "action": action}

    except Exception as e:
        logger.error(f"Error en Alberto Agent: {str(e)}")
        error_msg = "Lo siento, tuve un pequeño error. ¿Podrías repetirlo?"
        await send_whatsapp_message(from_phone, error_msg)
        await save_to_history(from_phone, "alberto", error_msg)
        return {"status": "error", "error": str(e)}
