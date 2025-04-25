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

const ListOrdonnances = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(1); // Nombre d'items par page
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [listOrdonnance, setListOrdonnance] = useState<Ordonnance[] | null>(
    null
  );

  // Calcul des éléments à afficher
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    listOrdonnance?.slice(indexOfFirstItem, indexOfLastItem) || [];

  // Changement de page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    const id = localStorage.getItem("id_patient");
    axios
      .get(
        `https://tatbib-api.onrender.com/medcine/getOrdonnanceByPatient/${id}`
      )
      .then(function (response) {
        setListOrdonnance(response.data);
        setLoading(false);
      })
      .catch(function (err) {
        console.log(err);
        setError("Failed to load ordonnances");
        setLoading(false);
      });
  }, []);

  if (typeof window !== "undefined") {
    const login = localStorage.getItem("LoginPatient") || "{}";

    const logOut = () => {
      if (typeof window !== "undefined") {
        // Remove only patient-related items from localStorage
        const patientItems = [
          "tokenPatient",
          "LoginPatient",
          "id_patient",
          "id_appointment",
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

    return (
      <div className="Container">
        <nav className="menu noPrint" tabIndex={0}>
          <div className="smartphone-menu-trigger" />
          <header className="avatar">
            <Image
              alt=""
              src={user}
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
              <ToastContainer />
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
                currentItems.map((item: any, index: any) => (
                  <div
                    className="blog-slider mt-5"
                    style={{ height: "500px" }}
                    key={index}
                  >
                    <div className="blog-slider__wrp swiper-wrapper">
                      <div className="blog-slider__item swiper-slide">
                        <div className="blog-slider__img">
                          <Image src={logo} alt="" />
                        </div>
                        <div className="blog-slider__content">
                          <div className="blog-slider__title">
                            <h4>
                              <span style={{ color: "red" }}>Dr: </span>
                              {item.medcine.fullName}
                            </h4>
                          </div>
                          <div className="blog-slider__code">
                            <h4>{item.medcine.speciality}</h4>
                          </div>
                          <span className="blog-slider__code">
                            <span style={{ color: "red" }}>Mr/Mme: </span>
                            {item.patient.firstName} {item.patient.lastName}
                          </span>
                          <div className="blog-slider__code">
                            <span style={{ color: "red" }}>medicamment: </span>
                            <textarea
                              readOnly
                              style={{
                                height: "100px",
                                width: "100%",
                                border: "none",
                              }}
                              value={item.medicamment}
                            />
                          </div>
                          <Link href="" className="blog-slider__button noPrint">
                            print
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              {/* Pagination */}
              {listOrdonnance && listOrdonnance.length > itemsPerPage && (
                <div
                  className="pagination noPrint"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: "20px 0",
                    gap: "10px",
                  }}
                >
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                      padding: "5px 10px",
                      border: "1px solid #ddd",
                      backgroundColor: "white",
                      cursor: "pointer",
                      borderRadius: "4px",
                    }}
                  >
                    Précédent
                  </button>

                  {Array.from({
                    length: Math.ceil(listOrdonnance.length / itemsPerPage),
                  }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => paginate(index + 1)}
                      style={{
                        padding: "5px 10px",
                        border:
                          currentPage === index + 1
                            ? "2px solid red"
                            : "1px solid #ddd",
                        backgroundColor:
                          currentPage === index + 1 ? "#f8f8f8" : "white",
                        cursor: "pointer",
                        borderRadius: "4px",
                      }}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={
                      currentPage ===
                      Math.ceil(listOrdonnance.length / itemsPerPage)
                    }
                    style={{
                      padding: "5px 10px",
                      border: "1px solid #ddd",
                      backgroundColor: "white",
                      cursor: "pointer",
                      borderRadius: "4px",
                    }}
                  >
                    Suivant
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }
};

export default withAuth(ListOrdonnances);
