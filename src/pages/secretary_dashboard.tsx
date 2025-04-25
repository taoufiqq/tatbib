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
const DashboardSecretary = () => {
  const router = useRouter();

  // const data = router.query;

  const [listAppointment, setListAppointment] = useState<Appointment[] | null>(
    null
  );

  useEffect(() => {
    const id = localStorage.getItem("login_medcine");

    axios
      .get(
        `https://tatbib-api.onrender.com/appointment/getAppointmentSecretary/${id}`
      )
      .then(function (response) {
        setListAppointment(response.data);
      })
      .catch(function (err) {
        console.log(err);
      });
  }, []);

  if (typeof window !== "undefined") {
    const login = localStorage.getItem("LoginSecretary");
    // delete My Account
    const deleteAppointment = (id: any) => {
      var msgConfirmation = window.confirm(
        "Are You Sure Yo want to delete this Appointment ?"
      );
      if (msgConfirmation) {
        axios
          .delete(
            `https://tatbib-api.onrender.com/secretary/deleteAppointment/${id}`
          )
          .then(function (response) {
            window.location.reload();
            console.log("item was deleted Succesfully ... ");
            toast("Appointment was deleted SuccessFully", {
              hideProgressBar: true,
              autoClose: 2000,
              type: "success",
              position: "top-right",
            });

            // toastr.success(' Appointment was deleted SuccessFully')
          });
      }
    };
    const getIdAppointment = (id: any) => {
      localStorage.setItem("idAppointment", id);
      router.push("/confirm_appointment", undefined, { shallow: true });
    };

    const alertAppointment = (id: any) => {
      localStorage.setItem("idAppointment", id);
      router.push("/alert_appointment", undefined, { shallow: true });
    };

    const logOut = () => {
      // Remove only secretary-related items from localStorage
      const itemsToRemove = [
        'tokenSecretary',
        'LoginSecretary',
        'id_secretary',
        // Add any other secretary-specific items here
      ];
    
      itemsToRemove.forEach(item => {
        localStorage.removeItem(item);
      });
    
      router.push("/login_secretary");
      toast.success("Logged out successfully", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,  // Changed to true for better UX
        pauseOnHover: true,  // Changed to true for better UX
        draggable: true,     // Changed to true for better UX
        progress: undefined,
        theme: "colored",
      });
    };

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
              <MdFolderShared/>
              <Link href="" style={{ textDecoration: "none", color: "white" }}>
                <span>Patient Record</span>
              </Link>
            </li>
            <li tabIndex={0} className="icon-settings">
                  <RiLogoutCircleFill />
              <span onClick={logOut}>Log out</span>
            </li>
          </ul>
        </nav>
        <main>
          <div className="helper">
            Appointemnt<span> Management | Appointemnt</span>
          </div>
          <div className="table-responsive">
            <div className="table-wrapper">
              <div className="table-title">
                <div className="row">
                  <div className="col-sm-5">
                    <h2>
                      Appointemnt <b>list</b>
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
                {listAppointment &&
                  listAppointment.map((item: any, index: any) => (
                    <tbody key={index}>
                      <tr>
                        <td>{item.patient.firstName}</td>
                        <td>{item.patient.lastName}</td>
                        <td>{item.patient.email}</td>
                        <td>{item.patient.telephone}</td>
                        <td>{moment(item.dateTime).format(`MMMM DD YYYY`)}</td>
                        <td>{moment(item.dateTime).format(`HH:MM`)}</td>
                        <td
                          style={{
                            color:
                              item.status !== "Unconfirmed" ? "color" : "red",
                          }}
                        >
                          {item.status}
                        </td>

                        <td>
                          <Link
                            href=""
                            onClick={() => alertAppointment(item._id)}
                            className="edit"
                            title="Alert Appointment"
                            data-toggle="tooltip"
                          >
                            {" "}
                            <i className="material-icons add_alert">&#xe003;</i>
                            <ToastContainer />
                          </Link>
                          <Link
                            href=""
                            onClick={() => getIdAppointment(item._id)}
                            className="confirm"
                            title="Confirm Appointment"
                            data-toggle="tooltip"
                          >
                            <i className="material-icons done_outline">
                              &#xe92f;
                            </i>
                            <ToastContainer />
                          </Link>
                          <Link
                            href=""
                            className="edit"
                            title="Edit Appointment"
                            data-toggle="tooltip"
                          >
                            <i className="material-icons">&#xE254;</i>
                          </Link>
                          <Link
                            href=""
                            onClick={() => deleteAppointment(item._id)}
                            className="delete"
                            title="Delete Appointment"
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
};
export default withAuth(DashboardSecretary);
