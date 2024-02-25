import React from "react";

function ExpenseList({ expenses }) {
  return (
    <div>
      <h2>Expenses:</h2>
      <ul>
        {expenses.map((expense, index) => (
          <li key={index}>
            <strong>Amount:</strong> {expense.amount}, <strong>Description:</strong> {expense.description}, <strong>Category:</strong> {expense.category}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseList;