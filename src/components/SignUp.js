import React, { useState, useEffect } from "react";
import "./SignUp.css";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { useNavigate } from "react-router-dom"; // Import useHistory from react-router-dom

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Initialize useHistory

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Create the user
      await firebase
        .auth()
        .createUserWithEmailAndPassword(formData.email, formData.password);

      // Sign in the user after successful creation
      const userCredential = await firebase
        .auth()
        .signInWithEmailAndPassword(formData.email, formData.password);

      // Extract the user's token
      const token = await userCredential.user.getIdToken();

      // Store the token in local storage
      localStorage.setItem("firebaseToken", token);

      // Clear form data
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
      });

      setIsLoggedIn(true);
      alert("User created and logged in successfully");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCompleteProfile = () => {
    navigate("/complete-profile"); // Navigate to complete profile page
  };

  return (
    <div>
    {!isLoggedIn ? (
      <div className="welcome-screen">
        <h2>Welcome to Expense Tracker</h2>
      </div>
    ) : (
      <div className="signup-container">
        <div className="signup-form">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            {/* Your form inputs */}
            <button type="submit">Sign Up</button>
          </form>
        </div>
        <button onClick={handleCompleteProfile}>Complete Profile</button>{" "}
        {/* Button to complete profile */}
      </div>
    )}
  </div>
  );
};

export default SignUp;
