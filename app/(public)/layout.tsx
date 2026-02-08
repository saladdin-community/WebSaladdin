import Header from "@/app/components/layout/Header";
import { ThemeProvider } from "@/app/providers/ThemeProvider";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <ThemeProvider>{children}</ThemeProvider>
    </>
  );
}
