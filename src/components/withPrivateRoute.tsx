"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, ComponentType } from "react";
import {
  normalizeRole,
  type AuthRole,
  getRoleTokens,
  ROLES,
} from "@/utils/roles";

// Safely access localStorage with error handling - moved to a shared utility
export const safeLocalStorage = {
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
  },
};

const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>,
  options?: { role?: AuthRole }
) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const pathname = usePathname();
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
        const redirectPath =
          options?.role === ROLES.MEDICINE
            ? "/login_medicine"
            : options?.role === ROLES.SECRETARY
            ? "/login_secretary"
            : "/login_patient";

        if (pathname !== redirectPath) {
          console.log(`Not authenticated, redirecting to ${redirectPath}...`);
          router.push(redirectPath);
        }
      }
    }, [mounted, router, pathname]); // ✅ removed options
    // Don't render anything during SSR
    if (typeof window === "undefined") return null;

    // Don't render anything until mount
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
