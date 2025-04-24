// import Image from "next/image";
// import { useRouter } from "next/router";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import logo from "../../public/images/doctor.png";
// import withAuth from "@/components/withPrivateRoute";
// import moment from "moment";
// import { Appointment } from "@/types";
// import { MdDashboard } from "react-icons/md";
// import { FaNotesMedical, FaUserEdit, FaUserPlus } from "react-icons/fa";
// import { RiLogoutCircleFill } from "react-icons/ri";
// const ListAppointments = () => {
//   const router = useRouter();

//   const [listAppointment, setListAppointment] = useState<Appointment[] | null>(
//     null
//   );

//   useEffect(() => {
//     const id = localStorage.getItem("id_medcine");
//     axios
//       .get(
//         `https://tatbib-api.onrender.com/appointment/getAppointmentMedcine/${id}`
//       )
//       .then(function (response) {
//         setListAppointment(response.data);
//       })
//       .catch(function (err) {
//         console.log(err);
//       });
//   }, []);
//   if (typeof window !== "undefined") {
//     const getIdAppointment = (id: any) => {
//       localStorage.setItem("idAppointment", id);
//       router.push("/create_ordonnance");
//     };
//     const getIdPatient = (id: any) => {
//       localStorage.setItem("id_patient", id);
//       router.push("/create_ordonnance");
//     };

//     const login = localStorage.getItem("LoginMedcine");
//     const logOut = () => {
//       localStorage.clear();
//       router.push("/login_medicine");
//     };

//     return (
//       <div className="Container">
//         <nav className="menu" tabIndex={0}>
//           <div className="smartphone-menu-trigger" />
//           <header className="avatar">
//             <Image alt="" src={logo} style={{ borderRadius: "50%", width: "150px" }} />
//             <h6>Welcome</h6>
//             <h5 style={{ color: "white" }}>{login}</h5>
//           </header>
//           <ul>
//     <li tabIndex={0} className="icon-customers">    <MdDashboard /><Link href='/list_appointments_medicine' style={{textDecoration:"none",color:"white"}}><span>ListAppointments</span></Link><ToastContainer /></li>

//     <li tabIndex={0} className="icon-profil">   <FaUserEdit /><Link href='/medicine_dashboard' style={{textDecoration:"none",color:"white"}}><span>MyAccount</span></Link><ToastContainer /></li>
//       <li tabIndex={0} className="icon-users"> <FaNotesMedical /><Link href='/ordonnances_by_medicine' style={{textDecoration:"none",color:"white"}}><span>Ordonnances</span></Link></li>
//       <li tabIndex={0} className="icon-Secrétaire"><FaUserPlus/><Link href='/account_secretary' style={{textDecoration:"none",color:"white"}}><span>Secretary</span></Link><ToastContainer /></li>    
//       <li tabIndex={0} className="icon-settings">  <RiLogoutCircleFill /><span onClick={logOut}>Log out</span><ToastContainer /></li>
//     </ul>
//         </nav>
//         <main>
//           <div className="helper">
//             Appointemnt<span> Appointemnts | List</span>
//           </div>
//           {/* <p className="listRDV">Appointemnt list</p> */}
//           <div className="table-responsive">
//             <div className="table-wrapper">
//               <div className="table-title">
//                 <div className="row">
//                   <div className="col-sm-5">
//                     <h2>
//                       Appointemnts <b>list</b>
//                     </h2>
//                   </div>
//                   {/* <div className="col-sm-7">
//           <a href="#" className="btn btn-secondary"><i className="material-icons"></i> <span>Add New User</span></a>
//           <a href="#" className="btn btn-secondary"><i className="material-icons"></i> <span>Export to Excel</span></a>						
//         </div> */}
//                 </div>
//               </div>
//               <table className="table table-striped table-hover">
//                 <thead>
//                   <tr>
//                     <th>LastName</th>
//                     <th>FirstName</th>
//                     <th>email</th>
//                     <th>telephone</th>
//                     <th>Date</th>
//                     <th>Time</th>
//                     <th>status</th>
//                     <th>Ordonnance</th>
//                   </tr>
//                 </thead>
//                 {listAppointment &&
//                   listAppointment.map((item: any, index: any) => (
//                     <tbody key={index}>
//                       <tr>
//                         <td>{item.patient.firstName}</td>
//                         <td>{item.patient.lastName}</td>
//                         <td>{item.patient.email}</td>
//                         <td>{item.patient.telephone}</td>
//                         <td>{moment(item.dateTime).format(`MMMM DD YYYY`)}</td>
//                         <td>{moment(item.dateTime).format(`HH:MM`)}</td>
//                         <td
//                           style={{
//                             color:
//                               item.status !== "Unconfirmed" ? "color" : "red",
//                           }}
//                         >
//                           {item.status}
//                         </td>

//                         <td>
//                           <Link
//                             href=""
//                             onClick={() => {
//                               getIdAppointment(item._id);
//                               getIdPatient(item.patient._id);
//                             }}
//                             className="confirm"
//                             title="Writing a Ordonnance"
//                             data-toggle="tooltip"
//                             style={{
//                               visibility:
//                                 item.status !== "Unconfirmed"
//                                   ? "visible"
//                                   : "hidden",
//                             }}
//                           >
//                             <i className="material-icons border_color">
//                               &#xe22b;
//                             </i>
//                           </Link>
//                         </td>
//                       </tr>
//                     </tbody>
//                   ))}
//               </table>
//             </div>
//           </div>
//         </main>
//       </div>
//     );
//   }
// };

// export default withAuth(ListAppointments);
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
      if (typeof window === 'undefined') return;

      const id = localStorage.getItem("id_medcine");
      if (!id) {
        setError("Doctor ID not found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://tatbib-api.onrender.com/appointment/getAppointmentMedcine/${id}`
        );
        
        // Add error handling for empty or invalid response
        if (!response.data) {
          throw new Error("No data received from server");
        }
        
        setListAppointment(response.data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointments");
        toast.error("Failed to load appointments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCreateOrdonnance = (appointmentId: string, patientId: string) => {
    if (!appointmentId || !patientId) {
      toast.error("Missing appointment or patient information");
      return;
    }
    
    localStorage.setItem("idAppointment", appointmentId);
    localStorage.setItem("id_patient", patientId);
    router.push("/create_ordonnance");
  };

  const logOut = () => {
    localStorage.clear();
    router.push("/login_medicine");
    toast.success("Logged out successfully");
  };

  // Safe rendering guard for SSR
  if (typeof window === 'undefined') {
    return null;
  }

  const login = localStorage.getItem("LoginMedcine");

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
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
          <h5 style={{ color: "white" }}>{login}</h5>
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
                    if (!item.patient) {
                      return (
                        <tr key={index}>
                          <td colSpan={8} className="text-center">Invalid patient data</td>
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
                              title="Writing a Ordonnance"
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
              <div className="no-appointments">
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