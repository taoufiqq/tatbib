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

      const response = await axios.get(
        `https://tatbib-api.onrender.com/appointment/getAppointmentMedcine/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            populate: "patient",
          },
        }
      );
      console.log("Appointments data:", response.data);
      setListAppointment(response.data);
    } catch (err: unknown) {
      console.error("Error fetching appointments:", err);

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
    const medicineStorageItems = [tokenKey, loginKey, idKey, "role", "medcine"];
    medicineStorageItems.forEach((item) => localStorage.removeItem(item));
    router.push("/login_medicine");
    toast.success("Logged out successfully");
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
      }}>
        <div style={{
          border: '4px solid rgba(0, 0, 0, 0.1)',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          borderLeftColor: '#09f',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>Loading appointments...</p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const loginMedcine = localStorage.getItem(loginKey) || "";

  return (
    <div className="Container" style={{ overflow: "hidden" }}>
        <nav className="menu" tabIndex={0}>
        <div className="smartphone-menu-trigger" />
        <header className="avatar">
          <Image
            alt="Doctor profile"
            src={logo}
            width={150}
            height={150}
            style={{ borderRadius: "50%" }}
          />
          <h6>Welcome</h6>
          <h5 style={{ color: "white" }}>{loginMedcine}</h5>
        </header>

        <ul>
          <li tabIndex={0} className="icon-customers">
            <MdDashboard />
            <Link href="/list_appointments_medicine" passHref>
              <span style={{ textDecoration: "none", color: "white" }}>
                List Appointments
              </span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-profil">
            <FaUserEdit />
            <Link href="/medicine_dashboard" passHref>
              <span style={{ textDecoration: "none", color: "white" }}>
                My Account
              </span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-users">
            <FaNotesMedical />
            <Link href="/ordonnances_by_medicine" passHref>
              <span style={{ textDecoration: "none", color: "white" }}>
                Ordonnances
              </span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-Secrétaire">
            <FaUserPlus />
            <Link href="/account_secretary" passHref>
              <span style={{ textDecoration: "none", color: "white" }}>
                Secretary
              </span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-settings">
            <RiLogoutCircleFill />
            <span onClick={handleLogout} style={{ cursor: "pointer" }}>
              Log out
            </span>
          </li>
        </ul>
      </nav>

      <main>
        <div className="helper">
          Appointment List <span> Management | Appointments</span>
        </div>
        <div className="table-responsive">
          <div className="table-wrapper">
            <div className="table-title">
              <div className="row">
                <div className="col-sm-5">
                  <h2>
                    Appointments <b>Management</b>
                  </h2>
                </div>
              </div>
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
                      <td style={{
                        color: appointment.status === "Confirmed" ? "green" : "red"
                      }}>
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
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center" }}>
                      No appointments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <ToastContainer position="top-right" autoClose={5000} />

      {/* <style jsx>{`
        .Container {
          position: relative;
          display: flex;
          width: 100%;
          height: 100vh;
          background-color: #f5f5f5;
          font-family: 'Roboto', Arial, sans-serif;
        }

        .menu {
          background: #2c3e50;
          color: white;
          width: 240px;
          height: 100%;
          box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
        }

        .avatar {
          padding: 2em 0.5em;
          text-align: center;
        }

        .avatar h6 {
          font-weight: 400;
          margin: 0.5em 0;
          color: #ccc;
        }

        .avatar h5 {
          margin: 0.2em 0;
          font-weight: 500;
        }
        
        .menu ul {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }

        .menu li {
          padding: 1em 1.5em;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .menu li:hover {
          background: #34495e;
        }

        .menu span {
          margin-left: 0.5em;
        }

        main {
          flex: 1;
          padding: 30px;
          overflow-y: auto;
        }

        .helper {
          margin-bottom: 20px;
          font-size: 1.1em;
          color: #555;
        }

        .helper span {
          color: #999;
          font-size: 0.9em;
        }

        .table-responsive {
          margin: 30px 0;
        }

        .table-wrapper {
          background: #fff;
          padding: 20px 25px;
          border-radius: 3px;
          min-width: 1000px;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
        }

        .table-title {
          padding-bottom: 15px;
          background: #fff;
          color: #333;
          padding: 16px 30px;
          margin: -20px -25px 10px;
          border-radius: 3px 3px 0 0;
        }

        .table-title h2 {
          margin: 5px 0 0;
          font-size: 24px;
        }

        .table-title .row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .col-sm-5 {
          width: 50%;
        }
        
        table.table-striped.table-hover {
          width: 100%;
          border-collapse: collapse;
        }

        table.table-striped.table-hover th,
        table.table-striped.table-hover td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        table.table-striped.table-hover th {
          background: #f8f9fa;
          font-weight: 600;
        }

        table.table-striped.table-hover tbody tr:nth-of-type(odd) {
          background-color: #fcfcfc;
        }

        table.table-striped.table-hover tbody tr:hover {
          background: #f5f5f5;
        }

        .edit {
          background: none;
          border: none;
          color: #17a2b8;
          cursor: pointer;
          font-size: 1.2rem;
        }
      `}</style> */}
    </div>
  );
};

// Export with withAuth HOC
export default withAuth(ListAppointments, { role: ROLES.MEDICINE });