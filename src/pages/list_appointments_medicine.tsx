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

const ITEMS_PER_PAGE = 5;

const ListAppointments = () => {
  const router = useRouter();
  const [listAppointment, setListAppointment] = useState<Appointment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const { tokenKey, loginKey, idKey } = getRoleTokens(ROLES.MEDICINE);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const id = localStorage.getItem(idKey);
      const token = localStorage.getItem(tokenKey);
      if (!id || !token) throw new Error("Missing credentials");

      const response = await axios.get(
        `https://tatbib-api.onrender.com/appointment/getAppointmentMedcine/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { populate: "patient" },
        }
      );

      setListAppointment(response.data.data);
    } catch (err: unknown) {
      console.error("Error fetching appointments:", err);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrdonnance = (appointmentId: string, patientId: string) => {
    if (!patientId) return toast.error("Missing patient ID");
    localStorage.setItem("idAppointment", appointmentId);
    localStorage.setItem("id_patient", patientId);
    router.push("/create_ordonnance");
  };

  const handleLogout = () => {
    [tokenKey, loginKey, idKey, "role", "medcine"].forEach((item) => localStorage.removeItem(item));
    router.push("/login_medicine");
    toast.success("Logged out successfully");
  };

  const paginatedAppointments = listAppointment?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = listAppointment ? Math.ceil(listAppointment.length / ITEMS_PER_PAGE) : 0;

  const loginMedcine = localStorage.getItem(loginKey) || "";

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div className="spinner" style={{ width: 36, height: 36 }}></div>
        <p>Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="Container">
      <nav className="menu" tabIndex={0}>
        <header className="avatar">
          <Image alt="Doctor profile" src={logo} width={150} height={150} style={{ borderRadius: "50%" }} />
          <h6>Welcome</h6>
          <h5 style={{ color: "white" }}>{loginMedcine}</h5>
        </header>
        <ul>
          <li><MdDashboard /><Link href="/list_appointments_medicine">List Appointments</Link></li>
          <li><FaUserEdit /><Link href="/medicine_dashboard">My Account</Link></li>
          <li><FaNotesMedical /><Link href="/ordonnances_by_medicine">Ordonnances</Link></li>
          <li><FaUserPlus /><Link href="/account_secretary">Secretary</Link></li>
          <li><RiLogoutCircleFill /><span onClick={handleLogout}>Log out</span></li>
        </ul>
      </nav>

      <main>
        <div className="helper">Appointment List <span> Management | Appointments</span></div>
        <div className="table-responsive">
          <div className="table-wrapper">
            <div className="table-title">
              <h2>Appointments <b>Management</b></h2>
            </div>
            <table className="table table-striped table-hover">
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
                {paginatedAppointments?.length ? (
                  paginatedAppointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{appointment.patient?.lastName || "N/A"}</td>
                      <td>{appointment.patient?.firstName || "N/A"}</td>
                      <td>{appointment.patient?.email || "N/A"}</td>
                      <td>{appointment.patient?.telephone || "N/A"}</td>
                      <td>{moment(appointment.dateTime).format("MMMM DD YYYY")}</td>
                      <td>{moment(appointment.dateTime).format("HH:mm")}</td>
                      <td style={{ textAlign: "center", display: "flex", alignItems: "center" }}>
                        {appointment.status === "Pending" ? (
                          <><div className="spinner"></div><span style={{ marginLeft: 10, color: "orange" }}>Pending</span></>
                        ) : appointment.status === "Confirmed" ? (
                          <span style={{ color: "green" }}>✔️ Confirmed</span>
                        ) : appointment.status === "Cancelled" ? (
                          <span style={{ color: "gray" }}>🚫 Cancelled</span>
                        ) : appointment.status === "Completed" ? (
                          <span style={{ color: "blue" }}>✅ Completed</span>
                        ) : (
                          <span style={{ color: "red" }}>❌ Unconfirmed</span>
                        )}
                      </td>
                      <td>
                        {!["Cancelled", "Unconfirmed", "Pending"].includes(appointment.status) && (
                          <button
                            onClick={() => appointment.patient?._id ? handleCreateOrdonnance(appointment._id, appointment.patient._id) : toast.error("Patient ID is missing")}
                            className="edit"
                            title="Create Prescription"
                          >
                            <i className="material-icons">&#xE254;</i>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={8} style={{ textAlign: "center" }}>No appointments found</td></tr>
                )}
              </tbody>
            </table>
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`page-button ${currentPage === page ? "active" : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={5000} />
      </main>

      <style jsx>{`
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: orange;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .pagination {
          margin-top: 20px;
          display: flex;
          justify-content: center;
        }
        .page-button {
          background: #eee;
          border: none;
          padding: 8px 12px;
          margin: 0 5px;
          cursor: pointer;
          border-radius: 5px;
        }
        .page-button.active {
          background: #293846;
          color: #fff;
        }
        @media (max-width: 768px) {
          .table-wrapper {
            overflow-x: auto;
          }
          .table {
            min-width: 700px;
          }
        }
      `}</style>
    </div>
  );
};

export default withAuth(ListAppointments, { role: ROLES.MEDICINE });

