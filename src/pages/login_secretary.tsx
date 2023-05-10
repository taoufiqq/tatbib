import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../public/images/logo.png";
import Imglogin from "../../public/images/Login2.svg";

// import LoginMedcine from '../Médecin/LoginMedcine';

export default function LoginSecretary() {
  const router = useRouter();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const Secretary = { login, password };

    axios
      .post(`https://tatbib-api.onrender.com/secretary/login`, Secretary)
      .then((res) => {
        console.log(res);
        if (!res.data.message) {
          let status = res.data.status;
          if (typeof window !== "undefined") {
            localStorage.setItem("status", status);
          }
          if (status === "InActive") {
            toast.info(
              "You cant use this Account now, Please wait for it to be activated!!!",
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
              }
            );
            console.log(
              "You can't use this Account now, Please wait for it to be activated!!!"
            );
          } else if (status === "Block") {
            console.log("This Account is Blocked!!!");

            toast.error("This Account is Blocked!!!", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
              theme: "colored",
            });
          } else {
            let tokenSecretary = res.data.tokenSecretary;
            let roleSecretary = res.data.roleSecretary;
            let loginMedcine = res.data.loginMedcine;
            console.log(loginMedcine);
            if (typeof window !== "undefined") {
              localStorage.setItem("tokenSecretary", tokenSecretary);
              localStorage.setItem("LoginSecretary", login);
              localStorage.setItem("roleSecretary", roleSecretary);
              localStorage.setItem("login_medcine", loginMedcine);
            }
            router.push("/secretary_dashboard");

            toast.success("authenticated SuccessFully", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
              theme: "colored",
            });
          }
        } else {
          toast.warn("Login Or password invalid !!!! Please try again !", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "colored",
          });
          console.log("Username Or password invalid !!!! Please try again !");
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
          <div className="row">
            <div
              className="col-12 col-md-12 col-lg-6 "
              style={{ marginTop: "5%" }}
            >
              <form className="row" onSubmit={handleSubmit}>
                <label className="form-label">Login as a Secretary</label>
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
