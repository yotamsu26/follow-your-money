import Link from "next/link";
import { Input } from "../components/basic-components/Input";
import { Button } from "../components/basic-components/Button";

export default function LoginScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">
          Welcome
        </h1>

        <form className="space-y-6">
          <Input label="Email" type="email" placeholder="you@example.com" />

          <Input label="Password" type="password" placeholder="••••••••" />

          <Button type="submit" variant="primary" className="w-full">
            Login
          </Button>
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
