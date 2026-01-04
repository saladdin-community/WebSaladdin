import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scindin Nerifi - Auth",
  description: "Join our community of knowledge seekers",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}

      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-linear-to-br from-primary-900/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-linear-to-tl from-primary-800/10 to-transparent rounded-full blur-3xl"></div>

        <div className="absolute inset-0 opacity-10"></div>
      </div>
    </>
  );
}
