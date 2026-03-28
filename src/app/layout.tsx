import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // 👈 Ye line check karo

export const metadata: Metadata = {
  title: "LuxeLair | Luxury Real Estate",
  description: "Find your dream home in Ahmedabad",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#F8FAFC]">
        <Navbar />
        {children}
        <Footer /> {/* 👈 Yahan Footer add kiya */}
      </body>
    </html>
  );
}