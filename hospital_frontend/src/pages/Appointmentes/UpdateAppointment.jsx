import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditAppointment() {
    const { id } = useParams();
    const [patients, setPatients] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [patient, setPatient] = useState('');
    const [doctor, setDoctor] = useState('');
    const [hospital, setHospital] = useState('');
    const [department, setDepartment] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [status, setStatus] = useState('confirmed');
    const navigate = useNavigate();

    const STATUS_CHOICES = [
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'completed', label: 'Completed' }
    ];

    const formatDateForInput = (isoDate) => {
        if (!isoDate) return '';
        return isoDate.replace('Z', '');
    };

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/patient/')
            .then(response => setPatients(response.data))
            .catch(error => console.error('Error fetching patients:', error));

        axios.get('http://127.0.0.1:8000/api/hospitals/')
            .then(response => setHospitals(response.data))
            .catch(error => console.error('Error fetching hospitals:', error));

        axios.get('http://127.0.0.1:8000/api/departments/')
            .then(response => setDepartments(response.data))
            .catch(error => console.error('Error fetching departments:', error));

        axios.get('http://127.0.0.1:8000/api/doctors/')
            .then(response => setDoctors(response.data))
            .catch(error => console.error('Error fetching doctors:', error));

        axios.get(`http://127.0.0.1:8000/api/appointment/${id}`)
            .then(response => {
                const data = response.data;
                console.log('Fetched appointment data:', data);
                setPatient(data.patient || '');
                setDoctor(data.doctor || '');
                setHospital(data.hospital || '');
                setDepartment(data.department || '');
                setAppointmentDate(formatDateForInput(data.appointment_date));
                setStatus(data.status || 'confirmed');
            })
            .catch(error => console.error('Error fetching appointment details:', error));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://127.0.0.1:8000/api/appointment/${id}/update/`, {
                patient,
                doctor,
                hospital,
                department,
                appointment_date: appointmentDate,
                status
            });

            toast.success("Appointment Updated Successfully! 🎉");
            setTimeout(() => {
                navigate('/appointment');
            }, 4000);
        } catch (error) {
            console.error('Error updating appointment:', error);
            toast.error("Failed to update appointment. Please try again.");
        }
    };

    return (
        <section className="min-h-screen bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 flex items-center justify-center py-12">
            <div className="max-w-lg w-full p-10 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl transform transition-all hover:shadow-3xl hover:-translate-y-2">
                <ToastContainer position="top-right" autoClose={3000} />
                <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 mb-8">Edit Appointment</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-2 text-sm font-bold text-white">Hospital</label>
                        <select
                            value={hospital}
                            onChange={(e) => setHospital(e.target.value)}
                            required
                            className="w-full p-3 bg-teal-100 dark:bg-teal-200 border-2 border-teal-400 rounded-xl text-gray-900 focus:ring-4 focus:ring-teal-300 focus:border-teal-500 transition-all duration-300"
                        >
                            <option value="">Select a hospital</option>
                            {hospitals.map(h => (
                                <option key={h.id} value={h.id}>{h.hospital_name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-bold text-white">Patient</label>
                        <select
                            value={patient}
                            onChange={(e) => setPatient(e.target.value)}
                            required
                            className="w-full p-3 bg-blue-100 dark:bg-blue-200 border-2 border-blue-400 rounded-xl text-gray-900 focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300"
                        >
                            <option value="">Select a patient</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>{p.patient_name || `${p.first_name} ${p.last_name}`}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-bold text-white">Doctor</label>
                        <select
                            value={doctor}
                            onChange={(e) => setDoctor(e.target.value)}
                            required
                            className="w-full p-3 bg-purple-100 dark:bg-purple-200 border-2 border-purple-400 rounded-xl text-gray-900 focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300"
                        >
                            <option value="">Select a doctor</option>
                            {doctors.map(d => (
                                <option key={d.id} value={d.id}>{`${d.first_name} ${d.last_name}`}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-bold text-white">Department</label>
                        <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            required
                            className="w-full p-3 bg-pink-100 dark:bg-pink-200 border-2 border-pink-400 rounded-xl text-gray-900 focus:ring-4 focus:ring-pink-300 focus:border-pink-500 transition-all duration-300"
                        >
                            <option value="">Select a department</option>
                            {departments.map(d => (
                                <option key={d.id} value={d.id}>{d.department_name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-bold text-white">Appointment Date</label>
                        <input
                            type="datetime-local"
                            value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.target.value)}
                            required
                            className="w-full p-3 bg-yellow-100 dark:bg-yellow-200 border-2 border-yellow-400 rounded-xl text-gray-900 focus:ring-4 focus:ring-yellow-300 focus:border-yellow-500 transition-all duration-300"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-bold text-white">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            required
                            className="w-full p-3 bg-green-100 dark:bg-green-200 border-2 border-green-400 rounded-xl text-gray-900 focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all duration-300"
                        >
                            <option value="">Select a status</option>
                            {STATUS_CHOICES.map(status => (
                                <option key={status.value} value={status.value}>{status.label}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 px-5 bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-yellow-600 focus:ring-4 focus:ring-pink-300 transition-all duration-300 transform hover:scale-105"
                    >
                        Update Appointment
                    </button>
                </form>
            </div>
        </section>
    );
}