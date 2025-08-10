"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
// src/app/api/stock/process/route.ts
const server_1 = require("next/server");
const next_1 = require("next-auth/next");
const route_1 = require("@/app/api/auth/[...nextauth]/route");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function POST(req) {
    var _a;
    const session = await (0, next_1.getServerSession)(route_1.authOptions);
    // 1. Authenticate and Authorize: MUST be an ADMIN
    if (((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.role) !== client_1.Role.ADMIN) {
        return server_1.NextResponse.json({ error: 'Forbidden: Admin access required.' }, { status: 403 });
    }
    const approverId = session.user.id;
    const { requestId, newStatus } = await req.json();
    if (!requestId || !newStatus || !['APPROVED', 'REJECTED'].includes(newStatus)) {
        return server_1.NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    const request = await prisma.stockRequest.findUnique({
        where: { id: requestId },
        include: { product: true },
    });
    if (!request) {
        return server_1.NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }
    if (request.status !== client_1.RequestStatus.PENDING) {
        return server_1.NextResponse.json({ error: 'Request has already been processed' }, { status: 400 });
    }
    try {
        // --- Handle REJECTION ---
        if (newStatus === client_1.RequestStatus.REJECTED) {
            const updatedRequest = await prisma.stockRequest.update({
                where: { id: requestId },
                data: { status: client_1.RequestStatus.REJECTED, approvedById: approverId },
            });
            // TODO: Audit Log for Rejection
            return server_1.NextResponse.json(updatedRequest);
        }
        // --- Handle APPROVAL within a transaction ---
        if (newStatus === client_1.RequestStatus.APPROVED) {
            const changeAmount = request.type === 'IN' ? request.quantity : -request.quantity;
            // Check for sufficient stock before starting the transaction
            if (request.type === 'OUT' && request.product.quantity < request.quantity) {
                return server_1.NextResponse.json({ error: `Insufficient stock for ${request.product.name}. Available: ${request.product.quantity}, Requested: ${request.quantity}` }, { status: 400 });
            }
            const result = await prisma.$transaction(async (tx) => {
                // 1. Update the Product quantity
                const updatedProduct = await tx.product.update({
                    where: { id: request.productId },
                    data: { quantity: { increment: changeAmount } },
                });
                // 2. Update the Stock Request
                const updatedRequest = await tx.stockRequest.update({
                    where: { id: requestId },
                    data: { status: client_1.RequestStatus.APPROVED, approvedById: approverId },
                });
                // 3. CREATE THE IMMUTABLE LEDGER ENTRY - The most important new step!
                await tx.ledgerEntry.create({
                    data: {
                        stockRequestId: requestId,
                        productId: request.productId,
                        change: changeAmount,
                        newQuantity: updatedProduct.quantity, // The quantity AFTER the transaction
                    },
                });
                // 4. (Optional) Create an Audit Log
                await tx.auditLog.create({
                    data: {
                        action: 'STOCK_REQUEST_APPROVED',
                        details: `Admin ${session.user.email} approved request ${requestId}.`,
                        userId: approverId,
                    }
                });
                return updatedRequest;
            });
            return server_1.NextResponse.json(result);
        }
    }
    catch (error) {
        console.error('Error processing request:', error);
        return server_1.NextResponse.json({ error: 'Request processing failed' }, { status: 500 });
    }
}
