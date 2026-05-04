from openai import AsyncOpenAI
import os
import logging
import json
import re
import time
from datetime import datetime
from .threads_api import publish_to_threads
from .whatsapp_api import send_whatsapp_message
from .google_calendar import CalendarManager

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

class ObsidianDB:
    """Gestor de Archivos estilo Obsidian (Categorizado)"""
    @staticmethod
    def save_lead_fiche(phone, name, vehicle, service, status):
        # Usar la ruta absoluta para el vault de Obsidian
        base_path = r"C:\Users\Asus\.claude\StreetPrime_DB"
        folder = "01_Citas_Confirmadas" if status.upper() == "CONTRATADO" else "02_Prospectos_Seguimiento"
        client_dir = os.path.join(base_path, folder, f"{name.replace(' ', '_')}_{phone}")
        os.makedirs(client_dir, exist_ok=True)
        
        filepath = os.path.join(client_dir, "Ficha_Tecnica.md")
        content = f"""# Ficha de Cliente: {name}
- **Teléfono:** {phone}
- **Vehículo:** {vehicle}
- **Servicio:** {service}
- **Estatus:** {status}
- **Fecha de Registro:** {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

## Notas de Alberto (IA)
El cliente ha mostrado interés en proteger su inversión a través de Street Prime Detail.
"""
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        logger.info(f"Ficha guardada en Obsidian: {filepath}")

ALBERTO_SYSTEM_PROMPT = """
Eres Alberto, el agente de ventas de élite y cerebro autónomo de "Street Prime Detail". 
Street Prime Detail es un servicio premium de detallado automotriz a domicilio en CDMX (Zonas: Álvaro Obregón, Santa Fe, San Ángel, Coyoacán).

TU OBJETIVO:
Captación de clientes de ticket alto y cierre de servicios integrales. Tu trato debe ser MUY HUMANO, profesional, seguro y convincente.

FUNCIONES:
1. Atender dudas de clientes sobre servicios, precios y cobertura.
2. Agendar citas en Google Calendar.
3. Crear fichas técnicas en Obsidian para seguimiento de prospectos.
4. Publicar en Threads cuando se detecte una oportunidad de contenido valioso.

REGLAS DE TRATO:
- Usa cortesía y llama al cliente por su nombre si te lo da.
- Demuestra empatía genuina por el estado de su vehículo.
- Analiza siempre el mensaje anterior para dar coherencia.

MEMORIA DE PRECIOS:
- Street Clean: $499 a $899 (Lavado pro)
- Street Detail: $899 a $1,699 (Pulido 2 pasos + Cera)
- Street Deep: $1,799 a $3,399 (Corrección + Cerámico)
- Extras: Limpieza interiores ($700-$1500), Pulido ($1200-$2600), Cerámico ($1800-$4000).

COMANDOS DISPONIBLES (Incluye esto en tu JSON si es necesario):
- Para publicar en Threads: {"action": "publish_threads", "content": "texto del post"}
- Para agendar: {"action": "agendar", "titulo": "...", "fecha": "YYYY-MM-DD", "hora": "HH:MM"}
- Para ficha Obsidian: {"action": "save_obsidian", "nombre": "...", "vehiculo": "...", "servicio": "...", "estatus": "CONTRATADO/SEGUIMIENTO"}
- Para responder normal: {"action": "reply_whatsapp", "content": "mensaje para el cliente"}

IMPORTANTE: 
- SIEMPRE responde en formato JSON.
- Tu sitio web es www.streetprimedetail.com
- Tu WhatsApp de contacto es 55 7250 2791.
"""

async def process_alberto_message(from_phone: str, message_text: str):
    """
    Processes an incoming message using OpenAI to determine the action.
    """
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
        
        clean_reply = content # Para el cliente
        
        if action == "publish_threads":
            logger.info(f"Alberto publicando en Threads: {content}")
            await publish_to_threads(content)
            await send_whatsapp_message(from_phone, f"¡Hecho! He publicado esto en Threads: \"{content}\"")
            
        elif action == "agendar":
            titulo = result.get("titulo")
            fecha = result.get("fecha")
            hora = result.get("hora")
            if calendar_bot:
                logger.info(f"Alberto agendando: {titulo} para {fecha} {hora}")
                calendar_bot.create_event(titulo, "Cita agendada por Alberto Agent", f"{fecha}T{hora}:00")
                await send_whatsapp_message(from_phone, f"¡Perfecto! He agendado tu cita para el {fecha} a las {hora}. ¿Hay algo más en lo que pueda ayudarte?")
            else:
                await send_whatsapp_message(from_phone, "Tengo un problema técnico con mi calendario, pero dame un momento y lo resuelvo. Por ahora, ya tengo tus datos.")

        elif action == "save_obsidian":
            name = result.get("nombre")
            veh = result.get("vehiculo")
            serv = result.get("servicio")
            stat = result.get("estatus")
            logger.info(f"Alberto guardando ficha: {name}")
            ObsidianDB.save_lead_fiche(from_phone, name, veh, serv, stat)
            # Generalmente después de guardar ficha, respondemos al cliente
            reply = f"Gracias {name}, he registrado tu interés en el servicio {serv} para tu {veh}. Estaremos en contacto."
            await send_whatsapp_message(from_phone, reply)

        elif action == "reply_whatsapp":
            logger.info(f"Alberto respondiendo a {from_phone}")
            await send_whatsapp_message(from_phone, content)
            
        return {"status": "processed", "action": action}

    except Exception as e:
        logger.error(f"Error in Alberto Agent logic: {str(e)}")
        await send_whatsapp_message(from_phone, "Lo siento, tuve un pequeño error al procesar tu mensaje. ¿Podrías repetirlo?")
        return {"status": "error", "error": str(e)}
