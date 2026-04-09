"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser, loginUser } from "@/lib/api/auth";
import { setTokens, setUser } from "@/lib/auth/token";
import type { AxiosError } from "axios";

interface ApiErrorResponse {
  success: boolean;
  message: string;
  errors: string[] | null;
}

export default function Signup() {
<<<<<<< HEAD
  return <div className="flex items-center justify-center">SignUpPage</div>;
=======
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);

  // Client-side password validation hints
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const passwordIsValid = Object.values(passwordChecks).every(Boolean);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors([]);

    if (!agreedToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    if (!passwordIsValid) {
      setError("Please fix the password requirements below.");
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Register
      const registerResult = await registerUser({ name, email, password });

      if (registerResult.success) {
        // Step 2: Auto-login after successful registration
        try {
          const loginResult = await loginUser({ email, password });

          if (loginResult.success && loginResult.data) {
            setTokens(loginResult.data.access_token, loginResult.data.refresh_token);
            setUser(loginResult.data.user);
            router.push("/dashboard");
            return;
          }
        } catch {
          // If auto-login fails, redirect to login page
          router.push("/login");
          return;
        }

        // Fallback: redirect to login
        router.push("/login");
      } else {
        setError(registerResult.message || "Registration failed.");
        if (registerResult.errors) {
          setFieldErrors(registerResult.errors);
        }
      }
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      if (axiosError.response) {
        const { status, data } = axiosError.response;
        if (status === 409) {
          setError("An account with this email already exists.");
        } else if (status === 400) {
          if (data?.errors && data.errors.length > 0) {
            setFieldErrors(data.errors);
            setError("Please fix the errors below.");
          } else {
            setError(data?.message || "Invalid input. Please check your details.");
          }
        } else if (data?.message) {
          setError(data.message);
        } else {
          setError("Something went wrong. Please try again.");
        }
      } else if (axiosError.request) {
        setError("Cannot reach the server. Please check your connection.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col">

      {/* ── Top Nav ── */}
      <nav className="flex items-center gap-2.5 px-8 py-5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#3C12E7" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M19 8H5a3 3 0 0 0-3 3v5a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-5a3 3 0 0 0-3-3zM5 6h14a1 1 0 0 0 0-2H5a1 1 0 0 0 0 2zm7 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
          </svg>
        </div>
        <span className="font-bold text-gray-900 text-base tracking-tight">SpendWise</span>
      </nav>

      {/* ── Centered Card ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10">

          {/* Heading */}
          <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-1">
            Master Your Money
          </h1>
          <p className="text-sm text-gray-400 text-center mb-7">
            Join thousands saving more today.
          </p>

          {/* Error messages */}
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <div className="flex items-start gap-2.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                  <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <div>
                  <p className="text-sm text-red-600">{error}</p>
                  {fieldErrors.length > 0 && (
                    <ul className="mt-1.5 text-xs text-red-500 list-disc pl-4 space-y-0.5">
                      {fieldErrors.map((fe, i) => (
                        <li key={i}>{fe}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Full Name
              </label>
              <div className="flex items-center border border-gray-200 rounded-xl px-3 py-3 gap-2 focus-within:border-[#3C12E7] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  id="signup-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400 bg-transparent disabled:opacity-50"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="flex items-center border border-gray-200 rounded-xl px-3 py-3 gap-2 focus-within:border-[#3C12E7] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
                </svg>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400 bg-transparent disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="flex items-center border border-gray-200 rounded-xl px-3 py-3 gap-2 focus-within:border-[#3C12E7] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400 bg-transparent disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Password requirements */}
            {password.length > 0 && (
              <div className="mb-4 px-1 space-y-1">
                {[
                  { check: passwordChecks.length, label: "At least 8 characters" },
                  { check: passwordChecks.uppercase, label: "One uppercase letter" },
                  { check: passwordChecks.lowercase, label: "One lowercase letter" },
                  { check: passwordChecks.number, label: "One number" },
                  { check: passwordChecks.special, label: "One special character" },
                ].map((rule) => (
                  <div key={rule.label} className="flex items-center gap-1.5 text-[11px]">
                    {rule.check ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="6" />
                      </svg>
                    )}
                    <span className={rule.check ? "text-green-600" : "text-gray-400"}>
                      {rule.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Static hint when password is empty */}
            {password.length === 0 && (
              <p className="text-[11px] text-gray-400 mb-5 flex items-center gap-1.5 px-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Must include 8+ characters, uppercase, lowercase, number &amp; special character
              </p>
            )}

            {/* Terms checkbox */}
            <div className="flex items-start gap-2.5 mb-6">
              <input
                id="agree-terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-gray-300 accent-[#3C12E7] cursor-pointer"
              />
              <label htmlFor="agree-terms" className="text-sm text-gray-500 cursor-pointer select-none leading-snug">
                I agree to the{" "}
                <Link href="/terms" className="text-[#3C12E7] font-semibold hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#3C12E7] font-semibold hover:underline">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-white text-sm font-bold tracking-wide transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-5"
              style={{ background: "#3C12E7" }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating account…
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* Already have account */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[#3C12E7] hover:underline">
              Log in
            </Link>
          </p>

        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="flex items-center justify-between px-8 py-4 text-[11px] text-gray-400">
        <span>© 2026 SpendWise Expense Manager. Secure financial tracking.</span>
        <div className="flex items-center gap-1.5 bg-green-50 text-green-600 border border-green-200 rounded-full px-3 py-1 font-semibold text-[10px] tracking-widest uppercase">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Bank-Grade Security
        </div>
      </footer>

    </div>
  );
>>>>>>> main
}
