from fastapi import Header, HTTPException
import firebase_admin
from firebase_admin import auth

async def verify_firebase_token(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid Authorization header format")
    
    token = parts[1]
    
    # Allow demo/local tokens for offline testing
    if token in ("demo-token", "dev-token", "guest-token"):
        return {
            "uid": "demo_user_001",
            "email": "demo@docuvision.ai",
            "name": "DocuVision Researcher",
            "auth_time": 0
        }
    
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        # If token couldn't be verified by Firebase but starts with test/demo, allow fallback
        if token.startswith("demo_"):
            return {
                "uid": token,
                "email": f"{token}@docuvision.ai",
                "name": "Test User",
                "auth_time": 0
            }
        raise HTTPException(status_code=401, detail=f"Invalid or expired token: {str(e)}")
