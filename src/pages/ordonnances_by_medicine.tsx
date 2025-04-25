import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import doctor from "../../public/images/doctor.png";
import withAuth from "@/components/withPrivateRoute";
import { MdDashboard } from "react-icons/md";
import { FaNotesMedical, FaUserEdit, FaUserPlus } from "react-icons/fa";
import { RiLogoutCircleFill } from "react-icons/ri";

interface Medication {
  name: string;
  dosage: string;
  duration: string;
  instructions?: string;
}

interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
}

interface Ordonnance {
  _id: string;
  patient: Patient;
  medications: Medication[];
  date: string;
}

const OrdonnancesByMedicine = () => {
  const router = useRouter();
  const [state, setState] = useState<{
    ordonnances: Ordonnance[];
    loading: boolean;
    error: string | null;
  }>({
    ordonnances: [],
    loading: true,
    error: null,
  });

  const [selectedOrdonnance, setSelectedOrdonnance] =
    useState<Ordonnance | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const fetchOrdonnances = async () => {
      try {
        const doctorId = localStorage.getItem("id_medcine");
        if (!doctorId) {
          throw new Error("Doctor authentication required");
        }

        const response = await axios.get<Ordonnance[]>(
          `https://tatbib-api.onrender.com/medcine/getOrdonnanceByMedcine/${doctorId}`
        );

        if (!response?.data || !Array.isArray(response.data)) {
          throw new Error("Invalid data format received from server");
        }

        setState({
          ordonnances: response.data,
          loading: false,
          error: null,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load ordonnances";
        setState({
          ordonnances: [],
          loading: false,
          error: errorMessage,
        });
        toast.error(errorMessage);
        console.error("API Error:", err);
      }
    };

    fetchOrdonnances();
  }, [isClient]);

  const handleViewDetails = (ordonnanceId: string) => {
    const ordonnance = state.ordonnances.find((o) => o._id === ordonnanceId);
    if (ordonnance) {
      setSelectedOrdonnance(ordonnance);
      setIsDetailsModalOpen(true);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime())
        ? "Invalid date"
        : date.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
    } catch {
      return "Invalid date";
    }
  };

  const logOut = () => {
    if (typeof window !== "undefined") {
      const medicineItems = ["tokenMedicine", "LoginMedicine", "id_medcine"];

      medicineItems.forEach((item) => localStorage.removeItem(item));
    }

    router.push("/login_medicine");
    toast.success("Logged out successfully");
  };

  if (!isClient) {
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
        <div
          style={{
            border: "4px solid rgba(0, 0, 0, 0.1)",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            borderLeftColor: "#09f",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (state.loading) {
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
        <div
          style={{
            border: "4px solid rgba(0, 0, 0, 0.1)",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            borderLeftColor: "#09f",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <p>Loading ordonnances...</p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "#dc3545", marginBottom: "1rem" }}>{state.error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "0.5rem 1rem",
            background: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (state.ordonnances.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p>No ordonnances found</p>
        <Link href="/create-ordonnance">
          <button
            style={{
              padding: "0.75rem 1.5rem",
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              marginTop: "1rem",
              cursor: "pointer",
            }}
          >
            Create New Ordonnance
          </button>
        </Link>
      </div>
    );
  }

  const login = isClient
    ? localStorage.getItem("LoginMedcine") || "Doctor"
    : "Doctor";

  return (
    <div className="Container">
      <nav className="menu" tabIndex={0}>
        <div className="smartphone-menu-trigger" />
        <header className="avatar">
          <Image
            alt="Doctor profile"
            src={doctor}
            width={150}
            height={150}
            style={{ borderRadius: "50%" }}
            priority
          />
          <h6>Welcome</h6>
          <h5 style={{ color: "white" }}>{login}</h5>
        </header>
        <ul>
          <li tabIndex={0} className="icon-customers">
            <MdDashboard />
            <Link
              href="/list_appointments_medicine"
              style={{ textDecoration: "none", color: "white" }}
            >
              <span>ListAppointments</span>
            </Link>
            <ToastContainer />
          </li>
          <li tabIndex={0} className="icon-profil">
            <FaUserEdit />
            <Link
              href="/medicine_dashboard"
              style={{ textDecoration: "none", color: "white" }}
            >
              <span>MyAccount</span>
            </Link>
            <ToastContainer />
          </li>
          <li tabIndex={0} className="icon-users">
            <FaNotesMedical />
            <Link
              href="/ordonnances_by_medicine"
              style={{ textDecoration: "none", color: "white" }}
            >
              <span>Ordonnances</span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-Secrétaire">
            <FaUserPlus />
            <Link
              href="/account_secretary"
              style={{ textDecoration: "none", color: "white" }}
            >
              <span>Secretary</span>
            </Link>
            <ToastContainer />
          </li>
          <li tabIndex={0} className="icon-settings">
            <RiLogoutCircleFill />
            <span onClick={logOut}>Log out</span>
            <ToastContainer />
          </li>
        </ul>
      </nav>

      <main>
        <div className="helper">
          <h1>Ordonnances Management</h1>
          <span>View and manage patient prescriptions</span>
        </div>

        <div className="table-container">
          <table className="ordonnance-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Medications</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.ordonnances.map((ordonnance) => (
                <tr key={ordonnance._id}>
                  <td>
                    {ordonnance.patient?.firstName || "Unknown"}{" "}
                    {ordonnance.patient?.lastName || ""}
                  </td>
                  <td>{formatDate(ordonnance.date)}</td>
                  <td>
                    <ul className="medication-list">
                      {ordonnance.medications?.slice(0, 2).map((med, idx) => (
                        <li key={idx}>
                          <strong>{med.name}</strong> - {med.dosage} (
                          {med.duration})
                        </li>
                      ))}
                      {ordonnance.medications?.length > 2 && (
                        <li>
                          + {ordonnance.medications.length - 2} more medications
                        </li>
                      )}
                    </ul>
                  </td>
                  <td>
                    <button
                      onClick={() => handleViewDetails(ordonnance._id)}
                      className="view-button"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Details Modal */}
      {isDetailsModalOpen && selectedOrdonnance && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "8px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h2 style={{ color: "#2b6cb0", margin: 0 }}>
                Ordonnance Details
              </h2>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#718096",
                }}
              >
                &times;
              </button>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <h3 style={{ color: "#4a5568", marginBottom: "8px" }}>
                Patient:
              </h3>
              <p>
                {selectedOrdonnance.patient?.firstName}{" "}
                {selectedOrdonnance.patient?.lastName}
              </p>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <h3 style={{ color: "#4a5568", marginBottom: "8px" }}>Date:</h3>
              <p>{formatDate(selectedOrdonnance.date)}</p>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <h3 style={{ color: "#4a5568", marginBottom: "8px" }}>
                Medications:
              </h3>
              <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                {selectedOrdonnance.medications?.map((med, idx) => (
                  <li
                    key={idx}
                    style={{
                      padding: "12px",
                      backgroundColor: idx % 2 === 0 ? "#f7fafc" : "white",
                      borderRadius: "4px",
                      marginBottom: "8px",
                    }}
                  >
                    <strong style={{ color: "#2b6cb0" }}>{med.name}</strong>
                    <div>Dosage: {med.dosage}</div>
                    <div>Duration: {med.duration}</div>
                    {med.instructions && (
                      <div>Instructions: {med.instructions}</div>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setIsDetailsModalOpen(false)}
              style={{
                backgroundColor: "#4299e1",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "16px",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

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
        theme="colored"
      />

      <style jsx>{`
        .Container {
          display: flex;
          min-height: 100vh;
        }

        .menu {
          width: 250px;
          background: #2b2b2b;
          position: fixed;
          height: 100%;
          transition: all 0.3s;
          z-index: 100;
        }

        .avatar {
          text-align: center;
          padding: 20px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .avatar h5,
        .avatar h6 {
          margin: 10px 0;
          color: white;
        }

        ul {
          list-style: none;
          padding: 0;
          margin-top: 20px;
        }

        li {
          padding: 15px;
          cursor: pointer;
          transition: background 0.3s;
        }

        li:hover {
          background: #3a3a3a;
        }

        main {
          flex: 1;
          padding: 20px;
          margin-left: 250px;
        }

        .helper {
          margin-bottom: 30px;
        }

        .helper h1 {
          font-size: 24px;
          margin-bottom: 5px;
        }

        .helper span {
          color: #666;
        }

        .table-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .ordonnance-table {
          width: 100%;
          border-collapse: collapse;
        }

        .ordonnance-table th {
          background: #2b6cb0;
          color: white;
          padding: 15px;
          text-align: left;
        }

        .ordonnance-table td {
          padding: 15px;
          border-bottom: 1px solid #eee;
        }

        .ordonnance-table tr:hover {
          background: #f9f9f9;
        }

        .medication-list {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .medication-list li {
          padding: 5px 0;
          margin: 0;
        }

        .view-button {
          background: #4299e1;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.3s;
        }

        .view-button:hover {
          background: #3182ce;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .menu {
            width: 70px;
          }

          .menu .avatar h5,
          .menu li span {
            display: none;
          }

          .menu li {
            text-align: center;
            padding: 15px 5px;
          }

          main {
            margin-left: 70px;
          }
        }
      `}</style>
    </div>
  );
};

export default withAuth(OrdonnancesByMedicine);
