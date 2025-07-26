import React, { useState, useMemo } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartDataLabels
);

function AnalyticsDashboard({ expenses, categories, addCustomCategory, removeCategory }) {
  const [timePeriod, setTimePeriod] = useState('monthly');
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  const aggregatedSpending = useMemo(() => {
    if (!Array.isArray(expenses)) return {};

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentDay = now.getDate();

    let filteredExpenses = expenses;

    switch (timePeriod) {
      case 'daily':
        filteredExpenses = expenses.filter(({ date }) => {
          const d = new Date(date);
          return d.getDate() === currentDay && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });
        break;
      case 'weekly':
        filteredExpenses = expenses.filter(({ date }) => {
          const d = new Date(date);
          const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
          return diffDays >= 0 && diffDays < 7;
        });
        break;
      case 'monthly':
        filteredExpenses = expenses.filter(({ date }) => {
          const d = new Date(date);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });
        break;
      case 'alltime':
      default:
        break;
    }

    return filteredExpenses.reduce((acc, expense) => {
      const category = expense.category?.trim() || 'Uncategorized';
      const amount = typeof expense.amount === 'number' ? expense.amount : 0;
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {});
  }, [expenses, timePeriod]);

  const chartData = useMemo(() => {
    const labels = Object.keys(aggregatedSpending);
    const data = Object.values(aggregatedSpending);

    return {
      labels: labels.length ? labels : ['No data'],
      datasets: [{
        label: `Spending (${timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)})`,
        data: data.length ? data : [0],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        datalabels: {
          color: '#000',
          anchor: 'end',
          align: 'top',
          offset: 5,
          font: { weight: 'bold' }
        },
      }],
    };
  }, [aggregatedSpending, timePeriod]);

  const pieChartData = useMemo(() => {
    const labels = Object.keys(aggregatedSpending);
    const data = Object.values(aggregatedSpending);

    return {
      labels: labels.length ? labels : ['No data'],
      datasets: [{
        label: `Spending (${timePeriod})`,
        data: data.length ? data : [0],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(199, 199, 199, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)'
        ],
        borderWidth: 1,
      }],
    };
  }, [aggregatedSpending, timePeriod]);

  const totalSpendingAllTime = useMemo(() => expenses.reduce((sum, e) => sum + (typeof e.amount === 'number' ? e.amount : 0), 0), [expenses]);
  const totalSpendingSelectedPeriod = Object.values(aggregatedSpending).reduce((sum, val) => sum + val, 0);

  const chartOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `Spending by Category (${timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)})` },
      datalabels: { color: '#000', anchor: 'end', align: 'top', offset: 5, font: { weight: 'bold' } },
    },
  }), [timePeriod]);

  const handleCategoryInputChange = (e) => setCustomCategoryInput(e.target.value);
  const handleAddCustomCategory = () => {
    if (customCategoryInput.trim()) {
      addCustomCategory(customCategoryInput.trim());
      setCustomCategoryInput('');
    }
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-4">Analytics Dashboard</h2>
      <div className="flex gap-4 items-center mb-6">
        <label className="text-gray-400">Time Period:</label>
        <select value={timePeriod} onChange={e => setTimePeriod(e.target.value)} className="bg-gray-800 p-2 rounded">
          <option value="alltime">All Time</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div className="bg-gray-800 p-4 rounded mb-6 max-w-md">
        <h3 className="text-xl font-semibold mb-2">Summary</h3>
        <p>Total Spending (All Time): <strong>${totalSpendingAllTime.toFixed(2)}</strong></p>
        <p>Total Spending ({timePeriod}): <strong>${totalSpendingSelectedPeriod.toFixed(2)}</strong></p>
      </div>

      <div className="flex flex-wrap gap-8 justify-center mb-10">
        <div className="w-full md:w-[45%]">
          <h3 className="text-lg font-semibold mb-2">Line Chart</h3>
          <Line data={chartData} options={chartOptions} />
        </div>
        <div className="w-full md:w-[45%]">
          <h3 className="text-lg font-semibold mb-2">Pie Chart</h3>
          <Pie data={pieChartData} options={{
            responsive: true,
            plugins: {
              legend: { position: 'right' },
              title: {
                display: true,
                text: `Spending Breakdown (${timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)})`
              },
              datalabels: {
                color: '#000',
                font: { weight: 'bold' }
              }
            }
          }} />
        </div>
      </div>

      <div className="border-t border-gray-700 pt-6 max-w-xl">
        <h3 className="text-xl font-semibold mb-4">Manage Categories</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="New Category Name"
            value={customCategoryInput}
            onChange={handleCategoryInputChange}
            className="flex-grow p-2 rounded bg-gray-800 text-white"
          />
          <button
            onClick={handleAddCustomCategory}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-white"
          >
            Add Category
          </button>
        </div>
        {categories.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <li key={cat} className="bg-gray-700 px-3 py-1 rounded flex items-center">
                {cat}
                <button
                  onClick={() => removeCategory(cat)}
                  className="ml-2 text-red-400 hover:text-red-300 text-sm"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
