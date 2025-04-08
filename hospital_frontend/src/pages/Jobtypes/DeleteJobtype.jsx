import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DeleteJobType() {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/jobtypes/${id}/delete/`);
            toast.success("Job Type Deleted Successfully! 🎉");
            
            setTimeout(() => {
                navigate('/jobtypes');
            }, 4000);
        } catch (error) {
            console.error('Error deleting job type:', error);
            alert('Failed to delete job type. Please try again.');
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }} id="bg">
            <ToastContainer />
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
                Delete Job Type
            </h1>
            <p>Are you sure you want to delete this job type?</p>
            <div style={{ marginTop: '20px' }}>
                <button
                    onClick={handleDelete}
                    style={{ backgroundColor: 'red', color: 'white', padding: '10px 20px', marginRight: '10px' }}
                >
                    Yes, Delete
                </button>
                <button
                    onClick={() => navigate('/jobtypes')}
                    style={{ backgroundColor: 'gray', color: 'white', padding: '10px 20px' }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}