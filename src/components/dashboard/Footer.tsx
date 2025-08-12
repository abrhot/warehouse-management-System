// src/components/dashboard/Footer.tsx
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto pt-8 text-center text-sm text-[#6f9550]">
      <div className="flex justify-center gap-6">
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/terms">Terms of Service</Link>
        <Link href="/support">Support</Link>
      </div>
      <p className="mt-2">
        Warehouse Management System © 2025. Version 1.0.0
      </p>
    </footer>
  );
}