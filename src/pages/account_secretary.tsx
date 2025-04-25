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

export default function SecretaryCompte() {
  const router = useRouter();

  // const [secretary, setSecretary] = useState();
  // const login = localStorage.getItem('LoginMedcine') || " "

  const [listSecretary, setListSecretary] = useState<Secretary[] | null>(null);
  const [loading, setLoading] = useState(true);
  if (typeof window !== "undefined") {
    const loginMedcine = localStorage.getItem("LoginMedcine") || " ";

    axios
      .get(
        `https://tatbib-api.onrender.com/medcine/getSecretaryByMedcineName/${loginMedcine}`
      )
      .then(function (response) {
        setListSecretary(response.data);
        setLoading(false);
      })
      .catch(function (err) {
        console.log(err);
        setLoading(false);
        toast.error("Failed to load account secretary");
      });

    const getIdSecretary = (id: any) => {
      localStorage.setItem("idSecretary", id);
      router.push("/management_account_secretary");
    };

    // delete My Account
    const deleteAccountSecretary = (id: any) => {
      var msgConfirmation = window.confirm(
        "Are You Sure Yo want to delete this Account ?"
      );
      if (msgConfirmation) {
        axios
          .delete(
            `https://tatbib-api.onrender.com/medcine/deleteSecretary/${id}`
          )
          .then(function (response) {
            window.location.reload();
            console.log("item was deleted Succesfully ... ");
            //   toastr.success(' Account was deleted SuccessFully')
          });
      }
    };

    //-----------------------log out-----------------
    const logOut = () => {
      if (typeof window !== "undefined") {
        // Remove only medicine-related items from localStorage
        const medicineItems = [
          "tokenMedicine",
          "LoginMedicine",
          "id_medcine",
        ];

        medicineItems.forEach((item) => localStorage.removeItem(item));
      }

      router.push("/login_medicine");
      toast.success("Logged out successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
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
          ></div>
          <p>Loading Account Secretary...</p>
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
    return (
      <div className="Container">
        <nav className="menu" tabIndex={0}>
          <div className="smartphone-menu-trigger" />
          <header className="avatar">
            <Image
              alt=""
              src={logo}
              style={{ borderRadius: "50%", width: "150px" }}
            />
            <h6>Welcome</h6>
            <h5 style={{ color: "white" }}>{loginMedcine}</h5>
          </header>
          <ul>
            <li tabIndex={0} className="icon-customers">
              {" "}
              <MdDashboard />
              <Link
                href="/list_appointments_medicine"
                style={{ textDecoration: "none", color: "white" }}
              >
                <span>ListAppointments</span>
              </Link>
              <ToastContainer />
            </li>

            <li tabIndex={0} className="icon-profil">
              {" "}
              <FaUserEdit />
              <Link
                href="/medicine_dashboard"
                style={{ textDecoration: "none", color: "white" }}
              >
                <span>MyAccount</span>
              </Link>
              <ToastContainer />
            </li>
            <li tabIndex={0} className="icon-users">
              {" "}
              <FaNotesMedical />
              <Link
                href="/ordonnances_by_medicine"
                style={{ textDecoration: "none", color: "white" }}
              >
                <span>Ordonnances</span>
              </Link>
            </li>
            <li tabIndex={0} className="icon-Secrétaire">
              <FaUserPlus />
              <Link
                href="/account_secretary"
                style={{ textDecoration: "none", color: "white" }}
              >
                <span>Secretary</span>
              </Link>
              <ToastContainer />
            </li>
            <li tabIndex={0} className="icon-settings">
              {" "}
              <RiLogoutCircleFill />
              <span onClick={logOut}>Log out</span>
              <ToastContainer />
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
                            color: item.status !== "InActive" ? "color" : "red",
                          }}
                        >
                          <span className="status text-danger"></span>
                          {item.status}
                        </td>
                        <td>
                          <Link
                            href=""
                            onClick={() => getIdSecretary(item._id)}
                            className="edit"
                            title="Active Account Secretary"
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
}
