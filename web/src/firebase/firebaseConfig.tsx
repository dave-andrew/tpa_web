// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyIXm8XYep1LVLxw3cIQZoFRUD0eMXFrQ",
  authDomain: "tpa-web-b09a4.firebaseapp.com",
  projectId: "tpa-web-b09a4",
  storageBucket: "tpa-web-b09a4.appspot.com",
  messagingSenderId: "857302347270",
  appId: "1:857302347270:web:65a079cb9009547ec49d87",
  measurementId: "G-1NHLFW3K9L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
