"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react"; // 1. Import from your auth library
import { getNavRoutes } from "@/config/routes";   // 2. Import the function, not the static array
import { Role } from "@/generated/prisma";

export default function MainNav() {
  const pathname = usePathname();
  
  // 3. Get the current user's session
  const { data: session } = useSession();

  // 4. Extract the user's role from the session object
  // Note: The path might be session.user.role depending on your session configuration
  const userRole = session?.user?.role as Role | undefined;
  
  // 5. Generate the correct list of routes based on the role
  const navRoutes = getNavRoutes(userRole);

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