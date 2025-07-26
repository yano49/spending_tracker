import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // For data labels on charts

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartDataLabels);

// Dummy data structure for components to use
const defaultCategories = ["Groceries", "Utilities", "Transport", "Entertainment"];

function AnalyticsDashboard({ expenses, categories, addCustomCategory }) {
  const [timePeriod, setTimePeriod] = useState('monthly'); // 'daily', 'weekly', 'monthly', 'alltime'
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [chartData, setChartData] = useState({});
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  // --- Data Filtering and Aggregation ---
  useEffect(() => {
    let processedExpenses = expenses;

    // Filter by time period
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-indexed
    const currentYear = now.getFullYear();

    switch (timePeriod) {
      case 'daily':
        // For daily, you'd likely need to show a list of days, or group by last 7 days
        // For simplicity here, let's focus on monthly and all-time for charts
        break;
      case 'weekly':
        // Similar to daily, might need to group by current week
        break;
      case 'monthly':
        processedExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
        });
        break;
      case 'alltime':
      default:
        processedExpenses = expenses;
        break;
    }

    // Group by category
    const expensesByCategory = processedExpenses.reduce((acc, expense) => {
      const category = expense.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + expense.amount;
      return acc;
    }, {});

    setFilteredExpenses(expensesByCategory);

    // --- Chart Data Preparation ---
    const chartLabels = Object.keys(expensesByCategory);
    const chartValues = Object.values(expensesByCategory);

    setChartData({
      labels: chartLabels,
      datasets: [
        {
          label: `Spending (${timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)})`,
          data: chartValues,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(199, 199, 199, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(199, 199, 199, 1)',
          ],
          borderWidth: 1,
          datalabels: {
              color: '#000',
              anchor: 'end',
              align: 'top',
              offset: 5,
              font: {
                  weight: 'bold'
              }
          }
        },
      ],
    });

  }, [expenses, timePeriod]); // Re-run when expenses or timePeriod changes

  // --- Calculations ---
  const totalSpendingAllTime = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalSpendingSelectedPeriod = Object.values(filteredExpenses).reduce((sum, amount) => sum + amount, 0);

  // --- Handlers ---
  const handleCategoryInputChange = (e) => {
    setCustomCategoryInput(e.target.value);
  };

  const handleAddCustomCategory = () => {
    if (customCategoryInput.trim()) {
      addCustomCategory(customCategoryInput.trim());
      setCustomCategoryInput(''); // Clear the input after adding
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Spending by Category (${timePeriod})`,
      },
      datalabels: { // Configure datalabels here as well for global settings if needed
        color: '#000',
        anchor: 'end',
        align: 'top',
        offset: 5,
        font: {
            weight: 'bold'
        }
      }
    },
  };

  return (
    <div>
      <h2>Analytics Dashboard</h2>

      <div>
        <label>Select Time Period: </label>
        <select value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)}>
          <option value="alltime">All Time</option>
          <option value="monthly">Monthly</option>
          {/* Add daily/weekly options if you implement their logic */}
        </select>
      </div>

      <h3>Summary</h3>
      <p>Total Spending (All Time): ${totalSpendingAllTime.toFixed(2)}</p>
      <p>Total Spending ({timePeriod}): ${totalSpendingSelectedPeriod.toFixed(2)}</p>

      <h3>Spending Breakdown</h3>
      {Object.keys(filteredExpenses).length > 0 ? (
        <div style={{ width: '600px', height: '400px' }}>
          <h4>Pie Chart</h4>
          <Line data={chartData} options={options} /> {/* Using Line chart for simplicity, you can switch to Pie */}
        </div>
      ) : (
        <p>No spending data for the selected period.</p>
      )}

      <div style={{ marginTop: '20px' }}>
        <h4>Add Custom Category</h4>
        <input
          type="text"
          value={customCategoryInput}
          onChange={handleCategoryInputChange}
          placeholder="New Category Name"
        />
        <button onClick={handleAddCustomCategory}>Add Category</button>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;