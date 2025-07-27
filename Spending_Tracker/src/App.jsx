import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navigation from './components/Navigation.jsx';
import AnalyticsDashboard from './components/AnalyticDashboard.jsx';
import Journal from './components/Journal.jsx';

const STORAGE_KEY_EXPENSES = 'spendingTrackerExpenses';
const STORAGE_KEY_CATEGORIES = 'spendingTrackerCategories';

const loadExpenses = () => {
  const data = localStorage.getItem(STORAGE_KEY_EXPENSES);
  return data ? JSON.parse(data) : [];
};

const saveExpenses = (expenses) => {
  localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(expenses));
};

const loadCategories = async () => {
  const data = localStorage.getItem(STORAGE_KEY_CATEGORIES);
  if (data) return JSON.parse(data);

  try {
    const res = await fetch('/spending-category.json');
    if (!res.ok) throw new Error('Failed to fetch categories');
    const categories = await res.json();
    return Array.isArray(categories) && categories.length
      ? categories
      : ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Healthcare', 'Utilities', 'Education', 'Other'];
  } catch {
    return ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Healthcare', 'Utilities', 'Education', 'Other'];
  }
};

function App() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setExpenses(loadExpenses());
      const cats = await loadCategories();
      setCategories(cats);
      setLoading(false);
    }
    fetchData();
  }, []);

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now(),
      amount: parseFloat(expense.amount) || 0,
    };
    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
  };

  const removeExpense = (id) => {
    const updatedExpenses = expenses.filter((exp) => exp.id !== id);
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
  };

  const addCustomCategory = (category) => {
    if (!category || categories.includes(category)) return;
    const updatedCategories = [...categories, category];
    setCategories(updatedCategories);
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(updatedCategories));
  };

  const removeCategory = (category) => {
    const updatedCategories = categories.filter((cat) => cat !== category);
    setCategories(updatedCategories);
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(updatedCategories));
  };

  if (loading) return <div className="text-white p-8">Loading app data...</div>;

  return (
    <Router>
      <div className="bg-gradient-to-br from-indigo-100 to-blue-50 text-gray-900 min-h-screen flex">
        <Navigation />
        <main className="ml-64 p-8 w-full min-h-screen">
          <Routes>
            <Route
              path="/"
              element={
                <AnalyticsDashboard
                  expenses={expenses}
                  categories={categories}
                  addCustomCategory={addCustomCategory}
                  removeCategory={removeCategory}
                />
              }
            />
            <Route
              path="/journal"
              element={
                <Journal
                  expenses={expenses}
                  categories={categories}
                  addExpense={addExpense}
                  removeExpense={removeExpense}
                  addCustomCategory={addCustomCategory}
                  removeCategory={removeCategory}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;