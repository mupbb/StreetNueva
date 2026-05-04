import os
import logging
import asyncio
from openai import AsyncOpenAI
from .threads_api import publish_to_threads

logger = logging.getLogger(__name__)

# Initialize OpenAI client
client = AsyncOpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

SOCIAL_PROMPT = """
Eres el Especialista en Redes Sociales de "Street Prime Detail". 
Tu objetivo es crear contenido de ALTA CONVERSIÓN para Threads.

DEBES generar 3 publicaciones distintas para el día:
1. EDUCATIVA: Sobre el cuidado del auto, por qué es importante el detallado, etc.
2. COMERCIAL: Promocionando un servicio específico de Street Prime.
3. TIP RÁPIDO: Un truco de mantenimiento que el cliente pueda apreciar.

REGLAS OBLIGATORIAS PARA CADA POST:
- Incluir siempre el CTA: "Escríbenos por WhatsApp al 55 7250 2791"
- Incluir siempre el sitio web: www.streetprimedetail.com
- Mantener un tono premium, experto y cercano.
- Usa emojis de forma profesional.

Responde únicamente con el contenido de los 3 posts separados por la cadena "---POST_BREAK---".
"""

async def generate_daily_content():
    """Generates 3 posts using OpenAI"""
    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": SOCIAL_PROMPT},
                {"role": "user", "content": "Genera el contenido de hoy para Threads enfocado en el clima actual de CDMX y el cuidado automotriz."}
            ]
        )
        content = response.choices[0].message.content
        posts = [p.strip() for p in content.split("---POST_BREAK---")]
        return posts
    except Exception as e:
        logger.error(f"Error generating social content: {e}")
        return []

async def publish_daily_post(post_type_index: int):
    """
    Publishes one of the daily posts. 
    post_type_index: 0 (Edu), 1 (Com), 2 (Tip)
    """
    logger.info(f"Social Agent: Iniciando publicación tipo {post_type_index}")
    posts = await generate_daily_content()
    
    if len(posts) > post_type_index:
        post_content = posts[post_type_index]
        logger.info(f"Publicando en Threads: {post_content[:50]}...")
        result = await publish_to_threads(post_content)
        return result
    else:
        logger.error("No se pudo obtener el contenido para publicar.")
        return {"error": "No content available"}
