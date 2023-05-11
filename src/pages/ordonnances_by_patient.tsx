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
  const router = useRouter();

  const [listOrdonnance, setListOrdonnance] = useState<Ordonnance[] | null>(
    null
  );

  useEffect(() => {
    const id = localStorage.getItem("id_patient");
    axios
      .get(
        `https://tatbib-api.onrender.com/medcine/getOrdonnanceByPatient/${id}`
      )
      .then(function (response) {
        setListOrdonnance(response.data);
      })
      .catch(function (err) {
        console.log(err);
      });
  }, []);

  if (typeof window !== "undefined") {
    const login = localStorage.getItem("LoginPatient") || "{}";

    const logOut = () => {
      localStorage.clear();
      router.push("/login_patient");
      toast.success("Log out SuccessFully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "colored",
      });
    };

    return (
      <div className="Container">
        <nav className="menu noPrint" tabIndex={0}>
          <div className="smartphone-menu-trigger" />
          <header className="avatar">
            <Image alt="" src={user} style={{ borderRadius: "50%", width: "150px" }} />
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
          {/* <p className="listRDV">Appointemnt list</p> */}
          <div className="table-responsive">
            <div className="table-wrapper">
              <div className="table-title noPrint">
                <div className="row">
                  <div className="col-sm-5">
                    <h2>
                      Ordonnances <b>list</b>
                    </h2>
                  </div>
                  {/* <div className="col-sm-7">
          <a href="#" className="btn btn-secondary"><i className="material-icons"></i> <span>Add New User</span></a>
          <a href="#" className="btn btn-secondary"><i className="material-icons"></i> <span>Export to Excel</span></a>						
        </div> */}
                </div>
              </div>
              {listOrdonnance &&
                listOrdonnance.map((item: any, index: any) => (
                  <div
                    className="blog-slider mt-5 "
                    style={{ height: "500px" }}
                    key={index}
                  >
                    <div className="blog-slider__wrp swiper-wrapper ">
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
                          {/* <div className="blog-slider__code"><span style={{color:'red'}}>date: </span> {item.dateTime}</div> */}

                          <div className="blog-slider__code">
                            <span style={{ color: "red" }}>medicamment: </span>
                            <textarea
                              style={{
                                height: "100px",
                                width: "450px",
                                border: "none",
                              }}
                            >
                              {item.medicamment}
                            </textarea>
                          </div>
                          <Link href="" className="blog-slider__button noPrint">
                            print
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* <div className="blog-slider__pagination"></div> */}
                  </div>
                ))}
            </div>
          </div>
        </main>
      </div>
    );
  }
};

export default withAuth(ListOrdonnances);
