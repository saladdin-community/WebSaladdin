import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "./providers/ThemeProvider";
import Header from "./components/layout/Header";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Salahuddin Heritage Learning",
  description: "Master modern skills rooted in timeless wisdom",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {/* <Header /> */}
          <ThemeProvider>{children}</ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
