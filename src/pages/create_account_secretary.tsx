import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../public/images/logo.png";
import { Secretary } from "@/types";

export default function CreateAccountSecretary() {
  // var Medecin = JSON.parse(localStorage.getItem('medcine'));
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    login: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const loginMedcine = localStorage.getItem("LoginMedcine");
      if (!loginMedcine) {
        throw new Error("Doctor information not found");
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/medcine/createAccountSecretary`,
        { ...formData, loginMedcine },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        router.push("/account_secretary");
      } else {
        throw new Error(response.data.message || "Account creation failed");
      }
    } catch (error) {
      console.error("Account creation error:", error);
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to create account"
        );
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
              <Image alt="" src={logo} width="100" />
            </Link>
          </div>
        </div>
        <div className="card EspacePatient">
          <div className="row ">
            <div>
              <form
                className="row"
                method="#"
                action="#"
                onSubmit={handleSubmit}
              >
                <label className="form-label" style={{ marginTop: "4%" }}>
                  Create Compte Secretary
                </label>
                <div className="fromloginSignUp" style={{ marginTop: "10%" }}>
                  <div className="row ">
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
                      {/* <input
                        type="text"
                        placeholder="Email"
                        className="form-control"
                        id="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      /> */}
                    </div>
                  </div>
                  <div className="row ">
                    <div className="col-md-6">
                    <input
                     className="form-control"
                        type="text"
                        placeholder="login"
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
                <button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Confirm"}
                </button>
              </form>
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
