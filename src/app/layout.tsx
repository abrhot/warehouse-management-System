// src/app/layout.tsx

import AppProviders from "../providers/AppProviders";
import "@/styles/globals.css"; // Don't forget global styles

export const metadata = {
  title: "Warehouse Management System",
  description: "EthioTele WMS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
