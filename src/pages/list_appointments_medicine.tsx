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
// import { normalizeRole, ROLES, getRoleTokens } from "@/utils/roles";

// const ListAppointments = () => {
//   const router = useRouter();
//   const [listAppointment, setListAppointment] = useState<Appointment[] | null>(
//     null
//   );
//   const [loading, setLoading] = useState(true);

//   // Get the correct storage keys
//   const { tokenKey, loginKey, idKey } = getRoleTokens(ROLES.MEDICINE);

//   useEffect(() => {
//     console.log("Authentication Status Check:", {
//       token: localStorage.getItem(tokenKey),
//       role: localStorage.getItem("role"),
//       normalizedRole: normalizeRole(localStorage.getItem("role") || ""),
//       login: localStorage.getItem(loginKey),
//     });

//     fetchAppointments();
//   }, []);

//   const fetchAppointments = async () => {
//     try {
//       const id = localStorage.getItem(idKey);
//       console.log("Fetching appointments for medicine ID:", id);

//       if (!id) {
//         throw new Error("No medicine ID found in localStorage");
//       }

//       const token = localStorage.getItem(tokenKey);
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       // Note: You might need to update your API endpoint to use "medicine" instead of "medcine"
//       const response = await axios.get(
//         `https://tatbib-api.onrender.com/appointment/getAppointmentMedcine/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           params: {
//             populate: "patient", // Ensure patient data is fully populated
//           },
//         }
//       );
//       console.log("Appointments data:", response.data);
//       setListAppointment(response.data);
//     } catch (err: unknown) {
//       console.error("Error fetching appointments:", err);

//       // Type guard to check if it's an Axios error
//       if (axios.isAxiosError(err)) {
//         if (err.response?.status === 401) {
//           toast.error("Session expired. Please login again.");
//           handleLogout();
//         } else {
//           toast.error("Failed to load appointments");
//         }
//       } else {
//         toast.error("An unexpected error occurred");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateOrdonnance = (appointmentId: string, patientId: string) => {
//     if (!patientId) {
//       toast.error("Cannot create prescription - missing patient ID");
//       return;
//     }
//     localStorage.setItem("idAppointment", appointmentId);
//     localStorage.setItem("id_patient", patientId);
//     router.push("/create_ordonnance");
//   };

//   const handleLogout = () => {
//     // Clear all medicine-related localStorage items using the correct keys
//     const medicineStorageItems = [tokenKey, loginKey, idKey, "role", "medcine"];

//     medicineStorageItems.forEach((item) => localStorage.removeItem(item));

//     router.push("/login_medicine");
//     toast.success("Logged out successfully");
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="loading-spinner">
//           <div className="spinner"></div>
//           <p>Loading appointments...</p>
//         </div>
//         <style jsx>{`
//           .loading-container {
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             height: 100vh;
//           }
//           .loading-spinner {
//             text-align: center;
//           }
//           .spinner {
//             border: 4px solid rgba(0, 0, 0, 0.1);
//             width: 36px;
//             height: 36px;
//             border-radius: 50%;
//             border-left-color: #09f;
//             animation: spin 1s linear infinite;
//             margin: 0 auto 16px;
//           }
//           @keyframes spin {
//             0% {
//               transform: rotate(0deg);
//             }
//             100% {
//               transform: rotate(360deg);
//             }
//           }
//         `}</style>
//       </div>
//     );
//   }

//   const currentUser = localStorage.getItem(loginKey);

//   return (
//     <div className="doctor-dashboard">
//       <nav className="sidebar">
//         <div className="sidebar-header">
//           <Image
//             src={logo}
//             alt="Doctor Profile"
//             width={150}
//             height={150}
//             className="profile-image"
//           />
//           <h6>Welcome</h6>
//           <h5>{currentUser}</h5>
//         </div>

//         <ul className="sidebar-menu">
//           <li>
//             <MdDashboard />
//             <Link href="/list_appointments_medicine">
//               <span>Appointments</span>
//             </Link>
//           </li>
//           <li>
//             <FaUserEdit />
//             <Link href="/medicine_dashboard">
//               <span>My Account</span>
//             </Link>
//           </li>
//           <li>
//             <FaNotesMedical />
//             <Link href="/ordonnances_by_medicine">
//               <span>Prescriptions</span>
//             </Link>
//           </li>
//           <li>
//             <FaUserPlus />
//             <Link href="/account_secretary">
//               <span>Secretary</span>
//             </Link>
//           </li>
//           <li onClick={handleLogout}>
//             <RiLogoutCircleFill />
//             <span>Log Out</span>
//           </li>
//         </ul>
//       </nav>

//       <main className="content">
//         <div className="page-header">
//           <h1>Appointments List</h1>
//         </div>

//         <div className="table-container">
//           <table className="appointments-table">
//             <thead>
//               <tr>
//                 <th>Last Name</th>
//                 <th>First Name</th>
//                 <th>Email</th>
//                 <th>Phone</th>
//                 <th>Date</th>
//                 <th>Time</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {listAppointment && listAppointment.length > 0 ? (
//                 listAppointment.map((appointment) => (
//                   <tr key={appointment._id}>
//                     <td>{appointment.patient?.lastName || "N/A"}</td>
//                     <td>{appointment.patient?.firstName || "N/A"}</td>
//                     <td>{appointment.patient?.email || "N/A"}</td>
//                     <td>{appointment.patient?.telephone || "N/A"}</td>
//                     <td>
//                       {moment(appointment.dateTime).format("MMMM DD YYYY")}
//                     </td>
//                     <td>{moment(appointment.dateTime).format("HH:mm")}</td>
//                     <td
//                       className={`status-${appointment.status.toLowerCase()}`}
//                     >
//                       {appointment.status}
//                     </td>
//                     <td>
//                       {appointment.status !== "Unconfirmed" && (
//                         <button
//                           onClick={() => {
//                             if (appointment.patient?._id) {
//                               handleCreateOrdonnance(
//                                 appointment._id,
//                                 appointment.patient._id
//                               );
//                             } else {
//                               toast.error("Patient ID is missing");
//                             }
//                           }}
//                           className="ordonnance-btn"
//                           title="Create Prescription"
//                         >
//                           <i className="material-icons">edit_document</i>
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={8} className="no-appointments">
//                     No appointments found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </main>

//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />

//       <style jsx>{`
//         .doctor-dashboard {
//           display: flex;
//           min-height: 100vh;
//           background-color: #f5f5f5;
//         }

//         .sidebar {
//           width: 250px;
//           background: #2c3e50;
//           color: white;
//           padding: 20px 0;
//         }

//         .sidebar-header {
//           text-align: center;
//           padding: 20px;
//         }

//         .profile-image {
//           border-radius: 50%;
//           object-fit: cover;
//           border: 3px solid #3498db;
//         }

//         .sidebar-menu {
//           list-style: none;
//           padding: 0;
//         }

//         .sidebar-menu li {
//           padding: 15px 20px;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           transition: background 0.3s;
//         }

//         .sidebar-menu li:hover {
//           background: #34495e;
//         }

//         .content {
//           flex: 1;
//           padding: 30px;
//         }

//         .page-header {
//           margin-bottom: 30px;
//         }

//         .table-container {
//           background: white;
//           border-radius: 8px;
//           box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//           overflow: hidden;
//         }

//         .appointments-table {
//           width: 100%;
//           border-collapse: collapse;
//         }

//         .appointments-table th,
//         .appointments-table td {
//           padding: 12px 15px;
//           text-align: left;
//           border-bottom: 1px solid #eee;
//         }

//         .appointments-table th {
//           background: #f8f9fa;
//           font-weight: 600;
//         }

//         .status-confirmed {
//           color: #28a745;
//         }

//         .status-unconfirmed {
//           color: #dc3545;
//         }

//         .ordonnance-btn {
//           background: none;
//           border: none;
//           color: #17a2b8;
//           cursor: pointer;
//           font-size: 1.2rem;
//         }

//         .no-appointments {
//           text-align: center;
//           padding: 20px;
//           color: #6c757d;
//         }
//       `}</style>
//     </div>
//   );
// };

// // At the bottom of list_appointments_medicine.tsx
// export default withAuth(ListAppointments, { role: ROLES.MEDICINE });
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
import { ROLES, getRoleTokens } from "@/utils/roles";

// Define a type for appointment status to ensure consistency
type AppointmentStatus =
  | "Pending"
  | "Confirmed"
  | "Cancelled"
  | "Completed"
  | "Unconfirmed";

const ListAppointments = () => {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { tokenKey, loginKey, idKey } = getRoleTokens(ROLES.MEDICINE);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const doctorId = localStorage.getItem(idKey);
        const token = localStorage.getItem(tokenKey);

        if (!doctorId || !token) {
          throw new Error("Authentication data missing");
        }

        const response = await axios.get<Appointment[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/appointment/getAppointmentMedicine/${doctorId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { populate: "patient" },
          }
        );

        setAppointments(response.data);
      } catch (error) {
        console.error("Fetch error:", error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            handleLogout();
            toast.error("Session expired. Please login again.");
          } else {
            toast.error(
              error.response?.data?.message || "Failed to load appointments"
            );
          }
        } else {
          toast.error("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCreatePrescription = (appointment: Appointment) => {
    if (!appointment.patient?._id) {
      toast.error("Patient information incomplete");
      return;
    }

    localStorage.setItem(
      "currentAppointment",
      JSON.stringify({
        id: appointment._id,
        patientId: appointment.patient._id,
        patientName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
      })
    );

    router.push("/create_ordonnance");
  };

  const handleLogout = () => {
    [tokenKey, loginKey, idKey, "role"].forEach((key) => {
      localStorage.removeItem(key);
    });
    router.push("/login_medicine");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <nav className="w-64 bg-gray-800 text-white p-4">
        <div className="text-center mb-8">
          <Image
            src={logo}
            alt="Doctor Profile"
            width={120}
            height={120}
            className="rounded-full border-4 border-blue-400 mx-auto"
            priority
          />
          <h6 className="mt-2 text-sm">Welcome</h6>
          <h5 className="font-medium">{localStorage.getItem(loginKey)}</h5>
        </div>

        <ul className="space-y-2">
          <NavItem icon={<MdDashboard />} href="/list_appointments_medicine">
            Appointments
          </NavItem>
          <NavItem icon={<FaUserEdit />} href="/medicine_dashboard">
            My Account
          </NavItem>
          <NavItem icon={<FaNotesMedical />} href="/ordonnances_by_medicine">
            Prescriptions
          </NavItem>
          <NavItem icon={<FaUserPlus />} href="/account_secretary">
            Secretary
          </NavItem>
          <li
            className="flex items-center p-3 hover:bg-gray-700 rounded cursor-pointer"
            onClick={handleLogout}
          >
            <RiLogoutCircleFill className="mr-3" />
            <span>Log Out</span>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Appointments List</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {appointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <TableHeader>Patient</TableHeader>
                    <TableHeader>Contact</TableHeader>
                    <TableHeader>Date</TableHeader>
                    <TableHeader>Time</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">
                          {appointment.patient?.firstName}{" "}
                          {appointment.patient?.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>{appointment.patient?.email}</div>
                        <div className="text-gray-500">
                          {appointment.patient?.telephone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {moment(appointment.dateTime).format("MMM D, YYYY")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {moment(appointment.dateTime).format("h:mm A")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge
                          status={appointment.status as AppointmentStatus}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {!["Unconfirmed", "Cancelled"].includes(
                          appointment.status
                        ) && (
                          <button
                            onClick={() =>
                              handleCreatePrescription(appointment)
                            }
                            className="text-blue-600 hover:text-blue-900"
                            title="Create Prescription"
                          >
                            <FaNotesMedical className="inline-block" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No appointments found
            </div>
          )}
        </div>
      </main>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

// Helper Components
const NavItem = ({
  icon,
  href,
  children,
}: {
  icon: React.ReactNode;
  href: string;
  children: React.ReactNode;
}) => (
  <li>
    <Link
      href={href}
      className="flex items-center p-3 hover:bg-gray-700 rounded"
    >
      <span className="mr-3">{icon}</span>
      <span>{children}</span>
    </Link>
  </li>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <th
    scope="col"
    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
  >
    {children}
  </th>
);

const StatusBadge = ({ status }: { status: AppointmentStatus }) => {
  const statusColors = {
    Confirmed: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Unconfirmed: "bg-yellow-100 text-yellow-800",
    Cancelled: "bg-red-100 text-red-800",
    Completed: "bg-blue-100 text-blue-800",
  };

  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[status]}`}
    >
      {status}
    </span>
  );
};

export default withAuth(ListAppointments, { role: ROLES.MEDICINE });
