import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UpdateHospital() {
    const [hospitalName, setHospitalName] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchHospital = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/hospitals/${id}/`);
                const hospital = response.data;
                setHospitalName(hospital.hospital_name);
                setAddress(hospital.address || '');
                setPhoneNumber(hospital.phone_number || '');
                setEmail(hospital.email || '');
            } catch (error) {
                console.error('Error fetching hospital:', error);
                toast.error('Failed to load hospital data. Please try again.');
            }
        };
        fetchHospital();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://127.0.0.1:8000/api/hospitals/${id}/update/`, { 
                hospital_name: hospitalName,
                address,
                phone_number: phoneNumber,
                email 
            });
            toast.success("Hospital Updated Successfully! 🎉");
            setTimeout(() => {
                navigate('/hospitals');
            }, 4000);
        } catch (error) {
            console.error('Error updating hospital:', error);
            toast.error('Failed to update hospital. Please try again.');
        }
    };

    return (
        <section className="min-h-screen bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 flex items-center justify-center py-12">
            <div className="max-w-md w-full p-10 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl transform transition-all hover:shadow-3xl hover:-translate-y-2">
                <ToastContainer position="top-right" autoClose={3000} />
                <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 mb-8">Update Hospital</h2>
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
                    <button
                        type="submit"
                        className="w-full py-3 px-5 bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-yellow-600 focus:ring-4 focus:ring-pink-300 transition-all duration-300 transform hover:scale-105"
                    >
                        Update Hospital
                    </button>
                </form>
            </div>
        </section>
    );
}