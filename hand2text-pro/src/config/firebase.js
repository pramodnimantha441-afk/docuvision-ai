import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyBAzhghBrAD_8duOEoKSS4NtnIS11XUanU',
  authDomain: 'handwriten-5e990.firebaseapp.com',
  projectId: 'handwriten-5e990',
  storageBucket: 'handwriten-5e990.firebasestorage.app',
  messagingSenderId: '49905443598',
  appId: '1:49905443598:web:e771a2f3003cc80ea2ad5f',
  measurementId: 'G-2DC01VNZNW',
  databaseURL: 'https://handwriten-5e990-default-rtdb.firebaseio.com'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
