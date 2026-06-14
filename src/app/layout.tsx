import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Resto Next App",
  description: "Generated Resto by next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} h-full antialiased`}>
      <body className="bg-white min-h-full flex flex-col antialiased">
        {/* ✓ FIXED: Navbar & halaman harus dibungkus DI DALAM Providers agar TanStack Query aktif */}
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="grow w-full">{children}</main>
            {/* Area Footer Hitam Tegak Lurus */}
            <div className="bg-black w-full mt-auto flex-shrink-0">
              <div className="custom-container">
                <Footer />
              </div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
