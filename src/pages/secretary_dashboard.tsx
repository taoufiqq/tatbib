// import { NextPage } from "next";
// import Image from "next/image";
// import { useRouter } from "next/router";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import logo from "../../public/images/Secretary_avatar.png";
// import withAuth from "@/components/withPrivateRoute";
// import moment from "moment";
// import { MdDashboard, MdFolderShared } from "react-icons/md";
// import { Appointment } from "@/types";
// import { RiLogoutCircleFill } from "react-icons/ri";
// import { ROLES, getRoleTokens } from "@/utils/roles";

// const SecretaryDashboard: NextPage = () => {
//   const router = useRouter();
//   const [listAppointment, setListAppointment] = useState<Appointment[] | null>(null);
//   const [login, setLogin] = useState<string>("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       // Use the utility function to get consistent key names
//       const { loginKey } = getRoleTokens(ROLES.SECRETARY);
//       setLogin(localStorage.getItem(loginKey) || "");
      
//       const doctorLogin = localStorage.getItem("login_medcine");
      
//       if (!doctorLogin) {
//         toast.error("Doctor information missing. Please log in again.");
//         handleLogout();
//         return;
//       }

//       fetchAppointments(doctorLogin);
//     }
//   }, []);

//   const fetchAppointments = (doctorLogin: string) => {
//     setLoading(true);
//     axios
//       .get(
//         `https://tatbib-api.onrender.com/appointment/getAppointmentSecretary/${doctorLogin}`
//       )
//       .then((response) => {
//         setListAppointment(response.data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching appointments:", err);
//         toast.error("Failed to load appointments", {
//           position: "top-right",
//           autoClose: 5000,
//           theme: "colored",
//         });
//         setLoading(false);
//       });
//   };

//   const deleteAppointment = (id: string) => {
//     if (window.confirm("Are you sure you want to delete this appointment?")) {
//       setLoading(true);
//       axios
//         .delete(
//           `https://tatbib-api.onrender.com/secretary/deleteAppointment/${id}`
//         )
//         .then(() => {
//           setListAppointment(
//             (prev) => prev?.filter((app) => app._id !== id) || null
//           );
//           toast.success("Appointment deleted successfully", {
//             position: "top-right",
//             autoClose: 3000,
//             theme: "colored",
//           });
//           setLoading(false);
//         })
//         .catch((err) => {
//           console.error("Error deleting appointment:", err);
//           toast.error("Failed to delete appointment", {
//             position: "top-right",
//             autoClose: 5000,
//             theme: "colored",
//           });
//           setLoading(false);
//         });
//     }
//   };

//   const handleAction = (id: string, path: string) => {
//     localStorage.setItem("idAppointment", id);
//     router.push(path);
//   };

//   const handleLogout = () => {
//     // Use the utility function to get consistent key names
//     const { tokenKey, loginKey, idKey } = getRoleTokens(ROLES.SECRETARY);
    
//     // Clear all related localStorage items
//     [tokenKey, loginKey, "role", idKey, "login_medcine"].forEach(
//       item => localStorage.removeItem(item)
//     );
    
//     router.push("/login_secretary");
//   };

//   return (
//     <div className="Container">
//       <nav className="menu" tabIndex={0}>
//         <div className="smartphone-menu-trigger" />
//         <header className="avatar">
//           <Image
//             alt="Secretary"
//             src={logo}
//             width={150}
//             height={150}
//             style={{ borderRadius: "50%", width: "150px" }}
//             priority
//           />
//           <h6>Welcome</h6>
//           <h5 style={{ color: "white" }}>{login}</h5>
//         </header>
//         <ul>
//           <li tabIndex={0} className="icon-customers">
//             <MdDashboard />
//             <Link href="" style={{ textDecoration: "none", color: "white" }}>
//               <span>Appointment</span>
//             </Link>
//           </li>
//           <li tabIndex={0} className="icon-folder">
//             <MdFolderShared />
//             <Link href="" style={{ textDecoration: "none", color: "white" }}>
//               <span>Patient Record</span>
//             </Link>
//           </li>
//           <li tabIndex={0} className="icon-settings">
//             <RiLogoutCircleFill />
//             <span onClick={handleLogout}>Log out</span>
//           </li>
//         </ul>
//       </nav>

//       <main>
//         <div className="helper">
//           Appointment<span> Management | Appointment</span>
//         </div>

//         {loading ? (
//           <div className="loading-spinner">Loading appointments...</div>
//         ) : (
//           <div className="table-responsive">
//             <div className="table-wrapper">
//               <div className="table-title">
//                 <div className="row">
//                   <div className="col-sm-5">
//                     <h2>
//                       Appointment <b>list</b>
//                     </h2>
//                   </div>
//                 </div>
//               </div>

//               {listAppointment && listAppointment.length > 0 ? (
//                 <table className="table table-striped table-hover">
//                   <thead>
//                     <tr>
//                       <th>LastName</th>
//                       <th>FirstName</th>
//                       <th>Email</th>
//                       <th>Telephone</th>
//                       <th>Date</th>
//                       <th>Time</th>
//                       <th>Status</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {listAppointment.map((item) => (
//                       <tr key={item._id}>
//                         <td>{item.patient.lastName}</td>
//                         <td>{item.patient.firstName}</td>
//                         <td>{item.patient.email}</td>
//                         <td>{item.patient.telephone}</td>
//                         <td>{moment(item.dateTime).format("MMMM DD YYYY")}</td>
//                         <td>{moment(item.dateTime).format("HH:mm")}</td>
//                         <td
//                           style={{
//                             color:
//                               item.status === "Unconfirmed" ? "red" : "green",
//                           }}
//                         >
//                           {item.status}
//                         </td>
//                         <td>
//                           <button
//                             onClick={() =>
//                               handleAction(item._id, "/alert_appointment")
//                             }
//                             className="btn-action"
//                             title="Alert"
//                             aria-label="Alert"
//                           >
//                             <i className="fas fa-bell" />
//                           </button>
//                           <button
//                             onClick={() =>
//                               handleAction(item._id, "/confirm_appointment")
//                             }
//                             className="btn-action"
//                             title="Confirm"
//                             aria-label="Confirm"
//                           >
//                             <i className="fas fa-check-circle" />
//                           </button>
//                           <button
//                             onClick={() => deleteAppointment(item._id)}
//                             className="btn-action delete"
//                             title="Delete"
//                             aria-label="Delete"
//                           >
//                             <i className="fas fa-trash-alt" />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               ) : (
//                 <div className="no-data">No appointments found</div>
//               )}
//             </div>
//           </div>
//         )}
//       </main>

//       <ToastContainer 
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         closeOnClick
//         pauseOnHover
//         draggable
//       />
//     </div>
//   );
// };

// export default withAuth(SecretaryDashboard, { role: ROLES.SECRETARY });
"use client"

import type { NextPage } from "next"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import logo from "../../public/images/Secretary_avatar.png"
import withAuth from "@/components/withPrivateRoute"
import moment from "moment"
import { MdDashboard, MdFolderShared } from "react-icons/md"
import type { Appointment } from "@/types"
import { RiLogoutCircleFill } from "react-icons/ri"
import { ROLES, getRoleTokens } from "@/utils/roles"

const SecretaryDashboard: NextPage = () => {
  const router = useRouter()
  const [listAppointment, setListAppointment] = useState<Appointment[] | null>(null)
  const [login, setLogin] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication on component mount
    const checkAndLoadData = () => {
      if (typeof window !== "undefined") {
        try {
          // Use the utility function to get consistent key names
          const { loginKey, tokenKey } = getRoleTokens(ROLES.SECRETARY)
          const secretaryLogin = localStorage.getItem(loginKey)
          const token = localStorage.getItem(tokenKey)

          // Verify we have the necessary auth data
          if (!secretaryLogin || !token) {
            console.error("Missing secretary authentication data")
            toast.error("Authentication error. Please log in again.")
            handleLogout()
            return
          }

          setLogin(secretaryLogin)

          const doctorLogin = localStorage.getItem("login_medcine")

          if (!doctorLogin) {
            console.error("Doctor login information missing")
            toast.error("Doctor information missing. Please log in again.")
            handleLogout()
            return
          }

          fetchAppointments(doctorLogin)
        } catch (error) {
          console.error("Error in authentication check:", error)
          toast.error("Authentication error. Please log in again.")
          handleLogout()
        }
      }
    }

    checkAndLoadData()
  }, [])

  const fetchAppointments = (doctorLogin: string) => {
    setLoading(true)

    // Get the token for authorization header
    const { tokenKey } = getRoleTokens(ROLES.SECRETARY)
    const token = localStorage.getItem(tokenKey)

    axios
      .get(`https://tatbib-api.onrender.com/appointment/getAppointmentSecretary/${doctorLogin}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to request if your API requires it
        },
      })
      .then((response) => {
        if (response.data) {
          setListAppointment(response.data)
        } else {
          setListAppointment(null)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching appointments:", err)

        // Handle unauthorized errors specifically
        if (err.response && err.response.status === 401) {
          toast.error("Session expired. Please log in again.", {
            position: "top-right",
            autoClose: 5000,
            theme: "colored",
          })
          handleLogout()
        } else {
          toast.error("Failed to load appointments", {
            position: "top-right",
            autoClose: 5000,
            theme: "colored",
          })
        }

        setLoading(false)
      })
  }

  const deleteAppointment = (id: string) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      setLoading(true)

      // Get the token for authorization header
      const { tokenKey } = getRoleTokens(ROLES.SECRETARY)
      const token = localStorage.getItem(tokenKey)

      axios
        .delete(`https://tatbib-api.onrender.com/secretary/deleteAppointment/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to request if your API requires it
          },
        })
        .then(() => {
          setListAppointment((prev) => prev?.filter((app) => app._id !== id) || null)
          toast.success("Appointment deleted successfully", {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          })
          setLoading(false)
        })
        .catch((err) => {
          console.error("Error deleting appointment:", err)

          // Handle unauthorized errors specifically
          if (err.response && err.response.status === 401) {
            toast.error("Session expired. Please log in again.", {
              position: "top-right",
              autoClose: 5000,
              theme: "colored",
            })
            handleLogout()
          } else {
            toast.error("Failed to delete appointment", {
              position: "top-right",
              autoClose: 5000,
              theme: "colored",
            })
          }

          setLoading(false)
        })
    }
  }

  const handleAction = (id: string, path: string) => {
    localStorage.setItem("idAppointment", id)
    router.push(path)
  }

  const handleLogout = () => {
    try {
      // Use the utility function to get consistent key names
      const { tokenKey, loginKey, idKey } = getRoleTokens(ROLES.SECRETARY)

      // Clear all related localStorage items
      localStorage.removeItem(tokenKey)
      localStorage.removeItem(loginKey)
      localStorage.removeItem("role")
      localStorage.removeItem(idKey)
      localStorage.removeItem("login_medcine")
      localStorage.removeItem("idAppointment") // Also clear any appointment ID

      // Force a complete page reload to clear any in-memory state
      window.location.href = "/login_secretary"
    } catch (error) {
      console.error("Error during logout:", error)
      // If there's an error during logout, force a hard redirect anyway
      window.location.href = "/login_secretary"
    }
  }

  return (
    <div className="Container">
      <nav className="menu" tabIndex={0}>
        <div className="smartphone-menu-trigger" />
        <header className="avatar">
          <Image
            alt="Secretary"
            src={logo || "/placeholder.svg"}
            width={150}
            height={150}
            style={{ borderRadius: "50%", width: "150px" }}
            priority
          />
          <h6>Welcome</h6>
          <h5 style={{ color: "white" }}>{login}</h5>
        </header>
        <ul>
          <li tabIndex={0} className="icon-customers">
            <MdDashboard />
            <Link href="" style={{ textDecoration: "none", color: "white" }}>
              <span>Appointment</span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-folder">
            <MdFolderShared />
            <Link href="" style={{ textDecoration: "none", color: "white" }}>
              <span>Patient Record</span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-settings">
            <RiLogoutCircleFill />
            <span onClick={handleLogout} style={{ cursor: "pointer" }}>
              Log out
            </span>
          </li>
        </ul>
      </nav>

      <main>
        <div className="helper">
          Appointment<span> Management | Appointment</span>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading appointments...</div>
        ) : (
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
                      <th>LastName</th>
                      <th>FirstName</th>
                      <th>Email</th>
                      <th>Telephone</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listAppointment.map((item) => (
                      <tr key={item._id}>
                        <td>{item.patient.lastName}</td>
                        <td>{item.patient.firstName}</td>
                        <td>{item.patient.email}</td>
                        <td>{item.patient.telephone}</td>
                        <td>{moment(item.dateTime).format("MMMM DD YYYY")}</td>
                        <td>{moment(item.dateTime).format("HH:mm")}</td>
                        <td
                          style={{
                            color: item.status === "Unconfirmed" ? "red" : "green",
                          }}
                        >
                          {item.status}
                        </td>
                        <td>
                          <button
                            onClick={() => handleAction(item._id, "/alert_appointment")}
                            className="btn-action"
                            title="Alert"
                            aria-label="Alert"
                          >
                            <i className="fas fa-bell" />
                          </button>
                          <button
                            onClick={() => handleAction(item._id, "/confirm_appointment")}
                            className="btn-action"
                            title="Confirm"
                            aria-label="Confirm"
                          >
                            <i className="fas fa-check-circle" />
                          </button>
                          <button
                            onClick={() => deleteAppointment(item._id)}
                            className="btn-action delete"
                            title="Delete"
                            aria-label="Delete"
                          >
                            <i className="fas fa-trash-alt" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-data">No appointments found</div>
              )}
            </div>
          </div>
        )}
      </main>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  )
}

export default withAuth(SecretaryDashboard, { role: ROLES.SECRETARY })
