// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
   apiKey: "AIzaSyDdg-9olrYVhgreQGOgzH6ZyAJbZIglOaA",

   authDomain: "car-dealership-fee89.firebaseapp.com",

   projectId: "car-dealership-fee89",

   storageBucket: "car-dealership-fee89.appspot.com",

   messagingSenderId: "23814161073",

   appId: "1:23814161073:web:7eb89d4040bdbe4a7cd890",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);