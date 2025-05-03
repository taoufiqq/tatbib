"use client";

import Image from "next/image";
import { useRouter } from "next/navigation"; // Changed to next/navigation
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../public/images/logo.png";
import Imglogin from "../../public/images/login.svg";
import { normalizeRole, ROLES, getRoleTokens } from "@/utils/roles";
import { safeLocalStorage } from "@/components/withPrivateRoute"; // Import the shared utility

export default function LoginPatient() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Only run client-side code after component mounts
  useEffect(() => {
    setIsClient(true);

    // Check if already logged in as patient
    const checkExistingAuth = () => {
      try {
        const storedRole = safeLocalStorage.getItem("role");
        if (storedRole === ROLES.PATIENT) {
          const { tokenKey } = getRoleTokens(ROLES.PATIENT);
          const token = safeLocalStorage.getItem(tokenKey);

          if (token) {
            console.log("Already logged in as patient, redirecting to dashboard");
            setTimeout(() => {
              window.location.href = "/patient_dashboard";
            }, 100);
          }
        }
      } catch (error) {
        console.error("Error checking existing auth:", error);
      }
    };

    checkExistingAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isClient) {
      toast.error("Application is still initializing. Please try again.");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Attempting patient login...");
      const response = await axios.post(
        `https://tatbib-api.onrender.com/patient/login`,
        { login, password },
        {
          // Add timeout to prevent hanging requests
          timeout: 15000,
        }
      );

      console.log("API Response:", response.data);

      if (response.data.message) {
        throw new Error(response.data.message);
      }

      const { verified, token, role, id } = response.data;
      
      // Make sure we have a role string to normalize (add fallback)
      const roleToNormalize = role || "patient"; // Default to patient if missing
      const normalizedRole = normalizeRole(roleToNormalize);
      
      console.log("Normalized Role:", normalizedRole);
      console.log("Expected Role:", ROLES.PATIENT);

      if (normalizedRole !== ROLES.PATIENT) {
        throw new Error(`Invalid role ${normalizedRole} for patient login`);
      }

      if (verified === false) {
        toast.warn("Please verify your account first via email", {
          position: "top-right",
          autoClose: 5000,
          theme: "colored",
        });
        setIsLoading(false);
        return;
      }

      // Get patient-specific storage keys from our utility function
      const { tokenKey, loginKey, idKey } = getRoleTokens(ROLES.PATIENT);

      // Store all auth data using safeLocalStorage
      const storageSuccess = [
        safeLocalStorage.setItem(tokenKey, token),
        safeLocalStorage.setItem(loginKey, login),
        safeLocalStorage.setItem("role", ROLES.PATIENT), // Always use the constant
        safeLocalStorage.setItem(idKey, id || "")
      ].every(Boolean);

      if (!storageSuccess) {
        throw new Error("Failed to store authentication data");
      }

      // Verify storage immediately
      console.log("Stored Patient Auth Data:", {
        token: safeLocalStorage.getItem(tokenKey),
        role: safeLocalStorage.getItem("role"),
        login: safeLocalStorage.getItem(loginKey),
        id: safeLocalStorage.getItem(idKey)
      });

      toast.success("Authenticated successfully", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });

      // Add a small delay to ensure localStorage is updated and toast is shown
      setTimeout(() => {
        window.location.href = "/patient_dashboard";
      }, 2000);

    } catch (error: unknown) {
      console.error("Login Error:", error);
      let errorMessage = "Login failed. Please try again.";
      
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          errorMessage = "Connection timeout. Please check your internet connection.";
        } else if (error.response) {
          errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        } else if (error.request) {
          errorMessage = "No response from server. Please try again later.";
        }
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
              <div style={{ width: "100px", height: "auto" }}>
                {isClient && (
                  <Image alt="Logo" src={logo} width={100} height={100} priority />
                )}
              </div>
            </Link>
          </div>
          <div className="col-12 col-sm-9 col-lg-6 col-xl-4">
              <div className="row justify-content-center">
                <div className="col-6 col-md-4 col-lg-5 col-xl-6 d-flex justify-content-end">
                  <Link
                    className="btn_Espace_Professionnels"
                    href="/professional_space"
                  >
                    <i className="fa fa-user-md"></i>professional_space
                  </Link>
                </div>
                <div className="col-6 col-md-4 col-lg-5 d-flex justify-content-center">
                  <Link className="btn_Espace_Patients" href="/patient_space">
                    <i className="fa fa-user"></i> patient_space
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
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Logging in...
                      </>
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
              {isClient && (
                <Image
                  alt="Login illustration"
                  src={Imglogin}
                  width={500}
                  height={300}
                  style={{ width: "70%", marginLeft: "60px" }}
                  className="imgLogin"
                  priority
                />
              )}
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