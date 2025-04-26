import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../public/images/Secretary_avatar.png";
import withAuth from "@/components/withPrivateRoute";
import moment from "moment";
import { MdDashboard, MdFolderShared } from "react-icons/md";
import { Appointment } from "@/types";
import { RiLogoutCircleFill } from "react-icons/ri";
import { ROLES } from "@/utils/roles";
const SecretaryDashboard : NextPage = () => {
  const router = useRouter();
  const [listAppointment, setListAppointment] = useState<Appointment[] | null>(
    null
  );
  const [login, setLogin] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLogin(localStorage.getItem("LoginSecretary") || "");
      const id = localStorage.getItem("login_medcine");

      axios
        .get(
          `https://tatbib-api.onrender.com/appointment/getAppointmentSecretary/${id}`
        )
        .then((response) => {
          setListAppointment(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to load appointments");
          setLoading(false);
        });
    }
  }, []);

  const deleteAppointment = (id: string) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      axios
        .delete(
          `https://tatbib-api.onrender.com/secretary/deleteAppointment/${id}`
        )
        .then(() => {
          setListAppointment(
            (prev) => prev?.filter((app) => app._id !== id) || null
          );
          toast.success("Appointment deleted successfully");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to delete appointment");
        });
    }
  };

  const handleAction = (id: string, path: string) => {
    localStorage.setItem("idAppointment", id);
    router.push(path);
  };

  const handleLogout = () => {
    ["tokenSecretary", "LoginSecretary", "role", "id_secretary"].forEach(
      item => localStorage.removeItem(item)
    );
    router.push("/login_secretary");
  };
  return (
    <div className="Container">
      <nav className="menu" tabIndex={0}>
        <div className="smartphone-menu-trigger" />
        <header className="avatar">
          <Image
            alt="Secretary"
            src={logo}
            width={150}
            height={150}
            style={{ borderRadius: "50%", width: "150px" }}
            priority
          />
          <h6>Welcome</h6>
          <h5 style={{ color: "white" }}>{login}</h5>
        </header>
        <ul>
          <li tabIndex={0} className="icon-customers">
            <MdDashboard />
            <Link href="" style={{ textDecoration: "none", color: "white" }}>
              <span>Appointment</span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-folder">
            <MdFolderShared />
            <Link href="" style={{ textDecoration: "none", color: "white" }}>
              <span>Patient Record</span>
            </Link>
          </li>
          <li tabIndex={0} className="icon-settings">
            <RiLogoutCircleFill />
            <span onClick={handleLogout}>Log out</span>
          </li>
        </ul>
      </nav>

      <main>
        <div className="helper">
          Appointment<span> Management | Appointment</span>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading appointments...</div>
        ) : (
          <div className="table-responsive">
            <div className="table-wrapper">
              <div className="table-title">
                <div className="row">
                  <div className="col-sm-5">
                    <h2>
                      Appointment <b>list</b>
                    </h2>
                  </div>
                </div>
              </div>

              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>LastName</th>
                    <th>FirstName</th>
                    <th>Email</th>
                    <th>Telephone</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {listAppointment?.map((item) => (
                    <tr key={item._id}>
                      <td>{item.patient.lastName}</td>
                      <td>{item.patient.firstName}</td>
                      <td>{item.patient.email}</td>
                      <td>{item.patient.telephone}</td>
                      <td>{moment(item.dateTime).format("MMMM DD YYYY")}</td>
                      <td>{moment(item.dateTime).format("HH:mm")}</td>
                      <td
                        style={{
                          color:
                            item.status === "Unconfirmed" ? "red" : "green",
                        }}
                      >
                        {item.status}
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            handleAction(item._id, "/alert_appointment")
                          }
                          className="btn-action"
                          title="Alert"
                          aria-label="Alert"
                        >
                          <i className="fas fa-bell" />
                        </button>
                        <button
                          onClick={() =>
                            handleAction(item._id, "/confirm_appointment")
                          }
                          className="btn-action"
                          title="Confirm"
                          aria-label="Confirm"
                        >
                          <i className="fas fa-check-circle" />
                        </button>
                        <button
                          onClick={() => deleteAppointment(item._id)}
                          className="btn-action delete"
                          title="Delete"
                          aria-label="Delete"
                        >
                          <i className="fas fa-trash-alt" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <ToastContainer />
    </div>
  );
};

export default withAuth(SecretaryDashboard, { role: "SECRETARY" });
