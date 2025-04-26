import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../public/images/logo.png";
import Imglogin from "../../public/images/login3.svg";
import { normalizeRole } from "@/utils/roles";

export default function LoginMedcine() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Attempting login...");
      const response = await axios.post(
        `https://tatbib-api.onrender.com/medcine/login`,
        { login, password }
      );

      console.log("API Response:", response.data);

      if (response.data.message) {
        throw new Error(response.data.message);
      }

      const { verified, token, role, id, medcine } = response.data;
      const normalizedRole = normalizeRole(role);

      console.log("Normalized Role:", normalizedRole);
      console.log("Expected Role:", "medicine");

      if (normalizedRole !== "medicine") {
        throw new Error(`Invalid role ${normalizedRole} for doctor login`);
      }

      if (verified === false) {
        toast.warn("Please verify your account first via email");
        return;
      }

      // Store all auth data atomically
      localStorage.setItem("tokenMedicine", token);
      localStorage.setItem("LoginMedicine", login);
      localStorage.setItem("role", normalizedRole);
      localStorage.setItem("id_medcine", id);
      localStorage.setItem("medcine", JSON.stringify(medcine));

      // Verify storage immediately
      console.log("Stored Auth Data:", {
        token: localStorage.getItem("tokenMedicine"),
        role: localStorage.getItem("role"),
        login: localStorage.getItem("LoginMedicine"),
        id: localStorage.getItem("id_medcine")
      });

      // Force reload to ensure auth state is picked up
      window.location.href = "/list_appointments_medicine";

    } catch (error: any) {
      console.error("Login Error:", error);
      toast.error(error.message || "Login failed. Please try again.");
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
            <div className="col-12 col-md-12 col-lg-6" style={{ marginTop: "4%" }}>
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
                    {isLoading ? "Logging in..." : "Log in"}
                  </button>

                  <Link href="/sign_up_medicine" style={{ textDecoration: "none" }}>
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
                alt="Login Illustration"
                src={Imglogin}
                style={{ width: "70%", marginLeft: "60px" }}
                className="imgLogin"
                priority
              />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </section>
  );
}