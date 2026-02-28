import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import SessionProvider from "@/components/providers/SessionProvider";
import "../style/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PIDS Alarm Management System",
  description:
    "Territory-mapped alarm dispatch & investigation platform for pipeline intrusion detection operations.",
};

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
};

export default Layout;
