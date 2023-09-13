import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBD38bd2AwVOM0pO7R23MsYBz_yl53TYoE",
  authDomain: "netflix-react-clone-bdde9.firebaseapp.com",
  projectId: "netflix-react-clone-bdde9",
  storageBucket: "netflix-react-clone-bdde9.appspot.com",
  messagingSenderId: "196080614063",
  appId: "1:196080614063:web:c97299e76f4702e7d3325a",
};

const firebaseApp = initializeApp(firebaseConfig);
//const db = firebaseApp.firestore();
const auth = getAuth(firebaseApp);

export { auth };
//export default db;
