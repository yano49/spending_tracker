import React, { useMemo, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const timeOptions = ['Daily', 'Weekly', 'Monthly'];

function getTimeFilteredExpenses(expenses, filter) {
  const now = new Date();
  return expenses.filter(exp => {
    const date = new Date(exp.date || exp.id);
    const diffDays = (now - date) / (1000 * 60 * 60 * 24);
    if (filter === 'Daily') return diffDays < 1;
    if (filter === 'Weekly') return diffDays <= 7;
    if (filter === 'Monthly') {
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }
    return true;
  });
}

function groupByCategory(expenses, categories) {
  const grouped = {};
  categories.forEach(cat => (grouped[cat] = 0));
  expenses.forEach(exp => {
    if (grouped[exp.category] !== undefined) {
      grouped[exp.category] += exp.amount;
    } else {
      grouped[exp.category] = exp.amount;
    }
  });
  return grouped;
}

function groupByDate(expenses) {
  const grouped = {};
  expenses.forEach(exp => {
    const date = new Date(exp.date || exp.id).toLocaleDateString();
    grouped[date] = (grouped[date] || 0) + exp.amount;
  });
  return grouped;
}

const AnalyticsDashboard = ({ expenses, categories }) => {
  const [timeFilter, setTimeFilter] = useState('Monthly');

  const filteredExpenses = useMemo(
    () => getTimeFilteredExpenses(expenses, timeFilter),
    [expenses, timeFilter]
  );

  const categoryData = useMemo(
    () => groupByCategory(filteredExpenses, categories),
    [filteredExpenses, categories]
  );

  const allTimeCategoryData = useMemo(
    () => groupByCategory(expenses, categories),
    [expenses, categories]
  );

  const lineData = useMemo(() => {
    const grouped = groupByDate(filteredExpenses);
    const labels = Object.keys(grouped).sort(
      (a, b) => new Date(a) - new Date(b)
    );
    return {
      labels,
      datasets: [
        {
          label: `${timeFilter} Spending`,
          data: labels.map(label => grouped[label]),
          borderColor: '#6366F1',
          backgroundColor: '#6366F1',
          tension: 0.3,
          fill: false,
        }
      ]
    };
  }, [filteredExpenses, timeFilter]);

  const barData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: `${timeFilter} Spending`,
        data: Object.values(categoryData),
        backgroundColor: '#6366F1',
      }
    ]
  };

  const pieData = {
    labels: Object.keys(allTimeCategoryData),
    datasets: [
      {
        label: 'All Time',
        data: Object.values(allTimeCategoryData),
        backgroundColor: [
          '#6366F1', '#3B82F6', '#10B981', '#F59E0B',
          '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'
        ],
        borderColor: '#fff',
        borderWidth: 1
      }
    ]
  };

  const totalAllTime = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const totalSelected = filteredExpenses.reduce((acc, exp) => acc + exp.amount, 0);

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-semibold text-indigo-800">📊 Analytics Overview</h2>

      {/* Time Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <select
          className="p-2 rounded-lg border border-indigo-300 text-indigo-800"
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
        >
          {timeOptions.map(opt => <option key={opt}>{opt}</option>)}
        </select>
        <div className="flex gap-4 text-indigo-900 font-medium">
          <div className="bg-white/60 p-4 rounded shadow">
            <p>Total Balance</p>
            <p className="text-lg font-bold">฿{totalAllTime.toFixed(2)}</p>
          </div>
          <div className="bg-white/60 p-4 rounded shadow">
            <p>{timeFilter} Spending</p>
            <p className="text-lg font-bold">฿{totalSelected.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/60 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2 text-indigo-700">Bar Chart: {timeFilter} by Category</h3>
          <Bar data={barData} />
        </div>
        <div className="bg-white/60 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2 text-indigo-700">Pie Chart: All-Time by Category</h3>
          <Pie data={pieData} />
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white/60 p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2 text-indigo-700">Line Chart: {timeFilter} Trend</h3>
        <Line data={lineData} />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
