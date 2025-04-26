import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { normalizeRole, ROLES, AuthRole, getRoleTokens } from "@/utils/roles";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: { role?: AuthRole } // Now using the value type ("medicine" | "secretary" | "patient")
) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    const checkAuth = () => {
      if (typeof window === "undefined") return false;

      const storedRole = normalizeRole(localStorage.getItem("role") || "");
      const requiredRole = options?.role;
      const { tokenKey, loginKey, idKey } = getRoleTokens(storedRole as AuthRole);

      console.log("Auth Check - localStorage:", {
        role: storedRole,
        token: localStorage.getItem(tokenKey),
        login: localStorage.getItem(loginKey),
        id: localStorage.getItem(idKey)
      });

      if (requiredRole && storedRole !== requiredRole) {
        console.log(`Role mismatch: stored ${storedRole}, required ${requiredRole}`);
        return false;
      }

      const token = localStorage.getItem(tokenKey);
      const login = localStorage.getItem(loginKey);

      if (!token || !login) {
        console.log("Missing token or login");
        return false;
      }

      return true;
    };

    useEffect(() => {
      const authStatus = checkAuth();
      setIsAuthenticated(authStatus);

      if (!authStatus) {
        console.log("Not authenticated, redirecting...");
        const redirectPath = options?.role === "medicine" ? "/login_medicine" :
                          options?.role === "secretary" ? "/login_secretary" :
                          "/login_patient";
        router.push(redirectPath);
      }
    }, [router, options?.role]);

    if (isAuthenticated === null) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return AuthComponent;
};

export default withAuth;