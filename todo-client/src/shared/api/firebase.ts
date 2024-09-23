/// <reference types="vite/client" />

import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const VITE_FIREBASE_API_KEY: string = import.meta.env.VITE_FIREBASE_API_KEY as string;
const VITE_AUTH_DOMAIN: string = import.meta.env.VITE_AUTH_DOMAIN as string;
const VITE_PROJECT_ID: string = import.meta.env.VITE_PROJECT_ID as string;
const VITE_STORAGE_BUCKET: string = import.meta.env.VITE_STORAGE_BUCKET as string;
const VITE_MESSAGING_SENDER_ID: string = import.meta.env.VITE_MESSAGING_SENDER_ID as string;
const VITE_APP_ID: string = import.meta.env.VITE_APP_ID as string;
const VITE_MEASUREMENT_ID: string = import.meta.env.VITE_MEASUREMENT_ID as string;

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: VITE_FIREBASE_API_KEY,
  authDomain: VITE_AUTH_DOMAIN,
  projectId: VITE_PROJECT_ID,
  storageBucket: VITE_STORAGE_BUCKET,
  messagingSenderId: VITE_MESSAGING_SENDER_ID,
  appId: VITE_APP_ID,
  measurementId: VITE_MEASUREMENT_ID
};

const app: FirebaseApp = initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
