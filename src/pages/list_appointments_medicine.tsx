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

const ListAppointments = () => {
  const router = useRouter();
  const [listAppointment, setListAppointment] = useState<Appointment[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem("id_medcine");
    axios
      .get(
        `https://tatbib-api.onrender.com/appointment/getAppointmentMedcine/${id}`
      )
      .then(function (response) {
        setListAppointment(response.data);
        setLoading(false);
      })
      .catch(function (err) {
        console.log(err);
        setLoading(false);
        toast.error("Failed to load appointments");
      });
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
      }}>
        <div style={{
          border: '4px solid rgba(0, 0, 0, 0.1)',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          borderLeftColor: '#09f',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>Loading appointments...</p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (typeof window !== "undefined") {
    const getIdAppointment = (id: any) => {
      localStorage.setItem("idAppointment", id);
      router.push("/create_ordonnance");
    };
    const getIdPatient = (id: any) => {
      localStorage.setItem("id_patient", id);
      router.push("/create_ordonnance");
    };

    const login = localStorage.getItem("LoginMedcine");
    const logOut = () => {
      if (typeof window !== "undefined") {
        // Remove only medicine-related items from localStorage
        const medicineItems = [
          "tokenMedicine",
          "LoginMedicine",
          "id_medcine",
        ];

        medicineItems.forEach((item) => localStorage.removeItem(item));
      }

      router.push("/login_medicine");
      toast.success("Logged out successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    };

    return (
      <div className="Container">
        <nav className="menu" tabIndex={0}>
          <div className="smartphone-menu-trigger" />
          <header className="avatar">
            <Image alt="" src={logo} width={150} height={150} style={{ borderRadius: "50%", width: "150px" }} />
            <h6>Welcome</h6>
            <h5 style={{ color: "white" }}>{login}</h5>
          </header>
          <ul>
            <li tabIndex={0} className="icon-customers">
              <MdDashboard />
              <Link href='/list_appointments_medicine' style={{textDecoration:"none",color:"white"}}>
                <span>ListAppointments</span>
              </Link>
              <ToastContainer />
            </li>
            <li tabIndex={0} className="icon-profil">
              <FaUserEdit />
              <Link href='/medicine_dashboard' style={{textDecoration:"none",color:"white"}}>
                <span>MyAccount</span>
              </Link>
              <ToastContainer />
            </li>
            <li tabIndex={0} className="icon-users">
              <FaNotesMedical />
              <Link href='/ordonnances_by_medicine' style={{textDecoration:"none",color:"white"}}>
                <span>Ordonnances</span>
              </Link>
            </li>
            <li tabIndex={0} className="icon-Secrétaire">
              <FaUserPlus/>
              <Link href='/account_secretary' style={{textDecoration:"none",color:"white"}}>
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
            Appointemnt<span> Appointemnts | List</span>
          </div>
          <div className="table-responsive">
            <div className="table-wrapper">
              <div className="table-title">
                <div className="row">
                  <div className="col-sm-5">
                    <h2>
                      Appointemnts <b>list</b>
                    </h2>
                  </div>
                </div>
              </div>
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>LastName</th>
                    <th>FirstName</th>
                    <th>email</th>
                    <th>telephone</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>status</th>
                    <th>Ordonnance</th>
                  </tr>
                </thead>
                {listAppointment && listAppointment.length > 0 ? (
                  listAppointment.map((item: any, index: any) => (
                    <tbody key={index}>
                      <tr>
                        <td>{item.patient.firstName}</td>
                        <td>{item.patient.lastName}</td>
                        <td>{item.patient.email}</td>
                        <td>{item.patient.telephone}</td>
                        <td>{moment(item.dateTime).format(`MMMM DD YYYY`)}</td>
                        <td>{moment(item.dateTime).format(`HH:MM`)}</td>
                        <td style={{
                          color: item.status !== "Unconfirmed" ? "color" : "red",
                        }}>
                          {item.status}
                        </td>
                        <td>
                          <Link
                            href=""
                            onClick={() => {
                              getIdAppointment(item._id);
                              getIdPatient(item.patient._id);
                            }}
                            className="confirm"
                            title="Writing a Ordonnance"
                            data-toggle="tooltip"
                            style={{
                              visibility: item.status !== "Unconfirmed" ? "visible" : "hidden",
                            }}
                          >
                            <i className="material-icons border_color">&#xe22b;</i>
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  ))
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>
                        No appointments found
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
};

export default withAuth(ListAppointments);