// import Image from "next/image";
// import { useRouter } from "next/router";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import axios from "axios";
// // import { format } from 'date-fns'
// import logo from "../../public/images/patient.png";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Appointment } from '@/types';
// import withAuth from "@/components/withPrivateRoute";
// import { MdDashboard } from "react-icons/md";
// import { FaNotesMedical, FaUserEdit } from "react-icons/fa";
// import { RiLogoutCircleFill } from "react-icons/ri";

// // if (typeof window !== 'undefined') {
// //   const loginPatient =localStorage.getItem('LoginPatient')
// // }
// const AccountPatient = () => {
//   const router = useRouter();
//   //   const [medcine, setMedcine] = useState();

//   const [firstName, setFirstName] = useState();
//   const [lastName, setLastName] = useState();
//   const [login, setLogin] = useState();
//   const [age, setAge] = useState();
//   const [telephone, setTelephone] = useState();
//   const [email, setEmail] = useState();

//   useEffect(() => {
//     const id = localStorage.getItem("id_patient");
//     axios
//       .get(`https://tatbib-api.onrender.com/patient/getPatientById/${id}`)
//       .then(function (response) {
//         setFirstName(response.data.firstName);
//         setLastName(response.data.lastName);
//         setLogin(response.data.login);
//         setAge(response.data.age);
//         setTelephone(response.data.telephone);
//         setEmail(response.data.email);
//         console.log(response.data);
//       })
//       .catch(function (err) {
//         console.log(err);
//       });
//   }, []);

//   if (typeof window !== "undefined") {
//     const id = localStorage.getItem("id_patient");
//     const loginPatient = localStorage.getItem("LoginPatient");

//     const getIdPatient = (id: any) => {
//       localStorage.setItem("id_patient", id);
//       router.push("/update_my_account");
//     };

//     // delete My Account
//     const deleteAccount = (id: any) => {
//       var msgConfirmation = window.confirm(
//         "Are You Sure Yo want to delete this Account ?"
//       );
//       if (msgConfirmation) {
//         axios
//           .delete(`https://tatbib-api.onrender.com/patient/deletePatient/${id}`)
//           .then(function (response) {
//             window.location.reload();
//             console.log("item was deleted Succesfully ... ");
//             toast("Account deleted SuccessFully", {
//               hideProgressBar: true,
//               autoClose: 2000,
//               type: "success",
//               position: "top-right",
//             });
//           });
//       }
//     };

//     //-----------------------log out-----------------
//     const logOut = () => {
//       localStorage.clear();
//       router.push("/login_patient");
//       toast.success("Log out SuccessFully", {
//         position: "top-left",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: false,
//         pauseOnHover: false,
//         draggable: false,
//         progress: undefined,
//         theme: "colored",
//       });
//     };

//     return (
//       <div className="Container" style={{ overflow: "hidden" }}>
//         <nav className="menu" tabIndex={0}>
//           <div className="smartphone-menu-trigger" />
//           <header className="avatar">
//             <Image
//               alt=""
//               src={logo}
//               style={{ borderRadius: "50%", width: "150px" }}
//             />
//             <h6>Welcome</h6>
//             <h5 style={{ color: "white" }}>{loginPatient}</h5>
//           </header>
//           <ul>
//             <li tabIndex={0} className="icon-customers">
//               <MdDashboard />
//               <Link
//                 href="/patient_dashboard"
//                 style={{ textDecoration: "none", color: "white" }}
//               >
//                 <span>Appointment</span>
//               </Link>
//             </li>
//             <li tabIndex={0} className="icon-users">
//               <FaNotesMedical />
//               <Link
//                 href="/ordonnances_by_patient"
//                 style={{ textDecoration: "none", color: "white" }}
//               >
//                 <span>Ordonnances</span>
//               </Link>
//             </li>
//             <li tabIndex={0} className="icon-profil">
//               <FaUserEdit />
//               <Link
//                 href="/account_patient"
//                 style={{ textDecoration: "none", color: "white" }}
//               >
//                 <span>MyAccount</span>
//               </Link>
//             </li>
//             <li tabIndex={0} className="icon-settings">
//               <RiLogoutCircleFill />
//               <span onClick={logOut}>Log out</span>
//               <ToastContainer />
//             </li>
//           </ul>
//         </nav>
//         <main>
//           <div className="helper">
//             My Account<span> Management | Account</span>
//           </div>
//           <div className="table-responsive">
//             <div className="table-wrapper">
//               <div className="table-title">
//                 <div className="row">
//                   <div className="col-sm-5">
//                     <h2>
//                       Account <b>Management</b>
//                     </h2>
//                   </div>
//                 </div>
//               </div>
//               <table className="table table-striped table-hover">
//                 <thead>
//                   <tr>
//                     <th>FirstName</th>
//                     <th>LastName</th>
//                     <th>Login</th>
//                     <th>Age</th>
//                     <th>Telephone</th>
//                     <th>Email</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 {/* { medcine && medcine.map(item =>( */}
//                 <tbody>
//                   <tr>
//                     <td>{firstName}</td>
//                     <td>{lastName}</td>
//                     <td>{login}</td>
//                     <td>{age}</td>
//                     <td>{telephone}</td>
//                     <td>{email}</td>
//                     <td>
//                       <Link
//                         href=""
//                         onClick={() => getIdPatient(id)}
//                         className="edit"
//                         title="Edit Account"
//                         data-toggle="tooltip"
//                       >
//                         <i className="material-icons">&#xE254;</i>
//                         <ToastContainer />
//                       </Link>
//                       <Link
//                         href=""
//                         onClick={() => deleteAccount(id)}
//                         className="delete"
//                         title="Delete Account"
//                         data-toggle="tooltip"
//                       >
//                         <i className="material-icons">&#xE872;</i>
//                         <ToastContainer />
//                       </Link>
//                     </td>
//                   </tr>
//                 </tbody>
//                 {/* ))} */}
//               </table>
//             </div>
//           </div>
//         </main>
//       </div>
//     );
//   }
// };

// export default withAuth(AccountPatient);
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import logo from "../../public/images/patient.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import withAuth from "@/components/withPrivateRoute";
import { MdDashboard } from "react-icons/md";
import { FaNotesMedical, FaUserEdit } from "react-icons/fa";
import { RiLogoutCircleFill } from "react-icons/ri";

interface PatientData {
  firstName: string;
  lastName: string;
  login: string;
  age: number;
  telephone: string;
  email: string;
}

const AccountPatient = () => {
  const router = useRouter();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("id_patient");
      if (id) {
        axios
          .get(`https://tatbib-api.onrender.com/patient/getPatientById/${id}`)
          .then((response) => {
            setPatientData(response.data);
          })
          .catch((err) => {
            console.error(err);
            toast.error("Failed to load patient data");
          })
          .finally(() => setLoading(false));
      }
    }
  }, []);

  const getIdPatient = (id: string) => {
    localStorage.setItem("id_patient", id);
    router.push("/update_my_account");
  };

  const deleteAccount = (id: string) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      axios
        .delete(`https://tatbib-api.onrender.com/patient/deletePatient/${id}`)
        .then(() => {
          localStorage.clear();
          toast.success("Account deleted successfully");
          router.push("/login_patient");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to delete account");
        });
    }
  };

  const logOut = () => {
    if (typeof window !== "undefined") {
      // Remove only patient-related items from localStorage
      const patientItems = [
        "tokenPatient",
        "LoginPatient",
        "id_patient",
        "id_appointment",
        "rolePatient"
        // Add any other patient-specific items here
      ];

      patientItems.forEach((item) => localStorage.removeItem(item));
    }

    router.push("/login_patient");
    toast.success("Logged out successfully", {
      position: "top-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading patient data...</p>
        </div>
        <style jsx>{`
          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .loading-spinner {
            text-align: center;
          }
          .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border-left-color: #09f;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const loginPatient = localStorage.getItem("LoginPatient");

  return (
    <div className="Container" style={{ overflow: "hidden" }}>
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
          <h5 style={{ color: "white" }}>{loginPatient}</h5>
        </header>
        <ul>
          <li tabIndex={0} className="icon-customers">
            <MdDashboard />
            <Link href="/patient_dashboard" passHref>
              <span style={{ textDecoration: "none", color: "white" }}>Appointment</span>
            </Link>
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
          My Account<span> Management | Account</span>
        </div>
        <div className="table-responsive">
          <div className="table-wrapper">
            <div className="table-title">
              <div className="row">
                <div className="col-sm-5">
                  <h2>Account <b>Management</b></h2>
                </div>
              </div>
            </div>
            
            {patientData ? (
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>FirstName</th>
                    <th>LastName</th>
                    <th>Login</th>
                    <th>Age</th>
                    <th>Telephone</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{patientData.firstName}</td>
                    <td>{patientData.lastName}</td>
                    <td>{patientData.login}</td>
                    <td>{patientData.age}</td>
                    <td>{patientData.telephone}</td>
                    <td>{patientData.email}</td>
                    <td>
                      <a
                        href="#"
                        onClick={() => getIdPatient(localStorage.getItem("id_patient")!)}
                        className="edit"
                        title="Edit Account"
                      >
                        <i className="material-icons">&#xE254;</i>
                      </a>
                      <a
                        href="#"
                        onClick={() => deleteAccount(localStorage.getItem("id_patient")!)}
                        className="delete"
                        title="Delete Account"
                      >
                        <i className="material-icons">&#xE872;</i>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div>No patient data available</div>
            )}
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={5000} />
      </main>
    </div>
  );
};

export default withAuth(AccountPatient);