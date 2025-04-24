import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../public/images/logo.png";

interface AppointmentData {
  dateTime: string;
  medcine: string;
  patient: string;
  loginMedcine?: string;
}

export default function RendezVous() {
  const router = useRouter();
  const [dateTime, setDateTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState<any>(null);
  const { id, login } = router.query;

  // Fetch doctor info when query params are available
  useEffect(() => {
    if (id) {
      axios
        .get(`https://tatbib-api.onrender.com/medcine/getMedcineById/${id}`)
        .then((response) => {
          console.log("Medcine data:", response.data);
          setDoctorInfo(response.data);
        })
        .catch((err) => {
          console.error("Error fetching medcine:", err);
          toast.error("Failed to load doctor information");
        });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Check if client side
    if (typeof window === 'undefined') {
      setIsSubmitting(false);
      return;
    }

    const token = localStorage.getItem("tokenPatient");
    const idPatient = localStorage.getItem("id_patient");

    // Validate patient login
    if (!token || !idPatient) {
      router.push("/login_patient");
      toast.warn("Please login first", {
        position: "top-center",
        autoClose: 5000,
        theme: "colored"
      });
      setIsSubmitting(false);
      return;
    }

    // Validate appointment data
    if (!dateTime) {
      toast.error("Please select a date and time");
      setIsSubmitting(false);
      return;
    }

    if (!id) {
      toast.error("Doctor information is missing");
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare appointment data
      const appointmentData: AppointmentData = {
        dateTime: new Date(dateTime).toISOString(),
        medcine: id as string,
        patient: idPatient,
        loginMedcine: login as string
      };

      console.log("Submitting appointment:", appointmentData);

      // Make API request with proper headers
      const response = await axios.post(
        "https://tatbib-api.onrender.com/appointment/addAppointment",
        appointmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      // Handle response
      if (response.data?.error) {
        toast.info("This time slot is already booked", {
          position: "top-center",
          autoClose: 5000,
          theme: "colored"
        });
      } else if (response.data?._id) {
        localStorage.setItem("id_appointment", response.data._id);
        toast.success("Appointment booked successfully", {
          position: "top-right",
          autoClose: 5000,
          theme: "colored"
        });
        router.push("/patient_dashboard");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Appointment error:", error);
      let errorMessage = "Failed to book appointment";
      
      if (axios.isAxiosError(error)) {
        const responseMsg = error.response?.data?.message;
        errorMessage = responseMsg || "Network error. Please try again later.";
      }
      
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
        theme: "colored"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate minimum date-time (current time plus 30 minutes)
  const minDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Add 30 minutes buffer
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="container-fluid px-0" style={{ overflow: "auto" }}>
      <section className="header-page">
        <div className="container">
          <div className="row justify-content-between py-3 align-items-center">
            <div className="col-12 col-sm-3 col-lg-4 d-flex justify-content-center justify-content-lg-start py-2 py-lg-0">
              <Link href="/" passHref>
                <Image 
                  alt="Clinic Logo" 
                  src={logo} 
                  width={100}
                  height={50}
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row align-items-center">
            <div className="blog-slider mt-5">
              <div className="blog-slider__wrp swiper-wrapper">
                <div className="blog-slider__item swiper-slide">
                  <div className="blog-slider__img">
                    <Image 
                      src={logo} 
                      alt="Doctor" 
                      width={150}
                      height={150}
                    />
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="blog-slider__content">
                      <div className="blog-slider__title">
                        <h5 style={{ color: "#2ca5b8" }}>
                          Choose a time for your <b>Appointment:</b>
                        </h5>
                        {doctorInfo && (
                          <p className="mt-2">Doctor: {doctorInfo.firstName} {doctorInfo.lastName}</p>
                        )}
                      </div>

                      <input
                        type="datetime-local"
                        id="meeting-time"
                        name="meeting-time"
                        min={minDateTime()}
                        value={dateTime}
                        onChange={(e) => setDateTime(e.target.value)}
                        required
                        className="form-control mb-3"
                      />

                      <button
                        type="submit"
                        className="blog-slider__button mt-5"
                        style={{ outline: "none" }}
                        disabled={isSubmitting || !id}
                      >
                        {isSubmitting ? "Processing..." : "Confirm"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
}