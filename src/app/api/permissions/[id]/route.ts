import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const permission = await prisma.permission.findUnique({
      where: { id },
      include: {
        module: true,
        action: true,
      },
    });

    if (!permission) {
      return NextResponse.json(
        { status: "error", code: 404, message: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: "success", code: 200, data: permission },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { status: "error", code: 500, message: "Server error" },
      { status: 500 }
    );
  }
}