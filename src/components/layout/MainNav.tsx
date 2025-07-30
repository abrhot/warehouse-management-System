"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navRoutes } from "@/config/routes";

export default function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="w-full border-b border-gray-200 bg-white shadow-sm px-6 py-4">
      <ul className="flex flex-wrap gap-6 text-sm font-medium text-gray-800">
        {navRoutes.map((route) => (
          <li key={route.path}>
            <Link
              href={route.path}
              className={`hover:text-green-700 transition ${
                pathname === route.path ? "text-green-700 font-semibold" : ""
              }`}
            >
              {route.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
