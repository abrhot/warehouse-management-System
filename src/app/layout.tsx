import type { Metadata } from "next";
import "./globals.css";
// Make sure the path is correct and the file exists
// Update the import path if your components folder is inside 'src'
import AppProviders from "../components/AppProviders";
export const metadata: Metadata = {
  title: "EthioTele WMS",
  description: "Warehouse Management System for Ethio Telecom",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}