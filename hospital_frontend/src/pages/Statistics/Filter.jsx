import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import ApexCharts from 'apexcharts';
import Statistics from './Statistics';

const Filter = () => {
  const [hospitals, setHospitals] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [chartData, setChartData] = useState({ total_patients: 0, categories: [], data: [] });
  const [filters, setFilters] = useState({
    hospital: '',
    department: '',
    doctor: '',
    fromDate: '',
    toDate: '',
  });
  const [loading, setLoading] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [hospitalsRes, departmentsRes, doctorsRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/hospitals/'),
          axios.get('http://127.0.0.1:8000/api/departments/'),
          axios.get('http://127.0.0.1:8000/api/doctors/'),
        ]);
        setHospitals(hospitalsRes.data);
        setDepartments(departmentsRes.data);
        setDoctors(doctorsRes.data);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchInitialData();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setAppointments([]);
    setChartData({ total_patients: 0, categories: [], data: [] });

    try {
      const params = {
        hospital: filters.hospital,
        department: filters.department,
        doctor: filters.doctor,
        start_date: filters.fromDate,
        end_date: filters.toDate,
      };
      const response = await axios.get('http://127.0.0.1:8000/api/completed-appointments/', { params });
      setAppointments(response.data.appointments);
      setChartData(response.data.chart_data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
      setChartData({ total_patients: 0, categories: [], data: [] });
    } finally {
      setLoading(false);
    }
  };

  const renderChart = () => {
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const chartElement = document.querySelector("#area-chart");
    if (!chartElement) return;

    chartElement.innerHTML = '';

    if (loading) {
      chartElement.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400">Loading...</p>';
      return;
    }

    if (chartData.data.length === 0) {
      chartElement.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400">No Data Available</p>';
      return;
    }

    const options = {
      chart: {
        height: 300,
        width: "100%",
        type: "area",
        fontFamily: "Inter, sans-serif",
        dropShadow: { enabled: false },
        toolbar: { show: true },
      },
      tooltip: { enabled: true, x: { show: true } },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.55,
          opacityTo: 0,
          shade: "#1C64F2",
          gradientToColors: ["#1C64F2"],
        },
      },
      dataLabels: { enabled: false },
      stroke: { width: 3 },
      grid: {
        show: true,
        strokeDashArray: 4,
        padding: { left: 20, right: 20, top: 0, bottom: 0 },
      },
      series: [
        {
          name: "Number Of Patients",
          data: chartData.data,
          color: "#1A56DB",
        },
      ],
      xaxis: {
        categories: chartData.categories,
        labels: {
          show: true,
          style: {
            colors: "#6B7280",
            fontSize: "12px",
          },
          rotate: -45,
          rotateAlways: false,
          trim: true,
        },
        axisBorder: { show: true },
        axisTicks: { show: true },
        title: {
          text: "Date",
          style: {
            color: "#6B7280",
            fontSize: "14px",
            fontWeight: 600,
          },
        },
      },
      yaxis: {
        show: true,
        min: 0,
        max: Math.max(...chartData.data) + 1,
        tickAmount: Math.max(...chartData.data),
        labels: {
          show: true,
          style: {
            colors: "#6B7280",
            fontSize: "12px",
          },
          formatter: (value) => Math.round(value),
        },
        title: {
          text: "Number of Patients",
          style: {
            color: "#6B7280",
            fontSize: "14px",
            fontWeight: 600,
          },
        },
      },
    };

    const chart = new ApexCharts(chartElement, options);
    chart.render();
    chartRef.current = chart;
  };

  useEffect(() => {
    renderChart();
  }, [chartData, loading]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!filters.hospital && !filters.department && !filters.doctor && !filters.fromDate && !filters.toDate) {
      setAppointments([]);
      setChartData({ total_patients: 0, categories: [], data: [] });
    } else {
      fetchAppointments();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Filter Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl mb-6">
          <div>
            <label htmlFor="hospital" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Hospital
            </label>
            <select
              id="hospital"
              name="hospital"
              value={filters.hospital}
              onChange={handleFilterChange}
              className="bg-teal-50 border-2 border-teal-400 text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-teal-300 focus:border-teal-500 block w-full p-3 dark:bg-teal-900 dark:border-teal-600 dark:placeholder-gray-400 dark:text-white transition-all duration-300"
            >
              <option value="">Choose hospital</option>
              {hospitals.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.hospital_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="department" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Department
            </label>
            <select
              id="department"
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className="bg-teal-50 border-2 border-teal-400 text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-teal-300 focus:border-teal-500 block w-full p-3 dark:bg-teal-900 dark:border-teal-600 dark:placeholder-gray-400 dark:text-white transition-all duration-300"
            >
              <option value="">Choose Department</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.department_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="doctor" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Doctors
            </label>
            <select
              id="doctor"
              name="doctor"
              value={filters.doctor}
              onChange={handleFilterChange}
              className="bg-teal-50 border-2 border-teal-400 text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-teal-300 focus:border-teal-500 block w-full p-3 dark:bg-teal-900 dark:border-teal-600 dark:placeholder-gray-400 dark:text-white transition-all duration-300"
            >
              <option value="">Choose Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {`${doctor.first_name} ${doctor.last_name}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="from-date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              From Date
            </label>
            <input
              type="date"
              id="from-date"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleFilterChange}
              className="bg-teal-50 border-2 border-teal-400 text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-teal-300 focus:border-teal-500 block w-full p-3 dark:bg-teal-900 dark:border-teal-600 dark:text-white transition-all duration-300"
            />
          </div>

          <div>
            <label htmlFor="to-date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              To Date
            </label>
            <input
              type="date"
              id="to-date"
              name="toDate"
              value={filters.toDate}
              onChange={handleFilterChange}
              className="bg-teal-50 border-2 border-teal-400 text-gray-900 text-sm rounded-xl focus:ring-4 focus:ring-teal-300 focus:border-teal-500 block w-full p-3 dark:bg-teal-900 dark:border-teal-600 dark:text-white transition-all duration-300"
            />
          </div>

          <div className="col-span-1 md:col-span-4 flex items-center justify-end mt-2">
            <button
              type="submit"
              disabled={loading}
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-bold text-white rounded-xl group bg-gradient-to-br from-pink-500 to-yellow-500 group-hover:from-pink-600 group-hover:to-yellow-600 focus:ring-4 focus:outline-none focus:ring-pink-300 transition-all duration-300"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-lg group-hover:bg-transparent">
                {loading ? 'Loading...' : 'Apply Filters'}
              </span>
            </button>
          </div>
        </form>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appointments Table */}
          <div className="relative overflow-x-auto shadow-2xl rounded-2xl bg-white dark:bg-gray-900 transform transition-all hover:shadow-3xl">
            <table className="w-full text-sm text-left text-gray-900 dark:text-white">
              <thead className="text-xs uppercase bg-gradient-to-r from-teal-500 to-blue-600 text-white">
                <tr>
                  <th scope="col" className="px-6 py-4 rounded-tl-2xl">Patient Name</th>
                  <th scope="col" className="px-6 py-4">Department</th>
                  <th scope="col" className="px-6 py-4">Hospital</th>
                  <th scope="col" className="px-6 py-4">Doctor</th>
                  <th scope="col" className="px-6 py-4 rounded-tr-2xl">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      Loading appointments...
                    </td>
                  </tr>
                ) : appointments.length > 0 ? (
                  appointments.map((appointment, index) => (
                    <tr
                      key={appointment.id}
                      className={`${
                        index % 2 === 0 ? 'bg-teal-50 dark:bg-teal-900' : 'bg-blue-50 dark:bg-blue-900'
                      } border-b dark:border-gray-700 hover:bg-gradient-to-r hover:from-teal-100 hover:to-blue-100 dark:hover:from-teal-800 dark:hover:to-blue-800 transition-all duration-300`}
                    >
                      <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                        {appointment.patient_name}
                      </th>
                      <td className="px-6 py-4">{appointment.department_name}</td>
                      <td className="px-6 py-4">{appointment.hospital_name}</td>
                      <td className="px-6 py-4">{`${appointment.first_name} ${appointment.last_name}`}</td>
                      <td className="px-6 py-4">{new Date(appointment.appointment_date).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No appointments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Chart Section */}
          <div className="relative shadow-2xl rounded-2xl bg-white dark:bg-gray-900 transform transition-all hover:shadow-3xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h5 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {loading ? '...' : chartData.total_patients}
                </h5>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                  Total Number Of Patients
                </p>
              </div>
            </div>
            <div id="area-chart" className="w-full h-[300px]"></div>
          </div>
        </div>

        <Statistics />
      </div>
    </div>
  );
};

export default Filter;