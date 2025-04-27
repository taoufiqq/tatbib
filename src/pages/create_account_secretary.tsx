import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../public/images/logo.png";
import { safeLocalStorage } from "@/components/withPrivateRoute"; // Import the shared utility

export default function CreateAccountSecretary() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    login: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check both possible localStorage keys for doctor login
      const loginMedcine =
        safeLocalStorage.getItem("login_medcine") ||
        safeLocalStorage.getItem("LoginMedcine");

      console.log("Found doctor login:", loginMedcine);

      if (!loginMedcine) {
        toast.error("Doctor information not found. Please log in first.");
        throw new Error("Doctor information not found");
      }

      // Get API URL from env or use default
      const apiUrl = "https://tatbib-api.onrender.com";

      console.log("Submitting secretary creation to:", `${apiUrl}/medcine/createAccountSecretary`);
      console.log("With data:", { ...formData, loginMedcine });

      const response = await axios.post(
        `${apiUrl}/medcine/createAccountSecretary`,
        { ...formData, loginMedcine },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data);

      if (response.data.success) {
        toast.success(response.data.message || "Secretary account created successfully");
        setTimeout(() => {
          router.push("/account_secretary");
        }, 2000);
      } else {
        throw new Error(response.data.message || "Account creation failed");
      }
    } catch (error) {
      console.error("Account creation error:", error);
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to create account"
        );
      } else if (error instanceof Error) {
        toast.error(error.message || "An unexpected error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="header-page">
      <div className="container">
        <div className="row justify-content-between py-3 align-items-center">
          <div className="col-12 col-sm-3 col-lg-4 d-flex justify-content-center justify-content-lg-start py-2 py-lg-0">
            <Link href="/">
              <div style={{ width: "100px", height: "auto" }}>
                {isClient && (
                  <Image alt="Logo" src={logo} width={100} height={100} priority />
                )}
              </div>
            </Link>
          </div>
        </div>
        <div className="card EspacePatient">
          <div className="row">
            <div>
              <form className="row" onSubmit={handleSubmit}>
                <label className="form-label" style={{ marginTop: "4%" }}>
                  Create Secretary Account
                </label>
                <div className="fromloginSignUp" style={{ marginTop: "10%" }}>
                  <div className="row">
                    <div className="col-md-6">
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Full Name"
                        id="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                         className="form-control"
                        type="email"
                        placeholder="Email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Login"
                        id="login"
                        required
                        value={formData.login}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        className="form-control"
                        type="password"
                        placeholder="Password"
                        id="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="form-control mt-5 btnConnect"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating...
                    </>
                  ) : (
                    "Confirm"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </section>
  );
}


// "use client"

// import Image from "next/image"
// import { useRouter } from "next/router"
// import type React from "react"
// import { useEffect, useState } from "react"
// import Link from "next/link"
// import axios from "axios"
// import { ToastContainer, toast } from "react-toastify"
// import "react-toastify/dist/ReactToastify.css"
// import logo from "../../public/images/logo.png"
// import { safeLocalStorage } from "@/components/withPrivateRoute" // Import the shared utility

// // Define a type for the form data
// type SecretaryFormData = {
//   fullName: string;
//   email: string;
//   login: string;
//   password: string;
// }

// // Type-safe way to check if all fields are filled
// const checkRequiredFields = (data: SecretaryFormData): string[] => {
//   const missing: string[] = [];
//   if (!data.fullName) missing.push("fullName");
//   if (!data.email) missing.push("email");
//   if (!data.login) missing.push("login");
//   if (!data.password) missing.push("password");
//   return missing;
// };

// export default function CreateAccountSecretary() {
//   const router = useRouter()

//   const [formData, setFormData] = useState<SecretaryFormData>({
//     fullName: "",
//     email: "",
//     login: "",
//     password: "",
//   })
//   const [loading, setLoading] = useState(false)
//   const [isClient, setIsClient] = useState(false)
//   const [apiError, setApiError] = useState<string | null>(null)

//   useEffect(() => {
//     setIsClient(true)
//   }, [])

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { id, value } = e.target
//     setFormData((prev) => ({ ...prev, [id]: value }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setApiError(null)

//     try {
//       // Check both possible localStorage keys for doctor login
//       const loginMedcine = safeLocalStorage.getItem("login_medcine") || safeLocalStorage.getItem("LoginMedcine")

//       console.log("Found doctor login:", loginMedcine)

//       if (!loginMedcine) {
//         toast.error("Doctor information not found. Please log in first.")
//         throw new Error("Doctor information not found")
//       }

//       // Validate required fields using our type-safe function
//       const missingFields = checkRequiredFields(formData);
      
//       if (missingFields.length > 0) {
//         toast.error(`Please fill in all required fields: ${missingFields.join(", ")}`)
//         throw new Error("Missing required fields")
//       }

//       // Prepare the data to send - exactly matching what the backend expects
//       const requestData = {
//         endpoint: "/medcine/createAccountSecretary",
//         data: {
//           loginMedcine,
//           fullName: formData.fullName,
//           email: formData.email,
//           login: formData.login,
//           password: formData.password,
//         },
//       }

//       console.log("Submitting secretary creation via proxy")
//       console.log("With data:", requestData.data)

//       // Configure request with retry and better error handling
//       const axiosConfig = {
//         headers: {
//           "Content-Type": "application/json",
//         },
//         timeout: 60000, // Longer timeout
//       };

//       // Make the request through our proxy with improved error handling
//       toast.info("Creating account...", { autoClose: false, toastId: "creating" });
      
//       const response = await axios.post("/api/proxy", requestData, axiosConfig);
      
//       console.log("Response:", response.data);
//       toast.dismiss("creating");

//       if (response.data.success) {
//         toast.success(response.data.message || "Secretary account created successfully");
//         setTimeout(() => {
//           router.push("/account_secretary");
//         }, 2000);
//       } else {
//         // Handle "success: false" case from the API
//         throw new Error(response.data.message || "Account creation failed");
//       }
//     } catch (error) {
//       toast.dismiss("creating");
//       console.error("Account creation error:", error);

//       // Attempt direct API call if proxy fails
//       try {
//         if (axios.isAxiosError(error) && (error.code === "ECONNABORTED" || error.response?.status === 502)) {
//           const loginMedcine = safeLocalStorage.getItem("login_medcine") || safeLocalStorage.getItem("LoginMedcine");
          
//           console.log("Proxy request failed. Attempting direct API call as fallback...");
//           toast.info("Retrying with direct connection...", { autoClose: 3000 });
          
//           // Get API URL from env or use default
//           const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://tatbib-api.onrender.com";
          
//           // Make direct request to API
//           const directResponse = await axios.post(
//             `${apiUrl}/medcine/createAccountSecretary`,
//             {
//               loginMedcine,
//               fullName: formData.fullName,
//               email: formData.email,
//               login: formData.login,
//               password: formData.password,
//             },
//             {
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               timeout: 60000,
//             }
//           );
          
//           console.log("Direct API response:", directResponse.data);
          
//           if (directResponse.data.success) {
//             toast.success(directResponse.data.message || "Secretary account created successfully");
//             setTimeout(() => {
//               router.push("/account_secretary");
//             }, 2000);
//             return; // Exit the function if successful
//           }
//         }
//       } catch (directError) {
//         console.error("Direct API call also failed:", directError);
//         // Continue to the normal error handling below
//       }

//       // Standard error handling
//       if (axios.isAxiosError(error)) {
//         console.log("Status:", error.response?.status);
//         console.log("Response data:", error.response?.data);
        
//         const errorMessage =
//           error.response?.data?.message || 
//           error.response?.data?.error || 
//           error.message || 
//           "Failed to create account";
        
//         setApiError(errorMessage);
//         toast.error(errorMessage);
//       } else if (error instanceof Error) {
//         setApiError(error.message);
//         toast.error(error.message || "An unexpected error occurred");
//       } else {
//         setApiError("Unknown error");
//         toast.error("An unexpected error occurred");
//       }
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <section className="header-page">
//       <div className="container">
//         <div className="row justify-content-between py-3 align-items-center">
//           <div className="col-12 col-sm-3 col-lg-4 d-flex justify-content-center justify-content-lg-start py-2 py-lg-0">
//             <Link href="/">
//               <div style={{ width: "100px", height: "auto" }}>
//                 {isClient && <Image alt="Logo" src={logo || "/placeholder.svg"} width={100} height={100} priority />}
//               </div>
//             </Link>
//           </div>
//         </div>
//         <div className="card EspacePatient">
//           <div className="row">
//             <div>
//               <form className="row" onSubmit={handleSubmit}>
//                 <label className="form-label" style={{ marginTop: "4%" }}>
//                   Create Secretary Account
//                 </label>
                
//                 {apiError && (
//                   <div className="alert alert-danger mt-3" role="alert">
//                     Error: {apiError}
//                     <br />
//                     <small>Please try again or contact support if this persists.</small>
//                   </div>
//                 )}
                
//                 <div className="fromloginSignUp" style={{ marginTop: "10%" }}>
//                   <div className="row">
//                     <div className="col-md-6">
//                       <input
//                         className="form-control"
//                         type="text"
//                         placeholder="Full Name"
//                         id="fullName"
//                         required
//                         value={formData.fullName}
//                         onChange={handleChange}
//                       />
//                     </div>
//                     <div className="col-md-6">
//                       <input
//                         className="form-control"
//                         type="email"
//                         placeholder="Email"
//                         id="email"
//                         required
//                         value={formData.email}
//                         onChange={handleChange}
//                       />
//                     </div>
//                   </div>
//                   <div className="row">
//                     <div className="col-md-6">
//                       <input
//                         className="form-control"
//                         type="text"
//                         placeholder="Login"
//                         id="login"
//                         required
//                         value={formData.login}
//                         onChange={handleChange}
//                       />
//                     </div>
//                     <div className="col-md-6">
//                       <input
//                         className="form-control"
//                         type="password"
//                         placeholder="Password"
//                         id="password"
//                         required
//                         value={formData.password}
//                         onChange={handleChange}
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 <button type="submit" className="form-control mt-3 btnConnect" disabled={loading}>
//                   {loading ? (
//                     <>
//                       <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                       Creating...
//                     </>
//                   ) : (
//                     "Confirm"
//                   )}
//                 </button>
                
//                 {loading && (
//                   <p className="text-center text-muted mt-2">
//                     <small>Please wait, this may take a moment...</small>
//                   </p>
//                 )}
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         closeOnClick
//         pauseOnHover
//         draggable
//       />
//     </section>
//   )
// }