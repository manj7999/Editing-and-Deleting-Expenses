import React from "react";
import SignUp from "./components/SignUp";
import CompleteProfile from "./components/CompleteProfile";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsW1uwOzto1cTBn6ljohs0ectbkhq6a10",
  authDomain: "router-b5718.firebaseapp.com",
  projectId: "router-b5718",
  storageBucket: "router-b5718.appspot.com",
  messagingSenderId: "798148189493",
  appId: "1:798148189493:web:9e1945aacc484e87723d85",
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

export const auth = firebaseApp.auth();
export const firestore = firebaseApp.firestore();

function App() {
  return (
    <Router>
    <div>
      <Routes>
        <Route exact path="/" element={<SignUp />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
      </Routes>
    </div>
  </Router>
  );
}

export default App;
