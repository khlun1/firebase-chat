import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBDeGR9iKVMZSvSsM6z8J2Gxx6mqBGwXI0",
    authDomain: "fir-chat-7debd.firebaseapp.com",
    projectId: "fir-chat-7debd",
    storageBucket: "fir-chat-7debd.firebasestorage.app",
    messagingSenderId: "900111747863",
    appId: "1:900111747863:web:c3a3fd0c8580d096184552",
    measurementId: "G-SF3JFWDCRM"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);