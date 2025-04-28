import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../public/images/patient.png";
import { Appointment, Medicine } from "@/types";
import withAuth from "@/components/withPrivateRoute";
import moment from "moment";
import { MdDashboard } from "react-icons/md";
import { FaNotesMedical, FaUserEdit } from "react-icons/fa";
import { RiLogoutCircleFill } from "react-icons/ri";
import useLocalStorage from "@/hooks/useLocalStorage";
import styles from "../styles/AppointmentButton.module.css";
import { normalizeRole, ROLES, getRoleTokens } from "@/utils/roles";

interface AppointmentWithMedicine extends Appointment {
  medicine: Medicine;
}

const PatientDashboard = () => {
  const router = useRouter();
  const [listAppointment, setListAppointment] = useState<
    AppointmentWithMedicine[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [login] = useLocalStorage<string | null>("LoginPatient", null);

  // Corrected to use PATIENT role tokens
  const { tokenKey, loginKey, idKey } = getRoleTokens(ROLES.PATIENT);

  useEffect(() => {
    console.log("Authentication Status Check:", {
      token: localStorage.getItem(tokenKey),
      role: normalizeRole(localStorage.getItem("role") || ""),
      patientId: localStorage.getItem(idKey),
    });

    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const patientId = localStorage.getItem(idKey);
      console.log("Fetching appointments for patient ID:", patientId);

      if (!patientId) {
        throw new Error("No patient ID found in localStorage");
      }

      const token = localStorage.getItem(tokenKey);
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        `https://tatbib-api.onrender.com/appointment/getAppointmentPatient/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(
        "First appointment:",
        JSON.stringify(response.data[0], null, 2)
      );
      console.log("Medicine object:", response.data[0]?.medicine);
      console.log(response.data); // Log the response here to check the data
      setListAppointment(response.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      // Handle errors as before
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    const patientStorageItems = [
      tokenKey,
      loginKey,
      idKey,
      "role", // Changed to match standard role storage
    ];

    patientStorageItems.forEach((item) => localStorage.removeItem(item));

    router.push("/login_patient");
    toast.success("Logged out successfully");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>... جاري تحميل المواعيد </p>
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

  return (
    <div className="Container">
      <nav className="menu" tabIndex={0}>
        <div className="smartphone-menu-trigger" />
        <header className="avatar">
          <Image
            alt="Patient profile"
            src={logo}
            width={150}
            height={150}
            style={{ borderRadius: "50%" }}
          />
          <h6>Welcome</h6>
          <h5 style={{ color: "white" }}>{login}</h5>
        </header>
        <ul>
          <li tabIndex={0} className="icon-customers">
            <MdDashboard />
            <span>Appointment</span>
          </li>
          <li tabIndex={0} className="icon-users">
            <FaNotesMedical />
            <Link href="/ordonnances_by_patient" passHref>
              <span style={{ textDecoration: "none", color: "white" }}>
                Ordonnances
              </span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-profil">
            <FaUserEdit />
            <Link href="/account_patient" passHref>
              <span style={{ textDecoration: "none", color: "white" }}>
                MyAccount
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
          My Appointment<span> Management | Appointment</span>
        </div>

        <div className="table-responsive">
          <div className="table-wrapper">
            <div className="table-title">
              <div className="row">
                <div className="col-sm-5">
                  <h2>
                    Appointment <b>list</b>
                  </h2>
                </div>
              </div>
            </div>

            {listAppointment && listAppointment.length > 0 ? (
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>FullName</th>
                    <th>Speciality</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {listAppointment.map((item, index) => (
                    <tr key={index}>
                      <td>{item.medicine?.fullName || "N/A"}</td>
                      <td>{item.medicine?.speciality || "N/A"}</td>
                      <td>{moment(item.dateTime).format("MMMM DD YYYY")}</td>
                      <td>{moment(item.dateTime).format("HH:mm")}</td>
                      <td
                        style={{
                          textAlign: "center",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.status === "Pending" ? (
                          <>
                            <div className="loading-spinner">
                              <div className="spinner"></div>
                            </div>
                            <span
                              style={{ marginLeft: "10px", fontSize: "14px" }}
                            >
                              Pending
                            </span>
                          </>
                        ) : item.status === "Confirmed" ? (
                          <>
                            <span
                              style={{
                                color: "green",
                                fontSize: "18px",
                                marginRight: "8px",
                              }}
                            >
                              ✔️
                            </span>
                            <span style={{ color: "green", fontSize: "14px" }}>
                              Confirmed
                            </span>
                          </>
                        ) : item.status === "Unconfirmed" ? (
                          <>
                            <span
                              style={{
                                color: "red",
                                fontSize: "18px",
                                marginRight: "8px",
                              }}
                            >
                              ❌
                            </span>
                            <span style={{ color: "red", fontSize: "14px" }}>
                              Unconfirmed
                            </span>
                          </>
                        ) : (
                          item.status
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-appointments">
                <p>No appointments found</p>
                <Link href="/search_medicine" passHref>
                  <button className="btn btn-primary">
                    Make an appointment
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {listAppointment && listAppointment.length > 0 && (
          <Link href="/search_medicine" passHref>
            <button className={styles.button}>
              <span className={styles.content}>
                <svg className={styles.icon} viewBox="0 0 24 24">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
                Make Another Appointment
              </span>
            </button>
          </Link>
        )}

        <ToastContainer />
        {/* Add some style for the spinner */}
        <style jsx>{`
          .loading-spinner {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .spinner {
            width: 24px;
            height: 24px;
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-left-color: #09f;
            border-radius: 50%;
            animation: spin 1s linear infinite;
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
      </main>
    </div>
  );
};

export default withAuth(PatientDashboard, { role: ROLES.PATIENT });
