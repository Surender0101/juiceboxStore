import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBSzPFF5wdaqQ_T-TF0kqbDa4G3NJKtoWI",
  authDomain: "juicebox-8ddfe.firebaseapp.com",
  projectId: "juicebox-8ddfe",
  storageBucket: "juicebox-8ddfe.firebasestorage.app",
  messagingSenderId: "1067292259321",
  appId: "1:1067292259321:web:e6520170067698bad40328",
  measurementId: "G-NJQ0JNEDH8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
