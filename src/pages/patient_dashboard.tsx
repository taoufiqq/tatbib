import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../public/images/patient.png";
import { Appointment } from "@/types";
import withAuth from "@/components/withPrivateRoute";
import moment from "moment";

const DashboardPatient = () => {
  const router = useRouter();

  const [listAppointment, setListAppointment] = useState<Appointment[] | null>(
    null
  );

  useEffect(() => {
    const id = localStorage.getItem("id_patient") || "{}";
    axios
      .get(
        `https://tatbib-api.onrender.com/appointment/getAppointmenPatient/${id}`
      )
      .then(function (response) {
        setListAppointment(response.data);
      })
      .catch(function (err) {
        console.log(err);
      });
  }, []);

  if (typeof window !== "undefined") {
    const login = localStorage.getItem("LoginPatient") || "{}";

    const logOut = () => {
      localStorage.clear();
      router.push("/login_patient");

      toast.success("Log out SuccessFully", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "colored",
      });
    };

    return (
      <div className="Container">
        <nav className="menu" tabIndex={0}>
          <div className="smartphone-menu-trigger" />
          <header className="avatar">
            <Image alt="" src={logo} style={{ borderRadius: "50%", width: "150px" }} />
            <h6>Welcome</h6>
            <h5 style={{ color: "white" }}>{login}</h5>
          </header>
          <ul>
            <li tabIndex={0} className="icon-customers">
              <span>Appointment</span>
            </li>
            <li tabIndex={0} className="icon-users">
              <Link
                href="/ordonnances_by_patient"
                style={{ textDecoration: "none", color: "white" }}
              >
                <span>Ordonnances</span>
              </Link>
            </li>
            <li tabIndex={0} className="icon-profil">
              <Link
                href="/account_patient"
                style={{ textDecoration: "none", color: "white" }}
              >
                <span>MyAccount</span>
              </Link>
            </li>
            <li tabIndex={0} className="icon-settings">
              <span onClick={logOut}>Log out</span>
              <ToastContainer />
            </li>
          </ul>
        </nav>
        <main>
          <div className="helper">
            My Appointemnt<span> Management | Appointemnt</span>
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
                  {/* <div className="col-sm-7">
          <a href="#" className="btn btn-secondary"><i className="material-icons"></i> <span>Add New User</span></a>
          <a href="#" className="btn btn-secondary"><i className="material-icons"></i> <span>Export to Excel</span></a>						
        </div> */}
                </div>
              </div>
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>FullName</th>
                    <th>Speciality</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                {listAppointment &&
                  listAppointment.map((item, index) => (
                    <tbody key={index}>
                      <tr>
                        <td>{item.medcine.fullName}</td>
                        <td>{item.medcine.speciality}</td>
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
                        <td></td>
                      </tr>
                    </tbody>
                  ))}
              </table>
            </div>
          </div>

          <Link href="/search_medicine" style={{ textDecoration: "none" }}>
            <input
              type="button"
              className="form-control mt-5 btnConnect rendez-vous"
              id="Rdv"
              value="Make an appointment"
            />
          </Link>
        </main>
      </div>
    );
  }
};

export default withAuth(DashboardPatient);
