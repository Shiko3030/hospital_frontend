// Statistics.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Statistics = () => {
  const [stats, setStats] = useState({
    departments_count: 0,
    employees_count: 0,
    patients_count: 0,
    appointments_count: 0,
    job_types_count: 0,
    hospitals_count: 0,
  });
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get('http://localhost:8000/api/statistics/');
        setStats(response.data); // Update the data
        setLoading(false); // End loading
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setError('Failed to load statistics. Please try again later.');
        setLoading(false); // End loading even if there is an error
      }
    };

    fetchStatistics();
  }, []); // Runs once when the component mounts

  // If still loading, show a loading message
  if (loading) {
    return (
      <div className="w-full text-center p-4">
        <p className="text-gray-500 dark:text-gray-400">Loading statistics...</p>
      </div>
    );
  }

  // If there is an error, show an error message
  if (error) {
    return (
      <div className="w-full text-center p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Display the statistics in cards
  return (
    <div className="w-full p-4">
      <div className="grid max-w-screen-xl grid-cols-1 gap-6 mx-auto sm:grid-cols-2 lg:grid-cols-3">
        {/* Card for Departments */}
        <Link
          to="/departments"
          className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex flex-col items-center justify-center"
        >
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {stats.departments_count}
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">Departments</p>
        </Link>

        {/* Card for Employees */}
        <Link
          to="/employee"
          className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex flex-col items-center justify-center"
        >
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {stats.employees_count}
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">Employees</p>
        </Link>

        {/* Card for Patients */}
        <Link
          to="/patient"
          className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex flex-col items-center justify-center"
        >
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {stats.patients_count}
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">Patients</p>
        </Link>

        {/* Card for Appointments */}
        <Link
          to="/appointment"
          className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex flex-col items-center justify-center"
        >
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {stats.appointments_count}
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">Appointments</p>
        </Link>

        {/* Card for Job Types */}
        <Link
          to="/jobtypes"
          className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex flex-col items-center justify-center"
        >
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {stats.job_types_count}
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">Job Types</p>
        </Link>

        {/* Card for Hospitals */}
        <Link
          to="/hospitals"
          className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex flex-col items-center justify-center"
        >
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {stats.hospitals_count}
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">Hospitals</p>
        </Link>
      </div>
    </div>
  );
};

export default Statistics;