import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import user from "../../public/images/patient.png";
import logo from "../../public/images/logo.png";
import { Ordonnance } from "@/types";
import withAuth from "@/components/withPrivateRoute";
import { MdDashboard } from "react-icons/md";
import { FaNotesMedical, FaUserEdit } from "react-icons/fa";
import { RiLogoutCircleFill } from "react-icons/ri";
import { ROLES } from "@/utils/roles";

const ListOrdonnances: NextPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [listOrdonnance, setListOrdonnance] = useState<Ordonnance[] | null>(
    null
  );
  const [login, setLogin] = useState<string>("");

  // Calculate items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    listOrdonnance?.slice(indexOfFirstItem, indexOfLastItem) || [];

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Print function
  const printOrdonnance = (index: number) => {
    const printElement = document.getElementById(`ordonnance-${index}`);
    if (!printElement) return;

    const printWindow = window.open("", "", "width=800,height=600");
    if (!printWindow) return;

    const styles = `
      <style>
        @media print {
          body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
          .blog-slider { width: 100% !important; height: auto !important; margin: 0 !important; box-shadow: none !important; }
          .blog-slider__content { padding: 20px !important; }
          textarea { border: 1px solid #ddd !important; padding: 8px !important; font-family: Arial, sans-serif !important; white-space: pre-wrap; }
          .noPrint { display: none !important; }
        }
      </style>
    `;

    printWindow.document.write(`
      <html>
        <head><title>Ordonnance</title>${styles}</head>
        <body>
          ${printElement.innerHTML}
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 200);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLogin(localStorage.getItem("LoginPatient") || "Patient");

      const id = localStorage.getItem("id_patient");
      axios
        .get(
          `https://tatbib-api.onrender.com/medcine/getOrdonnanceByPatient/${id}`
        )
        .then((response) => {
          setListOrdonnance(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setError("Failed to load ordonnances");
          setLoading(false);
        });
    }
  }, []);

  const logOut = () => {
    const patientItems = [
      "tokenPatient",
      "LoginPatient",
      "id_patient",
      "id_appointment",
      "rolePatient",
    ];
    patientItems.forEach((item) => localStorage.removeItem(item));
    router.push("/login_patient");
    toast.success("Logged out successfully");
  };

  return (
    <div className="Container">
      <nav className="menu noPrint" tabIndex={0}>
        <div className="smartphone-menu-trigger" />
        <header className="avatar">
          <Image
            alt="Patient"
            src={user}
            width={150}
            height={150}
            style={{ borderRadius: "50%", width: "150px" }}
          />
          <h6>Welcome</h6>
          <h5 style={{ color: "white" }}>{login}</h5>
        </header>
        <ul>
          <li tabIndex={0} className="icon-customers">
            <MdDashboard />
            <Link
              href="/patient_dashboard"
              style={{ textDecoration: "none", color: "white" }}
            >
              <span>Appointment</span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-users">
            <FaNotesMedical />
            <Link href="" style={{ textDecoration: "none", color: "white" }}>
              <span>Ordonnances</span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-profil">
            <FaUserEdit />
            <Link
              href="/account_patient"
              style={{ textDecoration: "none", color: "white" }}
            >
              <span>MyAccount</span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-settings">
            <RiLogoutCircleFill />
            <span onClick={logOut}>Log out</span>
          </li>
        </ul>
      </nav>

      <main>
        <div className="helper noPrint">
          Ordonnances<span> Ordonnances | List</span>
        </div>

        <div className="table-responsive">
          <div className="table-wrapper">
            <div className="table-title noPrint">
              <div className="row">
                <div className="col-sm-5">
                  <h2>
                    Ordonnances <b>list</b>
                  </h2>
                </div>
              </div>
            </div>

            {loading && (
              <div className="text-center py-5">
                <p>Loading ordonnances...</p>
              </div>
            )}

            {error && (
              <div className="alert alert-danger text-center">{error}</div>
            )}

            {!loading &&
              !error &&
              currentItems.map((item: any, index: number) => (
                <div
                  id={`ordonnance-${index}`}
                  className="blog-slider mt-5"
                  key={index}
                >
                  {/* ... your ordonnance card JSX ... */}
                </div>
              ))}

            {/* Pagination */}
            {listOrdonnance && listOrdonnance.length > itemsPerPage && (
              <div className="pagination noPrint">
                {/* ... your pagination JSX ... */}
              </div>
            )}
          </div>
        </div>
      </main>

      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

// In your component
export default withAuth(ListOrdonnances, { role: ROLES.PATIENT });
