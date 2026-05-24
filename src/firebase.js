import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDinJ29vT60UJ7WSQ24WvU-ze-3Z3BJ0ag",

  authDomain:
    "walnory.firebaseapp.com",

  projectId:
    "walnory",

  storageBucket:
    "walnory.firebasestorage.app",

  messagingSenderId:
    "106084556837",

  appId:
    "1:106084556837:web:ad188e6cc18527eaba1fcc",
};

const app =
  initializeApp(
    firebaseConfig
  );

export const db =
  getFirestore(app);

export const storage =
  getStorage(app);

export default app;