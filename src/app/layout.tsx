import "@/styles/globals.css";

export const metadata = {
  title: "WMS",
  description: "Warehouse Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
{/* Custom fonts are now loaded via _document.tsx for best practices */}

        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />  
      </head>
      <body>{children}</body>
    </html>
  );
}
