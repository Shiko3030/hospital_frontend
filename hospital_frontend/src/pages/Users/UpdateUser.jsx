import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditUser = () => {
  const { id } = useParams(); // لازم تكون عامل route فيها :id
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    hospital: '',
    can_view_all_hospitals: false,
  });

  const [hospitals, setHospitals] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    // Check if superuser
    axios.get('http://127.0.0.1:8000/auth/users/me/', { headers })
      .then(res => {
        setIsSuperuser(res.data.is_superuser);
      })
      .catch(() => navigate('/login'));

    // Fetch hospitals
    axios.get('http://127.0.0.1:8000/api/hospitals/', { headers })
      .then(res => setHospitals(res.data))
      .catch(() => setErrorMessage('Failed to load hospitals.'));

    // Fetch user data
    axios.get(`http://127.0.0.1:8000/users/users/${id}/`, { headers })
      .then(res => {
        const { username, hospital, can_view_all_hospitals } = res.data;
        setFormData({
          username,
          password: '', // don't show password
          hospital,
          can_view_all_hospitals,
        });
        setLoading(false);
      })
      .catch(() => {
        setErrorMessage('Failed to load user data.');
        setLoading(false);
      });
  }, [id, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isSuperuser) {
      setErrorMessage('Only superusers can edit users!');
      toast.error("Only superusers can edit users! 🚫");
      return;
    }

    const updatedData = { ...formData };
    if (!updatedData.password) delete updatedData.password; // ignore if empty

    try {
      await axios.put(`http://127.0.0.1:8000/users/users/${id}/`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User Updated Successfully! 🎉");
      setTimeout(() => {
        navigate('/users'); // التوجيه إلى صفحة المستخدمين بدلًا من الصفحة الرئيسية
      }, 2000); // تأخير 2 ثانية للسماح برؤية الـ Toast
    } catch (error) {
      if (error.response && error.response.data) {
        const errors = error.response.data;
        let errorText = '';
        for (let key in errors) {
          errorText += Array.isArray(errors[key]) ? `${errors[key].join(', ')}\n` : `${errors[key]}\n`;
        }
        setErrorMessage(errorText.trim());
        toast.error(`Failed to update user: ${errorText.trim()}`);
      } else {
        setErrorMessage('Failed to update user! Please try again.');
        toast.error("Failed to update user! Please try again. 😔");
      }
    }
  };

  if (loading) return <div>Loading...</div>;

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
    <main className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <ToastContainer /> {/* إضافة ToastContainer لعرض الرسائل */}
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Edit User
        </h1>
        <form onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="mb-4 text-red-600 dark:text-red-400 text-sm">{errorMessage}</div>
          )}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              id="username"
              className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white"
              placeholder="Enter username"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Password (leave blank to keep current)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              id="password"
              className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white"
              placeholder="New password"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="hospital" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Hospital
            </label>
            <select
              name="hospital"
              value={formData.hospital}
              onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
              id="hospital"
              className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-white"
              required
            >
              <option value="">Select a hospital</option>
              {hospitals.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.hospital_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="can_view_all_hospitals"
                checked={formData.can_view_all_hospitals}
                onChange={(e) => setFormData({ ...formData, can_view_all_hospitals: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Can view all hospitals
              </span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Update User
          </button>
        </form>
      </div>
    </main>
  );
};

export default EditUser;