// In a real app, you would get this from your user session or auth context
const userRole = 'ADMIN'; // Try changing this to 'USER' to see the links disappear

// Use 'const' as the array is mutated but not reassigned
const navRoutes = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Products", path: "/products" },
  { label: "Stock In", path: "/stock/in" },
  { label: "Stock Out", path: "/stock/out" },
  { label: "Reports", path: "/reports" },
  { label: "Notifications", path: "/notifications" },
  { label: "Profile", path: "/profile" },
];

// If the user is an admin, push the admin-only routes into the array
if (userRole === 'ADMIN') {
  navRoutes.push(
    { label: "Admin Users", path: "/admin/users" },
    { label: "Pending Requests", path: "/admin/requests" }
  );
}

// Export the final array
export { navRoutes };