import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
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
  const [listAppointment, setListAppointment] = useState<Appointment[] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { tokenKey, loginKey, idKey } = getRoleTokens(ROLES.MEDICINE);

  const fetchAppointments = useCallback(async () => {
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
  }, [idKey, tokenKey]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCreateOrdonnance = (appointmentId: string, patientId: string) => {
    if (!patientId) return toast.error("Missing patient ID");
    localStorage.setItem("idAppointment", appointmentId);
    localStorage.setItem("id_patient", patientId);
    router.push("/create_ordonnance");
  };

  const handleLogout = () => {
    [tokenKey, loginKey, idKey, "role", "medcine"].forEach((item) =>
      localStorage.removeItem(item)
    );
    router.push("/login_medicine");
    toast.success("Logged out successfully");
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
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = filteredAppointments
    ? Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE)
    : 0;

  const loginMedcine = localStorage.getItem(loginKey) || "";

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div className="spinner" style={{ width: 36, height: 36 }}></div>
        <p>Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="Container">
      <nav className="menu" tabIndex={0}>
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
              border: "1px solid rgb(44 165 184)",
              outline: "none",
              boxShadow: "rgb(41 155 228) 0px 2px 6px",
              transition: "all 0.3s ease",
              marginTop: "1%",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#0070f3")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#ccc")}
          />
        </div>

        <div className="table-responsive">
          <div className="table-wrapper">
            <div className="table-title">
              <h2>
                Appointments <b>Management</b>
              </h2>
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
                  paginatedAppointments.map((item) => (
                    <tr key={item._id}>
                      <td>{item.patient?.lastName || "N/A"}</td>
                      <td>{item.patient?.firstName || "N/A"}</td>
                      <td>{item.patient?.email || "N/A"}</td>
                      <td>{item.patient?.telephone || "N/A"}</td>
                      <td>{moment(item.dateTime).format("MMMM DD YYYY")}</td>
                      <td>{moment(item.dateTime).format("HH:mm")}</td>
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

                      <td>
                        {!["Cancelled", "Unconfirmed", "Pending"].includes(
                          item.status
                        ) && (
                          <button
                            onClick={() =>
                              item.patient?._id
                                ? handleCreateOrdonnance(
                                    item._id,
                                    item.patient._id
                                  )
                                : toast.error("Patient ID is missing")
                            }
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
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`page-button ${
                      currentPage === page ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={5000} />
      </main>

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
          background: #299be4;
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
