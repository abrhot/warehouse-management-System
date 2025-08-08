import { Role } from "@/generated/prisma";

interface NavRoute {
  label: string;
  path: string;
}

// Routes available to everyone
const baseRoutes: NavRoute[] = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Products", path: "/products" },
  { label: "Stock In", path: "/stock/in" },
  { label: "Stock Out", path: "/stock/out" },
  { label: "Reports", path: "/reports" },
  { label: "Notifications", path: "/notifications" },
];

// Routes available only to Admins
const adminRoutes: NavRoute[] = [
  { label: "Admin Users", path: "/admin/users" },
  { label: "Pending Requests", path: "/admin/requests" },
];

/**
 * Generates the navigation routes based on the user's role.
 * @param role The role of the current user.
 * @returns An array of NavRoute objects.
 */
export const getNavRoutes = (role?: Role): NavRoute[] => {
  if (role === "ADMIN") {
    // Admins see all base routes plus the admin routes
    return [...baseRoutes, ...adminRoutes];
  }
  // Regular users only see the base routes
  return baseRoutes;
};