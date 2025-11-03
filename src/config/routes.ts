// No Prisma import needed; use simple string role checks

interface NavRoute {
  label: string;
  path: string;
}

// Routes available to regular users and admins
const baseRoutes: NavRoute[] = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "My Requests", path: "/my-requests" },
  { label: "Products", path: "/products" },
  { label: "Categories", path: "/categories" },
  { label: "Reports", path: "/reports" },
  { label: "Settings", path: "/settings" },
];

// Routes available only to Admins
const adminRoutes: NavRoute[] = [
  { label: "Admin Users", path: "/admin/users" },
  { label: "Pending Requests", path: "/admin/requests" },
  { label: "Pending Approvals", path: "/admin/approvals" },
];

/**
 * Generates the navigation routes based on the user's role.
 * @param role The role of the current user.
 * @returns An array of NavRoute objects.
 */
export const getNavRoutes = (role?: string): NavRoute[] => {
  if (role === "ADMIN") {
    // Admins see all base routes plus the admin routes
    return [...baseRoutes, ...adminRoutes];
  }
  // Regular users only see the base routes
  return baseRoutes;
};
