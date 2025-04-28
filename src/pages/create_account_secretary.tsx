"use client";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../public/images/logo.png";
import { safeLocalStorage } from "@/components/withPrivateRoute"; // Import the shared utility
import { getRoleTokens, ROLES } from "@/utils/roles";
export default function CreateAccountSecretary() {
  const router = useRouter();
  const { tokenKey, loginKey, idKey } = getRoleTokens(ROLES.MEDICINE);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    login: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check both possible localStorage keys for doctor login
      // const loginMedcine =
      //   safeLocalStorage.getItem("login_medcine") ||
      //   safeLocalStorage.getItem("LoginMedcine");

      const loginMedcine =
        safeLocalStorage.getItem(loginKey) ||
        safeLocalStorage.getItem("login_medcine");

      console.log("Found doctor login:", loginMedcine);

      if (!loginMedcine) {
        toast.error("Doctor information not found. Please log in first.");
        throw new Error("Doctor information not found");
      }

      // Get API URL from env or use default
      const apiUrl = "https://tatbib-api.onrender.com";

      console.log(
        "Submitting secretary creation to:",
        `${apiUrl}/medcine/createAccountSecretary`
      );
      console.log("With data:", { ...formData, loginMedcine });

      const response = await axios.post(
        `${apiUrl}/medcine/createAccountSecretary`,
        { ...formData, loginMedcine },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data);

      if (response.data.success) {
        toast.success(
          response.data.message || "Secretary account created successfully"
        );
        setTimeout(() => {
          router.push("/account_secretary");
        }, 2000);
      } else {
        throw new Error(response.data.message || "Account creation failed");
      }
    } catch (error) {
      console.error("Account creation error:", error);
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to create account"
        );
      } else if (error instanceof Error) {
        toast.error(error.message || "An unexpected error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
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
          </div>
        </div>
        <div className="card EspacePatient">
          <div className="row">
            <div>
              <form className="row" onSubmit={handleSubmit}>
                <label className="form-label" style={{ marginTop: "4%" }}>
                  Create Secretary Account
                </label>
                <div className="fromloginSignUp" style={{ marginTop: "10%" }}>
                  <div className="row">
                    <div className="col-md-6">
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Full Name"
                        id="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        className="form-control"
                        type="email"
                        placeholder="Email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Login"
                        id="login"
                        required
                        value={formData.login}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        className="form-control"
                        type="password"
                        placeholder="Password"
                        id="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="form-control mt-5 btnConnect"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Creating...
                    </>
                  ) : (
                    "Confirm"
                  )}
                </button>
              </form>
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
