import React from "react";

function ExpenseList({ expenses, onDelete, onEdit }) {
  return (
    <div>
      <h2>Expenses:</h2>
      <ul>
        {expenses.map((expense, index) => (
          <li key={index}>
            <strong>Amount:</strong> {expense.amount}, <strong>Description:</strong> {expense.description}, <strong>Category:</strong> {expense.category}
            <button onClick={() => onDelete(expense.id)}>Delete</button> {/* Delete button */}
            <button onClick={() => onEdit(expense)}>Edit</button> {/* Edit button */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseList;