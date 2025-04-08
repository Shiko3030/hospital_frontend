import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateHospital() {
    const [hospitalName, setHospitalName] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [isSuperuser, setIsSuperuser] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const checkSuperuser = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/auth/users/me/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setIsSuperuser(response.data.is_superuser);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user:', error);
                navigate('/login');
            }
        };
        
        checkSuperuser();
    }, [navigate, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isSuperuser) {
            setErrorMessage('Only superusers can add new hospitals!');
            return;
        }

        try {
            await axios.post('http://127.0.0.1:8000/api/hospitals/create/', { 
                hospital_name: hospitalName,
                address,
                phone_number: phoneNumber,
                email 
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            toast.success("Hospital Created Successfully! 🎉");
            setTimeout(() => {
                navigate('/hospitals');
            }, 4000);
        } catch (error) {
            console.error('Error creating hospital:', error);
            toast.error('Failed to create hospital. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                <div className="text-2xl font-bold text-white animate-bounce">Loading...</div>
            </div>
        );
    }

    if (!isSuperuser) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-yellow-400 via-red-500 to-pink-600">
                <div className="p-10 bg-white rounded-3xl shadow-2xl max-w-sm text-center transform transition-all hover:scale-110 hover:shadow-3xl">
                    <h1 className="text-4xl font-extrabold text-red-600 mb-4 animate-pulse">Access Denied</h1>
                    <p className="text-gray-700 font-medium">Only admins can access this page.</p>
                    {errorMessage && (
                        <p className="mt-4 text-red-600 font-semibold">{errorMessage}</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 flex items-center justify-center py-12">
            <div className="max-w-md w-full p-10 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl transform transition-all hover:shadow-3xl hover:-translate-y-2">
                <ToastContainer position="top-right" autoClose={3000} />
                <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 mb-8">Create New Hospital</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-2 text-sm font-bold text-white">Hospital Name</label>
                        <input
                            type="text"
                            value={hospitalName}
                            onChange={(e) => setHospitalName(e.target.value)}
                            required
                            maxLength={100}
                            className="w-full p-3 bg-yellow-100 dark:bg-yellow-200 border-2 border-yellow-400 rounded-xl text-gray-900 focus:ring-4 focus:ring-yellow-300 focus:border-yellow-500 transition-all duration-300 placeholder-gray-500"
                            placeholder="Hospital Name"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-bold text-white">Address</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            maxLength={255}
                            className="w-full p-3 bg-green-100 dark:bg-green-200 border-2 border-green-400 rounded-xl text-gray-900 focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all duration-300 placeholder-gray-500"
                            placeholder="Hospital Address"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-bold text-white">Phone Number</label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            maxLength={15}
                            className="w-full p-3 bg-blue-100 dark:bg-blue-200 border-2 border-blue-400 rounded-xl text-gray-900 focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 placeholder-gray-500"
                            placeholder="Phone Number"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-bold text-white">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            maxLength={100}
                            className="w-full p-3 bg-purple-100 dark:bg-purple-200 border-2 border-purple-400 rounded-xl text-gray-900 focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300 placeholder-gray-500"
                            placeholder="Hospital Email"
                        />
                    </div>
                    {errorMessage && (
                        <p className="text-red-500 font-bold text-center animate-pulse">{errorMessage}</p>
                    )}
                    <button
                        type="submit"
                        className="w-full py-3 px-5 bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-yellow-600 focus:ring-4 focus:ring-pink-300 transition-all duration-300 transform hover:scale-105"
                    >
                        Create Hospital
                    </button>
                </form>
            </div>
        </section>
    );
}