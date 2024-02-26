import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import ExpenseList from "./ExpenseList";
import { ref, push, remove, set, onValue } from "firebase/database";

function ExpenseForm() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null); // State to hold the expense being edited

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchExpenses(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchExpenses = (userId) => {
    const expensesRef = ref(db, `expenses/${userId}`);
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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editingExpense) {
      // If an expense is being edited, update it
      updateExpense();
    } else {
      // Otherwise, add a new expense
      addExpense();
    }
  };

  const addExpense = () => {
    const newExpense = { amount, description, category };
    const expensesRef = ref(db, `expenses/${user.uid}`);
    push(expensesRef, newExpense)
      .then((res) => {
        console.log("Expense added successfully:", res);
      })
      .catch((error) => {
        console.error("Error adding expense to the database:", error);
      });
    resetForm();
  };

  const updateExpense = () => {
    const expenseRef = ref(db, `expenses/${user.uid}/${editingExpense.id}`);
    set(expenseRef, { amount, description, category })
      .then(() => {
        console.log("Expense updated successfully");
        setEditingExpense(null); // Reset editing state after update
      })
      .catch((error) => {
        console.error("Error updating expense:", error);
      });
    resetForm();
  };

  const handleDelete = (expenseId) => {
    const expenseRef = ref(db, `expenses/${user.uid}/${expenseId}`);
    remove(expenseRef)
      .then(() => {
        console.log("Expense successfully deleted");
      })
      .catch((error) => {
        console.error("Error deleting expense:", error);
      });
  };

  const handleEdit = (expense) => {
    // Set the editingExpense state to the selected expense
    setEditingExpense(expense);
    // Prefill form fields with the selected expense details
    setAmount(expense.amount);
    setDescription(expense.description);
    setCategory(expense.category);
  };

  const resetForm = () => {
    // Reset form fields and editing state
    setAmount("");
    setDescription("");
    setCategory("");
    setEditingExpense(null);
  };

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
          </select>
        </div>
        <button type="submit">{editingExpense ? "Update Expense" : "Add Expense"}</button>
      </form>
      <ExpenseList expenses={expenses} onDelete={handleDelete} onEdit={handleEdit} />
    </div>
  );
}

export default ExpenseForm;