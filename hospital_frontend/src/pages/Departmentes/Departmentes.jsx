import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function DepartmentList() {
    const [departments, setDepartments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/departments/', {
                    params: { search: searchTerm }
                });
                setDepartments(response.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };
        fetchDepartments();
    }, [searchTerm]);

    const handleSearch = (e) => {
        e.preventDefault();
        const searchValue = e.target.elements['default-search'].value;
        setSearchTerm(searchValue);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 p-6">
            <div className="max-w-4xl mx-auto">
                <form className="max-w-md mx-auto mb-6" onSubmit={handleSearch}>
                    <label htmlFor="default-search" className="mb-2 text-sm font-medium text-white sr-only">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input 
                            type="search" 
                            id="default-search" 
                            className="block w-full p-4 ps-10 text-sm text-gray-900 border-2 border-teal-400 rounded-xl bg-teal-100 focus:ring-4 focus:ring-teal-300 focus:border-teal-500 transition-all duration-300 dark:bg-teal-200 dark:border-teal-500 dark:placeholder-gray-500 dark:text-gray-900 dark:focus:ring-teal-400 dark:focus:border-teal-600" 
                            placeholder="Search departments..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </form>

                <button className="relative inline-flex items-center justify-center p-0.5 mb-6 mx-auto overflow-hidden text-sm font-bold text-white rounded-xl group bg-gradient-to-br from-pink-500 to-yellow-500 group-hover:from-pink-600 group-hover:to-yellow-600 focus:ring-4 focus:outline-none focus:ring-pink-300 transition-all duration-300">
                    <Link to="/departments/create" className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-lg group-hover:bg-transparent">
                        Create New Department
                    </Link>
                </button>

                <div className="relative overflow-x-auto shadow-2xl rounded-2xl bg-white dark:bg-gray-900 transform transition-all hover:shadow-3xl">
                    <table className="w-full text-sm text-left text-gray-900 dark:text-white">
                        <thead className="text-xs uppercase bg-gradient-to-r from-teal-500 to-blue-600 text-white">
                            <tr>
                                <th scope="col" className="px-6 py-4 rounded-tl-2xl">ID</th>
                                <th scope="col" className="px-6 py-4">Name</th>
                                <th scope="col" className="px-6 py-4">Hospital</th>
                                <th scope="col" className="px-6 py-4 rounded-tr-2xl">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.length > 0 ? (
                                departments.map((department, index) => (
                                    <tr 
                                        key={department.id} 
                                        className={`${
                                            index % 2 === 0 ? 'bg-teal-50 dark:bg-teal-900' : 'bg-blue-50 dark:bg-blue-900'
                                        } border-b dark:border-gray-700 hover:bg-gradient-to-r hover:from-teal-100 hover:to-blue-100 dark:hover:from-teal-800 dark:hover:to-blue-800 transition-all duration-300`}
                                    >
                                        <td className="px-6 py-4 font-medium">{department.id}</td>
                                        <td className="px-6 py-4 font-medium">{department.department_name}</td>
                                        <td className="px-6 py-4">{department.hospital_name || '-'}</td>
                                        <td className="flex items-center px-6 py-4 space-x-3">
                                            <Link 
                                                to={`/departments/${department.id}/update`} 
                                                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors duration-200"
                                            >
                                                Edit
                                            </Link>
                                            <Link 
                                                to={`/departments/${department.id}/delete`} 
                                                className="font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:underline transition-colors duration-200"
                                            >
                                                Remove
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900">
                                        No departments found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}