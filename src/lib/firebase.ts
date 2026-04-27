import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCP-DyqU9kqwK482Bhbg0kMzVfNSIpU7pE",
  authDomain: "cricpoint-6c34b.firebaseapp.com",
  databaseURL: "https://cricpoint-6c34b-default-rtdb.firebaseio.com",
  projectId: "cricpoint-6c34b",
  storageBucket: "cricpoint-6c34b.firebasestorage.app",
  messagingSenderId: "101819089138",
  appId: "1:101819089138:web:2155bc302de7a71ac5506b",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export default app;
