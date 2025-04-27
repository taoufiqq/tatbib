"use client";

import Image from "next/image";
import { useRouter } from "next/navigation"; // Changed to next/navigation
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { normalizeRole, ROLES, getRoleTokens } from "@/utils/roles";
import logo from "../../public/images/logo.png";
import Imglogin from "../../public/images/Login2.svg";
import { safeLocalStorage } from "@/components/withPrivateRoute"; // Import the shared utility

export default function LoginSecretary() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Only run client-side code after component mounts
  useEffect(() => {
    setIsClient(true);

    // Check if already logged in as secretary
    const checkExistingAuth = () => {
      try {
        const storedRole = safeLocalStorage.getItem("role");
        if (storedRole === ROLES.SECRETARY) {
          const { tokenKey } = getRoleTokens(ROLES.SECRETARY);
          const token = safeLocalStorage.getItem(tokenKey);

          if (token) {
            console.log("Already logged in as secretary, redirecting to dashboard");
            setTimeout(() => {
              window.location.href = "/secretary_dashboard";
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
      console.log("Attempting secretary login...");
      const response = await axios.post(
        `https://tatbib-api.onrender.com/secretary/login`,
        { login, password },
        {
          timeout: 15000,
        }
      );
  
      console.log("API Response:", response.data);
  
      if (response.data.message) {
        throw new Error(response.data.message);
      }
  
      const { status, tokenSecretary, roleSecretary, id, loginMedcine } = response.data;
  
      // Handle account status
      if (status === "InActive") {
        toast.warn(response.data.message || "Your account is not active yet. Please wait for activation.", {
          position: "top-right",
          autoClose: 5000,
          theme: "colored",
        });
        setIsLoading(false);
        return;
      }
  
      if (status === "Block") {
        toast.error(response.data.message || "This account is blocked.", {
          position: "top-right",
          autoClose: 5000,
          theme: "colored",
        });
        setIsLoading(false);
        return;
      }
  
      // Proceed with login if status is active
      const { tokenKey, loginKey, idKey } = getRoleTokens(ROLES.SECRETARY);
  
      const storageSuccess = [
        safeLocalStorage.setItem(tokenKey, tokenSecretary),
        safeLocalStorage.setItem(loginKey, login),
        safeLocalStorage.setItem("role", ROLES.SECRETARY),
        safeLocalStorage.setItem(idKey, id || ""),
        loginMedcine ? safeLocalStorage.setItem("login_medcine", loginMedcine) : true,
      ].every(Boolean);
  
      if (!storageSuccess) {
        throw new Error("Failed to store authentication data");
      }
  
      toast.success("Authenticated successfully", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });
  
      setTimeout(() => {
        window.location.href = "/secretary_dashboard";
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
              {isClient && (
                <Image
                  alt="Login Illustration"
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