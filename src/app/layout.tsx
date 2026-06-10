import type { Metadata } from "next";
import { Nunito, Nunito_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

const nunitoMono = Nunito_Sans({
  variable: "--font-nunito-mono",
  subsets: ["latin"],
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
    <html
      lang="en"
      className={`${nunitoSans.variable} ${nunitoMono.variable} h-full antialiased`}
    >
      <body
        className="
      bg-black min-h-full flex flex-col antialiased
      "
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
