import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { normalizeRole } from "@/utils/roles";
import { ROLES } from "@/utils/roles";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: { role?: keyof typeof ROLES }
) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    const checkAuth = () => {
      if (typeof window === "undefined") return false;

      console.log("Auth Check - localStorage:", {
        tokenMedicine: localStorage.getItem("tokenMedicine"),
        role: localStorage.getItem("role"),
        login: localStorage.getItem("LoginMedicine"),
        id: localStorage.getItem("id_medcine")
      });

      const storedRole = normalizeRole(localStorage.getItem("role") || "");
      const requiredRole = options?.role ? ROLES[options.role] : null;

      if (!requiredRole || storedRole !== requiredRole) {
        console.log(`Role mismatch: stored ${storedRole}, required ${requiredRole}`);
        return false;
      }

      const token = localStorage.getItem("tokenMedicine");
      const login = localStorage.getItem("LoginMedicine");

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
        const redirectPath = "/login_medicine";
        router.push(redirectPath);
      }
    }, [router]);

    if (isAuthenticated === null) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  // Set display name for debugging purposes
  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthComponent;
};

export default withAuth;