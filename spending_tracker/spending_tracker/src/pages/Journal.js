import React, { useState } from 'react';

function Journal({ expenses, setExpenses, categories, addExpense, addCustomCategory }) {
  const [date, setDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  const handleAddExpense = (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!date || !selectedCategory || !amount) {
      alert('Please fill in all fields.');
      return;
    }

    const newExpense = {
      date: date,
      category: selectedCategory,
      amount: parseFloat(amount), // Ensure amount is a number
    };

    addExpense(newExpense); // Use the function passed from App.js

    // Clear form after submission
    setDate('');
    setSelectedCategory('');
    setAmount('');
    setNewCategoryInput('');
    setShowNewCategoryInput(false);
  };

  const handleAddCustomCategory = (e) => {
    e.preventDefault();
    if (newCategoryInput.trim()) {
      addCustomCategory(newCategoryInput.trim()); // Use the function passed from App.js
      setSelectedCategory(newCategoryInput.trim()); // Automatically select the newly added category
      setNewCategoryInput('');
      setShowNewCategoryInput(false);
    }
  };

  const availableCategories = [...categories]; // Use categories passed from App.js

  return (
    <div>
      <h2>Journal</h2>
      <form onSubmit={handleAddExpense}>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div style={{ margin: '10px 0' }}>
          <label htmlFor="category">Spending Category:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">--Select a Category--</option>
            {availableCategories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => setShowNewCategoryInput(!showNewCategoryInput)}>
            {showNewCategoryInput ? 'Cancel' : '+ Add New Category'}
          </button>
        </div>

        {showNewCategoryInput && (
          <div style={{ marginLeft: '20px', marginBottom: '10px' }}>
            <input
              type="text"
              value={newCategoryInput}
              onChange={(e) => setNewCategoryInput(e.target.value)}
              placeholder="New Category Name"
            />
            <button type="button" onClick={handleAddCustomCategory}>Add</button>
          </div>
        )}

        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            step="0.01" // Allows for decimal amounts
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <button type="submit" style={{ marginTop: '15px' }}>Add Expense</button>
      </form>

      {/* Optional: Display recent expenses here */}
      <h3 style={{ marginTop: '30px' }}>Recent Expenses</h3>
      {expenses.length === 0 ? (
        <p>No expenses recorded yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {expenses.slice().reverse().map(expense => ( // Display newest first
            <li key={expense.id} style={{ borderBottom: '1px solid #ccc', padding: '8px 0' }}>
              <strong>{expense.date}</strong> - {expense.category}: ${expense.amount.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Journal;