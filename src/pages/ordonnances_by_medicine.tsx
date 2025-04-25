import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import doctor from "../../public/images/doctor.png";
import logo from "../../public/images/logo.png";
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

  useEffect(() => {
    const fetchOrdonnances = async () => {
      try {
        // Client-side check
        if (typeof window === "undefined") return;

        const doctorId = localStorage.getItem("id_medcine");
        if (!doctorId) {
          throw new Error("Doctor authentication required");
        }

        const response = await axios.get<Ordonnance[]>(
          `https://tatbib-api.onrender.com/medcine/getOrdonnanceByMedcine/${doctorId}`
        );

        // Validate response structure
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
  }, []);

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
        : date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
    } catch {
      return "Invalid date";
    }
  };

  const logOut = () => {
    localStorage.clear();
    router.push("/login_medicine");
    toast.success("Logged out successfully");
  };

  // Render nothing during SSR
  if (typeof window === "undefined") {
    return null;
  }

  // Loading state
  if (state.loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading ordonnances...</p>
      </div>
    );
  }

  // Error state
  if (state.error) {
    return (
      <div className="error-container">
        <p className="error-message">{state.error}</p>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (state.ordonnances.length === 0) {
    return (
      <div className="empty-state">
        <p>No ordonnances found</p>
        <Link href="/create-ordonnance">
          <button className="create-button">Create New Ordonnance</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="Container">
      <nav className="menu noPrint" tabIndex={0}>
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
          <h5 style={{ color: "white" }}>
            {localStorage.getItem("LoginMedcine") || "Doctor"}
          </h5>
        </header>

        <ul>
          <li tabIndex={0} className="icon-customers">
            <MdDashboard />
            <Link href="/list_appointments_medicine" passHref>
              <span style={{ textDecoration: "none", color: "white" }}>
                Appointments
              </span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-profil">
            <FaUserEdit />
            <Link href="/medicine_dashboard" passHref>
              <span style={{ textDecoration: "none", color: "white" }}>
                Profile
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
            <span onClick={logOut} style={{ cursor: "pointer" }}>
              Logout
            </span>
          </li>
        </ul>
      </nav>

      <main>
        <div className="helper noPrint">
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
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Ordonnance Details</h2>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="close-button"
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Patient Information</h3>
                <p>
                  <strong>Name:</strong> {selectedOrdonnance.patient?.firstName}{" "}
                  {selectedOrdonnance.patient?.lastName}
                </p>
              </div>

              <div className="detail-section">
                <h3>Date</h3>
                <p>{formatDate(selectedOrdonnance.date)}</p>
              </div>

              <div className="detail-section">
                <h3>Medications</h3>
                <ul className="medication-details-list">
                  {selectedOrdonnance.medications?.map((med, idx) => (
                    <li key={idx} className="medication-item">
                      <div className="medication-header">
                        <strong>{med.name}</strong>
                      </div>
                      <div>
                        <strong>Dosage:</strong> {med.dosage}
                      </div>
                      <div>
                        <strong>Duration:</strong> {med.duration}
                      </div>
                      {med.instructions && (
                        <div>
                          <strong>Instructions:</strong> {med.instructions}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="close-modal-button"
              >
                Close
              </button>
            </div>
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

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }

        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border-left-color: #09f;
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

        .error-container {
          padding: 2rem;
          text-align: center;
        }

        .error-message {
          color: #dc3545;
          margin-bottom: 1rem;
        }

        .retry-button {
          padding: 0.5rem 1rem;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .empty-state {
          text-align: center;
          padding: 2rem;
        }

        .create-button {
          padding: 0.75rem 1.5rem;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          margin-top: 1rem;
          cursor: pointer;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #eee;
        }

        .modal-header h2 {
          margin: 0;
          color: #2b6cb0;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }

        .modal-body {
          padding: 20px;
        }

        .detail-section {
          margin-bottom: 20px;
        }

        .detail-section h3 {
          color: #4a5568;
          margin-bottom: 10px;
          border-bottom: 1px solid #eee;
          padding-bottom: 5px;
        }

        .medication-details-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .medication-item {
          background: #f8fafc;
          padding: 15px;
          margin-bottom: 10px;
          border-radius: 4px;
          border-left: 4px solid #4299e1;
        }

        .medication-header {
          margin-bottom: 10px;
        }

        .modal-footer {
          padding: 15px 20px;
          border-top: 1px solid #eee;
          text-align: right;
        }

        .close-modal-button {
          background: #4299e1;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
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
