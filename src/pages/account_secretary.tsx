import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../public/images/doctor.png";
import { Secretary } from "@/types";
import { MdDashboard } from "react-icons/md";
import { FaNotesMedical, FaUserEdit, FaUserPlus } from "react-icons/fa";
import { RiLogoutCircleFill } from "react-icons/ri";
import { getRoleTokens, ROLES } from "@/utils/roles";
import { safeLocalStorage } from "@/components/withPrivateRoute";

export default function SecretaryCompte() {
  const router = useRouter();
  const [listSecretary, setListSecretary] = useState<Secretary[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { tokenKey, loginKey, idKey } = getRoleTokens(ROLES.MEDICINE);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loginMedcine =
        safeLocalStorage.getItem(loginKey) ||
        localStorage.getItem(loginKey) ||
        "";

      if (!loginMedcine) {
        toast.error("Login not found");
        setLoading(false);
        return;
      }

      axios
        .get(
          `https://tatbib-api.onrender.com/medcine/getSecretaryByMedcineName/${loginMedcine}`
        )
        .then((response) => {
          setListSecretary(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
          toast.error("Failed to load secretary accounts");
        });
    }
  }, []); // run only once

  const getIdSecretary = (id: any) => {
    localStorage.setItem("idSecretary", id);
    router.push("/management_account_secretary");
  };

  const deleteAccountSecretary = (id: any) => {
    const msgConfirmation = window.confirm(
      "Are you sure you want to delete this account?"
    );
    if (msgConfirmation) {
      axios
        .delete(`https://tatbib-api.onrender.com/medcine/deleteSecretary/${id}`)
        .then(() => {
          window.location.reload();
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to delete secretary");
        });
    }
  };

  const handleLogout = () => {
    const medicineItems = [tokenKey, loginKey, idKey, "role"];
    medicineItems.forEach((item) => localStorage.removeItem(item));

    router.push("/login_medicine");
    toast.success("Logged out successfully", {
      position: "top-right",
      autoClose: 5000,
    });
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div
          style={{
            border: "4px solid rgba(0, 0, 0, 0.1)",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            borderLeftColor: "#09f",
            animation: "spin 1s linear infinite",
          }}
        />
        <p>جاري التحميل ...</p>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  const login = (typeof window !== "undefined" && localStorage.getItem(loginKey)) || "";


    return (
      <div className="Container">
        <nav className="menu" tabIndex={0}>
          <div className="smartphone-menu-trigger" />
          <header className="avatar">
            <Image
              alt="Doctor profile"
              src={logo}
              width={150}
              height={150}
              style={{ borderRadius: "50%" }}
            />
            <h6>Welcome</h6>
            <h5 style={{ color: "white" }}>{login}</h5>
          </header>

          <ul>
            <li tabIndex={0} className="icon-customers">
              <MdDashboard />
              <Link href="/list_appointments_medicine" passHref>
                <span style={{ textDecoration: "none", color: "white" }}>
                  List Appointments
                </span>
              </Link>
            </li>
            <li tabIndex={0} className="icon-profil">
              <FaUserEdit />
              <Link href="/medicine_dashboard" passHref>
                <span style={{ textDecoration: "none", color: "white" }}>
                  My Account
                </span>
              </Link>
            </li>
            <li tabIndex={0} className="icon-users">
              <FaNotesMedical />
              <Link href="/ordonnances_by_medicine" passHref>
                <span style={{ textDecoration: "none", color: "white" }}>
                  Ordonnances
                </span>
              </Link>
            </li>
            <li tabIndex={0} className="icon-Secrétaire">
              <FaUserPlus />
              <Link href="/account_secretary" passHref>
                <span style={{ textDecoration: "none", color: "white" }}>
                  Secretary
                </span>
              </Link>
            </li>
            <li tabIndex={0} className="icon-settings">
              <RiLogoutCircleFill />
              <span onClick={handleLogout} style={{ cursor: "pointer" }}>
                Log out
              </span>
            </li>
          </ul>
        </nav>
        <main>
          <div className="helper">
            Secretary Account<span> Secretary | Management</span>
          </div>
          <div className="table-responsive">
            <div className="table-wrapper">
              <div className="table-title">
                <div className="row">
                  <div className="col-sm-5">
                    <h2>
                      Account <b>Management</b>
                    </h2>
                  </div>
                  <div className="col-sm-7">
                    <Link
                      href="/create_account_secretary"
                      className="btn btn-secondary"
                    >
                      <i className="material-icons"></i>{" "}
                      <span>Add New Secretary</span>
                    </Link>
                  </div>
                </div>
              </div>
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>FullName</th>
                    <th>Email</th>
                    <th>Login</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                {listSecretary &&
                  listSecretary.map((item: any, index: number) => (
                    <tbody key={index}>
                      <tr>
                        <td>{item.fullName}</td>
                        <td>{item.email}</td>
                        <td>{item.login}</td>
                        <td
                          style={{
                            color:
                              item.status === "Active"
                                ? "green"
                                : item.status === "InActive"
                                ? "orange"
                                : "red",
                          }}
                        >
                          <span className="status">{item.status}</span>
                        </td>

                        <td>
                          <Link
                            href=""
                            onClick={() => getIdSecretary(item._id)}
                            className="edit"
                            title="Manage Account Secretary"
                            data-toggle="tooltip"
                          >
                            <i className="material-icons">&#xE254;</i>
                          </Link>
                          <Link
                            href=""
                            onClick={() => deleteAccountSecretary(item._id)}
                            className="delete"
                            title="Delete Account Secretary"
                            data-toggle="tooltip"
                          >
                            <i className="material-icons">&#xE872;</i>
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  ))}
              </table>
            </div>
          </div>
        </main>
      </div>
    );
  }

