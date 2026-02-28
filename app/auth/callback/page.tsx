"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginLocal } from "@/app/lib/auth";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const userRaw = searchParams.get("user");
    const error = searchParams.get("error");

    if (error) {
      setErrorMessage(
        error === "unauthorized"
          ? "Login gagal. Silakan coba lagi."
          : "Terjadi kesalahan saat login.",
      );
      setStatus("error");
      return;
    }

    if (!token || !userRaw) {
      setErrorMessage("Data login tidak lengkap. Silakan coba lagi.");
      setStatus("error");
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userRaw));
      loginLocal(token, user);

      setStatus("success");

      // Redirect based on role
      setTimeout(() => {
        if (user.role === "admin") {
          router.replace("/admin/overview");
        } else {
          router.replace("/dashboard");
        }
      }, 1500);
    } catch (err) {
      console.error("Error during OAuth callback:", err);
      setErrorMessage("Gagal memproses data user.");
      setStatus("error");
    }
  }, [searchParams, router]);

  return (
    <div className="text-center space-y-4">
      {status === "loading" && (
        <>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full border-4 border-neutral-700 border-t-gold animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-white">
            Memproses login Google...
          </h2>
          <p className="text-neutral-400 text-sm">Mohon tunggu sebentar.</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-white">Login berhasil!</h2>
          <p className="text-neutral-400 text-sm">
            Mengalihkan ke dashboard...
          </p>
        </>
      )}

      {status === "error" && (
        <>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-white">Login Gagal</h2>
          <p className="text-neutral-400 text-sm max-w-sm">{errorMessage}</p>
          <button
            onClick={() => router.replace("/login")}
            className="mt-4 btn btn-primary px-6 py-2 text-sm font-sans text-secondary-900"
          >
            Kembali ke Login
          </button>
        </>
      )}
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
      <Suspense
        fallback={
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-neutral-700 border-t-gold animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Memproses login...
            </h2>
          </div>
        }
      >
        <CallbackContent />
      </Suspense>

      {/* Background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-linear-to-br from-primary-900/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-linear-to-tl from-primary-800/10 to-transparent rounded-full blur-3xl" />
      </div>
    </div>
  );
}
