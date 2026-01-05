"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaGoogle,
  FaFacebook,
  FaLock,
  FaEnvelope
} from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";
import LoginBackground from "@/public/images/login-background.jpg";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-dark flex">
      {/* ================= LEFT VISUAL ================= */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-secondary-900">
        <div className="absolute inset-0 opacity-40">
          <Image
            src={LoginBackground}
            alt="Background"
            fill
            priority
            className="object-cover scale-110"
            sizes="50vw"
            quality={85}
            style={{
              filter: "blur(1px)",
            }}
          />
        </div>

        <div className="relative z-10 w-full h-full flex items-end p-12">
          {/* Container utama */}
          <div className="flex items-start gap-4 md:gap-6">
            <div className="relative">
              <div className="w-1 h-12 bg-gradient-gold from-red-500 via-red-400 to-transparent ml-1"></div>
            </div>

            <div className="flex-1">
              <p className="text-2xl md:text-3xl text-white font-serif leading-relaxed">
                "Seek knowledge from the cradle to the grave."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT FORM ================= */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="self-start mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-neutral-400 hover:text-gold transition-colors"
          >
            <MdArrowBack className="text-xl" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            {/* Brand */}
            <div className="flex items-center gap-2 mb-4 justify-center">
              <div className="w-8 h-8 rounded-md bg-gradient-gold" />
              <span className="font-semibold text-white">
                Saladin Ma&apos;rifi
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-sans text-white mb-3">
              Welcome Back
            </h2>
            <p className="text-neutral-400">
              Please enter your details to sign in.
            </p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-3 flex items-center gap-2">
                <FaEnvelope className="text-gold" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  className="input pl-10"
                  placeholder="name@example.com"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-px bg-neutral-500"></div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-3 flex items-center gap-2">
                <FaLock className="text-gold" />
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  className="input pl-10"
                  placeholder="••••••••"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-px bg-neutral-500"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-border bg-card text-gold focus:ring-gold focus:ring-2"
                />
                <span className="ml-3 text-neutral-300">Remember me</span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-gold hover:text-primary-300 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full text-lg py-4 font-sans text-secondary-900 hover:text-white transition-all duration-300"
            >
              Sign In
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-4 text-sm text-neutral-500">
                OR CONTINUE WITH
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="btn btn-outline flex-1 justify-center items-center gap-3 py-3">
              <FaGoogle className="text-xl" />
              <span>Google</span>
            </button>
            <button className="btn btn-outline flex-1 justify-center items-center gap-3 py-3">
              <FaFacebook className="text-xl" />
              <span>Facebook</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-neutral-400">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-gold font-medium hover:text-primary-300 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
