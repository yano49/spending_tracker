import React, { useState } from 'react';

const timeOptions = ['Daily', 'Weekly', 'Monthly'];

const Journal = ({
  expenses,
  categories,
  addExpense,
  removeExpense,
  addCustomCategory,
  removeCategory
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0] || '');
  const [newCategory, setNewCategory] = useState('');
  const [timeFilter, setTimeFilter] = useState('Monthly');
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now - offset).toISOString().slice(0, 16);
    return localISOTime;
  });

  const getLocalDateTimeString = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now - offset).toISOString().slice(0, 16);
    return localISOTime;
  };

  const handleAddExpense = () => {
    if (!description || !amount || !category) return;
    addExpense({
      description,
      amount: parseFloat(amount),
      category,
      date: new Date(selectedDate).toISOString()
    });
    setDescription('');
    setAmount('');
    setSelectedDate(getLocalDateTimeString());
  };

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !categories.includes(trimmed)) {
      addCustomCategory(trimmed);
      setCategory(trimmed); // select the new one
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (cat) => {
    removeCategory(cat);
    if (category === cat) {
      const updated = categories.filter((c) => c !== cat);
      setCategory(updated[0] || '');
    }
  };

  const getFilteredExpenses = () => {
    const now = new Date();
    return expenses.filter((exp) => {
      const date = new Date(exp.date || exp.id);
      const diffDays = (now - date) / (1000 * 60 * 60 * 24);
      if (timeFilter === 'Daily') return diffDays < 1;
      if (timeFilter === 'Weekly') return diffDays <= 7;
      if (timeFilter === 'Monthly') {
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      }
      return true;
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold text-indigo-800">📝 Spending Journal</h2>

      {/* Input Fields */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="px-3 py-2 rounded border border-indigo-300"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="px-3 py-2 rounded border border-indigo-300"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded border border-indigo-300"
        >
          {categories.map((cat, idx) => (
            <option key={idx}>{cat}</option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 rounded border border-indigo-300"
        />
        <button
          onClick={handleAddExpense}
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
        >
          Add
        </button>
      </div>

      {/* Time Filter */}
      <div className="flex gap-2 items-center">
        <label className="text-indigo-700 font-medium">Filter By:</label>
        {timeOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => setTimeFilter(opt)}
            className={`px-3 py-1 rounded border ${
              timeFilter === opt
                ? 'bg-indigo-500 text-white'
                : 'border-indigo-300 text-indigo-700'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Category Editor */}
      <div className="mt-4 space-y-2">
        <h4 className="text-lg font-medium text-indigo-800">Manage Categories</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="flex items-center bg-gray-100 px-2 py-1 rounded shadow text-indigo-800"
            >
              {cat}
              <button
                onClick={() => handleRemoveCategory(cat)}
                className="ml-2 text-red-500 font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            placeholder="New Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="px-2 py-1 rounded border border-indigo-300"
          />
          <button
            onClick={handleAddCategory}
            className="bg-indigo-400 text-white px-3 py-1 rounded hover:bg-indigo-500"
          >
            Add Category
          </button>
        </div>
      </div>

      {/* Expense List */}
      <div className="mt-6 space-y-4">
        {getFilteredExpenses().map((exp) => (
          <div
            key={exp.id}
            className="flex justify-between items-center bg-white/70 p-3 rounded shadow text-indigo-900"
          >
            <div>
              <p className="font-medium">{exp.description}</p>
              <p className="text-sm text-gray-500">
                ฿{exp.amount.toFixed(2)} — {exp.category}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(exp.date || exp.id).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => removeExpense(exp.id)}
              className="text-red-500 hover:text-red-700 font-semibold"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Journal;