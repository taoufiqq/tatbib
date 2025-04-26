import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../public/images/logo.png";
import Imglogin from "../../public/images/login.svg";
import { normalizeRole } from "@/utils/roles";

export default function LoginPatient() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `https://tatbib-api.onrender.com/patient/login`,
        { login, password }
      );

      if (response.data.message) {
        throw new Error(response.data.message);
      }

      const { verified, token, role, id } = response.data;

      if (verified === false) {
        toast.info(
          "Please verify your account first by clicking the link in your email",
          {
            position: "top-right",
            autoClose: 5000,
            theme: "colored",
          }
        );
        return;
      }

      // Normalize and store auth data
      const normalizedRole = normalizeRole(role);
      localStorage.setItem("tokenPatient", token);
      localStorage.setItem("LoginPatient", login);
      localStorage.setItem("role", normalizedRole); // Using consistent 'role' key
      localStorage.setItem("id_patient", id);

      console.log("Patient login successful", {
        role: normalizedRole,
        storedRole: localStorage.getItem("role"),
      });

      router.push("/patient_dashboard");
      toast.success("Authenticated successfully", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="header-page">
      <div className="container">
        <div className="row justify-content-between py-3 align-items-center">
          <div className="col-12 col-sm-3 col-lg-4 d-flex justify-content-center justify-content-lg-start py-2 py-lg-0">
            <Link href="/">
              <Image alt="Logo" src={logo} width="100" priority />
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
              className="col-12 col-md-12 col-lg-6"
              style={{ marginTop: "2%" }}
            >
              <form className="row" onSubmit={handleSubmit}>
                <label className="form-label">Login</label>
                <div className="fromlogin">
                  <input
                    type="text"
                    placeholder="Login"
                    className="form-control"
                    required
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    disabled={isLoading}
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    className="form-control"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />

                  <button
                    type="submit"
                    className="form-control mt-5 btnConnect"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      "Log in"
                    )}
                  </button>

                  <Link
                    href="/sign_up_patient"
                    style={{ textDecoration: "none" }}
                  >
                    <button
                      type="button"
                      className="form-control mt-3 btnAuth"
                      disabled={isLoading}
                    >
                      Create an account
                    </button>
                  </Link>
                </div>
              </form>
            </div>
            <div className="col-12 col-md-12 col-lg-6">
              <Image
                alt="Login illustration"
                src={Imglogin}
                className="imgLogin"
                priority
              />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
}
