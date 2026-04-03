import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBi8IYC0XvkGWEEQCIR2IHD8RM0jARTKX0",
    authDomain: "primer-proyecto-react-59432.firebaseapp.com",
    projectId: "primer-proyecto-react-59432",
    storageBucket: "primer-proyecto-react-59432.firebasestorage.app",
    messagingSenderId: "43538836348",
    appId: "1:43538836348:web:6656e59cc5372b14f912f9"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar base de datos y autenticación
export const db = getFirestore(app);
export const auth = getAuth(app);