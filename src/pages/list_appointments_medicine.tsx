import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../public/images/doctor.png";
import withAuth from "@/components/withPrivateRoute";
import moment from "moment";
import { Appointment } from "@/types";
import { MdDashboard } from "react-icons/md";
import { FaNotesMedical, FaUserEdit, FaUserPlus } from "react-icons/fa";
import { RiLogoutCircleFill } from "react-icons/ri";
import { normalizeRole, ROLES, getRoleTokens } from "@/utils/roles";

const ListAppointments = () => {
  const router = useRouter();
  const [listAppointment, setListAppointment] = useState<Appointment[] | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // Get the correct storage keys
  const { tokenKey, loginKey, idKey } = getRoleTokens(ROLES.MEDICINE);

  useEffect(() => {
    console.log("Authentication Status Check:", {
      token: localStorage.getItem(tokenKey),
      role: localStorage.getItem("role"),
      normalizedRole: normalizeRole(localStorage.getItem("role") || ""),
      login: localStorage.getItem(loginKey),
    });

    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const id = localStorage.getItem(idKey);
      console.log("Fetching appointments for medicine ID:", id);

      if (!id) {
        throw new Error("No medicine ID found in localStorage");
      }

      const token = localStorage.getItem(tokenKey);
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Note: You might need to update your API endpoint to use "medicine" instead of "medcine"
      const response = await axios.get(
        `https://tatbib-api.onrender.com/appointment/getAppointmentMedcine/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            populate: "patient", // Ensure patient data is fully populated
          },
        }
      );
      console.log("Appointments data:", response.data);
      setListAppointment(response.data);
    } catch (err: unknown) {
      console.error("Error fetching appointments:", err);

      // Type guard to check if it's an Axios error
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          handleLogout();
        } else {
          toast.error("Failed to load appointments");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrdonnance = (appointmentId: string, patientId: string) => {
    if (!patientId) {
      toast.error("Cannot create prescription - missing patient ID");
      return;
    }
    localStorage.setItem("idAppointment", appointmentId);
    localStorage.setItem("id_patient", patientId);
    router.push("/create_ordonnance");
  };

  const handleLogout = () => {
    // Clear all medicine-related localStorage items using the correct keys
    const medicineStorageItems = [tokenKey, loginKey, idKey, "role", "medcine"];

    medicineStorageItems.forEach((item) => localStorage.removeItem(item));

    router.push("/login_medicine");
    toast.success("Logged out successfully");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading appointments...</p>
        </div>
        <style jsx>{`
          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .loading-spinner {
            text-align: center;
          }
          .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border-left-color: #09f;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  const currentUser = localStorage.getItem(loginKey);

  return (
    <div className="doctor-dashboard">
      <nav className="sidebar">
        <div className="sidebar-header">
          <Image
            src={logo}
            alt="Doctor Profile"
            width={150}
            height={150}
            className="profile-image"
          />
          <h6>Welcome</h6>
          <h5>{currentUser}</h5>
        </div>

        <ul className="sidebar-menu">
          <li>
            <MdDashboard />
            <Link href="/list_appointments_medicine">
              <span>Appointments</span>
            </Link>
          </li>
          <li>
            <FaUserEdit />
            <Link href="/medicine_dashboard">
              <span>My Account</span>
            </Link>
          </li>
          <li>
            <FaNotesMedical />
            <Link href="/ordonnances_by_medicine">
              <span>Prescriptions</span>
            </Link>
          </li>
          <li>
            <FaUserPlus />
            <Link href="/account_secretary">
              <span>Secretary</span>
            </Link>
          </li>
          <li onClick={handleLogout}>
            <RiLogoutCircleFill />
            <span>Log Out</span>
          </li>
        </ul>
      </nav>

      <main className="content">
        <div className="page-header">
          <h1>Appointments List</h1>
        </div>

        <div className="table-container">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Last Name</th>
                <th>First Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listAppointment && listAppointment.length > 0 ? (
                listAppointment.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>{appointment.patient?.lastName || "N/A"}</td>
                    <td>{appointment.patient?.firstName || "N/A"}</td>
                    <td>{appointment.patient?.email || "N/A"}</td>
                    <td>{appointment.patient?.telephone || "N/A"}</td>
                    <td>
                      {moment(appointment.dateTime).format("MMMM DD YYYY")}
                    </td>
                    <td>{moment(appointment.dateTime).format("HH:mm")}</td>
                    <td
                      className={`status-${appointment.status.toLowerCase()}`}
                    >
                      {appointment.status}
                    </td>
                    <td>
                      {appointment.status !== "Unconfirmed" && (
                        <button
                          onClick={() => {
                            if (appointment.patient?._id) {
                              handleCreateOrdonnance(
                                appointment._id,
                                appointment.patient._id
                              );
                            } else {
                              toast.error("Patient ID is missing");
                            }
                          }}
                          className="ordonnance-btn"
                          title="Create Prescription"
                        >
                          <i className="material-icons">edit_document</i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="no-appointments">
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <style jsx>{`
        .doctor-dashboard {
          display: flex;
          min-height: 100vh;
          background-color: #f5f5f5;
        }

        .sidebar {
          width: 250px;
          background: #2c3e50;
          color: white;
          padding: 20px 0;
        }

        .sidebar-header {
          text-align: center;
          padding: 20px;
        }

        .profile-image {
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #3498db;
        }

        .sidebar-menu {
          list-style: none;
          padding: 0;
        }

        .sidebar-menu li {
          padding: 15px 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: background 0.3s;
        }

        .sidebar-menu li:hover {
          background: #34495e;
        }

        .content {
          flex: 1;
          padding: 30px;
        }

        .page-header {
          margin-bottom: 30px;
        }

        .table-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .appointments-table {
          width: 100%;
          border-collapse: collapse;
        }

        .appointments-table th,
        .appointments-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        .appointments-table th {
          background: #f8f9fa;
          font-weight: 600;
        }

        .status-confirmed {
          color: #28a745;
        }

        .status-unconfirmed {
          color: #dc3545;
        }

        .ordonnance-btn {
          background: none;
          border: none;
          color: #17a2b8;
          cursor: pointer;
          font-size: 1.2rem;
        }

        .no-appointments {
          text-align: center;
          padding: 20px;
          color: #6c757d;
        }
      `}</style>
    </div>
  );
};

// At the bottom of list_appointments_medicine.tsx
export default withAuth(ListAppointments, { role: ROLES.MEDICINE });
