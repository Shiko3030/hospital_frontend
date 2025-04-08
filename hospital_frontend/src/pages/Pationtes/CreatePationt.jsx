import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreatePatient() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [hospital, setHospital] = useState('');
    const [hospitals, setHospitals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/hospitals/')
            .then(response => setHospitals(response.data))
            .catch(error => console.error('Error fetching hospitals:', error));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const payload = {
            first_name: firstName,
            last_name: lastName,
            gender,
            date_of_birth: dateOfBirth || null,
            phone_number: phoneNumber || null,
            email: email || null,
            hospital: parseInt(hospital)
        };
        console.log('Payload being sent:', payload);
        try {
            await axios.post('http://127.0.0.1:8000/api/patient/create/', payload);
            toast.success("Patient Created Successfully! 🎉", {
                autoClose: 2000,
            });
            setFirstName('');
            setLastName('');
            setGender('');
            setDateOfBirth('');
            setPhoneNumber('');
            setEmail('');
            setHospital('');
            setTimeout(() => {
                navigate('/patient');
            }, 4000);
        } catch (error) {
            const errors = error.response?.data;
            let errorText = "Failed to create patient. Please try again.";
            if (errors && typeof errors === 'object') {
                errorText = Object.entries(errors)
                    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
                    .join(" | ");
            }
            toast.error(errorText);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="min-h-screen bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 flex items-center justify-center py-12">
            <div className="max-w-lg w-full p-10 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl transform transition-all hover:shadow-3xl hover:-translate-y-2">
                <ToastContainer position="top-right" autoClose={3000} />
                <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 mb-8">Create Patient</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-2 text-sm font-bold text-white">First Name</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="First Name"
                            required
                            className="w-full p-3 bg-teal-100 dark:bg-teal-200 border-2 border-teal-400 rounded-xl text-gray-900 focus:ring-4 focus:ring-teal-300 focus:border-teal-500 transition-all duration-300"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-bold text-white">Last Name</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Last Name"
                            required
                            className="w-full p-3 bg-blue-100 dark:bg-blue-200 border-2 border-blue-400 rounded-xl text-gray-900 focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-bold text-white">Gender</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                            className="w-full p-3 bg-purple-100 dark:bg-purple-200 border-2 border-purple-400 rounded-xl text-gray-900 focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-bold text-white">Date of Birth</label>
                        <input
                            type="date"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            className="w-full p-3 bg-pink-100 dark:bg-pink-200 border-2 border-pink-400 rounded-xl text-gray-900 focus:ring-4 focus:ring-pink-300 focus:border-pink-500 transition-all duration-300"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-bold text-white">Phone Number</label>
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Phone Number"
                            className="w-full p-3 bg-yellow-100 dark:bg-yellow-200 border-2 border-yellow-400 rounded-xl text-gray-900 focus:ring-4 focus:ring-yellow-300 focus:border-yellow-500 transition-all duration-300"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-bold text-white">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full p-3 bg-green-100 dark:bg-green-200 border-2 border-green-400 rounded-xl text-gray-900 focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all duration-300"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-bold text-white">Hospital</label>
                        <select
                            value={hospital}
                            onChange={(e) => setHospital(e.target.value)}
                            required
                            className="w-full p-3 bg-orange-100 dark:bg-orange-200 border-2 border-orange-400 rounded-xl text-gray-900 focus:ring-4 focus:ring-orange-300 focus:border-orange-500 transition-all duration-300"
                        >
                            <option value="">Select a hospital</option>
                            {hospitals.map(h => (
                                <option key={h.id} value={h.id}>{h.hospital_name}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-5 bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-yellow-600 focus:ring-4 focus:ring-pink-300 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating...' : 'Create Patient'}
                    </button>
                </form>
            </div>
        </section>
    );
}