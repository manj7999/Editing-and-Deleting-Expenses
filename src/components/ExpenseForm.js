import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth"; // Update the import statement
import { auth } from "../firebase"; // Assuming you have initialized Firebase in a file named "firebase.js"
import ExpenseList from "./ExpenseList";

function ExpenseForm() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [user, setUser] = useState(null); // Update the state to hold user's authentication status
  const [expenses, setExpenses] = useState([]); // State to hold expenses

  // Listen for changes in the user's authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update the user state
    });
    return () => unsubscribe(); // Clean up the subscription
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const newExpense = { amount, description, category };
    setExpenses([...expenses, newExpense]);
    // Reset form fields after submission
    setAmount("");
    setDescription("");
    setCategory("");
  };

  // Only render the form if the user is authenticated
  if (!user) {
    return <div>Please login to add expenses.</div>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select category</option>
            <option value="Food">Food</option>
            <option value="Petrol">Petrol</option>
            <option value="Salary">Salary</option>
            {/* Add more categories as needed */}
          </select>
        </div>
        <button type="submit">Add Expense</button>
      </form>
      <ExpenseList expenses={expenses} />
    </div>
  );
}

export default ExpenseForm;
