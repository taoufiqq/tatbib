import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../public/images/logo.png";
import Imglogin from "../../public/images/login3.svg";

export default function LoginMedcine() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const medcine = { login, password };

    axios
      .post(`https://tatbib-api.onrender.com/medcine/login`, medcine)
      .then((res) => {
        if (!res.data.message) {
          let verifier = res.data.verified;
          let medcine = res.data.medcine;
          
          localStorage.setItem("medcine", JSON.stringify(medcine));

          if (verifier === false) {
            toast.warn("Please verify your account first via email");
          } else {
            if (typeof window !== "undefined") {
              localStorage.setItem("tokenMedicine", res.data.token);
              localStorage.setItem("LoginMedicine", login);
              localStorage.setItem("role", "medicine");
              localStorage.setItem("id_medcine", res.data.id);
            }
            router.push("/list_appointments_medicine");
            toast.success("Authenticated successfully");
          }
        } else {
          toast.error("Login or password invalid");
        }
      })
      .catch((err) => {
        toast.error("Login failed. Please try again.");
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
          <div className="row">
            <div
              className="col-12 col-md-12 col-lg-6 "
              style={{ marginTop: "4%" }}
            >
              <form className="row" onSubmit={handleSubmit}>
                <label className="form-label">Login as a Doctor</label>
                <div className="fromlogin">
                  <input
                    type="text"
                    placeholder="Login"
                    className="form-control"
                    required
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    className="form-control "
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button
                    type="submit"
                    className="form-control mt-5 btnConnect"
                  >
                    log in
                    <ToastContainer />
                  </button>
                  <Link
                    href="/sign_up_medicine"
                    style={{ textDecoration: "none" }}
                  >
                    <input
                      type="submit"
                      className="form-control mt-3 btnAuth"
                      value="Create an account"
                    />
                  </Link>
                </div>
              </form>
            </div>
            <div className="col-12 col-md-12 col-lg-6 ">
              <Image
                alt=""
                src={Imglogin}
                style={{ width: "70%", marginLeft: "60px" }}
                className="imgLogin"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
