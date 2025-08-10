"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const headers_1 = require("next/headers");
async function POST() {
    (0, headers_1.cookies)().delete('authToken');
    return server_1.NextResponse.json({ message: 'Logged out' });
}
