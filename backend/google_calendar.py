import os
import datetime
import pickle
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from google.auth.transport.requests import Request

# Alcances (Scopes) requeridos
SCOPES = ['https://www.googleapis.com/auth/calendar']

class CalendarManager:
    """Clase para gestionar eventos en Google Calendar"""
    
    def __init__(self, credentials_path='credentials_google.json', token_path='token_google.pickle'):
        self.credentials_path = credentials_path
        self.token_path = token_path
        self.service = self._authenticate()

    def _authenticate(self):
        creds = None
        # El archivo token.pickle almacena los tokens de acceso y actualización del usuario
        if os.path.exists(self.token_path):
            with open(self.token_path, 'rb') as token:
                creds = pickle.load(token)
        
        # Si no hay credenciales válidas disponibles, pedir al usuario que inicie sesión.
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                try:
                    flow = InstalledAppFlow.from_client_secrets_file(self.credentials_path, SCOPES)
                    # Usamos un puerto fijo (8080) para evitar redirect_uri_mismatch
                    # El usuario debe añadir http://localhost:8080/ en su consola de Google
                    creds = flow.run_local_server(port=8080, timeout_seconds=60)
                    
                    # Guardar las credenciales para la próxima ejecución
                    with open(self.token_path, 'wb') as token:
                        pickle.dump(creds, token)
                except Exception as e:
                    print(f"⚠️ Error de autenticación en Google Calendar: {e}")
                    print("El servidor continuará sin acceso al calendario por ahora.")
                    return None

        return build('calendar', 'v3', credentials=creds)

    def create_event(self, summary, description, start_datetime_str, duration_minutes=60):
        """
        Crea un evento en el calendario principal.
        start_datetime_str: Formato ISO o similar (ej: '2026-04-15T10:00:00')
        """
        try:
            # Asegurar formato ISO
            start_time = start_datetime_str
            if 'T' not in start_time:
                start_time = f"{start_time}T10:00:00" # Default a las 10 AM si no hay hora
            
            # Calcular fin
            start_dt = datetime.datetime.fromisoformat(start_time.replace('Z', ''))
            end_dt = start_dt + datetime.timedelta(minutes=duration_minutes)
            end_time = end_dt.isoformat()

            event = {
                'summary': summary,
                'description': description,
                'start': {
                    'dateTime': start_time,
                    'timeZone': 'America/Mexico_City',
                },
                'end': {
                    'dateTime': end_time,
                    'timeZone': 'America/Mexico_City',
                },
                'reminders': {
                    'useDefault': True,
                },
            }

            event_result = self.service.events().insert(calendarId='primary', body=event).execute()
            print(f"Evento creado: {event_result.get('htmlLink')}")
            return event_result.get('htmlLink')
        except Exception as e:
            print(f"Error creando evento en Calendar: {e}")
            return None

if __name__ == "__main__":
    # Prueba rápida
    manager = CalendarManager()
    # manager.create_event("Prueba Alberto", "Cita de detallado", "2026-04-13T15:00:00")
