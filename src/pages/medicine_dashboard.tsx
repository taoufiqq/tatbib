import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../public/images/doctor.png";
import withAuth from "@/components/withPrivateRoute";
import { MdDashboard } from "react-icons/md";
import { FaNotesMedical, FaUserEdit, FaUserPlus } from "react-icons/fa";
import { RiLogoutCircleFill } from "react-icons/ri";

interface MedecinData {
  _id: string;
  fullName: string;
  email: string;
  speciality: string;
  city: string;
  availablity: string;
  login: string;
}

const DashboardMedcine = () => {
  const router = useRouter();
  const [medecinData, setMedecinData] = useState<MedecinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedecinData = async () => {
      try {
        // First check if we're on client-side
        if (typeof window === "undefined") return;

        // Safely get doctor ID
        const doctorId = localStorage.getItem("id_medcine");
        console.log("hhhhhhhhhhhhhhhh", doctorId);
        // Validate ID before making API call
        if (!doctorId) {
          setError("Doctor ID not found");
          toast.error("Doctor ID not found");
          router.push("/login_medicine");
          return;
        }

        // Make API request
        const response = await axios.get<MedecinData>(
          `https://tatbib-api.onrender.com/medcine/getMedcineById/${doctorId}`
        );

        setMedecinData(response.data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load doctor data";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMedecinData();
  }, [router]);

  const handleEditAccount = (id: string) => {
    localStorage.setItem("id_medcine", id);
    router.push("/availability_medicine");
  };

  const logOut = () => {
    if (typeof window !== "undefined") {
      // Remove only medicine-related items from localStorage
      const medicineItems = [
        "tokenMedicine",
        "LoginMedicine",
        "id_medcine",
        "role",
        "login_medcine",
        // Add any other medicine-specific items here
      ];

      medicineItems.forEach((item) => localStorage.removeItem(item));
    }

    router.push("/login_medicine");
    toast.success("Logged out successfully", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true, // Enabled for better UX
      pauseOnHover: true, // Enabled for better UX
      draggable: true, // Enabled for better UX
      progress: undefined,
      theme: "colored",
    });
  };

  if (typeof window === "undefined") {
    return null; // Skip rendering during SSR
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div
          style={{
            border: "4px solid rgba(0, 0, 0, 0.1)",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            borderLeftColor: "#09f",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <p>Loading doctor data...</p>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }
  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!medecinData) {
    return <div className="error">No doctor data found</div>;
  }

  const loginMedcine = localStorage.getItem("LoginMedcine") || "";

  return (
    <div className="Container" style={{ overflow: "hidden" }}>
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
          <h5 style={{ color: "white" }}>{loginMedcine}</h5>
        </header>

        <ul>
          <li tabIndex={0} className="icon-customers">
            <MdDashboard />
            <Link href="/list_appointments_medicine" passHref>
              <span style={{ textDecoration: "none", color: "white" }}>
                List Appointments
              </span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-profil">
            <FaUserEdit />
            <Link href="/medicine_dashboard" passHref>
              <span style={{ textDecoration: "none", color: "white" }}>
                My Account
              </span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-users">
            <FaNotesMedical />
            <Link href="/ordonnances_by_medicine" passHref>
              <span style={{ textDecoration: "none", color: "white" }}>
                Ordonnances
              </span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-Secrétaire">
            <FaUserPlus />
            <Link href="/account_secretary" passHref>
              <span style={{ textDecoration: "none", color: "white" }}>
                Secretary
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
          My Account <span> Management | Account</span>
        </div>
        <div className="table-responsive">
          <div className="table-wrapper">
            <div className="table-title">
              <div className="row">
                <div className="col-sm-5">
                  <h2>
                    Account <b>Management</b>
                  </h2>
                </div>
              </div>
            </div>

            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>FullName</th>
                  <th>Email</th>
                  <th>Login</th>
                  <th>Speciality</th>
                  <th>City</th>
                  <th>Availability</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>{medecinData.fullName}</td>
                  <td>{medecinData.email}</td>
                  <td>{medecinData.login}</td>
                  <td>{medecinData.speciality}</td>
                  <td>{medecinData.city}</td>
                  <td
                    style={{
                      color:
                        medecinData.availablity !== "NotAvailable"
                          ? "green"
                          : "red",
                    }}
                  >
                    {medecinData.availablity}
                  </td>
                  <td>
                    <button
                      onClick={() => handleEditAccount(medecinData._id)}
                      className="edit"
                      title="Edit Account"
                    >
                      <i className="material-icons">&#xE254;</i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default withAuth(DashboardMedcine);
