import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
export const firebaseConfig = {
	apiKey: 'AIzaSyAMeK2AHCPiZ2jUwLPtLYVlIAgy8XxKCls',
	authDomain: "kasu-e-market-d99c4.firebaseapp.com",
	projectId: "kasu-e-market-d99c4",
	storageBucket: "kasu-e-market-d99c4.appspot.com",
	messagingSenderId: "790480478268",
	appId: "1:790480478268:web:773cd23d3b0072b4cc2339"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
