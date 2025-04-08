import React from 'react';
import './App.css';
import { Navigate, Outlet } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Hospitals
import { Hospitals } from './pages/Hospitals/Hospitals';
import CreateHospital from './pages/Hospitals/CreateHospital';
import UpdateHospital from './pages/Hospitals/UpdateHospital';
import DeleteHospital from './pages/Hospitals/DeleteHospital';

// Jobtypes
import { JobTypes } from './pages/JobTypes/JobTypes';
import CreateJobType from './pages/Jobtypes/CreateJobtype';
import UpdateJobType from './pages/Jobtypes/UpdateJobtype';
import DeleteJobType from './pages/Jobtypes/DeleteJobtype';

// Appointments
import Appointmentes from './pages/Appointmentes/Appointmentes';
import CreateAppointment from './pages/Appointmentes/CreateAppointment';
import UpdateAppointment from './pages/Appointmentes/UpdateAppointment';
import DeleteAppointment from './pages/Appointmentes/DeleteAppointment';

// Departments
import Departmentes from './pages/Departmentes/Departmentes';
import CreateDepartment from './pages/Departmentes/CreateDepartment';
import UpdateDepartment from './pages/Departmentes/UpdateDepartment';
import DeleteDepartment from './pages/Departmentes/DeleteDepartment';

// Employees
import Employees from './pages/Employees/Employees';
import CreateEmployee from './pages/Employees/CreateEmployee';
import UpdateEmployee from './pages/Employees/UpdateEmployee';
import DeleteEmployee from './pages/Employees/DeleteEmploee';

// Patients
import Patientes from './pages/Pationtes/Pationtes';
import CreatePatient from './pages/Pationtes/CreatePationt';
import UpdatePatient from './pages/Pationtes/UpdatePationt';
import DeletePatient from './pages/Pationtes/DeletePationt';


//  Statistics
import Statistics from './pages/Statistics/Statistics';
import Filter from './pages/Statistics/Filter';


// Auth Pages
import Login from './pages/Login&Signup/Login';


// Users
import AddUser from './pages/Users/AddUser';
import UsersList from './pages/Users/Users';
import EditUser from './pages/Users/UpdateUser';
import DeleteUser from './pages/Users/DeleteUser';

// Other Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound'; 

import Layout from './hocs/Layout';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import TestPage from './pages/test_page';


// تعريف ProtectedRoute
const ProtectedRoute = () => {
  const token = localStorage.getItem('access_token');
  return token ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  return (
    
    <Router>
      <Layout>
        <Routes>
          {/* الصفحات العامة (مش محمية) */}
          <Route path="/login" element={<Login />} />

          {/* الصفحات المحمية */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
             <Route path="/test" element={<TestPage />} />
              {/* Users */}
            <Route path="/add_users" element={<AddUser />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/users/:id/update" element={<EditUser />} />
            <Route path="/users/:id/delete" element={<DeleteUser />} />


                        {/* Statistics */}
            <Route path="/Filter" element={<Filter />} />
            <Route path="/Statistics" element={<Statistics />} />

            {/* Departments */}
            <Route path="/departments" element={<Departmentes />} />
            <Route path="/departments/create" element={<CreateDepartment />} />
            <Route path="/departments/:id/update" element={<UpdateDepartment />} />
            <Route path="/departments/:id/delete" element={<DeleteDepartment />} />

            {/* Appointments */}
            <Route path="/appointment" element={<Appointmentes />} />
            <Route path="/appointment/create" element={<CreateAppointment />} />
            <Route path="/appointments/:id/update" element={<UpdateAppointment />} />
            <Route path="/appointments/:id/delete" element={<DeleteAppointment />} />

            {/* Employees */}
            <Route path="/employee" element={<Employees />} />
            <Route path="/employee/create" element={<CreateEmployee />} />
            <Route path="/employee/:id/update" element={<UpdateEmployee />} />
            <Route path="/employee/:id/delete" element={<DeleteEmployee />} />

            {/* Patients */}
            <Route path="/patient" element={<Patientes />} />
            <Route path="/patient/create" element={<CreatePatient />} />
            <Route path="/patient/:id/update" element={<UpdatePatient />} />
            <Route path="/patient/:id/delete" element={<DeletePatient />} />

            {/* Hospitals */}
            <Route path="/hospitals" element={<Hospitals />} />
            <Route path="/hospitals/create" element={<CreateHospital />} />
            <Route path="/hospitals/:id/update" element={<UpdateHospital />} />
            <Route path="/hospitals/:id/delete" element={<DeleteHospital />} />

            {/* Jobtypes */}
            <Route path="/jobtypes" element={<JobTypes />} />
            <Route path="/jobtypes/create" element={<CreateJobType />} />
            <Route path="/jobtypes/:id/update" element={<UpdateJobType />} />
            <Route path="/jobtypes/:id/delete" element={<DeleteJobType />} />


          </Route>

          {/* صفحة 404 لأي مسار مش موجود */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer /> {/* لعرض الـ Toast notifications */}
      </Layout>
    </Router>
  );
}

export default App;