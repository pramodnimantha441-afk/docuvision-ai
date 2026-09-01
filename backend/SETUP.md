# Hand2Text Pro Backend Setup Guide

## 1. Firebase Service Account Key
To connect to the Firebase Realtime Database securely:
1. Go to your [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`handwriten-5e990`)
3. Go to **Project Settings** (gear icon) > **Service Accounts**
4. Click **Generate new private key**
5. Save the downloaded JSON file as `firebase-service-account.json` directly inside this `backend/` folder.

## 2. Install Dependencies
Make sure you have Python 3.13 installed. Run the following command in this `backend/` folder:
```bash
pip install -r requirements.txt --trusted-host pypi.org --trusted-host files.pythonhosted.org
```

## 3. Realtime Database Security Rules
You need to secure your Realtime Database to only allow authenticated users to read/write their own data.
1. Go to Firebase Console > **Realtime Database**
2. Click the **Rules** tab
3. Paste the following JSON:
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "documents": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```
4. Click **Publish**.

## 4. Run the Backend Server
You can simply double-click the `start_backend.bat` file to start the server.
Alternatively, from the command line in this directory, run:
```bash
python -m uvicorn main:app --reload
```

*Note: The first time you start the server, it will take 60-90 seconds to load the Keras and Flan-T5 models into memory.*
