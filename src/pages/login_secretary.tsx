import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../public/images/logo.png";
import Imglogin from "../../public/images/Login2.svg";
import { normalizeRole, ROLES, getRoleTokens } from "@/utils/roles";

export default function LoginSecretary() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Attempting secretary login...");
      const response = await axios.post(
        `https://tatbib-api.onrender.com/secretary/login`,
        { login, password }
      );

      console.log("API Response:", response.data);

      if (response.data.message) {
        throw new Error(response.data.message);
      }

      const { status, tokenSecretary, roleSecretary, id, loginMedcine } = response.data;
      console.log("Raw response role:", roleSecretary);

      // Make sure we have a role string to normalize (add fallback)
      const roleToNormalize = roleSecretary || "secretary"; // Default to secretary if missing
      const normalizedRole = normalizeRole(roleToNormalize);
      console.log("After normalization:", normalizedRole);
      console.log("Expected role:", ROLES.SECRETARY);
      if (normalizedRole && normalizedRole !== ROLES.SECRETARY) {
        throw new Error(`Invalid role ${normalizedRole} for secretary login`);
      }

      // Handle account status
      if (status === "InActive") {
        toast.warn("Your account is not active yet. Please wait for activation.", {
          position: "top-right",
          autoClose: 5000,
          theme: "colored",
        });
        setIsLoading(false);
        return;
      }

      if (status === "Block") {
        toast.error("This account is blocked.", {
          position: "top-right",
          autoClose: 5000,
          theme: "colored",
        });
        setIsLoading(false);
        return;
      }

      // Get the correct storage keys from our utility function
      const { tokenKey, loginKey, idKey } = getRoleTokens(ROLES.SECRETARY);

      // Store all auth data using the keys from our utility function
      localStorage.setItem(tokenKey, tokenSecretary);
      localStorage.setItem(loginKey, login);
      localStorage.setItem("role", normalizedRole); // Store normalized role
      localStorage.setItem(idKey, id || ""); // Make sure id is stored even if undefined
      localStorage.setItem("login_medcine", loginMedcine || ""); // Store associated doctor

      // Verify storage immediately for debugging
      console.log("Stored Auth Data:", {
        token: localStorage.getItem(tokenKey),
        role: localStorage.getItem("role"),
        login: localStorage.getItem(loginKey),
        id: localStorage.getItem(idKey),
        loginMedcine: localStorage.getItem("login_medcine")
      });

      toast.success("Authenticated successfully", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });

      // Force redirect to secretary dashboard
      router.push("/secretary_dashboard");

    } catch (error: unknown) {
      console.error("Login Error:", error);
      let errorMessage = "Login failed. Please try again.";
      
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

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
            <div className="col-12 col-md-12 col-lg-6" style={{ marginTop: "4%" }}>
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
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Logging in...
                      </>
                    ) : (
                      "Log in"
                    )}
                  </button>
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
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </section>
  );
}