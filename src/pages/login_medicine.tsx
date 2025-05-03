"use client";

import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../public/images/logo.png";
import Imglogin from "../../public/images/login3.svg";
import { normalizeRole, ROLES, getRoleTokens } from "@/utils/roles";
import { safeLocalStorage } from "@/components/withPrivateRoute";
import { useTranslation } from "next-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function LoginMedicine(): React.ReactElement {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { locale } = router;
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  // Only run client-side code after component mounts
  useEffect(() => {
    setIsClient(true);

    // Check if already logged in as medicine
    const checkExistingAuth = () => {
      try {
        const storedRole = safeLocalStorage.getItem("role");
        if (storedRole === ROLES.MEDICINE) {
          const { tokenKey } = getRoleTokens(ROLES.MEDICINE);
          const token = safeLocalStorage.getItem(tokenKey);

          if (token) {
            console.log(
              "Already logged in as medicine, redirecting to dashboard"
            );
            setTimeout(() => {
              window.location.href = "/list_appointments_medicine";
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
      console.log("Attempting login...");
      const response = await axios.post(
        `https://tatbib-api.onrender.com/medcine/login`,
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

      const { verified, token, role, id, medcine } = response.data;

      // Make sure we have a role string to normalize (add fallback)
      const roleToNormalize = role || "medicine"; // Default to medicine if missing
      const normalizedRole = normalizeRole(roleToNormalize);

      console.log("Normalized Role:", normalizedRole);
      console.log("Expected Role:", ROLES.MEDICINE);

      if (normalizedRole !== ROLES.MEDICINE) {
        throw new Error(`Invalid role ${normalizedRole} for doctor login`);
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

      // Get the correct storage keys from our utility function
      const { tokenKey, loginKey, idKey } = getRoleTokens(ROLES.MEDICINE);

      // Store all auth data using the keys from our utility function with safeLocalStorage
      const storageSuccess = [
        safeLocalStorage.setItem(tokenKey, token),
        safeLocalStorage.setItem(loginKey, medcine?.login || login),
        safeLocalStorage.setItem("role", ROLES.MEDICINE),
        safeLocalStorage.setItem(idKey, id || ""),
        medcine
          ? safeLocalStorage.setItem("medcine", JSON.stringify(medcine))
          : true,
      ].every(Boolean);

      if (!storageSuccess) {
        throw new Error("Failed to store authentication data");
      }

      // Verify storage immediately
      console.log("Stored Auth Data:", {
        token: safeLocalStorage.getItem(tokenKey),
        role: safeLocalStorage.getItem("role"),
        login: safeLocalStorage.getItem(loginKey),
        id: safeLocalStorage.getItem(idKey),
      });

      toast.success("Authenticated successfully", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });

      // Add a small delay to ensure localStorage is updated and toast is shown
      setTimeout(() => {
        window.location.href = "/list_appointments_medicine";
      }, 2000);
    } catch (error: unknown) {
      console.error("Login Error:", error);
      let errorMessage = "Login failed. Please try again.";

      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          errorMessage =
            "Connection timeout. Please check your internet connection.";
        } else if (error.response) {
          errorMessage =
            error.response.data?.message ||
            `Server error: ${error.response.status}`;
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

  // const handleForgotPassword = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!email) {
  //     toast.error("Please enter your email address");
  //     return;
  //   }

  //   setResetLoading(true);

  //   try {
  //     const response = await axios.post(
  //       `https://tatbib-api.onrender.com/medcine/forgot-password`,
  //       { email },
  //       { timeout: 15000 }
  //     );

  //     toast.success("Password reset instructions have been sent to your email", {
  //       position: "top-right",
  //       autoClose: 5000,
  //       theme: "colored",
  //     });

  //     // Return to login form after successful submission
  //     setShowForgotPassword(false);
  //     setEmail("");

  //   } catch (error: unknown) {
  //     console.error("Password Reset Error:", error);
  //     let errorMessage = "Failed to send reset instructions. Please try again.";

  //     if (axios.isAxiosError(error)) {
  //       if (error.code === "ECONNABORTED") {
  //         errorMessage = "Connection timeout. Please check your internet connection.";
  //       } else if (error.response) {
  //         errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
  //       } else if (error.request) {
  //         errorMessage = "No response from server. Please try again later.";
  //       }
  //     } else if (error instanceof Error) {
  //       errorMessage = error.message;
  //     }

  //     toast.error(errorMessage, {
  //       position: "top-right",
  //       autoClose: 5000,
  //       theme: "colored",
  //     });
  //   } finally {
  //     setResetLoading(false);
  //   }
  // };
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setResetLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:3030/medcine/forgot-password`,
        { email },
        {
          timeout: 15000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(
        response.data.message ||
          "Password reset instructions have been sent to your email",
        {
          position: "top-right",
          autoClose: 5000,
          theme: "colored",
        }
      );

      setShowForgotPassword(false);
      setEmail("");
    } catch (error: unknown) {
      console.error("Password Reset Error:", error);

      let errorMessage = "Failed to send reset instructions. Please try again.";
      let showContactSupport = false;

      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          errorMessage = "Request timed out. Please check your connection.";
        } else if (error.response) {
          // Handle specific backend error messages
          if (error.response.status === 500) {
            errorMessage =
              "Our system is currently unavailable. Please try again later.";
            showContactSupport = true;
          } else {
            errorMessage = error.response.data?.message || errorMessage;
          }
        }
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });

      if (showContactSupport) {
        toast.info("Contact support if this persists", {
          position: "top-right",
          autoClose: 5000,
          theme: "colored",
        });
      }
    } finally {
      setResetLoading(false);
    }
  };
  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
  };

  return (
    <div
      className="container-fluid px-0"
      style={{ overflow: "auto", direction: locale === "ar" ? "rtl" : "ltr" }}
    >
      <section className="header-page">
        <div className="container">
          <div className="row justify-content-between py-3 align-items-center">
            <div className="col-12 col-sm-3 col-lg-4 d-flex justify-content-center justify-content-lg-start py-2 py-lg-0">
              <Link href="/">
                <div style={{ width: "100px", height: "auto" }}>
                  {isClient && (
                    <Image
                      alt="Logo"
                      src={logo}
                      width={100}
                      height={100}
                      priority
                    />
                  )}
                </div>
              </Link>
              <div className="ms-3">
                <LanguageSwitcher />
              </div>
            </div>
            <div className="col-12 col-sm-9 col-lg-6 col-xl-4">
              <div className="row justify-content-center">
                <div className="col-6 col-md-4 col-lg-5 col-xl-6 d-flex justify-content-end">
                  <Link
                    className="btn_Espace_Professionnels"
                    href="/professional_space"
                  >
                    <i className="fas fa-user-injured"></i>{" "}
                    {t("professional_space")}
                  </Link>
                </div>
                <div className="col-6 col-md-4 col-lg-5 d-flex justify-content-center">
                  <Link className="btn_Espace_Patients" href="/patient_space">
                    <i className="fas fa-user-injured"></i> {t("patient_space")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="card EspacePatient">
            <div className="row">
              <div
                className="col-12 col-md-12 col-lg-6"
                style={{ marginTop: "4%" }}
              >
                {!showForgotPassword ? (
                  /* Login Form */
                  <form className="row" onSubmit={handleSubmit}>
                    <label className="form-label">{t("login_as_doctor")}</label>
                    <div className="fromlogin">
                      <input
                        type="text"
                        placeholder={t("login")}
                        className="form-control"
                        required
                        value={login}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setLogin(e.target.value)
                        }
                        disabled={isLoading}
                      />

                      <input
                        type="password"
                        placeholder={t("password")}
                        className="form-control"
                        required
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setPassword(e.target.value)
                        }
                        disabled={isLoading}
                      />

                      <div className="d-flex justify-content-center mt-2">
                        <button
                          type="button"
                          className="btn btn-link p-0 text-decoration-none"
                          onClick={toggleForgotPassword}
                          disabled={isLoading}
                        >
                          {t("forgot_password")}
                        </button>
                      </div>

                      <button
                        type="submit"
                        className="form-control mt-4 btnConnect"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            {t("logging_in")}
                          </>
                        ) : (
                          <>{t("log_in")}</>
                        )}
                      </button>

                      <Link
                        href="/sign_up_medicine"
                        style={{ textDecoration: "none" }}
                      >
                        <button
                          type="button"
                          className="form-control mt-3 btnAuth"
                          disabled={isLoading}
                        >
                          {t("create_account")}
                        </button>
                      </Link>
                    </div>
                  </form>
                ) : (
                  /* Forgot Password Form */
                  <form className="row" onSubmit={handleForgotPassword}>
                    <label className="form-label">
                      {t("forgot_password_title")}
                    </label>
                    <div className="fromlogin">
                      <p
                        className="text-muted mb-3"
                        style={{ textAlign: "center", width: "99%" }}
                      >
                        {t("forgot_password_instruction")}
                      </p>

                      <input
                        type="email"
                        placeholder={t("email_placeholder")}
                        className="form-control"
                        required
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEmail(e.target.value)
                        }
                        disabled={resetLoading}
                      />

                      <button
                        type="submit"
                        className="form-control mt-4 btnConnect"
                        disabled={resetLoading}
                      >
                        {resetLoading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            {t("sending")}
                          </>
                        ) : (
                          <>{t("reset_password")}</>
                        )}
                      </button>

                      <button
                        type="button"
                        className="form-control mt-3 btnAuth"
                        onClick={toggleForgotPassword}
                        disabled={resetLoading}
                      >
                        {t("back_to_login")}
                      </button>
                    </div>
                  </form>
                )}
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
    </div>
  );
}
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
