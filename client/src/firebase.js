// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCV9XB82lNxvowWq61OEcQkk4Dlyk4mJGs",
  authDomain: "image-store-8ddb7.firebaseapp.com",
  projectId: "image-store-8ddb7",
  storageBucket: "image-store-8ddb7.appspot.com",
  messagingSenderId: "498974884237",
  appId: "1:498974884237:web:5afa05a88a6fb48fc7fdc4",
  measurementId: "G-PNGRD0FV85"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
