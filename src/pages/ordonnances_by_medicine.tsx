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
        // Check if we're on the client side
        if (typeof window === 'undefined') return;

        const id = localStorage.getItem('id_medcine');
        if (!id) {
          throw new Error('Doctor ID not found');
        }

        const response = await axios.get<Ordonnance[]>(
          `https://tatbib-api.onrender.com/medcine/getOrdonnanceByMedcine/${id}`
        );
        
        if (response.data && response.data.length > 0) {
          setOrdonnances(response.data);
        } else {
          setError('No ordonnances found');
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load ordonnances';
        setError(message);
        toast.error(message);
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
    return <div className="loading">Loading ordonnances...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (ordonnances.length === 0) {
    return (
      <div className="no-ordonnances">
        <p>No ordonnances available</p>
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
          />
          <h6>Welcome</h6>
          <h5 style={{ color: 'white' }}>{localStorage.getItem("LoginMedcine") || ""}</h5>
        </header>

        <ul>
          <li tabIndex={0} className="icon-customers">
            <MdDashboard />
            <Link href="/list_appointments_medicine" passHref>
              <span style={{ textDecoration: 'none', color: 'white' }}>List Appointments</span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-profil">
            <FaUserEdit />
            <Link href="/medicine_dashboard" passHref>
              <span style={{ textDecoration: 'none', color: 'white' }}>My Account</span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-users">
            <FaNotesMedical />
            <Link href="/ordonnances_by_medicine" passHref>
              <span style={{ textDecoration: 'none', color: 'white' }}>Ordonnances</span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-Secrétaire">
            <FaUserPlus />
            <Link href="/account_secretary" passHref>
              <span style={{ textDecoration: 'none', color: 'white' }}>Secretary</span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-settings">
            <RiLogoutCircleFill />
            <span onClick={logOut} style={{ cursor: 'pointer' }}>Log out</span>
          </li>
        </ul>
      </nav>

      <main>
        <div className="helper">
          Ordonnances <span> Management | List</span>
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

            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Medications</th>
                </tr>
              </thead>
              <tbody>
                {ordonnances.map(ordonnance => (
                  <tr key={ordonnance._id}>
                    <td>{ordonnance.patient.firstName} {ordonnance.patient.lastName}</td>
                    <td>{new Date(ordonnance.date).toLocaleDateString()}</td>
                    <td>
                      <ul>
                        {ordonnance.medications.map((med, idx) => (
                          <li key={idx}>
                            {med.name} - {med.dosage} ({med.duration})
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default withAuth(OrdonnancesByMedicine);