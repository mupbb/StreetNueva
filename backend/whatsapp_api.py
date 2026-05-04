import httpx
import os
import logging

logger = logging.getLogger(__name__)

async def send_whatsapp_message(to_phone: str, message_text: str):
    """
    Sends a text message via WhatsApp Business API.
    
    Args:
        to_phone: The recipient's phone number (with country code).
        message_text: The content of the message.
    """
    access_token = os.environ.get('META_ACCESS_TOKEN')
    phone_number_id = os.environ.get('WHATSAPP_PHONE_NUMBER_ID')
    
    if not access_token or not phone_number_id:
        logger.error("WhatsApp API credentials missing (META_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID)")
        return None

    url = f"https://graph.facebook.com/v18.0/{phone_number_id}/messages"
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "messaging_product": "whatsapp",
        "to": to_phone,
        "type": "text",
        "text": {"body": message_text}
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=payload)
            data = response.json()
            
            if response.status_code == 200:
                logger.info(f"WhatsApp message sent to {to_phone}")
                return data
            else:
                logger.error(f"WhatsApp API Error: {data}")
                return data
    except Exception as e:
        logger.error(f"Exception sending WhatsApp message: {str(e)}")
        return {"error": str(e)}
