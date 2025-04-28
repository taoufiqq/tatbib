"use client";

import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../public/images/Secretary_avatar.png";
import withAuth from "@/components/withPrivateRoute";
import moment from "moment";
import { MdDashboard, MdFolderShared } from "react-icons/md";
import type { Appointment } from "@/types";
import { RiLogoutCircleFill } from "react-icons/ri";
import { ROLES, getRoleTokens } from "@/utils/roles";
import { FaCircle } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { FaBell, FaCheckCircle, FaTrashAlt } from "react-icons/fa";

const SecretaryDashboard: NextPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const [listAppointment, setListAppointment] = useState<Appointment[] | null>(
    null
  );
  const [status, setStatus] = useState<string>("Inactive");
  const [login, setLogin] = useState<string>("");

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        menuOpen &&
        window.innerWidth <= 768 &&
        !target.closest(".sidebar-menu") &&
        !target.closest(".mobile-menu-toggle")
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);
  useEffect(() => {
    // Check authentication on component mount
    const checkAndLoadData = () => {
      if (typeof window !== "undefined") {
        try {
          // Use the utility function to get consistent key names
          const { loginKey, tokenKey } = getRoleTokens(ROLES.SECRETARY);
          const secretaryLogin = localStorage.getItem(loginKey);
          const token = localStorage.getItem(tokenKey);

          // Verify we have the necessary auth data
          if (!secretaryLogin || !token) {
            console.error("Missing secretary authentication data");
            toast.error("Authentication error. Please log in again.");
            handleLogout();
            return;
          }
          const fetchedStatus = "Active"; // Replace with actual status check
          setStatus(fetchedStatus);
          setLogin(secretaryLogin);

          const doctorLogin = localStorage.getItem("login_medcine");

          if (!doctorLogin) {
            console.error("Doctor login information missing");
            toast.error("Doctor information missing. Please log in again.");
            handleLogout();
            return;
          }

          fetchAppointments(doctorLogin);
        } catch (error) {
          console.error("Error in authentication check:", error);
          toast.error("Authentication error. Please log in again.");
          handleLogout();
        }
      }
    };

    checkAndLoadData();
  }, []);

  const fetchAppointments = (doctorLogin: string) => {
    if (!doctorLogin) {
      toast.error("Doctor information missing");
      handleLogout();
      return;
    }

    // Get the token for authorization header
    const { tokenKey } = getRoleTokens(ROLES.SECRETARY);
    const token = localStorage.getItem(tokenKey);
    if (!token) {
      toast.error("Session expired");
      handleLogout();
      return;
    }

    axios
      .get(
        `https://tatbib-api.onrender.com/appointment/getAppointmentSecretary/${doctorLogin}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to request if your API requires it
          },
        }
      )
      .then((response) => {
        if (response.data) {
          setListAppointment(response.data);
        } else {
          setListAppointment(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching appointments:", err);

        // Handle unauthorized errors specifically
        if (err.response && err.response.status === 401) {
          toast.error("Session expired. Please log in again.", {
            position: "top-right",
            autoClose: 5000,
            theme: "colored",
          });
          handleLogout();
        } else {
          toast.error("Failed to load appointments", {
            position: "top-right",
            autoClose: 5000,
            theme: "colored",
          });
        }

        setLoading(false);
      });
  };

  const deleteAppointment = (id: string) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      setLoading(true);

      // Get the token for authorization header
      const { tokenKey } = getRoleTokens(ROLES.SECRETARY);
      const token = localStorage.getItem(tokenKey);

      axios
        .delete(
          `https://tatbib-api.onrender.com/secretary/deleteAppointment/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add token to request if your API requires it
            },
          }
        )
        .then(() => {
          setListAppointment(
            (prev) => prev?.filter((app) => app._id !== id) || null
          );
          toast.success("Appointment deleted successfully", {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error deleting appointment:", err);

          // Handle unauthorized errors specifically
          if (err.response && err.response.status === 401) {
            toast.error("Session expired. Please log in again.", {
              position: "top-right",
              autoClose: 5000,
              theme: "colored",
            });
            handleLogout();
          } else {
            toast.error("Failed to delete appointment", {
              position: "top-right",
              autoClose: 5000,
              theme: "colored",
            });
          }

          setLoading(false);
        });
    }
  };

  const handleAction = (id: string, path: string) => {
    localStorage.setItem("idAppointment", id);
    router.push(path);
  };

  const handleLogout = () => {
    try {
      // Use the utility function to get consistent key names
      const { tokenKey, loginKey, idKey } = getRoleTokens(ROLES.SECRETARY);

      // Clear all related localStorage items
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(loginKey);
      localStorage.removeItem("role");
      localStorage.removeItem(idKey);
      localStorage.removeItem("login_medcine");
      localStorage.removeItem("idAppointment"); // Also clear any appointment ID

      // Force a complete page reload to clear any in-memory state
      window.location.href = "/login_secretary";
    } catch (error) {
      console.error("Error during logout:", error);
      // If there's an error during logout, force a hard redirect anyway
      window.location.href = "/login_secretary";
    }
  };

  return (
    <div className="dashboard-container">
      {/* Hamburger menu for mobile */}
      <div
        className="mobile-menu-toggle"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        {/* <i className="fas fa-bars"></i> */}
        <IoMenu />
      </div>

      {/* Sidebar navigation */}
      <nav className={`sidebar-menu ${menuOpen ? "active" : ""}`}>
        <div className="sidebar-header">
          <Image
            alt="Secretary"
            src={logo}
            width={80}
            height={80}
            style={{ borderRadius: "50%", width: "80px", height: "80px" }}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/images/avatar-fallback.png";
            }}
            priority
          />
          <div className="user-info">
            <h6>Welcome</h6>
            <h5>{login}</h5>
            <div className="status-indicator">
              <FaCircle
                style={{
                  color: status === "Active" ? "green" : "gray",
                  marginRight: "5px",
                  fontSize: "12px",
                }}
              />
              <span>{status === "Active" ? "Online" : "Offline"}</span>
            </div>
          </div>
        </div>

        <ul className="sidebar-menu-items">
          <li className="menu-item">
            <Link href="" className="menu-link">
              <MdDashboard className="menu-icon" />
              <span className="menu-text">Appointment</span>
            </Link>
          </li>
          <li className="menu-item">
            <Link href="" className="menu-link">
              <MdFolderShared className="menu-icon" />
              <span className="menu-text">Patient Record</span>
            </Link>
          </li>
          <li className="menu-item">
            <button onClick={handleLogout} className="menu-link logout-button">
              <RiLogoutCircleFill className="menu-icon" />
              <span className="menu-text">Log out</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Main content area */}
      <main className="main-content">
        <div className="page-header">
          <h1>
            Appointment<span> Management | Appointment</span>
          </h1>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading appointments...</p>
          </div>
        ) : (
          <div className="content-card">
            <div className="card-header">
              <h2>
                Appointment <b>list</b>
              </h2>
            </div>

            {listAppointment && listAppointment.length > 0 ? (
              <div className="table-responsive">
                <table className="appointment-table">
                  <thead>
                    <tr>
                      <th>LastName</th>
                      <th>FirstName</th>
                      <th className="hide-sm">Email</th>
                      <th>Telephone</th>
                      <th>Date</th>
                      <th className="hide-sm">Time</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listAppointment.map((item) => (
                      <tr key={item._id}>
                        <td data-label="LastName">{item.patient.lastName}</td>
                        <td data-label="FirstName">{item.patient.firstName}</td>
                        <td data-label="Email" className="hide-sm">
                          {item.patient.email}
                        </td>
                        <td data-label="Telephone">{item.patient.telephone}</td>
                        <td data-label="Date">
                          {moment(item.dateTime).format("MMM DD")}
                        </td>
                        <td data-label="Time" className="hide-sm">
                          {moment(item.dateTime).format("HH:mm")}
                        </td>
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
                              style={{
                                marginLeft: "10px",
                                fontSize: "14px",
                                color: "orange",
                              }}
                            >
                              Pending
                            </span>
                          </>
                        ) : item.status === "Confirmed" ? (
                          <>
                            <span
                              style={{
                                fontSize: "18px",
                                marginRight: "8px",
                                color: "green",
                              }}
                            >
                              ✔️
                            </span>
                            <span style={{ fontSize: "14px", color: "green" }}>
                              Confirmed
                            </span>
                          </>
                        ) : item.status === "Unconfirmed" ? (
                          <>
                            <span
                              style={{
                                fontSize: "18px",
                                marginRight: "8px",
                                color: "red",
                              }}
                            >
                              ❌
                            </span>
                            <span style={{ fontSize: "14px", color: "red" }}>
                              Unconfirmed
                            </span>
                          </>
                        ) : (
                          item.status
                        )}
                      </td>
                        <td data-label="Action" className="action-buttons">
                          <button
                            onClick={() =>
                              handleAction(item._id, "/alert_appointment")
                            }
                            className="btn-action alert"
                            title="Alert"
                          >
                            <FaBell />
                          </button>
                          <button
                            onClick={() =>
                              handleAction(item._id, "/confirm_appointment")
                            }
                            className="btn-action confirm"
                            title="Confirm"
                          >
                            <FaCheckCircle />
                          </button>
                          <button
                            onClick={() => deleteAppointment(item._id)}
                            className="btn-action delete"
                            title="Delete"
                          >
                            <FaTrashAlt />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-data">
                <i className="fas fa-calendar-times"></i>
                <p>No appointments found</p>
              </div>
            )}
          </div>
        )}
      </main>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default withAuth(SecretaryDashboard, { role: ROLES.SECRETARY });
