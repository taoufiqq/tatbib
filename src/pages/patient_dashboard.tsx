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
import useLocalStorage from "@/hooks/useLocalStorage";

interface Medcine {
  fullName: string;
  speciality: string;
}

interface AppointmentWithMedcine extends Appointment {
  medcine: Medcine;
}

const DashboardPatient = () => {
  const router = useRouter();
  const [listAppointment, setListAppointment] = useState<
    AppointmentWithMedcine[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [login] = useLocalStorage<string | null>("LoginPatient", null); // Removed setLogin since we're not using it

  useEffect(() => {
    const fetchAppointments = async () => {
      if (typeof window !== "undefined") {
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
    if (typeof window !== "undefined") {
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
              <span style={{ textDecoration: "none", color: "white" }}>
                Ordonnances
              </span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-profil">
            <FaUserEdit />
            <Link href="/account_patient" passHref>
              <span style={{ textDecoration: "none", color: "white" }}>
                MyAccount
              </span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-settings">
            <RiLogoutCircleFill />
            <span onClick={logOut} style={{ cursor: "pointer" }}>
              Log out
            </span>
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
                  <h2>
                    Appointment <b>list</b>
                  </h2>
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
                      <td
                        style={{
                          color:
                            item.status === "Confirmed"
                              ? "green"
                              : item.status === "Pending"
                              ? "orange"
                              : "red",
                        }}
                      >
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
            <button
              className="
           relative
           inline-flex
           items-center
           justify-center
           mt-8
           px-6
           py-3
           bg-gradient-to-br
           from-blue-500
           to-blue-600
           text-white
           font-medium
           rounded-lg
           shadow-md
           hover:from-blue-600
           hover:to-blue-700
           hover:shadow-lg
           hover:-translate-y-0.5
           active:translate-y-0
           active:shadow-sm
           transition-all
           duration-300
           ease-in-out
           overflow-hidden
           group
         "
            >
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
                Make Another Appointment
              </span>
              <span
                className="
             absolute
             inset-0
             bg-gradient-to-r
             from-transparent
             via-white/20
             to-transparent
             -translate-x-full
             group-hover:translate-x-full
             transition-transform
             duration-600
             ease-in-out
           "
              ></span>
            </button>
          </Link>
        )}

        <ToastContainer />
      </main>
    </div>
  );
};

export default withAuth(DashboardPatient);
