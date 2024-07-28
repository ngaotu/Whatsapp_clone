// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
const firebaseConfig = {
    apiKey: "AIzaSyDYnff3PbpwZsxqL3ThRyeTKCSMmj9jClE",
    authDomain: "whatsappclone-8859b.firebaseapp.com",
    projectId: "whatsappclone-8859b",
    storageBucket: "whatsappclone-8859b.appspot.com",
    messagingSenderId: "530350835719",
    appId: "1:530350835719:web:a8265252450abd58f742a2",
    measurementId: "G-JR7N4TFX9K"
  };

  // Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);
// Initialize Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { storage, auth, provider };

// export {storage}
export default db