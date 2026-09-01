import os
from dotenv import load_dotenv

load_dotenv()

FIREBASE_SERVICE_ACCOUNT_PATH = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "../handwriten-5e990-firebase-adminsdk-fbsvc-bfaecaee2f.json")
DATABASE_URL = os.getenv("DATABASE_URL", "https://handwriten-5e990-default-rtdb.firebaseio.com")
MODEL_PATH = os.getenv("MODEL_PATH", "../model/My_Ultimate_Model.zip")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000")
DEBUG = os.getenv("DEBUG", "true").lower() == "true"

IMAGE_WIDTH = 256
IMAGE_HEIGHT = 64
BATCH_SIZE = 32

# Standard IAM dataset vocabulary (uppercase, matches training setup)
IAM_VOCAB = sorted(list(" !\"#&'()*+,-./0123456789:;?ABCDEFGHIJKLMNOPQRSTUVWXYZ"))
