// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWaVmK770EqO0m6QCBwTOu3TDMryRE1co",
  authDomain: "cotumo-beta-var2.firebaseapp.com",
  projectId: "cotumo-beta-var2",
  storageBucket: "cotumo-beta-var2.appspot.com",
  messagingSenderId: "542315764813",
  appId: "1:542315764813:web:446c831a1843224e0fd004",
  measurementId: "G-CWZ8BQXWGG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app); // ←databaseと連携

export { db };
