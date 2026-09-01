========================================================================
   DOCUVISION AI / HAND2TEXT PRO - COMPLETE PROJECT SETUP & GUIDE
========================================================================

------------------------------------------------------------------------
1. FOLDER CONTENTS:
------------------------------------------------------------------------
- backend/               : FastAPI Python backend (OCR, Flan-T5 NLP, Firebase)
- hand2text-pro/         : React.js + Vite Frontend Workspace
- model/                 : Model weights and checkpoint directories

------------------------------------------------------------------------
2. HOW TO RUN THE SYSTEM:
------------------------------------------------------------------------

Step 1: Start Backend Server (FastAPI)
  1. Open a terminal / command prompt.
  2. Navigate to the backend directory:
     cd backend
  3. Install dependencies (if not already installed):
     pip install -r requirements.txt
  4. Start the server:
     uvicorn main:app --host 127.0.0.1 --port 8000 --reload
  (Runs on http://127.0.0.1:8000)

Step 2: Start Frontend Application (React + Vite)
  1. Open a second terminal / command prompt.
  2. Navigate to the frontend directory:
     cd hand2text-pro
  3. Install dependencies:
     npm install
  4. Start the development server:
     npm run dev
  (Runs on http://localhost:3000)

------------------------------------------------------------------------
3. ACCESS URLS:
------------------------------------------------------------------------
- Web Application (Frontend) : http://localhost:3000
- Backend REST API Server    : http://127.0.0.1:8000
- Interactive Swagger Docs   : http://127.0.0.1:8000/docs
========================================================================
