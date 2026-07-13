// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9URoZiMbn-ZMbcvmW0kTLNaqs2t5f6M8",
  authDomain: "sajilobus-80d0d.firebaseapp.com",
  projectId: "sajilobus-80d0d",
  storageBucket: "sajilobus-80d0d.firebasestorage.app",
  messagingSenderId: "877718439659",
  appId: "1:877718439659:web:a85d274d6c1c4d8ab0e0ae",
  measurementId: "G-26BNJNVKDE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
 
export const auth = getAuth(app);
