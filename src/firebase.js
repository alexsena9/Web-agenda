import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB2mGBpWYNdkBZ3qDLPFs27aPayI0JvEso",
  authDomain: "web-agenda-59d73.firebaseapp.com",
  projectId: "web-agenda-59d73",
  storageBucket: "web-agenda-59d73.firebasestorage.app",
  messagingSenderId: "1042270304793",
  appId: "1:1042270304793:web:f4384a837752985b1b4888",
  measurementId: "G-YBW872HVGE",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
