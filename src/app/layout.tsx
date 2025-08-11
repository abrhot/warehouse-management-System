// src/app/layout.tsx
import { Inter } from 'next/font/google';
import Providers from './providers';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "WMS",
  description: "Warehouse Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Update the body class to set the new background color
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-gray-800`}>
        <Providers>
          {children}
        </Providers>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}