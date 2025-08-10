"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const headers_1 = require("next/headers");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function GET() {
    var _a;
    const cookieStore = (0, headers_1.cookies)();
    const authToken = (_a = cookieStore.get('authToken')) === null || _a === void 0 ? void 0 : _a.value;
    if (!authToken) {
        return server_1.NextResponse.json({ user: null }, { status: 200 });
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(authToken, process.env.JWT_SECRET);
        const user = {
            id: decodedToken.id,
            email: decodedToken.email,
            role: decodedToken.role,
        };
        return server_1.NextResponse.json({ user }, { status: 200 });
    }
    catch (error) {
        return server_1.NextResponse.json({ user: null, error: 'Invalid token' }, { status: 401 });
    }
}
