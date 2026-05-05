import asyncio
import os
from dotenv import load_dotenv
from backend.db import db_manager
from backend.linkedin_agent import lucero

load_dotenv()

LINKEDIN_STRATEGY = [
    {
        "day": 1,
        "type": "Autoridad B2B",
        "content": "El detallado automotriz no es solo estetica, es preservacion de activos. En el sector corporativo, la imagen de su flota habla de la calidad de su empresa. #StreetPrime #B2B #CDMX"
    },
    {
        "day": 2,
        "type": "Educativo",
        "content": "Por que el ceramico es una inversion y no un gasto? Analizamos el ROI de proteger su vehiculo hoy para mantener su valor de reventa mañana. #CarCare #Business #Authority"
    }
]

async def run_import():
    print("Iniciando importacion de Lucero...")
    await db_manager.connect()
    db = await db_manager.get_db()
    if db is None:
        print("Error de conexion.")
        return
    await lucero.initialize_calendar(LINKEDIN_STRATEGY)
    print("Lucero sincronizada con exito.")

if __name__ == "__main__":
    asyncio.run(run_import())
