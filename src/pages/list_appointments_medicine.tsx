import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
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

interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
}

interface AppointmentWithPatient extends Appointment {
  patient: Patient;
}

const ListAppointments = () => {
  const router = useRouter();
  const [listAppointment, setListAppointment] = useState<AppointmentWithPatient[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      // Skip if server-side rendering
      if (typeof window === 'undefined') return;

      try {
        // Get doctor ID from localStorage
        const id = localStorage.getItem("id_medcine");
        
        // Validate doctor ID
        if (!id) {
          console.error("Doctor ID not found in localStorage");
          setError("Doctor ID not found. Please login again.");
          setLoading(false);
          toast.error("Authentication error. Please login again.");
          setTimeout(() => {
            router.push("/login_medicine");
          }, 3000);
          return;
        }

        console.log("Fetching appointments for doctor:", id);
        
        // Make API request
        const response = await axios.get(
          `https://tatbib-api.onrender.com/appointment/getAppointmentMedcine/${id}`,
          {
            headers: {
              "Cache-Control": "no-cache",
              "Pragma": "no-cache"
            }
          }
        );
        
        // Validate response data
        if (!response.data) {
          throw new Error("No data received from server");
        }
        
        console.log("Appointments data:", response.data);
        setListAppointment(response.data);
      } catch (err: any) {
        console.error("Error fetching appointments:", err);
        
        // Handle specific error scenarios
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          setError("Your session has expired. Please login again.");
          localStorage.clear();
          setTimeout(() => {
            router.push("/login_medicine");
          }, 3000);
        } else {
          setError(`Failed to load appointments: ${err.message || "Unknown error"}`);
          toast.error("Failed to load appointments. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [router]);

  const handleCreateOrdonnance = (appointmentId: string, patientId: string) => {
    // Validate required IDs
    if (!appointmentId) {
      toast.error("Missing appointment information");
      return;
    }
    
    if (!patientId) {
      toast.error("Missing patient information");
      return;
    }
    
    // Store IDs and navigate
    try {
      localStorage.setItem("idAppointment", appointmentId);
      localStorage.setItem("id_patient", patientId);
      router.push("/create_ordonnance");
    } catch (err) {
      console.error("Error storing appointment data:", err);
      toast.error("Failed to process request. Please try again.");
    }
  };

  const logOut = () => {
    try {
      localStorage.clear();
      toast.success("Logged out successfully");
      router.push("/login_medicine");
    } catch (err) {
      console.error("Error during logout:", err);
      toast.error("Logout failed. Please try again.");
    }
  };

  // Safe rendering guard for SSR
  if (typeof window === 'undefined') {
    return null;
  }

  const login = localStorage.getItem("LoginMedcine");

  if (loading) {
    return (
      <div className="loading-container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="loading">Loading appointments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="error alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="Container">
      <nav className="menu" tabIndex={0}>
        <div className="smartphone-menu-trigger" />
        <header className="avatar">
          <Image 
            alt="Doctor profile" 
            src={logo} 
            width={150}
            height={150}
            style={{ borderRadius: "50%" }}
          />
          <h6>Welcome</h6>
          <h5 style={{ color: "white" }}>{login || "Doctor"}</h5>
        </header>
        <ul>
          <li tabIndex={0} className="icon-customers">
            <MdDashboard />
            <Link href='/list_appointments_medicine' passHref>
              <span style={{textDecoration:"none",color:"white"}}>ListAppointments</span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-profil">
            <FaUserEdit />
            <Link href='/medicine_dashboard' passHref>
              <span style={{textDecoration:"none",color:"white"}}>MyAccount</span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-users">
            <FaNotesMedical />
            <Link href='/ordonnances_by_medicine' passHref>
              <span style={{textDecoration:"none",color:"white"}}>Ordonnances</span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-Secrétaire">
            <FaUserPlus/>
            <Link href='/account_secretary' passHref>
              <span style={{textDecoration:"none",color:"white"}}>Secretary</span>
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
          Appointment<span> Appointments | List</span>
        </div>
        
        <div className="table-responsive">
          <div className="table-wrapper">
            <div className="table-title">
              <div className="row">
                <div className="col-sm-5">
                  <h2>Appointments <b>list</b></h2>
                </div>
              </div>
            </div>

            {listAppointment && listAppointment.length > 0 ? (
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>LastName</th>
                    <th>FirstName</th>
                    <th>Email</th>
                    <th>Telephone</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Ordonnance</th>
                  </tr>
                </thead>
                <tbody>
                  {listAppointment.map((item, index) => {
                    // Guard against missing patient data
                    if (!item.patient || typeof item.patient !== 'object') {
                      return (
                        <tr key={index}>
                          <td colSpan={8} className="text-center text-danger">Invalid patient data</td>
                        </tr>
                      );
                    }
                    
                    return (
                      <tr key={index}>
                        <td>{item.patient.lastName || "N/A"}</td>
                        <td>{item.patient.firstName || "N/A"}</td>
                        <td>{item.patient.email || "N/A"}</td>
                        <td>{item.patient.telephone || "N/A"}</td>
                        <td>{item.dateTime ? moment(item.dateTime).format("MMMM DD YYYY") : "N/A"}</td>
                        <td>{item.dateTime ? moment(item.dateTime).format("HH:mm") : "N/A"}</td>
                        <td style={{
                          color: item.status === "Confirmed" ? "green" :
                                item.status === "Pending" ? "orange" : "red"
                        }}>
                          {item.status || "Unknown"}
                        </td>
                        <td>
                          {item.status !== "Unconfirmed" && (
                            <button
                              onClick={() => handleCreateOrdonnance(item._id, item.patient._id)}
                              className="confirm"
                              title="Writing an Ordonnance"
                              disabled={!item._id || !item.patient._id}
                            >
                              <i className="material-icons border_color">&#xe22b;</i>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="no-appointments text-center py-4">
                <p>No appointments found</p>
              </div>
            )}
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={5000} />
      </main>
    </div>
  );
};

export default withAuth(ListAppointments);