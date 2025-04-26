// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import { normalizeRole, ROLES, AuthRole, getRoleTokens } from "@/utils/roles";

// const withAuth = <P extends object>(
//   WrappedComponent: React.ComponentType<P>,
//   options?: { role?: AuthRole } // Now using the value type ("medicine" | "secretary" | "patient")
// ) => {
//   const AuthComponent = (props: P) => {
//     const router = useRouter();
//     const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

//     const checkAuth = () => {
//       if (typeof window === "undefined") return false;

//       const storedRole = normalizeRole(localStorage.getItem("role") || "");
//       const requiredRole = options?.role;
//       const { tokenKey, loginKey, idKey } = getRoleTokens(storedRole as AuthRole);

//       console.log("Auth Check - localStorage:", {
//         role: storedRole,
//         token: localStorage.getItem(tokenKey),
//         login: localStorage.getItem(loginKey),
//         id: localStorage.getItem(idKey)
//       });

//       if (requiredRole && storedRole !== requiredRole) {
//         console.log(`Role mismatch: stored ${storedRole}, required ${requiredRole}`);
//         return false;
//       }

//       const token = localStorage.getItem(tokenKey);
//       const login = localStorage.getItem(loginKey);

//       if (!token || !login) {
//         console.log("Missing token or login");
//         return false;
//       }

//       return true;
//     };

//     useEffect(() => {
//       const authStatus = checkAuth();
//       setIsAuthenticated(authStatus);

//       if (!authStatus) {
//         console.log("Not authenticated, redirecting...");
//         const redirectPath = options?.role === "medicine" ? "/login_medicine" :
//                           options?.role === "secretary" ? "/login_secretary" :
//                           "/login_patient";
//         router.push(redirectPath);
//       }
//     }, [router, options?.role]);

//     if (isAuthenticated === null) {
//       return <div>Loading...</div>;
//     }

//     if (!isAuthenticated) {
//       return null;
//     }

//     return <WrappedComponent {...props} />;
//   };

//   AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
//   return AuthComponent;
// };

// export default withAuth;
"use client"

import type React from "react"

import { useRouter } from "next/router" // Using Pages Router navigation
import { useEffect, useState } from "react"
import { normalizeRole, type AuthRole, getRoleTokens, ROLES } from "@/utils/roles"

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

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>, options?: { role?: AuthRole }) => {
  const AuthComponent = (props: P) => {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
      // Mark that we're on the client
      setIsClient(true)

      const checkAuth = () => {
        if (typeof window === "undefined") return false

        try {
          const storedRole = safeLocalStorage.getItem("role")

          if (!storedRole) {
            console.log("No role found in localStorage")
            return false
          }

          const normalizedStoredRole = normalizeRole(storedRole)
          const requiredRole = options?.role

          // Get the correct token keys based on the stored role
          let tokenKey, loginKey

          try {
            const keys = getRoleTokens(normalizedStoredRole as AuthRole)
            tokenKey = keys.tokenKey
            loginKey = keys.loginKey
          } catch (error) {
            console.error("Error getting role tokens:", error)
            return false
          }

          console.log("Auth Check - localStorage:", {
            role: normalizedStoredRole,
            token: safeLocalStorage.getItem(tokenKey),
            login: safeLocalStorage.getItem(loginKey),
          })

          // Check if the stored role matches the required role (if specified)
          if (requiredRole && normalizedStoredRole !== requiredRole) {
            console.log(`Role mismatch: stored ${normalizedStoredRole}, required ${requiredRole}`)
            return false
          }

          const token = safeLocalStorage.getItem(tokenKey)
          const login = safeLocalStorage.getItem(loginKey)

          if (!token || !login) {
            console.log("Missing token or login")
            return false
          }

          return true
        } catch (error) {
          console.error("Error in checkAuth:", error)
          return false
        }
      }

      const authStatus = checkAuth()
      setIsAuthenticated(authStatus)

      if (!authStatus) {
        console.log("Not authenticated, redirecting...")

        try {
          const redirectPath =
            options?.role === ROLES.MEDICINE
              ? "/login_medicine"
              : options?.role === ROLES.SECRETARY
                ? "/login_secretary"
                : "/login_patient"

          // Use window.location for more reliable redirects
          window.location.href = redirectPath
        } catch (error) {
          console.error("Error during redirect:", error)
          // Fallback to router.push if window.location fails
          router.push("/login_secretary")
        }
      }
    }, [router])

    // Don't render anything until we've checked authentication on the client
    if (!isClient) {
      return <div>Loading...</div>
    }

    if (isAuthenticated === null) {
      return <div>Verifying authentication...</div>
    }

    if (!isAuthenticated) {
      return <div>Redirecting to login...</div>
    }

    return <WrappedComponent {...props} />
  }

  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`
  return AuthComponent
}

export default withAuth
