import { useRouter } from "next/router";
import { useEffect, ReactElement, useState } from "react";
import { NextComponentType, NextPageContext } from "next";
import LoginMedcine from "@/pages/login_medicine";
import LoginPatient from "@/pages/login_patient";
import LoginSecretary from "@/pages/login_secretary";
import Home from "@/pages";

type AuthProps = {
  isLoggedIn?: boolean;
};

const withAuth = <P extends {}>(
  Component: NextComponentType<NextPageContext, AuthProps, P>,
  options?: { role?: "patient" | "medcine" | "secretary" } // Fixed typo here
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
        case "medcine":
          tokenKey = "tokenMedicine";
          loginKey = "LoginMedicine";
          break;
        case "secretary":
          tokenKey = "tokenSecretary";
          loginKey = "LoginSecretary";
          break;
        default: // patient
          tokenKey = "tokenPatient";
          loginKey = "LoginPatient";
      }

      const token = localStorage.getItem(tokenKey);
      const login = localStorage.getItem(loginKey);
      return !!token && !!login;
    };

    useEffect(() => {
      const authStatus = checkAuth();
      setIsAuthenticated(authStatus);
      
      if (!authStatus) {
        const redirectPath =
          options?.role === "medcine"
            ? "/login_medicine"
            : options?.role === "secretary"
            ? "/login_secretary"
            : "/login_patient";
        router.push(redirectPath);
      }
    }, [router, options?.role]); // Added dependencies

    if (isAuthenticated === null) {
      return <div>Loading...</div>; // Add a loading state
    }

    if (!isAuthenticated) {
      return options?.role === "medcine" ? (
        <LoginMedcine />
      ) : options?.role === "secretary" ? (
        <LoginSecretary />
      ) : (
        <LoginPatient />
      );
    }

    return <Component {...props} />;
  };

  if (
    "getInitialProps" in Component &&
    typeof Component.getInitialProps === "function"
  ) {
    const originalGetInitialProps = Component.getInitialProps;
    AuthComponent.getInitialProps = async (ctx: NextPageContext) => {
      const componentProps = await originalGetInitialProps(ctx);
      return { ...componentProps } as P & AuthProps;
    };
  }

  return AuthComponent;
};

export default withAuth;