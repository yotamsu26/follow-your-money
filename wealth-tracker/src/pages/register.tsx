import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { Input } from "../components/basic-components/Input";
import { Button } from "../components/basic-components/Button";
import { wrapFetch } from "../api/api-calls";

enum RegisterError {
  USERNAME_TAKEN = "Username is already taken",
  EMAIL_TAKEN = "User with this email already exists",
  REGISTRATION_FAILED = "Registration failed",
}

// Define Zod schema
const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full Name is required"),
    userName: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // error will show on confirmPassword
  });

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = registerSchema.safeParse(formData);

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
      const response = await wrapFetch("http://localhost:3020/auth/register", {
        method: "POST",
        body: JSON.stringify({
          fullName: result.data.fullName,
          userName: result.data.userName,
          email: result.data.email,
          password: result.data.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Registration successful
        alert("Registration successful! Please login to continue.");
        // Redirect to login page
        window.location.href = "/";
      } else {
        // Handle API errors
        if (data.message === RegisterError.EMAIL_TAKEN) {
          setErrors({ email: RegisterError.EMAIL_TAKEN });
        } else if (data.message === RegisterError.USERNAME_TAKEN) {
          setErrors({ userName: RegisterError.USERNAME_TAKEN });
        } else {
          setErrors({
            submit: data.message || RegisterError.REGISTRATION_FAILED,
          });
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ submit: RegisterError.REGISTRATION_FAILED });
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-10">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">
          Join Wealth Tracker
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            name="fullName"
            type="text"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
          />

          <Input
            label="Username"
            name="userName"
            type="text"
            placeholder="johndoe123"
            value={formData.userName}
            onChange={handleChange}
            error={errors.userName}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
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

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>

          {errors.submit && (
            <div className="mt-2 text-red-600 text-sm text-center">
              {errors.submit}
            </div>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
