import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateDepartment() {
    const [departmentName, setDepartmentName] = useState('');
    const [hospital, setHospital] = useState('');
    const [hospitals, setHospitals] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/hospitals/')
            .then(response => setHospitals(response.data))
            .catch(error => console.error('Error fetching hospitals:', error));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/departments/create/', { 
                department_name: departmentName,
                hospital
            });
            toast.success("Department Created Successfully! 🎉");
            setDepartmentName('');
            setHospital('');
            setTimeout(() => {
                navigate('/departments');
            }, 4000);
        } catch (error) {
            console.error('Error creating department:', error.response?.data || error.message);
            toast.error(`Failed to create department: ${error.response?.status || 'Unknown error'}`);
        }
    };

    return (
        <section className="min-h-screen bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 flex items-center justify-center py-12">
            <div className="max-w-md w-full p-10 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl transform transition-all hover:shadow-3xl hover:-translate-y-2">
                <ToastContainer position="top-right" autoClose={3000} />
                <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 mb-8">Create New Department</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-2 text-sm font-bold text-white">Department Name</label>
                        <input
                            type="text"
                            value={departmentName}
                            onChange={(e) => setDepartmentName(e.target.value)}
                            required
                            className="w-full p-3 bg-yellow-100 dark:bg-yellow-200 border-2 border-yellow-400 rounded-xl text-gray-900 focus:ring-4 focus:ring-yellow-300 focus:border-yellow-500 transition-all duration-300 placeholder-gray-500"
                            placeholder="Department Name"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-bold text-white">Hospital</label>
                        <select
                            value={hospital}
                            onChange={(e) => setHospital(e.target.value)}
                            required
                            className="w-full p-3 bg-green-100 dark:bg-green-200 border-2 border-green-400 rounded-xl text-gray-900 focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all duration-300 placeholder-gray-500"
                        >
                            <option value="">Select a hospital</option>
                            {hospitals.map(h => (
                                <option key={h.id} value={h.id}>{h.hospital_name}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 px-5 bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-yellow-600 focus:ring-4 focus:ring-pink-300 transition-all duration-300 transform hover:scale-105"
                    >
                        Create Department
                    </button>
                </form>
            </div>
        </section>
    );
}