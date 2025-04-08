import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UpdateJobType() {
    const [jobName, setJobName] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchJobType = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/jobtypes/${id}/`);
                const jobType = response.data;
                setJobName(jobType.job_name);
            } catch (error) {
                console.error('Error fetching job type:', error);
                toast.error('Failed to load job type data. Please try again.');
            }
        };
        fetchJobType();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://127.0.0.1:8000/api/jobtypes/${id}/update/`, { 
                job_name: jobName,
            });
            toast.success("Job Type Updated Successfully! 🎉");
            setTimeout(() => {
                navigate('/jobtypes');
            }, 4000);
        } catch (error) {
            console.error('Error updating job type:', error);
            toast.error('Failed to update job type. Please try again.');
        }
    };

    return (
        <section className="min-h-screen bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 flex items-center justify-center py-12">
            <div className="max-w-md w-full p-10 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl transform transition-all hover:shadow-3xl hover:-translate-y-2">
                <ToastContainer position="top-right" autoClose={3000} />
                <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 mb-8">Update Job Type</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-2 text-sm font-bold text-white">Job Name</label>
                        <input
                            type="text"
                            value={jobName}
                            onChange={(e) => setJobName(e.target.value)}
                            required
                            maxLength={50}
                            className="w-full p-3 bg-yellow-100 dark:bg-yellow-200 border-2 border-yellow-400 rounded-xl text-gray-900 focus:ring-4 focus:ring-yellow-300 focus:border-yellow-500 transition-all duration-300 placeholder-gray-500"
                            placeholder="Job Name"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 px-5 bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-yellow-600 focus:ring-4 focus:ring-pink-300 transition-all duration-300 transform hover:scale-105"
                    >
                        Update Job Type
                    </button>
                </form>
            </div>
        </section>
    );
}