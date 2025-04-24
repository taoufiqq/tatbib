import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../public/images/patient.png";
import { Appointment } from "@/types";
import withAuth from "@/components/withPrivateRoute";
import moment from "moment";
import { MdDashboard } from "react-icons/md";
import { FaNotesMedical, FaUserEdit } from "react-icons/fa";
import { RiLogoutCircleFill } from "react-icons/ri";
import useLocalStorage from '@/hooks/useLocalStorage';

interface Medcine {
  fullName: string;
  speciality: string;
}

interface AppointmentWithMedcine extends Appointment {
  medcine: Medcine;
}

const DashboardPatient = () => {
  const router = useRouter();
  const [listAppointment, setListAppointment] = useState<AppointmentWithMedcine[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [login] = useLocalStorage<string | null>("LoginPatient", null); // Removed setLogin since we're not using it

  useEffect(() => {
    const fetchAppointments = async () => {
      if (typeof window !== 'undefined') {
        const id = localStorage.getItem("id_patient");
        
        if (!id) {
          router.push("/login_patient");
          return;
        }

        try {
          const response = await axios.get(
            `https://tatbib-api.onrender.com/appointment/getAppointmenPatient/${id}`
          );
          setListAppointment(response.data);
        } catch (err) {
          console.error("Error fetching appointments:", err);
          toast.error("Failed to load appointments");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAppointments();
  }, [router]);

  const logOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    router.push("/login_patient");
    toast.success("Logged out successfully", {
      position: "top-left",
      autoClose: 5000,
      theme: "colored",
    });
  };

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  return (
    <div className="Container">
      <nav className="menu" tabIndex={0}>
        <div className="smartphone-menu-trigger" />
        <header className="avatar">
          <Image 
            alt="Patient profile" 
            src={logo} 
            width={150}
            height={150}
            style={{ borderRadius: "50%" }}
          />
          <h6>Welcome</h6>
          <h5 style={{ color: "white" }}>{login}</h5>
        </header>
        <ul>
          <li tabIndex={0} className="icon-customers">
            <MdDashboard />
            <span>Appointment</span>
          </li>
          <li tabIndex={0} className="icon-users">
            <FaNotesMedical />
            <Link href="/ordonnances_by_patient" passHref>
              <span style={{ textDecoration: "none", color: "white" }}>Ordonnances</span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-profil">
            <FaUserEdit />
            <Link href="/account_patient" passHref>
              <span style={{ textDecoration: "none", color: "white" }}>MyAccount</span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-settings">
            <RiLogoutCircleFill />
            <span onClick={logOut} style={{ cursor: "pointer" }}>Log out</span>
          </li>
        </ul>
      </nav>

      <main>
        <div className="helper">
          My Appointment<span> Management | Appointment</span>
        </div>
        
        <div className="table-responsive">
          <div className="table-wrapper">
            <div className="table-title">
              <div className="row">
                <div className="col-sm-5">
                  <h2>Appointment <b>list</b></h2>
                </div>
              </div>
            </div>

            {listAppointment && listAppointment.length > 0 ? (
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>FullName</th>
                    <th>Speciality</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {listAppointment.map((item, index) => (
                    <tr key={index}>
                      <td>{item.medcine?.fullName || "N/A"}</td>
                      <td>{item.medcine?.speciality || "N/A"}</td>
                      <td>{moment(item.dateTime).format("MMMM DD YYYY")}</td>
                      <td>{moment(item.dateTime).format("HH:mm")}</td>
                      <td style={{
                        color: item.status === "Confirmed" ? "green" : 
                              item.status === "Pending" ? "orange" : "red"
                      }}>
                        {item.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-appointments">
                <p>No appointments found</p>
                <Link href="/search_medicine" passHref>
                  <button className="btn btn-primary">
                    Make an appointment
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {listAppointment && listAppointment.length > 0 && (
          <Link href="/search_medicine" passHref>
          <button className="appointment-button">
            <span className="button-content">
              <svg className="button-icon" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              Make Another Appointment
            </span>
          </button>
        </Link>
        )}

        <ToastContainer />
      </main>
    </div>
  );
};
<style jsx>{`
  .appointment-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    margin-top: 2rem;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .appointment-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(59, 130, 246, 0.25);
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  }

  .appointment-button:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .appointment-button::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }

  .appointment-button:hover::after {
    transform: translateX(100%);
  }

  .button-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .button-icon {
    width: 20px;
    height: 20px;
    fill: currentColor;
    transition: transform 0.3s ease;
  }

  .appointment-button:hover .button-icon {
    transform: scale(1.1);
  }
`}</style>
export default withAuth(DashboardPatient);