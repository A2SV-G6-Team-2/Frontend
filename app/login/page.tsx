"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/lib/api/auth";
import { setTokens, setUser } from "@/lib/auth/token";
import type { AxiosError } from "axios";

interface ApiErrorResponse {
  success: boolean;
  message: string;
  errors: string[] | null;
}

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [trustDevice, setTrustDevice] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await loginUser({ email, password });

      if (result.success && result.data) {
        // Store tokens and user
        setTokens(result.data.access_token, result.data.refresh_token);
        setUser(result.data.user);

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setError(result.message || "Login failed. Please try again.");
      }
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      if (axiosError.response) {
        const { status, data } = axiosError.response;
        if (status === 401) {
          setError("Incorrect email or password.");
        } else if (data?.errors && data.errors.length > 0) {
          setError(data.errors.join(". "));
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
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex rounded-2xl shadow-2xl overflow-hidden bg-white">

        {/* ── Left Panel ── */}
        <div
          className="relative hidden md:flex flex-col justify-between w-[45%] p-10 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #4F35D2 0%, #6B3FC8 40%, #8B3AB8 100%)",
          }}
        >
          {/* Background decorative icon */}
          <div className="absolute top-8 right-8 opacity-20">
            <div className="w-24 h-24 rounded-2xl border-4 border-white flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border-4 border-white" />
            </div>
          </div>

          {/* Background trend line decoration */}
          <div className="absolute bottom-24 right-4 opacity-15">
            <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
              <polyline
                points="0,70 30,50 60,30 90,45 120,10"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>

          {/* App icon */}
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M19 8H5a3 3 0 0 0-3 3v5a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-5a3 3 0 0 0-3-3zM5 6h14a1 1 0 0 0 0-2H5a1 1 0 0 0 0 2zm7 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
              </svg>
            </div>

            <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
              Master your<br />money.
            </h1>
            <p className="text-white/70 text-sm leading-relaxed">
              Manage your finances with ease. Track every penny and reach your savings goals faster.
            </p>
          </div>

          {/* Savings widget */}
          <div className="relative z-10 bg-white/15 backdrop-blur-sm rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="17 6 23 6 23 12" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-white/60 text-xs font-semibold tracking-widest uppercase">Monthly Savings</span>
            </div>
            <p className="text-white text-2xl font-bold mb-3">+24.5% Growth</p>
            {/* Progress bar */}
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: "65%" }} />
            </div>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="flex-1 flex flex-col justify-center px-10 py-12 bg-white">
          <div className="max-w-sm mx-auto w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome</h2>
            <p className="text-gray-400 text-sm mb-7">Manage your finances with ease.</p>

            {/* Error message */}
            {error && (
              <div className="mb-5 flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                  <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl px-3 py-3 gap-2 focus-within:border-[#3C12E7] transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
                  </svg>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="name@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400 bg-transparent disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-gray-700">Password</label>
                  <Link href="/forgot-password" className="text-sm font-semibold text-[#3C12E7] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="flex items-center border border-gray-200 rounded-xl px-3 py-3 gap-2 focus-within:border-[#3C12E7] transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="flex-1 text-sm outline-none text-gray-700 bg-transparent placeholder:text-gray-400 disabled:opacity-50"
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

              {/* Trust device checkbox */}
              <div className="flex items-center gap-2 mb-6">
                <input
                  id="trust-device"
                  type="checkbox"
                  checked={trustDevice}
                  onChange={(e) => setTrustDevice(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 accent-[#3C12E7] cursor-pointer"
                />
                <label htmlFor="trust-device" className="text-sm text-gray-500 cursor-pointer select-none">
                  Trust this device for 30 days
                </label>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl text-white text-sm font-bold tracking-wide transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: "#3C12E7" }}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Join for free */}
            <p className="text-center text-sm text-gray-500 mt-6">
              New to our platform?{" "}
              <Link href="/signup" className="font-bold text-[#3C12E7] hover:underline">
                Join for free
              </Link>
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Secure SSL Encrypted
              </div>
              <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium">
                <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms</Link>
                <Link href="/support" className="hover:text-gray-600 transition-colors">Support</Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
