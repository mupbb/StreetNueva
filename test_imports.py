try:
    from backend.server import app
    print("✅ Server app imported successfully")
except Exception as e:
    print(f"❌ Error importing server: {e}")
    import traceback
    traceback.print_exc()
