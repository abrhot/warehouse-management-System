"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
// src/app/api/stock/request/route.ts
const server_1 = require("next/server");
const next_1 = require("next-auth/next");
const route_1 = require("@/app/api/auth/[...nextauth]/route");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function POST(req) {
    var _a;
    const session = await (0, next_1.getServerSession)(route_1.authOptions);
    if (!((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id)) {
        return server_1.NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    try {
        const body = await req.json();
        // We ONLY accept productId. No more creating products on the fly.
        const { productId, quantity, type, notes, reason } = body;
        if (!productId || !quantity || !type) {
            return server_1.NextResponse.json({ error: 'Missing required fields: productId, quantity, and type are required.' }, { status: 400 });
        }
        // Create the request with the real user ID
        const stockRequest = await prisma.stockRequest.create({
            data: {
                productId: productId,
                quantity: Number(quantity),
                type: type, // Assumes type is 'IN' or 'OUT'
                status: 'PENDING',
                notes: notes,
                reason: reason,
                requestedById: session.user.id, // Correctly links to the user
            },
        });
        // TODO: Create an audit log entry for the request creation
        await prisma.auditLog.create({
            data: {
                action: 'STOCK_REQUEST_CREATED',
                details: `User ${session.user.email} created a ${type} request for ${quantity} of product ID ${productId}.`,
                userId: session.user.id,
            }
        });
        return server_1.NextResponse.json(stockRequest, { status: 201 });
    }
    catch (error) {
        console.error("Error creating stock request:", error);
        return server_1.NextResponse.json({ error: 'Failed to create stock request' }, { status: 500 });
    }
}
