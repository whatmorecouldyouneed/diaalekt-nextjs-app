import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDG7vpCzFSz5KCoT8eS1u_Jd2yPvwYP0tQ",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "diaalekt-nextjs-app.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://diaalekt-nextjs-app-default-rtdb.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "diaalekt-nextjs-app",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "diaalekt-nextjs-app.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "432140753056",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:432140753056:web:68e4344595961c854bd1c5",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-SHKKFFH638"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Initialize Realtime Database

// Export the database instance for use in other parts of your application
export const db = database;

// Function to add newsletter email to Realtime Database
export const addNewsletterEmail = async (email: string) => {
  try {
    await set(ref(db, 'newsletter/' + email.replace('.', '_')), {
      email: email,
      timestamp: Date.now()
    });
    console.log("Email added successfully!");
    return true;
  } catch (error) {
    console.error("Error adding email: ", error);
    return false;
  }
};

