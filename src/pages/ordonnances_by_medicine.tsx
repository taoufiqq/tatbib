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
  const [ordonnances, setOrdonnances] = useState<Ordonnance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrdonnances = async () => {
      try {
        // Check if running on client side
        if (typeof window === 'undefined') return;

        const doctorId = localStorage.getItem('id_medcine');
        if (!doctorId) {
          throw new Error('Doctor ID not found in localStorage');
        }

        const response = await axios.get<Ordonnance[]>(
          `https://tatbib-api.onrender.com/medcine/getOrdonnanceByMedcine/${doctorId}`
        );

        // Ensure response.data exists and is an array
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid data format received from API');
        }

        setOrdonnances(response.data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load ordonnances';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Error fetching ordonnances:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdonnances();
  }, []);

  const logOut = () => {
    localStorage.clear();
    router.push('/login_medicine');
    toast.success('Logged out successfully');
  };

  if (typeof window === 'undefined') {
    return null; // Skip rendering during SSR
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading ordonnances...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Try Again
        </button>
      </div>
    );
  }

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
                List Appointments
              </span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-profil">
            <FaUserEdit />
            <Link href="/medicine_dashboard" passHref>
              <span style={{ textDecoration: 'none', color: 'white' }}>
                My Account
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
              Log out
            </span>
          </li>
        </ul>
      </nav>

      <main>
        <div className="helper">
          Ordonnances <span>Management | List</span>
        </div>

        <div className="table-responsive">
          <div className="table-wrapper">
            <div className="table-title">
              <div className="row">
                <div className="col-sm-5">
                  <h2>Ordonnances <b>List</b></h2>
                </div>
              </div>
            </div>

            {ordonnances.length === 0 ? (
              <div className="no-data-message">
                <p>No ordonnances found</p>
              </div>
            ) : (
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Medications</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ordonnances.map((ordonnance) => (
                    <tr key={ordonnance._id}>
                      <td>
                        {ordonnance.patient.firstName} {ordonnance.patient.lastName}
                      </td>
                      <td>
                        {new Date(ordonnance.date).toLocaleDateString()}
                      </td>
                      <td>
                        <ul className="medication-list">
                          {ordonnance.medications.map((medication, index) => (
                            <li key={index}>
                              {medication.name} - {medication.dosage} ({medication.duration})
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td>
                        <button className="action-button view-button">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
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
    </div>
  );
};

export default withAuth(OrdonnancesByMedicine);