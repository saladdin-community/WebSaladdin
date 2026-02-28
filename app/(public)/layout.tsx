import { Header } from "@/app/components/layout/Header";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import FloatingAdminButton from "@/app/components/admin/FloatingAdminButton";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <ThemeProvider>{children}</ThemeProvider>
      <FloatingAdminButton />
    </>
  );
}
