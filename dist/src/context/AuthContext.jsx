'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = void 0;
exports.AuthProvider = AuthProvider;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const AuthContext = (0, react_1.createContext)(undefined);
function AuthProvider({ children }) {
    const [user, setUser] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const router = (0, navigation_1.useRouter)();
    (0, react_1.useEffect)(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/session');
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                }
            }
            catch (err) {
                console.error('Failed to fetch session:', err);
            }
            finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);
    const login = (userData) => {
        setUser(userData);
        router.push('/dashboard');
    };
    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        router.push('/login');
    };
    return (<AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>);
}
const useAuth = () => {
    const context = (0, react_1.useContext)(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
exports.useAuth = useAuth;
