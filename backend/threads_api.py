import httpx
import os
import logging

logger = logging.getLogger(__name__)

async def create_threads_container(text: str):
    """
    Step 1 of Threads publishing: Create a media container.
    """
    user_id = os.environ.get('THREADS_USER_ID')
    access_token = os.environ.get('THREADS_ACCESS_TOKEN')
    
    if not user_id or not access_token:
        logger.error("Threads API credentials missing (THREADS_USER_ID or THREADS_ACCESS_TOKEN)")
        return None

    url = f"https://graph.threads.net/v1.0/{user_id}/threads"
    
    params = {
        "text": text,
        "media_type": "TEXT",
        "access_token": access_token
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, params=params)
            data = response.json()
            
            if "id" in data:
                return data["id"]
            else:
                logger.error(f"Threads Container Error: {data}")
                return None
    except Exception as e:
        logger.error(f"Exception creating Threads container: {str(e)}")
        return None

async def publish_threads_container(creation_id: str):
    """
    Step 2 of Threads publishing: Publish the container.
    """
    user_id = os.environ.get('THREADS_USER_ID')
    access_token = os.environ.get('THREADS_ACCESS_TOKEN')
    
    if not user_id or not access_token:
        return None

    url = f"https://graph.threads.net/v1.0/{user_id}/threads_publish"
    
    params = {
        "creation_id": creation_id,
        "access_token": access_token
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, params=params)
            data = response.json()
            return data
    except Exception as e:
        logger.error(f"Exception publishing Threads container: {str(e)}")
        return {"error": str(e)}

async def publish_to_threads(text: str):
    """
    Unified function to publish text to Threads.
    """
    creation_id = await create_threads_container(text)
    if creation_id:
        return await publish_threads_container(creation_id)
    return {"error": "Failed to create container"}
