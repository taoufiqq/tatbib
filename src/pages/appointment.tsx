import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../public/images/logo.png";
import withAuth from "@/components/withPrivateRoute";
import { ROLES, getRoleTokens } from "@/utils/roles";

interface AppointmentData {
  dateTime: string;
  medcine: string;
  patient: string;
  loginMedcine?: string;
}

interface MedecinData {
  _id: string;
  firstName: string;
  lastName: string;
  // Add other doctor properties as needed
}

const RendezVous = () => {
  const router = useRouter();
  const [dateTime, setDateTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState<MedecinData | null>(null);
  const { id, login } = router.query;

  // Get role-specific tokens
  const { tokenKey, idKey } = getRoleTokens(ROLES.PATIENT);

  useEffect(() => {
    console.log("Authentication Status Check:", {
      token: localStorage.getItem(tokenKey),
      role: localStorage.getItem("role"),
      patientId: localStorage.getItem(idKey)
    });

    if (id) fetchDoctorInfo();
  }, [id]);

  const fetchDoctorInfo = async () => {
    try {
      const token = localStorage.getItem(tokenKey);
      if (!token) throw new Error("No authentication token found");

      const response = await axios.get<MedecinData>(
        `https://tatbib-api.onrender.com/medcine/getMedcineById/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setDoctorInfo(response.data);
    } catch (err: unknown) {
      console.error("Error fetching medcine:", err);
      let errorMessage = "Failed to load doctor information";
      
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          handleLogout();
          return;
        }
        errorMessage = err.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Client-side check
      if (typeof window === 'undefined') return;

      const token = localStorage.getItem(tokenKey);
      const patientId = localStorage.getItem(idKey);

      // Validate credentials
      if (!token || !patientId) {
        toast.warn("Please login first", { position: "top-center" });
        router.push("/login_patient");
        return;
      }

      if (!dateTime || !id) {
        toast.error("Missing required information");
        return;
      }

      const appointmentData: AppointmentData = {
        dateTime: new Date(dateTime).toISOString(),
        medcine: id as string,
        patient: patientId,
        loginMedcine: login as string
      };

      const response = await axios.post(
        "https://tatbib-api.onrender.com/appointment/addAppointment",
        appointmentData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      handleApiResponse(response.data);
    } catch (err: unknown) {
      handleSubmissionError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApiResponse = (data: any) => {
    if (data.error) {
      toast.info("This time slot is already booked", { position: "top-center" });
    } else if (data._id) {
      localStorage.setItem("id_appointment", data._id);
      toast.success("Appointment booked successfully");
      router.push("/patient_dashboard");
    } else {
      throw new Error("Invalid response from server");
    }
  };

  const handleSubmissionError = (err: unknown) => {
    console.error("Appointment error:", err);
    let errorMessage = "Failed to book appointment";

    if (axios.isAxiosError(err)) {
      errorMessage = err.response?.data?.message || "Network error";
      if (err.response?.status === 401) handleLogout();
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }

    toast.error(errorMessage, { position: "top-center" });
  };

  const handleLogout = () => {
    const patientItems = [tokenKey, idKey, "role"];
    patientItems.forEach(item => localStorage.removeItem(item));
    router.push("/login_patient");
  };

  const minDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
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
};

export default withAuth(RendezVous, { role: ROLES.PATIENT });