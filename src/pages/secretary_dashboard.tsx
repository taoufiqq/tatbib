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
import { FaCircle, FaBell, FaCheckCircle, FaTrashAlt } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";

const SecretaryDashboard: NextPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const [listAppointment, setListAppointment] = useState<Appointment[] | null>(
    null
  );
  const [status, setStatus] = useState<string>("Inactive");
  const [login, setLogin] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth <= 500) {
        setItemsPerPage(1);
      } else {
        setItemsPerPage(5);
      }
    };

    updateItemsPerPage(); // Initial check
    window.addEventListener("resize", updateItemsPerPage);

    return () => {
      window.removeEventListener("resize", updateItemsPerPage);
    };
  }, []);
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url.includes("/dashboard_secretary")) {
        // Check if returning to dashboard
        const doctorLogin = localStorage.getItem("login_medcine");
        if (doctorLogin) {
          fetchAppointments(doctorLogin);
        }
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);
  // Fetch data and authentication check
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
    const checkAndLoadData = () => {
      if (typeof window !== "undefined") {
        try {
          const { loginKey, tokenKey } = getRoleTokens(ROLES.SECRETARY);
          const secretaryLogin = localStorage.getItem(loginKey);
          const token = localStorage.getItem(tokenKey);

          if (!secretaryLogin || !token) {
            toast.error("Authentication error. Please log in again.");
            handleLogout();
            return;
          }
          setStatus("Active");
          setLogin(secretaryLogin);

          const doctorLogin = localStorage.getItem("login_medcine");

          if (!doctorLogin) {
            toast.error("Doctor information missing. Please log in again.");
            handleLogout();
            return;
          }
          fetchAppointments(doctorLogin);
        } catch (error) {
          toast.error("Authentication error. Please log in again.");
          handleLogout();
        }
      }
    };
    checkAndLoadData();
  }, []);

  const fetchAppointments = (doctorLogin: string) => {
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
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        setListAppointment(response.data || null);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          handleLogout();
        } else {
          toast.error("Failed to load appointments");
        }
        setLoading(false);
      });
  };

  const deleteAppointment = (id: string) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      const { tokenKey } = getRoleTokens(ROLES.SECRETARY);
      const token = localStorage.getItem(tokenKey);
      setLoading(true);

      axios
        .delete(
          `https://tatbib-api.onrender.com/secretary/deleteAppointment/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(() => {
          setListAppointment(
            (prev) => prev?.filter((app) => app._id !== id) || null
          );
          toast.success("Appointment deleted successfully");
          setLoading(false);
        })
        .catch((err) => {
          if (err.response?.status === 401) {
            toast.error("Session expired. Please log in again.");
            handleLogout();
          } else {
            toast.error("Failed to delete appointment");
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
    const { tokenKey, loginKey, idKey } = getRoleTokens(ROLES.SECRETARY);
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(loginKey);
    localStorage.removeItem(idKey);
    localStorage.removeItem("role");
    localStorage.removeItem("login_medcine");
    localStorage.removeItem("idAppointment");
    window.location.href = "/login_secretary";
  };
  const filteredAppointments = listAppointment?.filter((item) => {
    const search = searchQuery.toLowerCase();
    return (
      item.patient?.firstName?.toLowerCase().includes(search) ||
      item.patient?.lastName?.toLowerCase().includes(search) ||
      item.patient?.email?.toLowerCase().includes(search) ||
      item.patient?.telephone?.includes(search) ||
      moment(item.dateTime)
        .format("MMMM DD YYYY")
        .toLowerCase()
        .includes(search) ||
      moment(item.dateTime).format("HH:mm").includes(search) ||
      item.status.toLowerCase().includes(search)
    );
  });
  // Pagination calculation
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems =
  //   listAppointment?.slice(indexOfFirstItem, indexOfLastItem) || [];
  // const totalPages = listAppointment
  //   ? Math.ceil(listAppointment.length / itemsPerPage)
  //   : 1;
  const paginatedAppointments = filteredAppointments?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = filteredAppointments
    ? Math.ceil(filteredAppointments.length / itemsPerPage)
    : 0;
  return (
    <div className="dashboard-container">
      {/* Sidebar and Navigation */}
      <div
        className="mobile-menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <IoMenu />
      </div>

      <nav className={`sidebar-menu ${menuOpen ? "active" : ""}`}>
        <div className="sidebar-header">
          <Image
            alt="Secretary"
            src={logo}
            width={80}
            height={80}
            style={{ borderRadius: "50%" }}
            priority
          />
          <div className="user-info">
            <h6>Welcome</h6>
            <h5>{login}</h5>
            <div className="status-indicator">
              <FaCircle
                style={{
                  color: status === "Active" ? "green" : "gray",
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

      {/* Main Content */}
      <main className="main-content">
        <div className="page-header">
          <h1>
            Appointment<span> Management | Appointment</span>
          </h1>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search appointments..."
            style={{
              padding: "10px 16px",
              width: "80%",
              maxWidth: 500,
              borderRadius: "25px",
              border: "1px solid rgb(248, 249, 250)",
              outline: "none",
              boxShadow: "rgb(41, 56, 70) 0px 2px 6px",
              transition: "all 0.3s ease",
              marginTop: "1%",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#0070f3")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#ccc")}
          />
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

            {paginatedAppointments?.length ? (
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
                    {paginatedAppointments.map((item) => (
                      <tr key={item._id}>
                        <td>{item.patient.lastName}</td>
                        <td>{item.patient.firstName}</td>
                        <td className="hide-sm">{item.patient.email}</td>
                        <td>{item.patient.telephone}</td>
                        <td>{moment(item.dateTime).format("MMMM DD YYYY")}</td>
                        <td className="hide-sm">
                          {moment(item.dateTime).format("HH:mm")}
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {item.status === "Pending" ? (
                            <>
                              <div className="spinner"></div>
                              <span
                                style={{
                                  marginLeft: "10px",
                                  fontSize: "14px",
                                  color: "orange",
                                  fontWeight: "bold",
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
                                  fontWeight: "bold",
                                }}
                              >
                                ✔️
                              </span>
                              <span
                                style={{
                                  fontSize: "14px",
                                  color: "green",
                                  fontWeight: "bold",
                                }}
                              >
                                Confirmed
                              </span>
                            </>
                          ) : item.status === "Cancelled" ? (
                            <>
                              <span
                                style={{
                                  fontSize: "18px",
                                  marginRight: "8px",
                                  color: "black",
                                  fontWeight: "bold",
                                }}
                              >
                                🚫
                              </span>
                              <span
                                style={{
                                  fontSize: "14px",
                                  color: "black",
                                  fontWeight: "bold",
                                }}
                              >
                                Cancelled
                              </span>
                            </>
                          ) : item.status === "Completed" ? (
                            <>
                              <span
                                style={{
                                  fontSize: "18px",
                                  marginRight: "8px",
                                  color: "green",
                                  fontWeight: "bold",
                                }}
                              >
                                ✅
                              </span>
                              <span
                                style={{
                                  fontSize: "14px",
                                  color: "green",
                                  fontWeight: "bold",
                                }}
                              >
                                Completed
                              </span>
                            </>
                          ) : (
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
                              <span
                                style={{
                                  fontSize: "14px",
                                  color: "red",
                                  fontWeight: "bold",
                                }}
                              >
                                Unconfirmed
                              </span>
                            </>
                          )}
                        </td>

                        <td className="action-buttons">
                          {(item.status === "Confirmed" ||
                            item.status === "Completed") && (
                            <button
                              onClick={() =>
                                handleAction(item._id, "/alert_appointment")
                              }
                              title="Alert"
                              className="btn-action alert"
                            >
                              <FaBell />
                            </button>
                          )}
                          <button
                            onClick={() =>
                              handleAction(item._id, "/confirm_appointment")
                            }
                            title="Confirm"
                            className="btn-action confirm"
                          >
                            <FaCheckCircle />
                          </button>
                          <button
                            onClick={() => deleteAppointment(item._id)}
                            title="Delete"
                            className="btn-action delete"
                          >
                            <FaTrashAlt />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="pagination">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      className={`page-button ${
                        currentPage === i + 1 ? "active" : ""
                      }`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="no-data">
                <p>No appointments found</p>
              </div>
            )}
          </div>
        )}

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
            border-left-color: #ffa500;
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
        `}</style>
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
