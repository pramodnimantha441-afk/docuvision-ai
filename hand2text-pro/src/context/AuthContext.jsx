import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { ref, set, serverTimestamp } from 'firebase/database';
import { auth, db, googleProvider } from '../config/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign In with Google
  async function signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      try {
        await set(ref(db, `users/${user.uid}`), {
          name: user.displayName || user.email,
          email: user.email,
          photoURL: user.photoURL || '',
          lastLogin: serverTimestamp()
        });
      } catch (dbErr) {
        console.warn('Realtime DB write warning (non-fatal):', dbErr);
      }
      
      return user;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  }

  // Sign In with Email & Password
  async function signInWithEmail(email, password) {
    const cleanEmail = email.trim().toLowerCase();
    
    // Built-in test accounts (Instant reliable login)
    if (
      (cleanEmail === 'admin@docuvision.ai' && password === 'admin123') ||
      (cleanEmail === 'user@docuvision.ai' && password === 'user123') ||
      (cleanEmail === 'vishwa@docuvision.ai' && password === 'vishwa123')
    ) {
      const devUser = {
        uid: 'usr_' + cleanEmail.split('@')[0],
        email: cleanEmail,
        displayName: cleanEmail.split('@')[0].charAt(0).toUpperCase() + cleanEmail.split('@')[0].slice(1),
        isGuest: false,
        getIdToken: async () => 'dev-token'
      };
      setCurrentUser(devUser);
      localStorage.setItem('docuvision_auth_user', JSON.stringify(devUser));
      return devUser;
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      return user;
    } catch (error) {
      console.error('Email Sign-In Error:', error);
      throw error;
    }
  }

  // Sign Up with Email & Password
  async function signUpWithEmail(email, password, displayName = '') {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      if (displayName) {
        await updateProfile(user, { displayName });
      }

      try {
        await set(ref(db, `users/${user.uid}`), {
          name: displayName || email.split('@')[0],
          email: user.email,
          photoURL: '',
          createdAt: serverTimestamp()
        });
      } catch (dbErr) {
        console.warn('Realtime DB write warning (non-fatal):', dbErr);
      }

      return user;
    } catch (error) {
      console.error('Email Sign-Up Error:', error);
      throw error;
    }
  }

  // Quick Demo / Guest Login (instant access for evaluation)
  async function signInAsGuest() {
    const guestUser = {
      uid: 'demo_user_001',
      email: 'demo@docuvision.ai',
      displayName: 'Guest Researcher',
      isGuest: true,
      getIdToken: async () => 'demo-token'
    };
    setCurrentUser(guestUser);
    localStorage.setItem('docuvision_guest', 'true');
    return guestUser;
  }

  function signOut() {
    localStorage.removeItem('docuvision_guest');
    localStorage.removeItem('docuvision_auth_user');
    if (currentUser?.isGuest || currentUser?.getIdToken) {
      setCurrentUser(null);
      return Promise.resolve();
    }
    return firebaseSignOut(auth);
  }

  async function getIdToken() {
    if (currentUser) {
      if (currentUser.isGuest || typeof currentUser.getIdToken !== 'function') {
        return 'demo-token';
      }
      try {
        return await currentUser.getIdToken();
      } catch {
        return 'demo-token';
      }
    }
    return 'demo-token';
  }

  useEffect(() => {
    // Check if dev user session exists
    const storedUser = localStorage.getItem('docuvision_auth_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        parsed.getIdToken = async () => 'dev-token';
        setCurrentUser(parsed);
        setLoading(false);
        return;
      } catch {}
    }

    // Check if guest session exists
    const isGuest = localStorage.getItem('docuvision_guest');
    if (isGuest) {
      setCurrentUser({
        uid: 'demo_user_001',
        email: 'demo@docuvision.ai',
        displayName: 'Guest Researcher',
        isGuest: true,
        getIdToken: async () => 'demo-token'
      });
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signInAsGuest,
    signOut,
    getIdToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
