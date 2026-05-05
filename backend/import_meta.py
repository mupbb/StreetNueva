import asyncio
import os
from dotenv import load_dotenv
from backend.db import db_manager
from backend.meta_agent import estela

load_dotenv()

META_STRATEGY = [
    {
        "day": 1,
        "platform": "Facebook/Instagram",
        "content": "✨ El brillo que tu auto merece. Descubre nuestro proceso de detallado profesional en Street Prime. #Detailing #CDMX #EsteticaAutomotriz"
    }
]

async def run_import():
    print("Iniciando importacion de Estela...")
    await db_manager.connect()
    db = await db_manager.get_db()
    if db is None: return
    await estela.initialize_calendar(META_STRATEGY)
    print("Estela sincronizada.")

if __name__ == "__main__":
    asyncio.run(run_import())
