import asyncio
from backend.db import db_manager
from backend.tiktok_agent import valentina

async def import_valentina_scripts():
    # Primeros días de la enciclopedia de servicios
    scripts = [
        {
            "day": 1, 
            "service": "Piel", 
            "title": "El Secreto de la Piel Nappa", 
            "hook": "¿Sabías que el jabón común reseca la piel de tu auto?",
            "body": "Explicación: La piel es un material orgánico. Necesita limpieza con pH balanceado y nutrición para no agrietarse. Mira cómo lo hacemos.",
            "cta": "Link en bio para tratamiento de interiores."
        },
        {
            "day": 2, 
            "service": "Alcántara", 
            "title": "Cuidado de Alcántara Profesional", 
            "hook": "No cepilles tu alcántara en seco, podrías quemarla.",
            "body": "Explicación: Mostramos el uso de cepillo de cerdas de crin de caballo y microfibra húmeda para revivir la textura original.",
            "cta": "Escríbenos por WhatsApp."
        },
        {
            "day": 3, 
            "service": "Motor", 
            "title": "Detallado de Motor Seguro", 
            "hook": "¿Miedo a lavar tu motor? Aquí te enseñamos cómo se hace sin riesgos.",
            "body": "Explicación: Cubrimos sensores, usamos desengrasante dieléctrico y terminamos con protector que no conduce electricidad.",
            "cta": "Agenda tu detallado de motor hoy."
        }
    ]
    
    # Rellenamos el resto del mes con servicios clave
    services = ["Cristales", "Rines", "Carrocería", "Cielo del auto", "Plásticos", "Faros", "Chasis", "Ozonización"]
    for i in range(4, 31):
        service = services[i % len(services)]
        scripts.append({
            "day": i,
            "service": service,
            "title": f"Maestría en {service}",
            "hook": f"Día {i}: Descubre por qué el detallado de {service} es vital.",
            "body": f"En este video Valentina explica la técnica Street Prime para {service}.",
            "cta": "Consulta nuestros precios por WhatsApp."
        })

    await db_manager.connect()
    await valentina.initialize_calendar(scripts)
    print("🎵 Enciclopedia de Valentina cargada exitosamente.")

if __name__ == "__main__":
    asyncio.run(import_valentina_scripts())
