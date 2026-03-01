"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginLocal } from "@/app/lib/auth";
import { getApiMe } from "@/app/lib/generated";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const processLogin = async () => {
      try {
        // 1. Try to get error from search params
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

        // 2. Extract Token and UserRaw (Scrap from SearchParams + Hash)
        // Check regular search params first
        let token =
          searchParams.get("token") || searchParams.get("access_token");
        let userRaw = searchParams.get("user");

        // If not found in search params, check the URL Hash (Fragment)
        // Some OAuth providers return tokens in the # hash
        if (typeof window !== "undefined" && !token) {
          const hash = window.location.hash.substring(1);
          const params = new URLSearchParams(hash);
          token = params.get("token") || params.get("access_token");
          if (!userRaw) userRaw = params.get("user");
        }

        if (!token) {
          setErrorMessage("Data login tidak lengkap (Token tidak ditemukan).");
          setStatus("error");
          return;
        }

        let user;
        if (userRaw) {
          try {
            user = JSON.parse(decodeURIComponent(userRaw));
          } catch (e) {
            console.error("Failed to parse userRaw", e);
          }
        }

        // 3. If User data is missing, fetch from API using the token
        if (!user) {
          try {
            const response = await getApiMe({
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            user = response.data;
          } catch (apiErr) {
            console.error("Failed to fetch user profile", apiErr);
            throw new Error("Gagal mengambil profil pengguna.");
          }
        }

        if (!user || !isMounted) return;

        // 4. Save session and redirect
        loginLocal(token, user);
        setStatus("success");

        // Redirect based on role
        setTimeout(() => {
          if (!isMounted) return;
          if (user.role === "admin") {
            router.replace("/admin/overview");
          } else {
            router.replace("/dashboard");
          }
        }, 1500);
      } catch (err: any) {
        if (!isMounted) return;
        console.error("Error during OAuth callback:", err);
        setErrorMessage(err.message || "Gagal memproses login Google.");
        setStatus("error");
      }
    };

    processLogin();

    return () => {
      isMounted = false;
    };
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
