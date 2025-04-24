// import Image from "next/image";
// import { useRouter } from "next/router";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import logo from "../../public/images/logo.png";

// export default function RendezVous() {
//   // const  { idMedcine } = useParams();
//   // const  { login } = useParams();

//   const router = useRouter();
//   const [dateTime, setDateTime] = useState("");
//   const data = router.query;

//   console.log(data);

//   useEffect(() => {
//     axios
//       .get(`https://tatbib-api.onrender.com/medcine/getMedcineById/${data.id}`)
//       .then(function (response) {
//         console.log(response.data);
//       })
//       .catch(function (err) {
//         console.log(err);
//       });
//   }, [data.id]);

//   if (typeof window !== "undefined") {
//     const idPatient = localStorage.getItem("id_patient") || "{}";

//     // ------------------------------- get information medcine's Appointment  ------------------------------
//     const handleSubmit = async (e: React.FormEvent) => {
//       e.preventDefault();
      
//       // 1. Better token handling
//       const token = localStorage.getItem("tokenPatient");
//       if (!token) {
//         router.push("/login_patient");
//         toast.warn("Please login first", { 
//           position: "top-center",
//           autoClose: 5000,
//           theme: "colored"
//         });
//         return;
//       }
    
//       // 2. Basic validation
//       if (!dateTime || !data?.id || !idPatient) {
//         toast.error("Missing required information");
//         return;
//       }
    
//       try {
//         // 3. API call with proper headers and error handling
//         const response = await axios.post(
//           "https://tatbib-api.onrender.com/appointment/addAppointment",
//           {
//             dateTime,  // Ensure this is in correct format
//             medcine: data.id,
//             patient: idPatient,
//             loginMedcine: data.login
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`
//             }
//           }
//         );
    
//         // 4. Handle response (no interface needed)
//         if (response.data?.error) {
//           toast.info("This time slot is already booked", { 
//             position: "top-center",
//             autoClose: 5000,
//             theme: "colored"
//           });
//         } else {
//           localStorage.setItem("id_appointment", response.data._id);
//           toast.success("Appointment booked successfully", {
//             position: "top-right",
//             autoClose: 5000,
//             theme: "colored"
//           });
//           router.push("/patient_dashboard");
//         }
//       } catch (error) {
//         // 5. Better error handling
//         console.error("Appointment error:", error);
        
//         let errorMessage = "Failed to book appointment";
//         if (axios.isAxiosError(error)) {
//           errorMessage = error.response?.data?.message || errorMessage;
//         }
        
//         toast.error(errorMessage, {
//           position: "top-center",
//           autoClose: 5000,
//           theme: "colored"
//         });
//       }
//     };
//     // const handleSubmit = (e: any) => {
//     //   e.preventDefault();
//     //   const token = localStorage.getItem("tokenPatient") || "{}";
//     //   if (!token) {
//     //     router.push("/login_patient");
//     //     toast.warn("you are not connected!!!!!!", {
//     //       position: "top-center",
//     //       autoClose: 5000,
//     //       hideProgressBar: false,
//     //       closeOnClick: false,
//     //       pauseOnHover: false,
//     //       draggable: false,
//     //       progress: undefined,
//     //       theme: "colored",
//     //     });
//     //     // toastr.warning('You must have an Account, Create it now')
//     //   } else {
//     //     const Appointment = {
//     //       dateTime,
//     //       medcine: data.id,
//     //       patient: idPatient,
//     //       loginMedcine: data.login,
//     //     };
//     //     console.log(Appointment);

//     //     axios
//     //       .post(
//     //         `https://tatbib-api.onrender.com/appointment/addAppointment`,
//     //         Appointment
//     //       )

//     //       .then((res) => {
//     //         console.log(res.data.error);
//     //         if (res.data.error === true) {
//     //           toast.info(
//     //             "this date has aleready reserved,Please choose another date",
//     //             {
//     //               position: "top-center",
//     //               autoClose: 5000,
//     //               hideProgressBar: false,
//     //               closeOnClick: false,
//     //               pauseOnHover: false,
//     //               draggable: false,
//     //               progress: undefined,
//     //               theme: "colored",
//     //             }
//     //           );
//     //           router.push("/appointment");
//     //         } else {
//     //           localStorage.setItem("id_appointment", res.data._id);
//     //           router.push("/patient_dashboard");
//     //           toast.success("Appointment Reserved Successfully", {
//     //             position: "top-right",
//     //             autoClose: 5000,
//     //             hideProgressBar: false,
//     //             closeOnClick: false,
//     //             pauseOnHover: false,
//     //             draggable: false,
//     //             progress: undefined,
//     //             theme: "colored",
//     //           });
//     //           console.log(res.data);
//     //         }
//     //       });
//     //   }
//     // };
//     return (
//       <div className="container-fluid px-0" style={{ overflow: "auto" }}>
//         <section className="header-page">
//           <div className="container">
//             <div className="row justify-content-between py-3 align-items-center">
//               <div className="col-12 col-sm-3 col-lg-4 d-flex justify-content-center justify-content-lg-start py-2 py-lg-0">
//                 <Link href="/">
//                   <Image alt="" src={logo} width="100" />
//                 </Link>
//               </div>
//             </div>
//           </div>

//           <div className="container">
//             <div className="row align-items-center">
//               <div className="blog-slider mt-5">
//                 <div className="blog-slider__wrp swiper-wrapper">
//                   <div className="blog-slider__item swiper-slide">
//                     <div className="blog-slider__img">
//                       <Image src={logo} alt="" />
//                     </div>
//                     <form onSubmit={handleSubmit}>
//                       <div className="blog-slider__content">
//                         <div className="blog-slider__title">
//                           <h5 style={{ color: "#2ca5b8" }}>
//                             Choose a time for your <b>Appointment :</b>
//                           </h5>
//                         </div>

//                         <input
//                           type="datetime-local"
//                           id="meeting-time"
//                           name="meeting-time"
//                           min={Date.now()}
//                           value={dateTime}
//                           onChange={(e) => setDateTime(e.target.value)}
//                         />

//                         <button
//                           type="submit"
//                           className="blog-slider__button mt-5 s"
//                           style={{ outline: "none" }}
//                         >
//                           Confirm
//                           <ToastContainer />
//                         </button>
//                       </div>
//                     </form>
//                   </div>
//                 </div>

//                 {/* <div className="blog-slider__pagination"></div> */}
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     );
//   }
// }

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
  const data = router.query;

  useEffect(() => {
    if (data.id) {
      axios
        .get(`https://tatbib-api.onrender.com/medcine/getMedcineById/${data.id}`)
        .then((response) => {
          console.log("Medcine data:", response.data);
        })
        .catch((err) => {
          console.error("Error fetching medcine:", err);
          toast.error("Failed to load doctor information");
        });
    }
  }, [data.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem("tokenPatient");
    const idPatient = localStorage.getItem("id_patient");

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

    if (!dateTime || !data.id) {
      toast.error("Please select a date and time");
      setIsSubmitting(false);
      return;
    }

    try {
      const appointmentData: AppointmentData = {
        dateTime: new Date(dateTime).toISOString(), // Convert to ISO format
        medcine: data.id as string,
        patient: idPatient,
        loginMedcine: data.login as string
      };

      const response = await axios.post(
        "https://tatbib-api.onrender.com/appointment/addAppointment",
        appointmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data?.error) {
        toast.info("This time slot is already booked", {
          position: "top-center",
          autoClose: 5000,
          theme: "colored"
        });
      } else {
        localStorage.setItem("id_appointment", response.data._id);
        toast.success("Appointment booked successfully", {
          position: "top-right",
          autoClose: 5000,
          theme: "colored"
        });
        router.push("/patient_dashboard");
      }
    } catch (error) {
      console.error("Appointment error:", error);
      let errorMessage = "Failed to book appointment";
      
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
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
                      </div>

                      <input
                        type="datetime-local"
                        id="meeting-time"
                        name="meeting-time"
                        min={new Date().toISOString().slice(0, 16)}
                        value={dateTime}
                        onChange={(e) => setDateTime(e.target.value)}
                        required
                        className="form-control mb-3"
                      />

                      <button
                        type="submit"
                        className="blog-slider__button mt-5"
                        style={{ outline: "none" }}
                        disabled={isSubmitting}
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
