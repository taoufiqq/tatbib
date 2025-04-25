import { useRouter } from "next/router";
import { useEffect, ReactElement } from "react";
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
  options?: { role?: "patient" | "medcine" | "secretary" }
) => {
  const AuthComponent: NextComponentType<
    NextPageContext,
    AuthProps,
    P & AuthProps
  > = (props: P & AuthProps): ReactElement | null => {
    const router = useRouter();

    const checkAuth = () => {
      if (typeof window === "undefined") return false;

      if (options?.role === "medcine") {
        const token = localStorage.getItem("tokenMedicine");
        const login = localStorage.getItem("LoginMedicine");
        return !!token && !!login;
      } else if (options?.role === "secretary") {
        const token = localStorage.getItem("tokenSecretary");
        const login = localStorage.getItem("LoginSecretary");
        return !!token && !!login;
      } else {
        const token = localStorage.getItem("tokenPatient");
        const login = localStorage.getItem("LoginPatient");
        return !!token && !!login;
      }
    };

    useEffect(() => {
      if (!checkAuth()) {
        const redirectPath =
          options?.role === "medcine"
            ? "/login_medicine"
            : options?.role === "secretary"
            ? "/login_secretary"
            : "/login_patient";
        router.push(redirectPath);
      }
    }, []);

    if (!checkAuth()) {
      return options?.role === "medcine" ? (
        <LoginMedcine />
      ) : options?.role === "secretary" ? (
        <LoginSecretary />
      ) : (
        <Home />
      );
    }

    return <Component {...props} />;
  };

  // Type-safe handling of getInitialProps
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
