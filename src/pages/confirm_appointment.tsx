import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import withAuth from "@/components/withPrivateRoute";
import { getRoleTokens, ROLES } from "@/utils/roles";

const ConfirmAppointment = () => {
  const router = useRouter();

  const [status, setStatus] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [email, setEmail] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const { idKey } = router.query;

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const id = localStorage.getItem("idAppointment");
        if (!id) {
          console.error("No appointment ID found in localStorage");
          setLoading(false);
          return;
        }
        const response = await axios.get(
          `https://tatbib-api.onrender.com/appointment/getAppointmenById/${id}`
        );
        const appointment = response.data;

        setStatus(appointment.status);
        setEmail(appointment.patient.email);
        setDateTime(appointment.dateTime);
      } catch (error) {
        console.error("Failed to fetch appointment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, []); // ✅ Empty dependency array to run once

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const id = localStorage.getItem("idAppointment");
    const data = { status: updatedStatus, email, dateTime };

    axios
      .put(
        `https://tatbib-api.onrender.com/secretary/confirmAppointment/${id}`,
        data
      )
      .then((res) => {
        if (!res.data) {
          return false;
        } else {
          console.log(res.data);
          router.push("/secretary_dashboard");
          toast.success("Appointment confirmed SuccessFully", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "colored",
          });
        }
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
        <p>Loading...Please Wait</p>
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
          <h2 className="h2">Confirm Appointment</h2>
          <form onSubmit={handleSubmit}>
            <div className="col-12">
              <div className="input-icons mb-4">
                <select
                  className="select p-3"
                  value={updatedStatus}
                  onChange={(e) => setUpdatedStatus(e.target.value)}
                >
                  <option selected>Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Unconfirmed">Unconfirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="d-grid">
              <button
                type="submit"
                className="blog-slider__button mt-5"
                style={{ outline: "none" }}
                disabled={isSubmitting || !idKey}
              >
                {isSubmitting ? "Processing..." : "Confirm"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};
export default withAuth(ConfirmAppointment);
