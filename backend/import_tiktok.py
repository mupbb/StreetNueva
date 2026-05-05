import asyncio
import json
import os
from dotenv import load_dotenv
from backend.db import db_manager
from backend.tiktok_agent import valentina

# Cargar variables de entorno desde .env
load_dotenv()

TIKTOK_STRATEGY = [
    {
        "day": 1,
        "service": "Detallado de Piel",
        "hook": "Sabias que la piel de tu auto respira?",
        "body": "La piel nappa o sintetica necesita hidratacion constante. Si se siente rigida o brilla demasiado, es suciedad acumulada. En Street Prime usamos limpiadores de pH neutro y acondicionadores con proteccion UV.",
        "cta": "Dale a tu interior el trato premium que merece. WhatsApp en el perfil.",
        "hashtags": "#Detailing #CDMX #StreetPrime #Cuero"
    },
    {
        "day": 2,
        "service": "Alcantara",
        "hook": "El terror de muchos: Limpiar Alcantara.",
        "body": "No es tela ni es piel, es microfibra tecnica. El secreto es no empaparla. Usamos cepillos de cerdas suaves y tecnica de extraccion en seco para que recupere su suavidad original.",
        "cta": "Agenda tu limpieza de interiores hoy.",
        "hashtags": "#Alcantara #LuxuryCars #DetailingLife"
    }
]

async def run_import():
    print("Iniciando importacion de Valentina...")
    await db_manager.connect()
    db = await db_manager.get_db()
    if db is None:
        print("Error: No se pudo conectar a MongoDB. Verifica tu MONGO_URL en el archivo .env")
        return
    await valentina.initialize_calendar(TIKTOK_STRATEGY)
    print("Valentina sincronizada con exito.")

if __name__ == "__main__":
    asyncio.run(run_import())
