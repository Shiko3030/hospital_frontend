"use client";

import { Link, useNavigate } from "react-router-dom";
import DarkModeToggle from "../pages/DarkModeToggle";

export function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("access_token");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  // Nav item styles
  const navItemClass = `
    relative block py-2 px-4 
    text-gray-800 dark:text-gray-100 
    rounded-lg font-medium
    transition-all duration-300 ease-in-out
    hover:text-indigo-600 dark:hover:text-indigo-400
    hover:bg-indigo-50/50 dark:hover:bg-gray-800/50
    after:absolute after:left-0 after:bottom-0
    after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-indigo-400 after:to-purple-400
    after:transition-all after:duration-300 after:ease-in-out
    hover:after:w-full
  `;

  return (
    <nav className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        {/* Logo */}
        <Link to="/hospitals" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">
            Hospitals
          </span>
        </Link>

        {/* Right Section: Dark Mode Toggle + Menu Button */}
        <div className="flex items-center gap-4">
          <DarkModeToggle />
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 md:hidden"
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className="hidden w-full md:flex md:w-auto md:items-center"
          id="navbar-default"
        >
          <ul className="flex flex-col md:flex-row md:space-x-6 md:mt-0 font-medium">
            {[
              { to: "/", text: "Home" },
              { to: "/departments", text: "Departments" },
              { to: "/jobtypes", text: "JobTypes" },
              { to: "/appointment", text: "Appointments" },
              { to: "/employee", text: "Employee" },
              { to: "/patient", text: "Patients" },
            ].map((item) => (
              <li key={item.to}>
                <Link to={item.to}>
                  <span className={navItemClass}>{item.text}</span>
                </Link>
              </li>
            ))}

            {/* Dropdown */}
            <li className="relative">
              <button
                id="dropdownDefaultButton"
                data-dropdown-toggle="dropdown"
                className="flex items-center justify-between w-full md:w-auto py-2 px-4 text-gray-800 dark:text-gray-100 bg-indigo-100/50 dark:bg-gray-800/50 hover:bg-indigo-200/50 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-300"
                type="button"
              >
                More
                <svg
                  className="w-3 h-3 ml-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>

              <div
                id="dropdown"
                className="absolute left-0 mt-2 z-10 hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg w-48"
              >
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <Link to="/Filter">
                      <span className={`${navItemClass} w-full`}>Statistics</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/users">
                      <span className={`${navItemClass} w-full`}>Users</span>
                    </Link>
                  </li>
                  <li>
                    {isLoggedIn ? (
                      <Link to="/login" onClick={handleLogout}>
                        <span className={`${navItemClass} w-full`}>Logout</span>
                      </Link>
                    ) : (
                      <Link to="/login">
                        <span className={`${navItemClass} w-full`}>Login</span>
                      </Link>
                    )}
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}