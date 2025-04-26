// import Image from "next/image";
// import { useRouter } from "next/router";
// import React, { useState } from "react";
// import Link from "next/link";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import logo from "../../public/images/logo.png";
// import Imglogin from "../../public/images/Login2.svg";
// import { normalizeRole, ROLES, getRoleTokens } from "@/utils/roles";

// export default function LoginSecretary() {
//   const router = useRouter();
//   const [login, setLogin] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       console.log("Attempting secretary login...");
//       const response = await axios.post(
//         `https://tatbib-api.onrender.com/secretary/login`,
//         { login, password }
//       );

//       console.log("API Response:", response.data);

//       if (response.data.message) {
//         throw new Error(response.data.message);
//       }

//       const { status, tokenSecretary, roleSecretary, id, loginMedcine } = response.data;
//       console.log("Raw response role:", roleSecretary);

//       // Make sure we have a role string to normalize (add fallback)
//       const roleToNormalize = roleSecretary || "secretary"; // Default to secretary if missing
//       const normalizedRole = normalizeRole(roleToNormalize);
//       console.log("After normalization:", normalizedRole);
//       console.log("Expected role:", ROLES.SECRETARY);
//       if (normalizedRole && normalizedRole !== ROLES.SECRETARY) {
//         throw new Error(`Invalid role ${normalizedRole} for secretary login`);
//       }

//       // Handle account status
//       if (status === "InActive") {
//         toast.warn("Your account is not active yet. Please wait for activation.", {
//           position: "top-right",
//           autoClose: 5000,
//           theme: "colored",
//         });
//         setIsLoading(false);
//         return;
//       }

//       if (status === "Block") {
//         toast.error("This account is blocked.", {
//           position: "top-right",
//           autoClose: 5000,
//           theme: "colored",
//         });
//         setIsLoading(false);
//         return;
//       }

//       // Get the correct storage keys from our utility function
//       const { tokenKey, loginKey, idKey } = getRoleTokens(ROLES.SECRETARY);

//       // Store all auth data using the keys from our utility function
//       localStorage.setItem(tokenKey, tokenSecretary);
//       localStorage.setItem(loginKey, login);
//       localStorage.setItem("role", normalizedRole); // Store normalized role
//       localStorage.setItem(idKey, id || ""); // Make sure id is stored even if undefined
//       localStorage.setItem("login_medcine", loginMedcine || ""); // Store associated doctor

//       // Verify storage immediately for debugging
//       console.log("Stored Auth Data:", {
//         token: localStorage.getItem(tokenKey),
//         role: localStorage.getItem("role"),
//         login: localStorage.getItem(loginKey),
//         id: localStorage.getItem(idKey),
//         loginMedcine: localStorage.getItem("login_medcine")
//       });

//       toast.success("Authenticated successfully", {
//         position: "top-right",
//         autoClose: 3000,
//         theme: "colored",
//       });

//       // Force redirect to secretary dashboard
//       router.push("/secretary_dashboard");

//     } catch (error: unknown) {
//       console.error("Login Error:", error);
//       let errorMessage = "Login failed. Please try again.";
      
//       if (axios.isAxiosError(error)) {
//         errorMessage = error.response?.data?.message || error.message;
//       } else if (error instanceof Error) {
//         errorMessage = error.message;
//       }

//       toast.error(errorMessage, {
//         position: "top-right",
//         autoClose: 5000,
//         theme: "colored",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <section className="header-page">
//       <div className="container">
//         <div className="row justify-content-between py-3 align-items-center">
//           <div className="col-12 col-sm-3 col-lg-4 d-flex justify-content-center justify-content-lg-start py-2 py-lg-0">
//             <Link href="/">
//               <Image alt="Logo" src={logo} width="100" priority />
//             </Link>
//           </div>
//           <div className="col-12 col-sm-9 col-lg-6 col-xl-4">
//             <div className="row justify-content-center">
//               <div className="col-6 col-md-4 col-lg-5 col-xl-6 d-flex justify-content-end">
//                 <Link
//                   className="btn_Espace_Professionnels"
//                   href="/professional_space"
//                 >
//                   <i className="fas fa-user-injured"></i> Professional Spaces
//                 </Link>
//               </div>
//               <div className="col-6 col-md-4 col-lg-5 d-flex justify-content-center">
//                 <Link className="btn_Espace_Patients" href="/patient_space">
//                   <i className="fas fa-user-injured"></i> Patient Spaces
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="card EspacePatient">
//           <div className="row">
//             <div className="col-12 col-md-12 col-lg-6" style={{ marginTop: "4%" }}>
//               <form className="row" onSubmit={handleSubmit}>
//                 <label className="form-label">Login as a Secretary</label>
//                 <div className="fromlogin">
//                   <input
//                     type="text"
//                     placeholder="Login"
//                     className="form-control"
//                     required
//                     value={login}
//                     onChange={(e) => setLogin(e.target.value)}
//                     disabled={isLoading}
//                   />

//                   <input
//                     type="password"
//                     placeholder="Password"
//                     className="form-control"
//                     required
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     disabled={isLoading}
//                   />

//                   <button
//                     type="submit"
//                     className="form-control mt-5 btnConnect"
//                     disabled={isLoading}
//                   >
//                     {isLoading ? (
//                       <>
//                         <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                         Logging in...
//                       </>
//                     ) : (
//                       "Log in"
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//             <div className="col-12 col-md-12 col-lg-6">
//               <Image
//                 alt="Login Illustration"
//                 src={Imglogin}
//                 style={{ width: "70%", marginLeft: "60px" }}
//                 className="imgLogin"
//                 priority
//               />
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
//   );
// }
"use client"

import Image from "next/image"
import { useRouter } from "next/router"
import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { normalizeRole, ROLES, getRoleTokens } from "@/utils/roles"

// Safely access localStorage with error handling
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return typeof window !== "undefined" ? localStorage.getItem(key) : null
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error)
      return null
    }
  },
  setItem: (key: string, value: string): boolean => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, value)
        return true
      }
      return false
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error)
      return false
    }
  },
  removeItem: (key: string): boolean => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(key)
        return true
      }
      return false
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error)
      return false
    }
  },
  clear: (): boolean => {
    try {
      if (typeof window !== "undefined") {
        localStorage.clear()
        return true
      }
      return false
    } catch (error) {
      console.error(`Error clearing localStorage:`, error)
      return false
    }
  },
}

export default function LoginSecretary() {
  const router = useRouter()
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Only run client-side code after component mounts
  useEffect(() => {
    setIsClient(true)

    // Check if already logged in as secretary
    const checkExistingAuth = () => {
      try {
        const storedRole = safeLocalStorage.getItem("role")
        if (storedRole === ROLES.SECRETARY) {
          const { tokenKey } = getRoleTokens(ROLES.SECRETARY)
          const token = safeLocalStorage.getItem(tokenKey)

          if (token) {
            console.log("Already logged in as secretary, redirecting to dashboard")
            // Use setTimeout to ensure this runs after component is fully mounted
            setTimeout(() => {
              window.location.href = "/secretary_dashboard"
            }, 100)
          }
        }
      } catch (error) {
        console.error("Error checking existing auth:", error)
        // Clear potentially corrupted auth data
        safeLocalStorage.clear()
      }
    }

    checkExistingAuth()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isClient) {
      toast.error("Application is still initializing. Please try again.")
      return
    }

    setIsLoading(true)

    try {
      // Clear any existing auth data to prevent conflicts
      safeLocalStorage.clear()

      console.log("Attempting secretary login...")
      const response = await axios.post(
        `https://tatbib-api.onrender.com/secretary/login`,
        { login, password },
        {
          // Add timeout to prevent hanging requests
          timeout: 15000,
        },
      )

      console.log("API Response:", response.data)

      if (!response.data || response.data.message) {
        throw new Error(response.data?.message || "Invalid response from server")
      }

      const { status, tokenSecretary, roleSecretary, id, loginMedcine } = response.data

      // Validate required fields
      if (!tokenSecretary) {
        throw new Error("Authentication token missing from response")
      }

      console.log("Raw response role:", roleSecretary)

      // Make sure we have a role string to normalize (add fallback)
      const roleToNormalize = roleSecretary || "secretary" // Default to secretary if missing
      const normalizedRole = normalizeRole(roleToNormalize)
      console.log("After normalization:", normalizedRole)

      // Handle account status
      if (status === "InActive") {
        toast.warn("Your account is not active yet. Please wait for activation.", {
          position: "top-right",
          autoClose: 5000,
          theme: "colored",
        })
        setIsLoading(false)
        return
      }

      if (status === "Block") {
        toast.error("This account is blocked.", {
          position: "top-right",
          autoClose: 5000,
          theme: "colored",
        })
        setIsLoading(false)
        return
      }

      // Get the correct storage keys from our utility function
      const { tokenKey, loginKey, idKey } = getRoleTokens(ROLES.SECRETARY)

      // Store all auth data using the keys from our utility function
      const storageSuccess = [
        safeLocalStorage.setItem(tokenKey, tokenSecretary),
        safeLocalStorage.setItem(loginKey, login),
        safeLocalStorage.setItem("role", ROLES.SECRETARY), // Always use the constant, not the normalized value
        safeLocalStorage.setItem(idKey, id || ""), // Make sure id is stored even if undefined
        loginMedcine ? safeLocalStorage.setItem("login_medcine", loginMedcine) : true,
      ].every(Boolean)

      if (!storageSuccess) {
        throw new Error("Failed to store authentication data")
      }

      // Verify storage immediately for debugging
      console.log("Stored Auth Data:", {
        token: safeLocalStorage.getItem(tokenKey),
        role: safeLocalStorage.getItem("role"),
        login: safeLocalStorage.getItem(loginKey),
        id: safeLocalStorage.getItem(idKey),
        loginMedcine: safeLocalStorage.getItem("login_medcine"),
      })

      toast.success("Authenticated successfully", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      })

      // Add a small delay to ensure localStorage is updated and toast is shown
      setTimeout(() => {
        try {
          // Force redirect to secretary dashboard
          window.location.href = "/secretary_dashboard"
        } catch (error) {
          console.error("Navigation error:", error)
          // If navigation fails, provide a link
          toast.info("Click here to continue to dashboard", {
            position: "top-right",
            autoClose: false,
            onClick: () => (window.location.href = "/secretary_dashboard"),
            theme: "colored",
          })
        }
      }, 2000)
    } catch (error: unknown) {
      console.error("Login Error:", error)
      let errorMessage = "Login failed. Please try again."

      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          errorMessage = "Connection timeout. Please check your internet connection."
        } else if (error.response) {
          errorMessage = error.response.data?.message || `Server error: ${error.response.status}`
        } else if (error.request) {
          errorMessage = "No response from server. Please try again later."
        }
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="header-page">
      <div className="container">
        <div className="row justify-content-between py-3 align-items-center">
          <div className="col-12 col-sm-3 col-lg-4 d-flex justify-content-center justify-content-lg-start py-2 py-lg-0">
            <Link href="/">
              <div style={{ width: "100px", height: "auto" }}>
                {/* Use a placeholder if logo is undefined */}
                {isClient && <Image alt="Logo" src="/placeholder.svg" width={100} height={100} priority />}
              </div>
            </Link>
          </div>
          <div className="col-12 col-sm-9 col-lg-6 col-xl-4">
            <div className="row justify-content-center">
              <div className="col-6 col-md-4 col-lg-5 col-xl-6 d-flex justify-content-end">
                <Link className="btn_Espace_Professionnels" href="/professional_space">
                  <i className="fas fa-user-injured"></i> Professional Spaces
                </Link>
              </div>
              <div className="col-6 col-md-4 col-lg-5 d-flex justify-content-center">
                <Link className="btn_Espace_Patients" href="/patient_space">
                  <i className="fas fa-user-injured"></i> Patient Spaces
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="card EspacePatient">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-6" style={{ marginTop: "4%" }}>
              <form className="row" onSubmit={handleSubmit}>
                <label className="form-label">Login as a Secretary</label>
                <div className="fromlogin">
                  <input
                    type="text"
                    placeholder="Login"
                    className="form-control"
                    required
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    disabled={isLoading}
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    className="form-control"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />

                  <button type="submit" className="form-control mt-5 btnConnect" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Logging in...
                      </>
                    ) : (
                      "Log in"
                    )}
                  </button>
                </div>
              </form>
            </div>
            <div className="col-12 col-md-12 col-lg-6">
              {isClient && (
                <div style={{ width: "70%", marginLeft: "60px" }}>
                  <Image
                    alt="Login Illustration"
                    src="/placeholder.svg"
                    width={300}
                    height={300}
                    className="imgLogin"
                    priority
                  />
                </div>
              )}
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
  )
}
