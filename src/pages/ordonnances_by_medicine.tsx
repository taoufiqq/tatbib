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

  useEffect(() => {
    const fetchOrdonnances = async () => {
      try {
        const id = localStorage.getItem('id_medcine');
        if (!id) {
          throw new Error('Doctor ID not found');
        }

        const response = await axios.get<Ordonnance[]>(
          `https://tatbib-api.onrender.com/medcine/getOrdonnanceByMedcine/${id}`
        );
        setOrdonnances(response.data);
      } catch (error) {
        toast.error('Failed to load ordonnances');
        console.error(error);
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="Container">
      {/* Navigation and other JSX remains the same */}
      {/* ... */}
      
      {/* Example usage of Ordonnance type */}
      {ordonnances.map(ordonnance => (
        <div key={ordonnance._id}>
          <p>Patient: {ordonnance.patient.firstName} {ordonnance.patient.lastName}</p>
          {/* Render other ordonnance data */}
        </div>
      ))}

      <ToastContainer />
    </div>
  );
};

export default withAuth(OrdonnancesByMedicine);