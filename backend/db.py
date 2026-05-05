import os
from motor.motor_asyncio import AsyncIOMotorClient
import logging

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    db = None

    @classmethod
    async def connect(cls):
        if cls.client is None:
            mongo_url = os.environ.get('MONGO_URL')
            db_name = os.environ.get('DB_NAME', 'DetailAutomotriz')
            if not mongo_url:
                logger.error("❌ MONGO_URL no configurada en el entorno.")
                return None
            
            cls.client = AsyncIOMotorClient(mongo_url)
            cls.db = cls.client[db_name]
            logger.info(f"✅ Conectado a MongoDB Atlas: {db_name}")
        return cls.db

    @classmethod
    async def get_db(cls):
        if cls.db is None:
            await cls.connect()
        return cls.db

db_manager = Database()
