import { useRouter } from "next/router";
import { useEffect, ReactElement, useState } from "react";
import { NextComponentType, NextPageContext } from "next";
import LoginMedcine from "@/pages/login_medicine";
import LoginPatient from "@/pages/login_patient";
import LoginSecretary from "@/pages/login_secretary";
import { AuthRole, normalizeRole, ROLES } from "@/utils/roles";

type AuthProps = {
  isLoggedIn?: boolean;
};

const withAuth = <P extends {}>(
  Component: NextComponentType<NextPageContext, AuthProps, P>,
  options?: { role?: AuthRole }
) => {
  const AuthComponent: NextComponentType<
    NextPageContext,
    AuthProps,
    P & AuthProps
  > = (props: P & AuthProps): ReactElement | null => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    const checkAuth = () => {
      if (typeof window === "undefined") return false;

      let tokenKey, loginKey;
      
      switch(options?.role) {
        case ROLES.MEDICINE:
          tokenKey = "tokenMedicine";
          loginKey = "LoginMedicine";
          break;
        case ROLES.SECRETARY:
          tokenKey = "tokenSecretary";
          loginKey = "LoginSecretary";
          break;
        case ROLES.PATIENT:
          tokenKey = "tokenPatient";
          loginKey = "LoginPatient";
          break;
        default:
          return false;
      }

      const token = localStorage.getItem(tokenKey);
      const login = localStorage.getItem(loginKey);
      const role = normalizeRole(localStorage.getItem("role") || "");

      console.log("Auth Check:", { token, login, role, expected: options?.role });

      return !!token && !!login && role === options?.role;
    };

    useEffect(() => {
      const authStatus = checkAuth();
      setIsAuthenticated(authStatus);
      
      if (!authStatus) {
        const redirectPath =
          options?.role === ROLES.MEDICINE
            ? "/login_medicine"
            : options?.role === ROLES.SECRETARY
            ? "/login_secretary"
            : "/login_patient";
        console.log("Redirecting to:", redirectPath);
        router.push(redirectPath);
      }
    }, [router, options?.role]);

    if (isAuthenticated === null) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return options?.role === ROLES.MEDICINE ? (
        <LoginMedcine />
      ) : options?.role === ROLES.SECRETARY ? (
        <LoginSecretary />
      ) : (
        <LoginPatient />
      );
    }

    return <Component {...props} />;
  };

  // ... (keep rest of the HOC implementation)
  return AuthComponent;
};

export default withAuth;