"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import Image from "next/image";
import Vyom from "../../assets/VyomLogo.png";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner";

const SignupPage = () => {
const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const router = useRouter()

const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
});

const [passwordStrength, setPasswordStrength] = useState(0);

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));

  // Password strength logic
  if (name === "password") {
    let strength = 0;
    if (value.length >= 8) strength++;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) strength++;
    if (/[0-9]/.test(value)) strength++;
    if (/[^a-zA-Z0-9]/.test(value)) strength++;
    setPasswordStrength(strength);
  }
};

const handleSubmit = async (e) => {
  try{
    e.preventDefault();
    setLoading(true);
   const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.message);
      setLoading(false);
      return;
    }

    toast.success("signedup successfully... Logging you in...")

    // Step 2: auto sign in via NextAuth
    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    // console.log("Sign in result:", result);

    if (result?.error) {
      setError("Account created but sign in failed. Please login.");
      router.push("/login");
      return;
    }

    // Step 3: redirect to dashboard
    router.push("/dashboard");
    setLoading(false);
  } catch (err) {
    setError("An unexpected error occurred. Please try again.",err);
    setLoading(false);
  };
}

const getPasswordStrengthLabel = () => {
  if (passwordStrength === 0) return "";
  if (passwordStrength === 1) return "Weak";
  if (passwordStrength === 2) return "Fair";
  if (passwordStrength === 3) return "Good";
  return "Strong";
};

const getPasswordStrengthColor = () => {
  if (passwordStrength === 0) return "bg-border";
  if (passwordStrength === 1) return "bg-red-500";
  if (passwordStrength === 2) return "bg-yellow-500";
  if (passwordStrength === 3) return "bg-blue-500";
  return "bg-green-500";
};

  
  return (
    <main className="min-h-screen bg-grid-pattern bg-[#0A0A0A] w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-90" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-purple-400/20 blur-[120px] animate-pulse-slow" />
      <div
        className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-blue-400/20 blur-[120px] animate-pulse-slow"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-accent/10 blur-[150px] animate-pulse-slow"
        style={{ animationDelay: "1s" }}
      />

      <div className="w-full max-w-md space-y-6">
        {/* Logo and heading */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-lg bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Image src={Vyom} alt="Vyom Logo" className="rounded-md" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome to Vyom</h1>
          <p className="text-muted-foreground font-semibold text-xs">
            create an account to explore the real power of AI in you internship
            journey
          </p>
        </div>

        {/* Auth card with moving border */}
        <div className="relative group">
          {/* Moving border runner */}
          <div className="card-border-runner" aria-hidden="true" />

          <div className="relative bg-[#0a0a0e] backdrop-blur-xl rounded-2xl p-8 space-y-6 z-10">
            {/* Social login buttons */}
            <div className="flex gap-2 mb-2">
              {/* Google */}
              <Button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-300 hover:scale-[1.02]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 10.2v3.9h5.5c-.2 1.2-1.4 3.6-5.5 3.6-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.6C16.8 2.9 14.6 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.2-.2-1.7H12z"
                  />
                </svg>
                <span className="hidden sm:inline">Google</span>
              </Button>

              {/* Discord */}
              <Button
                onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
                className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-indigo-500/20 border border-white/10 text-white transition-all duration-300 hover:scale-[1.02]"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 127.14 96.36"
                  fill="#7289DA"
                >
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.92,97.68,97.68,0,0,0-29.09,0A72.37,72.37,0,0,0,45.66,0,105.89,105.89,0,0,0,19.39,8.09C2.79,33.58-1.71,58.39.51,82.84a105.73,105.73,0,0,0,32.17,16.14,77.7,77.7,0,0,0,6.86-11.13,68.42,68.42,0,0,1-10.79-5.18c.91-.68,1.8-1.39,2.66-2.12a75.57,75.57,0,0,0,64.32,0c.87.73,1.76,1.44,2.66,2.12a68.68,68.68,0,0,1-10.81,5.19,77.7,77.7,0,0,0,6.86,11.13A105.25,105.25,0,0,0,126.64,82.84C129.35,54.5,122.05,30,107.7,8.07ZM42.45,65.69c-6.31,0-11.49-5.78-11.49-12.9s5.1-12.9,11.49-12.9c6.43,0,11.57,5.83,11.49,12.9C53.94,59.91,48.88,65.69,42.45,65.69Zm42.24,0c-6.31,0-11.49-5.78-11.49-12.9s5.1-12.9,11.49-12.9c6.43,0,11.57,5.83,11.49,12.9C96.18,59.91,91.12,65.69,84.69,65.69Z" />
                </svg>
                <span className="hidden sm:inline">Discord</span>
              </Button>

              {/* GitHub */}
              <Button
                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-zinc-700/40 border border-white/10 text-white transition-all duration-300 hover:scale-[1.02]"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.8-.26.8-.58v-2.2c-3.34.73-4.03-1.42-4.03-1.42-.55-1.38-1.34-1.75-1.34-1.75-1.08-.75.08-.73.08-.73 1.2.08 1.83 1.23 1.83 1.23 1.07 1.84 2.8 1.3 3.5 1 .1-.78.42-1.3.76-1.6-2.66-.3-5.47-1.34-5.47-5.93 0-1.3.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.17.77.84 1.24 1.92 1.24 3.22 0 4.6-2.8 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.3c0 .32.2.7.8.58C20.56 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z" />
                </svg>
                <span className="hidden sm:inline">GitHub</span>
              </Button>
            </div>

            {/* Divider */}
            <div className="relative mt-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#0a0a0e] text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-white"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 bg-zinc-500/30 text-white placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-white"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 text-white bg-zinc-500/30 outline-none border-none placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-white"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 bg-zinc-500/30 text-white  placeholder:text-muted-foreground"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex gap-1 h-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-full ${
                            i < passwordStrength
                              ? getPasswordStrengthColor()
                              : "bg-border"
                          } transition-colors`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Password strength:{" "}
                      <span className="text-accent font-semibold">
                        {getPasswordStrengthLabel()}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-linear-to-r from-purple-500 to-blue-500 hover:opacity-90 text-white font-semibold py-2 rounded-lg transition-opacity duration-200"
              >
                {loading ? <Spinner className="w-4 h-4" /> : "Sign Up"}
              </Button>
            </form>
            
            {error && (<div className="text-xs mx-auto text-center text-red-400">{error}</div>)}

            {/* Sign up link */}
            <p className="text-center text-sm text-muted">
              Already have an account?{" "}
              <Link
                href="/api/auth/signin"
                className="text-purple-500 hover:text-purple-500/80 font-semibold transition-colors"
              >
                Sign in
              </Link>{" "}
            </p>
          </div>
        </div>

        {/* Additional info */}
        <div className="text-center text-xs text-muted-foreground">
          <p>
            By signing up, you agree to our{" "}
            <Link
              href="#"
              className="text-purple-500 hover:text-purple-500/80 transition-colors"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="text-purple-500 hover:text-purple-500/80 transition-colors"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default SignupPage;

{/* Password field */}
       