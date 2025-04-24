import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
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
    error: null
  });

  useEffect(() => {
    const fetchOrdonnances = async () => {
      try {
        // Client-side check
        if (typeof window === 'undefined') return;

        const doctorId = localStorage.getItem('id_medcine');
        if (!doctorId) {
          throw new Error('Doctor authentication required');
        }

        const response = await axios.get<Ordonnance[]>(
          `https://tatbib-api.onrender.com/medcine/getOrdonnanceByMedcine/${doctorId}`
        );

        // Validate response structure
        if (!response?.data || !Array.isArray(response.data)) {
          throw new Error('Invalid data format received from server');
        }

        setState({
          ordonnances: response.data,
          loading: false,
          error: null
        });

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load ordonnances';
        setState({
          ordonnances: [],
          loading: false,
          error: errorMessage
        });
        toast.error(errorMessage);
        console.error('API Error:', err);
      }
    };

    fetchOrdonnances();
  }, []);

  const logOut = () => {
    localStorage.clear();
    router.push('/login_medicine');
    toast.success('Logged out successfully');
  };

  // Render nothing during SSR
  if (typeof window === 'undefined') {
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
          <button className="create-button">
            Create New Ordonnance
          </button>
        </Link>
      </div>
    );
  }

  // Main render
  return (
    <div className="Container" style={{ overflow: 'hidden' }}>
      <nav className="menu" tabIndex={0}>
        <div className="smartphone-menu-trigger" />
        <header className="avatar">
          <Image 
            alt="Doctor profile" 
            src={doctor} 
            width={150}
            height={150}
            style={{ borderRadius: '50%' }}
            priority
          />
          <h6>Welcome</h6>
          <h5 style={{ color: 'white' }}>
            {localStorage.getItem("LoginMedcine") || "Doctor"}
          </h5>
        </header>

        <ul>
          <li tabIndex={0} className="icon-customers">
            <MdDashboard />
            <Link href="/list_appointments_medicine" passHref>
              <span style={{ textDecoration: 'none', color: 'white' }}>
                Appointments
              </span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-profil">
            <FaUserEdit />
            <Link href="/medicine_dashboard" passHref>
              <span style={{ textDecoration: 'none', color: 'white' }}>
                Profile
              </span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-users">
            <FaNotesMedical />
            <Link href="/ordonnances_by_medicine" passHref>
              <span style={{ textDecoration: 'none', color: 'white' }}>
                Ordonnances
              </span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-Secrétaire">
            <FaUserPlus />
            <Link href="/account_secretary" passHref>
              <span style={{ textDecoration: 'none', color: 'white' }}>
                Secretary
              </span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-settings">
            <RiLogoutCircleFill />
            <span 
              onClick={logOut} 
              style={{ cursor: 'pointer' }}
            >
              Logout
            </span>
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
                    {ordonnance.patient?.firstName || 'Unknown'} {ordonnance.patient?.lastName || ''}
                  </td>
                  <td>
                    {new Date(ordonnance.date).toLocaleDateString()}
                  </td>
                  <td>
                    <ul className="medication-list">
                      {ordonnance.medications?.map((med, idx) => (
                        <li key={idx}>
                          <strong>{med.name}</strong> - {med.dosage} ({med.duration})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <button className="view-button">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
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
        theme="colored"
      />

      <style jsx>{`
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
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
        .table-container {
          margin: 2rem 0;
          overflow-x: auto;
        }
        .ordonnance-table {
          width: 100%;
          border-collapse: collapse;
        }
        .ordonnance-table th,
        .ordonnance-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        .ordonnance-table th {
          background-color: #f8f9fa;
          font-weight: 600;
        }
        .medication-list {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .medication-list li {
          margin-bottom: 8px;
        }
        .view-button {
          padding: 6px 12px;
          background-color: #17a2b8;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default withAuth(OrdonnancesByMedicine);