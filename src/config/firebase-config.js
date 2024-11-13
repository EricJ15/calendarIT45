import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAOuw0Y7gyOIj55B5w0BN437wwM5q31_JY",
    authDomain: "caltask-91e66.firebaseapp.com",
    databaseURL: "https://caltask-91e66-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "caltask-91e66",
    storageBucket: "caltask-91e66.firebasestorage.app",
    messagingSenderId: "663116716368",
    appId: "1:663116716368:web:20c2e907350f1042fb3455",
    measurementId: "G-850RHF9VYN"
  };

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app); 