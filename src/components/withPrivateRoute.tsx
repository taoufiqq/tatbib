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
"use client";

import { useRouter } from "next/router";
import { useEffect, useState, ComponentType } from "react";
import { normalizeRole, type AuthRole, getRoleTokens, ROLES } from "@/utils/roles";

interface SafeLocalStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => boolean;
  removeItem: (key: string) => boolean;
  clear: () => boolean;
}

const safeLocalStorage: SafeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return typeof window !== "undefined" ? localStorage.getItem(key) : null;
    } catch (error) {
      console.error(`Error accessing localStorage (get ${key}):`, error);
      return null;
    }
  },
  setItem: (key: string, value: string): boolean => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, value);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error accessing localStorage (set ${key}):`, error);
      return false;
    }
  },
  removeItem: (key: string): boolean => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(key);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error accessing localStorage (remove ${key}):`, error);
      return false;
    }
  },
  clear: (): boolean => {
    try {
      if (typeof window !== "undefined") {
        localStorage.clear();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error clearing localStorage:", error);
      return false;
    }
  }
};

const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>,
  options?: { role?: AuthRole }
) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const [authState, setAuthState] = useState<{
      checked: boolean;
      isValid: boolean;
    }>({ checked: false, isValid: false });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
    }, []);

    useEffect(() => {
      if (!mounted) return;

      const checkAuth = (): boolean => {
        try {
          const storedRole = safeLocalStorage.getItem("role");
          if (!storedRole) {
            console.log("No role found in localStorage");
            return false;
          }

          const normalizedRole = normalizeRole(storedRole);
          
          // Type guard to ensure normalizedRole is AuthRole
          const isAuthRole = (role: string): role is AuthRole => {
            return Object.values(ROLES).includes(role as AuthRole);
          };

          if (!isAuthRole(normalizedRole)) {
            console.log(`Invalid role: ${normalizedRole}`);
            return false;
          }

          const requiredRole = options?.role;
          if (requiredRole && normalizedRole !== requiredRole) {
            console.log(`Role mismatch: ${normalizedRole} vs ${requiredRole}`);
            return false;
          }

          const { tokenKey, loginKey } = getRoleTokens(normalizedRole);
          const token = safeLocalStorage.getItem(tokenKey);
          const login = safeLocalStorage.getItem(loginKey);

          if (!token || !login) {
            console.log("Missing token or login");
            return false;
          }

          return true;
        } catch (error) {
          console.error("Authentication check failed:", error);
          return false;
        }
      };

      const authStatus = checkAuth();
      setAuthState({ checked: true, isValid: authStatus });

      if (!authStatus && mounted) {
        console.log("Not authenticated, redirecting...");
        const redirectPath = options?.role === ROLES.MEDICINE
          ? "/login_medicine"
          : options?.role === ROLES.SECRETARY
          ? "/login_secretary"
          : "/login_patient";

        router.push(redirectPath).catch((error) => {
          console.error("Redirect failed:", error);
          window.location.href = redirectPath;
        });
      }
    }, [mounted, router, options?.role]);

    if (!mounted) return null;

    if (!authState.checked) {
      return <div className="loading-overlay">Loading...</div>;
    }

    if (!authState.isValid) {
      return <div className="redirect-message">Redirecting to login...</div>;
    }

    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;
  return AuthComponent;
};

export default withAuth;