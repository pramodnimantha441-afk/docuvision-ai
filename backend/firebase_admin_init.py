import os
import firebase_admin
from firebase_admin import credentials, db
from config import FIREBASE_SERVICE_ACCOUNT_PATH, DATABASE_URL

firebase_app = None
db_ref = None

if not os.path.exists(FIREBASE_SERVICE_ACCOUNT_PATH):
    print(f"WARNING: Firebase service account file not found at {FIREBASE_SERVICE_ACCOUNT_PATH}")
    print("Please download it from Firebase Console and place it in the correct location.")
else:
    try:
        cred = credentials.Certificate(FIREBASE_SERVICE_ACCOUNT_PATH)
        firebase_app = firebase_admin.initialize_app(cred, {
            'databaseURL': DATABASE_URL
        })
        db_ref = db.reference('/')
        print("Firebase Admin SDK initialized successfully.")
    except ValueError as e:
        # App already initialized
        firebase_app = firebase_admin.get_app()
        db_ref = db.reference('/')
        print("Firebase Admin SDK already initialized.")
    except Exception as e:
        print(f"Error initializing Firebase Admin SDK: {e}")
