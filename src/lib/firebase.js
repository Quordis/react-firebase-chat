import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-63a91.firebaseapp.com",
  projectId: "reactchat-63a91",
  storageBucket: "reactchat-63a91.appspot.com",
  messagingSenderId: "360963908414",
  appId: "1:360963908414:web:c98513bce36bc9174c826f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();