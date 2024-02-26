import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail, // Import sendPasswordResetEmail
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { auth, db } from "./firebase";
import ExpenseForm from "./components/ExpenseForm";
import { ref, getDatabase, onValue } from "firebase/database";


function App() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // If user is authenticated, fetch expenses from the database
        fetchExpenses(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // Function to fetch expenses from the database
  const fetchExpenses = (userId) => {
    const expensesRef = ref(getDatabase(), `expenses/${userId}`); // app ki zarurat nahi
    onValue(expensesRef, (snapshot) => {
      const expensesData = snapshot.val();
      if (expensesData) {
        const expensesArray = Object.keys(expensesData).map((key) => ({
          id: key,
          ...expensesData[key],
        }));
        setExpenses(expensesArray);
      }
    });
  };
  
  const register = async () => {
    try {
      const newUser = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      console.log(newUser);
    } catch (error) {
      console.log(error.message);
    }
  };

  const login = async () => {
    try {
      const currentUser = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      console.log(currentUser);
    } catch (error) {
      console.log(error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
    localStorage.removeItem("idToken"); // Clear idToken from local storage
  };

  const sendVerificationEmail = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      console.log("Verification email sent");
    } catch (error) {
      if (error.code === "auth/too-many-requests") {
        console.log("Too many requests. Retrying in 60 seconds...");
        setTimeout(() => {
          sendVerificationEmail(); // Retry after 60 seconds
        }, 60000); // 60 seconds delay
      } else {
        console.error("Error sending verification email:", error);
      }
    }
  };

  const forgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, loginEmail);
      console.log("Password reset email sent");
      // Provide feedback to the user indicating that the password reset email has been sent
      alert("Password reset email sent. Please check your inbox.");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      // Provide feedback to the user about the error
      alert("Error sending password reset email. Please try again later.");
    }
  };

  return (
    <div className="App">
      {user && (
        <div>
          <button onClick={logout}>Logout</button>
        </div>
      )}
      <div>
        <h3>Add Daily Expense</h3>
        <ExpenseForm /> {/* Include ExpenseForm component here */}
      </div>
      <div>
        <h3> Register User </h3>
        <input
          placeholder="Email..."
          onChange={(event) => {
            setRegisterEmail(event.target.value);
          }}
        />
        <input
          placeholder="Password..."
          onChange={(event) => {
            setRegisterPassword(event.target.value);
          }}
        />

        <button onClick={register}> Create User </button>
      </div>
      <div>
        <h3> Login </h3>
        <input
          placeholder="Email..."
          onChange={(event) => {
            setLoginEmail(event.target.value);
          }}
        />
        <input
          placeholder="Password..."
          onChange={(event) => {
            setLoginPassword(event.target.value);
          }}
        />

        <button onClick={login}> Login </button>
      </div>
      <button onClick={forgotPassword}>Forgot Password?</button>{" "}
      {/* Forgot password button */}
      {user && (
        <div>
          <h4> User Logged In: {user.email}</h4>
          {!user.emailVerified && (
            <button onClick={sendVerificationEmail}> Verify Email ID </button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
