import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaChartPie, FaBook } from 'react-icons/fa';

const Navigation = () => {
  return (
    <aside className="w-64 h-screen bg-white/40 backdrop-blur-md shadow-xl p-6 fixed">
      <h1 className="text-2xl font-bold text-indigo-700 mb-10">💸 SpendWise</h1>
      <nav className="flex flex-col gap-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-lg transition ${
              isActive ? 'bg-indigo-500 text-white' : 'text-indigo-700 hover:bg-indigo-100'
            }`
          }
        >
          <FaChartPie /> Dashboard
        </NavLink>
        <NavLink
          to="/journal"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-lg transition ${
              isActive ? 'bg-indigo-500 text-white' : 'text-indigo-700 hover:bg-indigo-100'
            }`
          }
        >
          <FaBook /> Journal
        </NavLink>
      </nav>
    </aside>
  );
};

export default Navigation;
