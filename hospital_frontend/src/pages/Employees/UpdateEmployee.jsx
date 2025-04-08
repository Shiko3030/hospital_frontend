import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UpdateEmployee() {
    const { id } = useParams();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [hospital, setHospital] = useState('');
    const [job, setJob] = useState('');
    const [department, setDepartment] = useState('');
    const [departments, setDepartments] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        Promise.all([
            axios.get('http://127.0.0.1:8000/api/departments/'),
            axios.get('http://127.0.0.1:8000/api/hospitals/'),
            axios.get('http://127.0.0.1:8000/api/jobtypes/'),
            axios.get(`http://127.0.0.1:8000/api/employees/${id}`)
        ])
            .then(([departmentsRes, hospitalsRes, jobTypesRes, employeeRes]) => {
                setDepartments(departmentsRes.data);
                setHospitals(hospitalsRes.data);
                setJobTypes(jobTypesRes.data);
                const data = employeeRes.data;
                setFirstName(data.first_name || '');
                setLastName(data.last_name || '');
                setSpecialty(data.specialty || '');
                setLicenseNumber(data.license_number || '');
                setHospital(data.hospital || '');
                setJob(data.job || '');
                setDepartment(data.department || '');
            })
            .catch(error => console.error('Error fetching data:', error))
            .finally(() => setIsLoading(false));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const payload = {
            first_name: firstName,
            last_name: lastName,
            hospital: parseInt(hospital),
            specialty: specialty || null,
            license_number: licenseNumber || null,
            job: parseInt(job),
            department: parseInt(department)
        };
        console.log('Payload being sent:', payload);
        try {
            await axios.put(`http://127.0.0.1:8000/api/employees/${id}/update/`, payload);
            toast.success("Employee Updated Successfully! 🎉", {
                autoClose: 4000,
            });
            setTimeout(() => {
                navigate('/employee');
            }, 2000);
        } catch (error) {
            const errors = error.response?.data;
            let errorText = "Failed to update employee. Please try again.";
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
                <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 mb-8">Update Employee</h2>
                {isLoading ? (
                    <p className="text-center text-white text-lg">Loading...</p>
                ) : (
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
                            <label className="block mb-2 text-sm font-bold text-white">Hospital</label>
                            <select
                                value={hospital}
                                onChange={(e) => setHospital(e.target.value)}
                                required
                                className="w-full p-3 bg-purple-100 dark:bg-purple-200 border-2 border-purple-400 rounded-xl text-gray-900 focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300"
                            >
                                <option value="">Select a hospital</option>
                                {hospitals.map(h => (
                                    <option key={h.id} value={h.id}>{h.hospital_name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-bold text-white">Specialty</label>
                            <input
                                type="text"
                                value={specialty}
                                onChange={(e) => setSpecialty(e.target.value)}
                                placeholder="Specialty"
                                className="w-full p-3 bg-pink-100 dark:bg-pink-200 border-2 border-pink-400 rounded-xl text-gray-900 focus:ring-4 focus:ring-pink-300 focus:border-pink-500 transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-bold text-white">License Number</label>
                            <input
                                type="text"
                                value={licenseNumber}
                                onChange={(e) => setLicenseNumber(e.target.value)}
                                placeholder="License Number"
                                className="w-full p-3 bg-yellow-100 dark:bg-yellow-200 border-2 border-yellow-400 rounded-xl text-gray-900 focus:ring-4 focus:ring-yellow-300 focus:border-yellow-500 transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-bold text-white">Job</label>
                            <select
                                value={job}
                                onChange={(e) => setJob(e.target.value)}
                                required
                                className="w-full p-3 bg-green-100 dark:bg-green-200 border-2 border-green-400 rounded-xl text-gray-900 focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all duration-300"
                            >
                                <option value="">Select a job</option>
                                {jobTypes.map(j => (
                                    <option key={j.id} value={j.id}>{j.job_name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-bold text-white">Department</label>
                            <select
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                required
                                className="w-full p-3 bg-orange-100 dark:bg-orange-200 border-2 border-orange-400 rounded-xl text-gray-900 focus:ring-4 focus:ring-orange-300 focus:border-orange-500 transition-all duration-300"
                            >
                                <option value="">Select a department</option>
                                {departments.map(d => (
                                    <option key={d.id} value={d.id}>{d.department_name}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-5 bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-yellow-600 focus:ring-4 focus:ring-pink-300 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Updating...' : 'Update Employee'}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
}