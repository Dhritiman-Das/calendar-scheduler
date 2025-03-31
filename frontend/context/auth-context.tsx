"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authApi, LoginDto, RegisterDto } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";

interface User {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "user_data";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
  }, [user]);

  const refreshUserData = async () => {
    try {
      const userData = await authApi.me();
      setUser(userData as User);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      throw error;
    }
  };

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      const token = localStorage.getItem("token") || Cookies.get("token");

      // Try to load user from localStorage first for immediate UI display
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse stored user data", e);
        }
      }

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Get fresh user info from API
        const userData = await authApi.me();
        setUser(userData as User);
        // Update stored user data
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      } catch (error) {
        console.error("Auth check failed:", error);
        // Clear auth data if verification fails
        localStorage.removeItem("token");
        localStorage.removeItem(USER_STORAGE_KEY);
        Cookies.remove("token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (data: LoginDto) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(data);
      // Store token both in localStorage (for programmatic access) and in a cookie (for middleware)
      localStorage.setItem("token", response.accessToken);
      Cookies.set("token", response.accessToken, {
        secure: true,
        sameSite: "strict",
      });

      setUser(response.user);
      // Store user data for persistence
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));

      toast.success("Logged in successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please check your credentials.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterDto) => {
    setIsLoading(true);
    try {
      await authApi.register(data);
      toast.success("Registration successful! Please log in.");
      router.push("/auth/login");
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(
        "Registration failed. This username or email may already exist."
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);

      // Clear auth tokens and user data
      localStorage.removeItem("token");
      localStorage.removeItem(USER_STORAGE_KEY);
      Cookies.remove("token");

      router.push("/auth/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUserData: async () => {
          await refreshUserData();
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
