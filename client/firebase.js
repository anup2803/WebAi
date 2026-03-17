// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "webbuilderai-f7609.firebaseapp.com",
  projectId: "webbuilderai-f7609",
  storageBucket: "webbuilderai-f7609.firebasestorage.app",
  messagingSenderId: "388188672046",
  appId: "1:388188672046:web:cf0435c1498bf5501e0fbf",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
//provider
const provider = new GoogleAuthProvider();

export { auth, provider };
