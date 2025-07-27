import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { z } from "zod";
import { Input } from "../components/basic-components/Input";
import { Button } from "../components/basic-components/Button";
import { getItem, removeItem, setItem } from "../storage/local-storage-util";
import { useApiClient } from "../contexts/ApiContext";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const apiClient = useApiClient();

  useEffect(() => {
    const userData = getItem("userData");
    console.log(router.pathname);
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        if (parsedUserData.token) {
          if (verifyToken(parsedUserData.token)) {
            router.push("/dashboard");
          } else {
            removeItem("userData");
          }
        }
      } catch (error) {
        console.error("Invalid stored user data:", error);
        removeItem("userData");
      }
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await apiClient.post(
        "/auth/login",
        {
          username: result.data.username,
          password: result.data.password,
        },
        { requiresAuth: false }
      );

      if (response.success) {
        const userData = {
          _id: response.data._id,
          fullName: response.data.fullName,
          userName: response.data.userName,
          email: response.data.email,
          createdAt: response.data.createdAt,
          token: response.data.token,
        };

        setItem("userData", JSON.stringify(userData));
        router.push("/dashboard");
      } else {
        setErrors({ submit: response.error || "Login failed" });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">
          Welcome to Wealth Tracker
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Username"
            name="username"
            type="text"
            placeholder="username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>

          {errors.submit && (
            <div className="mt-2 text-red-600 text-sm text-center">
              {errors.submit}
            </div>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

function verifyToken(token: string) {
  const tokenParts = token.split(".");
  const payload = JSON.parse(atob(tokenParts[1]));
  const currentTime = Date.now() / 1000;

  if (payload.exp && payload.exp > currentTime) {
    return true;
  }
}
