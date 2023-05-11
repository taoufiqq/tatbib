import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import logo from "../../public/images/logo.png";
import login from "../../public/images/login.svg";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/types";

export default function SignUpMedcine() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [speciality, setSpeciality] = useState("");

  //---------add admin-------------

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const medicine = {
      fullName: e.target.fullName.value,
      email: e.target.email.value,
      password: e.target.password.value,
      login: e.target.login.value,
      city: e.target.city.value,
      speciality: e.target.speciality.value,
    };
    console.log(medicine);

    axios
      .post(`https://tatbib-api.onrender.com/medcine/authentication`, medicine)
      .then((res) => {
        if (!res.data.message) {
          router.push("/login_medicine");
          toast.success("authenticated SuccessFully", {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "colored",
          });
          console.log("res.data");
        } else {
          toast.warn("authenticated Failed!!!!!", {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "colored",
          });
          console.log("res.data");
          console.log("res.data");
        }
      });
  };
  return (
    <section className="header-page">
      <div className="container">
        <div className="row justify-content-between py-3 align-items-center">
          <div className="col-12 col-sm-3 col-lg-4 d-flex justify-content-center justify-content-lg-start py-2 py-lg-0">
            <Link href="/">
              <Image alt="" src={logo} width="100" />
            </Link>
          </div>
          <div className="col-12 col-sm-9 col-lg-6 col-xl-4">
            <div className="row justify-content-center">
              <div className="col-6 col-md-4 col-lg-5 col-xl-6 d-flex justify-content-end">
                <Link
                  className="btn_Espace_Professionnels"
                  href="/professional_space"
                >
                  <i className="fas fa-user-injured"></i> Professional Spaces
                </Link>
              </div>
              <div className="col-6 col-md-4 col-lg-5 d-flex justify-content-center">
                <Link className="btn_Espace_Patients" href="/patient_space">
                  <i className="fas fa-user-injured"></i> Patient Spaces
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="card EspacePatient">
          <div className="row " style={{ marginTop: "4%" }}>
            <div>
              <form
                className="row"
                method="#"
                action="#"
                onSubmit={handleSubmit}
              >
                <label className="form-label">Sign Up</label>
                <div className="fromloginSignUp">
                  <div className="row ">
                    <div className="col-md-6">
                      <label htmlFor="fullName"></label>
                      <input
                        type="text"
                        placeholder="FullName"
                        className="form-control"
                        name="fullName"
                        id="fullName"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="speciality"></label>
                      <input
                        type="text"
                        placeholder="Speciality"
                        className="form-control"
                        id="speciality"
                        name="speciality"
                        required
                      />
                    </div>
                  </div>
                  <div className="row ">
                    <div className="col-md-6">
                      <label htmlFor="city"></label>
                      <input
                        type="text"
                        placeholder="City"
                        className="form-control"
                        id="city"
                        name="city"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="email"></label>
                      <input
                        type="text"
                        placeholder="Email"
                        className="form-control"
                        id="email"
                        name="email"
                        required
                      />
                    </div>
                  </div>
                  <div className="row ">
                    <div className="col-md-6">
                      <label htmlFor="login"></label>
                      <input
                        type="text"
                        className="form-control"
                        id="login"
                        name="login"
                        placeholder="login"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="password"></label>
                      <input
                        type="password"
                        placeholder="Password"
                        className="form-control "
                        id="password"
                        name="password"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <input
                    type="submit"
                    className="form-control mt-5 btnConnect"
                    id="signup"
                    value="confirm"
                  />
                  <Link
                    href="/login_medicine"
                    style={{ textDecoration: "none" }}
                  >
                    <input
                      type="submit"
                      className="form-control mt-3 btnAuth"
                      value="I already have an account"
                    />
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
