"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MainNav;
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const react_1 = require("next-auth/react"); // 1. Import from your auth library
const routes_1 = require("@/config/routes"); // 2. Import the function, not the static array
function MainNav() {
    var _a;
    const pathname = (0, navigation_1.usePathname)();
    // 3. Get the current user's session
    const { data: session } = (0, react_1.useSession)();
    // 4. Extract the user's role from the session object
    // Note: The path might be session.user.role depending on your session configuration
    const userRole = (_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.role;
    // 5. Generate the correct list of routes based on the role
    const navRoutes = (0, routes_1.getNavRoutes)(userRole);
    return (<nav className="w-full border-b border-gray-200 bg-white shadow-sm px-6 py-4">
      <ul className="flex flex-wrap gap-6 text-sm font-medium text-gray-800">
        {navRoutes.map((route) => (<li key={route.path}>
            <link_1.default href={route.path} className={`hover:text-green-700 transition ${pathname === route.path ? "text-green-700 font-semibold" : ""}`}>
              {route.label}
            </link_1.default>
          </li>))}
      </ul>
    </nav>);
}
