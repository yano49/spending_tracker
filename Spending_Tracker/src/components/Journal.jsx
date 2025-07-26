import React, { useState } from 'react';

function Journal({
  expenses = [],
  addExpense,
  removeExpense,
  categories = [],
  addCustomCategory
}) {
  const [form, setForm] = useState({ date: '', category: '', amount: '' });
  const [customCategory, setCustomCategory] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.date || !form.category || !form.amount) {
      alert("Please fill in all fields.");
      return;
    }
    if (parseFloat(form.amount) <= 0) {
      alert("Amount must be a positive number.");
      return;
    }
    addExpense({
      date: form.date,
      category: form.category,
      amount: parseFloat(form.amount)
    });
    setForm({ date: '', category: '', amount: '' });
  };

  const handleAddCustomCategory = () => {
    if (customCategory.trim()) {
      addCustomCategory(customCategory.trim());
      setCustomCategory('');
    }
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6">Journal</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8 max-w-xl">
        <div>
          <label className="block mb-1">Date:</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
        </div>

        <div>
          <label className="block mb-1">Category:</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-800 text-white"
          >
            <option value="" disabled>
              -- Select Category --
            </option>
            {categories.length > 0 ? (
              categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))
            ) : (
              <option disabled>No categories available</option>
            )}
          </select>
        </div>

        <div>
          <label className="block mb-1">Amount:</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded"
        >
          Add Expense
        </button>
      </form>

      <div className="max-w-xl mb-10">
        <h3 className="text-xl font-semibold mb-3">Add Custom Category</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="New category name"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="flex-grow p-2 rounded bg-gray-800 text-white"
          />
          <button
            onClick={handleAddCustomCategory}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </div>

      <h3 className="text-2xl font-semibold mb-4">Expenses</h3>
      {Array.isArray(expenses) && expenses.length > 0 ? (
        <ul className="space-y-4 max-w-xl">
          {expenses.slice().reverse().map((exp) => (
            <li key={exp.id} className="flex justify-between items-center bg-gray-800 p-4 rounded">
              <div>
                <div className="font-semibold">{exp.date}</div>
                <div className="text-gray-400">{exp.category}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="font-semibold text-green-400">${exp.amount.toFixed(2)}</div>
                <button
                  onClick={() => removeExpense(exp.id)}
                  className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No expenses recorded yet.</p>
      )}
    </div>
  );
}

export default Journal;
