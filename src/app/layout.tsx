import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter as an example font
import Providers from './providers';      // 👈 1. Import the Providers component
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// The metadata object handles your <head> content like title and description
export const metadata: Metadata = {
  title: "WMS",
  description: "Warehouse Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers> {/* 👈 2. Wrap your {children} with the Providers component */}
          {children}
        </Providers>
      </body>
    </html>
  );
}