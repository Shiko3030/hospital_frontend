import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DeleteUser() {
    const { id } = useParams(); // جلب معرف المستخدم من المسار
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token'); // جلب التوكن للمصادقة
    const [isSuperuser, setIsSuperuser] = useState(false); // حالة لتخزين ما إذا كان المستخدم Superuser
    const [loading, setLoading] = useState(true); // حالة للتحميل

    useEffect(() => {
        if (!token) {
            toast.error("You need to be logged in to delete a user! 🚫");
            navigate('/login');
            return;
        }

        // جلب بيانات المستخدم الحالي للتحقق من حالة Superuser
        axios.get('http://127.0.0.1:8000/auth/users/me/', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                setIsSuperuser(response.data.is_superuser);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
                toast.error("Failed to verify user permissions! 🚫");
                navigate('/login');
            });
    }, [token, navigate]);

    const handleDelete = async () => {
        if (!isSuperuser) {
            toast.error("Only superusers can delete users! 🚫");
            return;
        }

        try {
            await axios.delete(`http://127.0.0.1:8000/users/users/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("User Deleted Successfully! 🎉");
            setTimeout(() => {
                navigate('/users'); // التوجيه إلى صفحة المستخدمين بعد الحذف
            }, 2000); // تأخير 2 ثانية للسماح برؤية الـ Toast
        } catch (error) {
            console.error('Error deleting user:', error);
            if (error.response && error.response.status === 404) {
                toast.error("User not found! 🚫");
            } else {
                toast.error("Failed to delete user. Please try again. 😔");
            }
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>;
    }

    if (!isSuperuser) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900" id="bg">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">Access Denied</h1>
              <p className="mt-2 text-gray-700 dark:text-gray-200">Only admins can access this page.</p>
            </div>
          </div>
        );
    }

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <ToastContainer />
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
                Delete User
            </h1>
            <p>Are you sure you want to delete this user?</p>
            <div style={{ marginTop: '20px' }}>
                <button
                    onClick={handleDelete}
                    style={{ backgroundColor: 'red', color: 'white', padding: '10px 20px', marginRight: '10px' }}
                >
                    Yes, Delete
                </button>
                <button
                    onClick={() => navigate('/users')}
                    style={{ backgroundColor: 'gray', color: 'white', padding: '10px 20px' }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}