"use client";

import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
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
  const [listAppointment, setListAppointment] = useState<Appointment[] | null>(null);
  const [status, setStatus] = useState<string>("Inactive");
  const [login, setLogin] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  // Declare handleLogout function first
  const handleLogout = useCallback(() => {
    const { tokenKey, loginKey, idKey } = getRoleTokens(ROLES.SECRETARY);
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(loginKey);
    localStorage.removeItem(idKey);
    localStorage.removeItem("role");
    localStorage.removeItem("login_medcine");
    localStorage.removeItem("idAppointment");
    window.location.href = "/login_secretary";
  }, []);

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

  const fetchAppointments = useCallback((doctorLogin: string) => {
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
  }, [handleLogout]);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url.includes("/dashboard_secretary")) {
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
  }, [fetchAppointments, router.events]);

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

  const { loginKey, tokenKey } = getRoleTokens(ROLES.SECRETARY);
  useEffect(() => {
    const checkAndLoadData = () => {
      if (typeof window !== "undefined") {
        try {
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
  }, [loginKey, tokenKey, fetchAppointments, handleLogout]);

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
          <p>Loading appointments...</p>
        ) : (
          <>
            <ul className="appointment-list">
              {paginatedAppointments?.map((appointment) => (
                <li key={appointment._id} className="appointment-item">
                  <div className="appointment-details">
                    <h3>{`${appointment.patient?.firstName} ${appointment.patient?.lastName}`}</h3>
                    <p>{appointment.patient?.email}</p>
                    <p>{appointment.patient?.telephone}</p>
                    <p>
                      {moment(appointment.dateTime).format("MMMM DD YYYY HH:mm")}
                    </p>
                    <p>Status: {appointment.status}</p>
                  </div>
                  <div className="appointment-actions">
                    <button
                      className="action-button"
                      onClick={() => handleAction(appointment._id, "/appointment_details")}
                    >
                      <FaBell /> Notify
                    </button>
                    <button
                      className="action-button"
                      onClick={() => deleteAppointment(appointment._id)}
                    >
                      <FaTrashAlt /> Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="pagination">
              {currentPage > 1 && (
                <button onClick={() => setCurrentPage(currentPage - 1)}>
                  Prev
                </button>
              )}
              {currentPage < totalPages && (
                <button onClick={() => setCurrentPage(currentPage + 1)}>
                  Next
                </button>
              )}
            </div>
          </>
        )}
      </main>
      <ToastContainer />
    </div>
  );
};

export default withAuth(SecretaryDashboard);
