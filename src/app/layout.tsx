import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}