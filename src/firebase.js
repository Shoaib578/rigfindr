
import  {initializeApp} from "firebase/app"
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
const firebaseConfig = {
    apiKey: "AIzaSyDF48tVHu9327RSVg6KHIekMfBU5_askGs",
    authDomain: "rigfindr-7f5b4.firebaseapp.com",
    projectId: "rigfindr-7f5b4",
    storageBucket: "rigfindr-7f5b4.appspot.com",
    messagingSenderId: "75835477083",
    appId: "1:75835477083:web:7a78927a7b46bafbdc837e",
    measurementId: "G-5EGVFJDKY8"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app)
  const storage = getStorage(app)
  export  {db,storage}