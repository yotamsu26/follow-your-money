import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { Input } from "../components/basic-components/Input";
import { Button } from "../components/basic-components/Button";

// Define Zod schema for login
const loginSchema = z.object({
  emailOrUsername: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginScreen() {
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
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
      const response = await fetch("http://localhost:3020/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: result.data.emailOrUsername,
          password: result.data.password,
        }),
      });

      console.log(response);

      const data = await response.json();

      if (data.success) {
        // Login successful
        alert("Login successful!");
        // Here you would typically save the user data and redirect
        console.log("User data:", data.data);
        // Redirect to dashboard or home page
        // window.location.href = "/dashboard";
      } else {
        // Handle API errors
        setErrors({ submit: data.message || "Login failed" });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">
          Welcome to Wealth Tracker
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Email or Username"
            name="emailOrUsername"
            type="text"
            placeholder="you@example.com or username"
            value={formData.emailOrUsername}
            onChange={handleChange}
            error={errors.emailOrUsername}
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
