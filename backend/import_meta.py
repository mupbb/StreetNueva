import asyncio
from backend.db import db_manager
from backend.meta_agent import estela

async def import_estela_strategy():
    # Estrategia de 30 días resumida para la base de datos
    posts = [
        {"day": 1, "type": "Reels", "platform": "FB/IG", "title": "El Secreto del Brillo Espejo", "content": "✨ ¿Sabes por qué algunos autos brillan más que otros? No es suerte, es técnica. En Street Prime usamos micro-pulido de precisión. #Detailing #CDMX #StreetPrime", "visual": "Video ASMR Pulido"},
        {"day": 2, "type": "Carrusel", "platform": "IG", "title": "5 Errores Fatales", "content": "❌ Lavar con trapo viejo, usar detergente de trastes... descubre qué está destruyendo tu pintura. #CarCare #DetailingTips", "visual": "Infografías de errores"},
        {"day": 3, "type": "Video Largo", "platform": "FB", "title": "Proceso Porsche", "content": "Hoy recibimos este Porsche para una transformación total. Mira cada detalle de nuestro proceso premium. #PorscheCDMX #LuxuryDetailing", "visual": "Video 10 min Proceso"},
        # ... Se añadirán los 30 días siguiendo el calendario maestro
    ]
    
    # Por ahora cargamos los primeros días clave para arrancar
    for i in range(4, 31):
        posts.append({
            "day": i,
            "type": "Estratégico",
            "platform": "FB/IG",
            "title": f"Día {i} de Transformación",
            "content": f"Día {i}: Continuamos elevando el estándar del detallado en México. Agenda por WhatsApp al 55 7250 2791. #StreetPrimeDetail",
            "visual": "Media Premium"
        })

    await db_manager.connect()
    await estela.initialize_calendar(posts)
    print("✨ Estrategia de Estela cargada exitosamente.")

if __name__ == "__main__":
    asyncio.run(import_estela_strategy())
