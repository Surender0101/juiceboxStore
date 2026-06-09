import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBSzPFF5wdaqQ_T-TF0kqbDa4G3NJKtoWI',
  authDomain: 'juicebox-8ddfe.firebaseapp.com',
  projectId: 'juicebox-8ddfe',
  storageBucket: 'juicebox-8ddfe.firebasestorage.app',
  messagingSenderId: '1067292259321',
  appId: '1:1067292259321:web:e6520170067698bad40328',
  measurementId: 'G-NJQ0JNEDH8',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

const AUTH_TIMEOUT_MS = 6000;

export const ensureFirebaseAuth = async () => {
  if (auth.currentUser) return auth.currentUser;

  try {
    const user = await Promise.race([
      signInAnonymously(auth).then((cred) => cred.user),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Firebase auth timed out')), AUTH_TIMEOUT_MS)
      ),
    ]);
    return user;
  } catch (err) {
    console.warn('Firebase anonymous sign-in unavailable:', err.message || err);
    return null;
  }
};
