import asyncio
import re
import os
from backend.db import db_manager
from backend.linkedin_agent import lucero

async def import_obsidian_strategy_for_lucero():
    filepath = r"c:\Users\Asus\Documents\ObsidianV\Vault\Estrategia de LinkedIn\Calendario 30 Días - Street Prime Detail.md"
    if not os.path.exists(filepath):
        print("❌ No se encontró el archivo de Obsidian.")
        return

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Buscamos los posts en el calendario de Obsidian
    days = re.findall(r"### DÍA (\d+)[^#]+```([\s\S]+?)```", content)
    
    posts_json = []
    for day_num, post_content in days:
        meta_context = content.split(f"### DÍA {day_num}")[1].split("```")[0]
        tipo = re.search(r"\|\s*([^\|\s\n]+)", meta_context)
        visual = re.search(r"\*\*Visual:\*\*\s*(.+)", meta_context)

        posts_json.append({
            "day": int(day_num),
            "type": tipo.group(1) if tipo else "Texto",
            "visual": visual.group(1) if visual else "Imagen Premium",
            "content": post_content.strip(),
            "status": "pending"
        })

    if posts_json:
        await db_manager.connect()
        await lucero.initialize_calendar(posts_json)
        print(f"✨ Lucero ha recibido {len(posts_json)} posts y está lista para empezar.")
    else:
        print("⚠️ Lucero no encontró posts válidos. Revisa el formato de Obsidian.")

if __name__ == "__main__":
    asyncio.run(import_obsidian_strategy_for_lucero())
