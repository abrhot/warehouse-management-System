"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
// src/app/api/reports/history/route.ts
const server_1 = require("next/server");
const prisma_1 = require("@/generated/prisma"); // 👈 FINAL CORRECTED IMPORT
const prisma_2 = __importDefault(require("@/lib/prisma"));
// ... rest of the file remains the same
async function GET() {
    try {
        const requestHistory = await prisma_2.default.stockRequest.findMany({
            where: {
                status: {
                    in: [prisma_1.RequestStatus.APPROVED, prisma_1.RequestStatus.REJECTED],
                },
            },
            include: {
                product: { select: { name: true } },
                requester: { select: { name: true } },
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });
        return server_1.NextResponse.json(requestHistory);
    }
    catch (error) {
        console.error('Failed to fetch request history:', error);
        return new server_1.NextResponse('Internal Server Error', { status: 500 });
    }
}
