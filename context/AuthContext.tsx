"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export type User = any;

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, userType: "company" | "employee") => Promise<void>;
  logout: () => void;
  registerCompany: (formData: FormData) => Promise<void>;
  forgotPassword: (email: string, userType: "company" | "employee") => Promise<void>;
  resetPassword: (token: string, newPassword: string, userType: "company" | "employee") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // On Mount, check for existing token & validate it
  useEffect(() => {
    const token = localStorage.getItem("elevu_auth");
    if (token) {
      const verifyToken = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/authenticate`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json()
            console.log("Token verified:", data);
            setUser(data.data);
          } else {
            if (response.status === 401) {
              localStorage.removeItem("elevu_auth");
            }
            setUser(null);
          }
        } catch (error) {
          console.error("Token verification error:", error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      };
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);


  // * Login (HANDLES COMPANY & EMPLOYEE)
  const login = async (email: string, password: string, userType: "company" | "employee") => {
    try {
      const endpoint = userType === "company" ? "/company/login" : "/employee/login";

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data?.message || "Login failed");
      }

      localStorage.setItem("elevu_auth", data.data);

      toast.success("Login Successful!");

      setTimeout(() => {
        const dashboardPath = userType === "company" ? "/admin/dashboard" : "/employee/dashboard";
        window.location.href = dashboardPath;
      }, 500);
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error(err.message || "Something went wrong");
    }
  };

  // * SIGNUP (HANDLES COMPANY & EMPLOYEE)
  const registerCompany = async (formData: FormData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/register`, {
        method: "POST",
        body: formData, // No Content-Type header needed for FormData, browser will set it automatically
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data?.message || "Registration failed");
      }

      const email = formData.get("email") as string;
      toast.success("Verification Email Sent");
      setTimeout(() => {
        router.push(`/verify-email-sent?email=${encodeURIComponent(email)}`);
      }, 500);
    } catch (err: any) {
      console.error("Signup error:", err);
      toast.error(err.message || "Something went wrong");
    }
  };

  // * Logout (HANDLES COMPANY & EMPLOYEE)
  const logout = () => {
    localStorage.removeItem("elevu_auth");
    toast.success("Signout Successful");
    setUser(null);
    router.push("/login");
  };

  // * FORGOT-PASSWORD (HANDLES COMPANY & EMPLOYEE FORGOT-PASSWORD)
  const forgotPassword = async (email: string, userType: "company" | "employee") => {
    try {
      const endpoint = userType === "company" ? "/company/forgot-password" : "/employee/forgot-password";

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
      );
      const data = await response.json();

      if (!data.success) {
        throw new Error(data?.message || "Failed to send reset link");
      }

      toast.success(`Reset link sent to ${email}`);
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (err: any) {
      console.error("ForgotPassword error:", err);
      toast.error(err.message || "Something went wrong");
    }
  };

  // * RESET-PASSWORD (HANDLES COMPANY & EMPLOYEE RESET-PASSWORD)
  const resetPassword = async (token: string, newPassword: string, userType: "company" | "employee") => {
    try {
      const endpoint = userType === "company" ? "/company/reset-password" : "/employee/reset-password";

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data?.message || "Failed to reset password");
      }

      toast.success("Password reset successfully!");
      setTimeout(() => {
        router.replace("/login");
      }, 1000);
    } catch (err: any) {
      console.error("ResetPassword error:", err);
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, registerCompany, forgotPassword, resetPassword }}    >
      {children}
    </AuthContext.Provider>
  );
}
