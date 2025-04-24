// import Image from "next/image";
// import { useRouter } from "next/router";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import axios from "axios";
// import logo from "../../public/images/logo.png";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function SearchMedcine() {
//   // const medecin = localStorage.getItem('medecin');
//   // this.medecin = medecinJson !== null ? JSON.parse(medecinJson) ;

//   // const [medcine, setMedcine] = useState<Medc[] | null>(null);
//   const router = useRouter();
//   if (typeof window !== "undefined") {
//     // Perform localStorage action
//     const medecin = JSON.parse(localStorage.getItem("medcine") || "[]");

//     console.log("medciiiiiiiiiiiiiiiiiiiiiin", medecin);

//     const token = localStorage.getItem("tokenPatient") || "";
//     if (!medecin || !Array.isArray(medecin)) {
//       return <div>No medecins available</div>;
//     }

//     // const takeAppointment =()=>{
//     //        if(!token){
//     //         router.push('/login_patient');
//     //         toast.warn('you are not connected!!!!!!', { position: "top-center",
//     //         autoClose: 5000,
//     //         hideProgressBar: false,
//     //         closeOnClick: false,
//     //         pauseOnHover: false,
//     //         draggable: false,
//     //         progress: undefined,
//     //         theme: "colored", })
//     //        }
//     //       //  else{
//     //       //   router.push('/appointment');
//     //       //   // localStorage.setItem("LoginMedcine", medecin.login);
//     //       //   // {`/appointment/${item._id}/${item.login}`}
//     //       //  }

//     //   }

//     console.log(medecin);

//     const listMedcines = medecin.map((item: any, index: number) => (
//       <div className="blog-slider mt-5" key={index}>
//         <div className="blog-slider__wrp swiper-wrapper">
//           <div className="blog-slider__item swiper-slide">
//             <div className="blog-slider__img">
//               <Image src={logo} alt="" />
//             </div>
//             <div className="blog-slider__content">
//               <div className="blog-slider__title">
//                 <h4>{item.fullName}</h4>
//               </div>
//               <span className="blog-slider__code">{item.speciality}</span>
//               <div className="blog-slider__code">{item.city}</div>
//               <div
//                 className="blog-slider__title"
//                 style={{
//                   color: item.availablity !== "NotAvailable" ? "color" : "red",
//                 }}
//               >
//                 {item.availablity}
//               </div>
//               <Link
//                 href={{
//                   pathname: "/appointment",
//                   query: {
//                     id: item._id,
//                     login: item.login,
//                   }, // the data
//                 }}
//                 className="blog-slider__button"
//                 style={{
//                   visibility:
//                     item.availablity !== "NotAvailable" ? "visible" : "hidden",
//                 }}
//               >
//                 Take Appointment
//               </Link>
//               <Link
//                 href=""
//                 className="blog-slider__button"
//                 style={{
//                   visibility:
//                     item.availablity !== "NotAvailable" ? "visible" : "hidden",
//                 }}
//               >
//                 teleConsiel
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* <div className="blog-slider__pagination"></div> */}
//       </div>
//     ));

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
//             <div className="row align-items-center">{listMedcines}</div>
//           </div>
//         </section>
//       </div>
//     );
//   }
// }
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/images/logo.png";
import { Medicine } from "@/types";

export default function SearchMedicine() { // Fixed typo in component name (Medcine -> Medicine)
  const router = useRouter();
  const [medicine, setMedicine] = useState<Medicine[]>([]); // Explicitly type the state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Also typed 
  useEffect(() => {
    try {
      const medicineData = localStorage.getItem("medcine"); // Note: Inconsistent spelling (medcine vs medicine)
      if (medicineData) {
        const parsedMedicine = JSON.parse(medicineData);
        if (Array.isArray(parsedMedicine)) {
          setMedicine(parsedMedicine);
        } else {
          setError("Invalid medicine data format.");
        }
      } else {
        setError("No medicines available.");
      }
    } catch (error) {
      console.error("Error parsing medicine data:", error);
      setError("Error loading medicine data.");
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!medicine || medicine.length === 0) {
    return <div>No medicines found.</div>;
  }

  const listMedicines = medicine.map((item, index) => (
    <div className="blog-slider mt-5" key={item._id || index}> {/* Prefer using item._id if available */}
      <div className="blog-slider__wrp swiper-wrapper">
        <div className="blog-slider__item swiper-slide">
          <div className="blog-slider__img">
            <Image 
              src={logo} 
              alt={`${item.fullName || 'Doctor'} profile`} // Better alt text
              width={100} // Added explicit width/height for Next.js Image
              height={100}
            />
          </div>
          <div className="blog-slider__content">
            <div className="blog-slider__title">
              <h4>{item.fullName || "Unknown Doctor"}</h4> {/* Fallback for missing data */}
            </div>
            <span className="blog-slider__code">{item.speciality || "General"}</span>
            <div className="blog-slider__code">{item.city || "Unknown location"}</div>
            <div
              className="blog-slider__title"
              style={{
                color: item.availablity !== "NotAvailable" ? "green" : "red",
              }}
            >
              {item.availablity || "Availability unknown"}
            </div>
            {item.availablity !== "NotAvailable" && (
              <>
                <Link
                  href={{
                    pathname: "/appointment",
                    query: {
                      id: item._id,
                      login: item.login,
                    },
                  }}
                  className="blog-slider__button"
                  passHref // Recommended for Next.js Link
                >
                  Take Appointment
                </Link>
                <Link 
                  href="#" 
                  className="blog-slider__button"
                  passHref
                  onClick={(e) => e.preventDefault()} // Prevent default for empty link
                >
                  TeleConsultation {/* Fixed typo in "TeleConsiel" */}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="container-fluid px-0" style={{ overflow: "auto" }}>
      <section className="header-page">
        <div className="container">
          <div className="row justify-content-between py-3 align-items-center">
            <div className="col-12 col-sm-3 col-lg-4 d-flex justify-content-center justify-content-lg-start py-2 py-lg-0">
              <Link href="/" passHref>
                <Image 
                  alt="Website logo" 
                  src={logo} 
                  width={100}
                  height={50} // Added height for proper aspect ratio
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row align-items-center">
            {listMedicines.length > 0 ? listMedicines : <div>No medicines available</div>}
          </div>
        </div>
      </section>
    </div>
  );
}