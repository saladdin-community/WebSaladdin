"use client";

import Link from "next/link";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import RegisterBackground from "@/public/images/register.png";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-dark">
      {/* ================= LEFT VISUAL ================= */}
      <div className="relative hidden lg:flex items-end overflow-hidden">
        <Image
          src={RegisterBackground}
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
        {/* Ornamental background */}
        <div
          className="absolute inset-0 bg-center bg-cover opacity-90"
          style={{
            backgroundImage: `
              radial-gradient(circle at center, rgba(212,175,53,0.15), transparent 60%),
              linear-gradient(to bottom, rgba(0,0,0,.6), rgba(0,0,0,.9))
            `,
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-12 max-w-xl space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 badge badge-secondary">
            Join 12,000+ Students
          </div>

          {/* Quote */}
          <div className="flex items-start gap-4 md:gap-6">
            <div className="relative">
              <div className="w-1 h-12 bg-gradient-gold from-red-500 via-red-400 to-transparent ml-1"></div>
            </div>
            <blockquote className="text-2xl leading-relaxed text-neutral-100 font-serif">
              “The ink of the scholar is more holy than the blood of the
              martyr.”
            </blockquote>
          </div>

          {/* Community */}
          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-3">
              <div className="w-9 h-9 rounded-full bg-neutral-700" />
              <div className="w-9 h-9 rounded-full bg-neutral-600" />
              <div className="w-9 h-9 rounded-full bg-neutral-500" />
            </div>
            <p className="text-sm text-neutral-400">
              Join our growing community
            </p>
          </div>
        </div>
      </div>

      {/* ================= RIGHT FORM ================= */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-md bg-gradient-gold" />
            <span className="font-semibold text-white">
              Saladin Ma&apos;rifi
            </span>
          </div>

          {/* Header */}
          <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
          <p className="text-neutral-400 mb-8">
            Start your journey to knowledge today.
          </p>

          {/* Form */}
          <form className="space-y-5">
            <div>
              <label className="text-sm text-neutral-300">Full Name</label>
              <input className="input mt-2" />
            </div>

            <div>
              <label className="text-sm text-neutral-300">Email Address</label>
              <input type="email" className="input mt-2" />
            </div>

            <div>
              <label className="text-sm text-neutral-300">Password</label>
              <input type="password" className="input mt-2" />
            </div>

            <div>
              <label className="text-sm text-neutral-300">
                Confirm Password
              </label>
              <input type="password" className="input mt-2" />
            </div>

            <button className="btn btn-primary w-full py-4 text-base">
              Create Account
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-dark px-4 text-xs text-neutral-500">
                OR CONTINUE WITH
              </span>
            </div>
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-4">
            <button className="btn btn-outline gap-3">
              <FaGoogle /> Google
            </button>
            <button className="btn btn-outline gap-3">
              <FaFacebook /> Facebook
            </button>
          </div>

          {/* Footer */}
          <p className="mt-8 text-sm text-neutral-400 text-center">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-gold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
