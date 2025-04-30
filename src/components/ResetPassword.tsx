"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../public/images/logo.png";
import Imglogin from "../../public/images/login3.svg";

export default function ResetPassword(): React.ReactElement | null {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    setToken(searchParams.get('token') || '');
  }, [searchParams]);

  const validatePassword = (pw: string): string | null => {
    if (pw.length < 8) return "Must be at least 8 characters";
    if (!/[A-Z]/.test(pw)) return "Must contain uppercase letter";
    if (!/[a-z]/.test(pw)) return "Must contain lowercase letter";
    if (!/[0-9]/.test(pw)) return "Must contain number";
    if (!/[^A-Za-z0-9]/.test(pw)) return "Must contain special character";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(`Password requirements: ${passwordError}`);
      return;
    }

    // Validate token exists
    if (!token) {
      toast.error("Invalid reset link. Please request a new password reset.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `https://tatbib-api.onrender.com/medcine/reset-password`,
        { token, password },
        { 
          timeout: 15000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success("Password reset successful. Redirecting to login...");
      
      // Clear sensitive data
      setPassword("");
      setConfirmPassword("");

      // Redirect after delay
      setTimeout(() => router.push("/login_medicine"), 3000);

    } catch (error: unknown) {
      console.error("Reset Password Error:", error);
      
      let errorMessage = "Password reset failed";
      let showContactSupport = false;

      if (axios.isAxiosError(error)) {
        if (error.response) {
          switch (error.response.status) {
            case 400:
              errorMessage = "Invalid or expired token";
              break;
            case 401:
              errorMessage = "Unauthorized request";
              break;
            case 500:
              errorMessage = "Server error. Please try again later.";
              showContactSupport = true;
              break;
            default:
              errorMessage = error.response.data?.message || errorMessage;
          }
        } else if (error.code === "ECONNABORTED") {
          errorMessage = "Request timed out. Check your connection.";
        }
      }

      toast.error(errorMessage);
      if (showContactSupport) {
        toast.info("Contact support if this persists");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) return null; // SSR guard

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
                <label className="form-label">Reset Your Password</label>
                <div className="fromlogin">
                <div className="password-requirements mb-3">
                    <small>Password must contain:</small>
                    <ul className="text-muted" style={{ fontSize: '0.8rem' }}>
                      <li>At least 8 characters</li>
                      <li>Uppercase and lowercase letters</li>
                      <li>At least one number</li>
                      <li>At least one special character</li>
                    </ul>
                  </div>

                  <input
                    type="password"
                    placeholder="New Password"
                    className="form-control"
                    required
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />

                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="form-control"
                    required
                    value={confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    style={{ marginTop: "15px" }}
                  />

                  <button
                    type="submit"
                    className="form-control mt-5 btnConnect"
                    disabled={isLoading || !token}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>

                  <div className="text-center mt-3">
                    <Link href="/login_medicine" style={{ textDecoration: "none" }}>
                      Back to Login
                    </Link>
                  </div>
                </div>
              </form>
              
              {!token && (
                <div className="alert alert-warning mt-3">
                  Invalid reset link. Please request a new password reset.
                </div>
              )}
            </div>
            <div className="col-12 col-md-12 col-lg-6">
              {isClient && (
                <Image
                  alt="Reset Password Illustration"
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