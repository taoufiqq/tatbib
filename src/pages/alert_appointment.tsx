import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../public/images/ss.jpg";
import withAuth from "@/components/withPrivateRoute";
import alert from "../../public/images/alert.svg";

const AlertAppointment = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const id_Appointment = localStorage.getItem("idAppointment");

    if (!id_Appointment) {
      toast.error("No appointment ID found");
      return;
    }

    axios
      .get(
        `https://tatbib-api.onrender.com/appointment/getAppointmenById/${id_Appointment}`
      )
      .then(function (response) {
        setEmail(response.data.patient.email);
        setDateTime(response.data.dateTime);
      })
      .catch(function (err) {
        console.log(err);
        toast.error("Failed to fetch appointment details");
      });
  }, []); // Added empty dependency array to run only once

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id_Appointment = localStorage.getItem("idAppointment");

    if (!id_Appointment) {
      toast.error("No appointment ID found");
      return;
    }

    const data = { email, dateTime };

    axios
      .put(
        `https://tatbib-api.onrender.com/secretary/alertAppointment/${id_Appointment}`,
        data
      )
      .then((res) => {
        if (!res.data.message) {
          router.push("/secretary_dashboard");
          toast.success("Alert has been sent successfully", {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "colored",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to send alert");
      });
  };

  return (
    <div className="Containerr" style={{ overflow: "hidden" }}>
      <main>
        <div className="table">
          <div className="table-wrapper">
            <div className="table-title">
              <div className="row">
                <div className="col-sm-5">
                  <h2>
                    Appointment <b>Management Appointment</b>
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-6 px-5 py-4 ConfirmForm">
          <h2 className="h2">Reminder Appointment</h2>
          <form onSubmit={handleSubmit}>
            <div className="col-12">
              <div className="input-icons mb-4">
                <Image 
                  alt="Alert icon" 
                  src={alert} 
                  width={300} 
                  height={300}
                  style={{ width: "60%", height: "auto" }} 
                />
              </div>
            </div>
            <div className="d-grid">
              <button
                type="submit"
                className="button1 py-3"
                style={{
                  width: "30%",
                  marginLeft: "35%",
                  backgroundColor: "red",
                }}
              >
                Reminder
              </button>
            </div>
          </form>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};

// Export with withAuth separately to avoid potential export issues
const AlertAppointmentWithAuth = withAuth(AlertAppointment);
export default AlertAppointmentWithAuth;