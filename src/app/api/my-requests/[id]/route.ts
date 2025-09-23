import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
// Use string literals for enum values

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } } // ✅ Don’t destructure here
) {
  const { id } = context.params; // ✅ Destructure inside the function

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const requestToDelete = await prisma.stockRequest.findUnique({
      where: { id },
    });

    if (!requestToDelete || requestToDelete.requestedBy !== session.user.id) {
      return NextResponse.json(
        { error: "Request not found or access denied" },
        { status: 404 }
      );
    }

    if (requestToDelete.status !== 'PENDING') {
      return NextResponse.json(
        { error: "Only pending requests can be deleted" },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.stockItem.update({
        where: { id: requestToDelete.stockItemId },
        data: { status: 'IN_STOCK' },
      }),
      prisma.stockRequest.delete({
        where: { id },
      }),
    ]);

    return NextResponse.json(
      { message: "Request deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete request:", error);
    return NextResponse.json(
      { error: "Failed to delete request" },
      { status: 500 }
    );
  }
}
