// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9UkfcjgIjW08Jab36070_sU4tvRMGxpM",
  authDomain: "verify-658bd.firebaseapp.com",
  projectId: "verify-658bd",
  storageBucket: "verify-658bd.appspot.com",
  messagingSenderId: "979138462366",
  appId: "1:979138462366:web:eeec13daca9815e248718f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };
