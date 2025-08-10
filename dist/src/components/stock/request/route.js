"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
// POST /api/stock/request
const server_1 = require("next/server");
const prisma_1 = require("@/lib/prisma");
const next_auth_1 = require("next-auth");
const auth_1 = require("@/lib/auth");
async function POST(req) {
    const session = await (0, next_auth_1.getServerSession)(auth_1.authOptions);
    if (!session || !session.user) {
        return server_1.NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { productId, quantity, type } = await req.json();
    try {
        const newRequest = await prisma_1.prisma.stockRequest.create({
            data: {
                type,
                quantity,
                productId,
                requestedBy: session.user.id,
                status: 'PENDING',
            },
        });
        return server_1.NextResponse.json({ success: true, data: newRequest });
    }
    catch (error) {
        console.error('Failed to create stock request:', error);
        return server_1.NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
