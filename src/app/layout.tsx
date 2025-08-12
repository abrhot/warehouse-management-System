import type { Metadata } from "next";
import { Poppins, Outfit } from "next/font/google"; // 1. Import your new fonts
import "./globals.css";
import { Toaster } from "sonner";

// 2. Configure the fonts with their weights and CSS variables
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "WMS",
  description: "Warehouse Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 3. Apply the font variables and new theme classes to the body */}
      <body className={`${poppins.variable} ${outfit.variable} font-sans bg-background text-foreground`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}