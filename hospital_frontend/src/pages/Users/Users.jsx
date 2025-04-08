import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function UsersList() {
    const [users, setUsers] = useState([]);
    const [isSuperuser, setIsSuperuser] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null); // لتخزين id المستخدم الحالي
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem("access_token");

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                const userRes = await axios.get("http://127.0.0.1:8000/auth/users/me/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setIsSuperuser(userRes.data.is_superuser);
                setCurrentUserId(userRes.data.id); // تخزين id المستخدم الحالي

                if (!userRes.data.is_superuser) {
                    setLoading(false);
                    return;
                }

                const usersRes = await axios.get("http://127.0.0.1:8000/users/users_list/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(usersRes.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate, token]);

    if (loading) {
        return <div className="text-center mt-10 text-gray-600 dark:text-gray-300">Loading...</div>;
    }

    if (!isSuperuser) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900" id="bg">
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md" id="not_admin">
                    <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
                        Access Denied
                    </h1>
                    <p className="mt-2 text-gray-700 dark:text-gray-200">
                        Only admins can access this page.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4">
            <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                <Link to="/add_users" className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                    Add New User
                </Link>
            </button>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Hospital</th>
                        <th className="px-6 py-3">View All Hospitals</th>
                        <th className="px-6 py-3">Is Admin</th>
                        <th className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white">
                                <td className="px-6 py-4">{user.username}</td>
                                <td className="px-6 py-4">{user.hospital_name || "N/A"}</td>
                                <td className="px-6 py-4">{user.can_view_all_hospitals ? "Yes" : "No"}</td>
                                <td className="px-6 py-4">{user.is_superuser ? "Yes" : "No"}</td>
                                <td className="flex items-center px-6 py-4 space-x-3">
                                    <Link to={`/users/${user.id}/update`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                        Edit
                                    </Link>
                                    {/* إخفاء رابط Remove إذا كان المستخدم هو الـ admin الحالي */}
                                    {user.id !== currentUserId && (
                                        <Link to={`/users/${user.id}/delete`} className="font-medium text-red-600 dark:text-red-500 hover:underline">
                                            Remove
                                        </Link>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="px-6 py-4 text-center">No Users found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}