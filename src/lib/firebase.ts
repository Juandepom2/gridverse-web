import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDZ4Z-1UL1uLQ8IvFuY8ynyy1o4vrTBFnE",
  authDomain: "gridverse-app.firebaseapp.com",
  projectId: "gridverse-app",
  storageBucket: "gridverse-app.firebasestorage.app",
  messagingSenderId: "1008557778901",
  appId: "1:1008557778901:web:c74f74410de3def3143f5c"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
