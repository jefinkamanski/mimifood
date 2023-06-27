
import { initializeApp } from "firebase/app"
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBmLyfvLdTrolazAmneAR83pRuJuU6SMr0",
  authDomain: "mimifood-6063f.firebaseapp.com",
  databaseURL: "https://mimifood-6063f-default-rtdb.firebaseio.com",
  projectId: "mimifood-6063f",
  storageBucket: "mimifood-6063f.appspot.com",
  messagingSenderId: "213705807414",
  appId: "1:213705807414:web:ce794e703d26c737782a97"
}

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

export  {db}
