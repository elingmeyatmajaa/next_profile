import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const permission = await prisma.permission.findUnique({
      where: { id: params.id },
      include: {
        module: true,
        action: true,
      },
    });

    if (!permission) {
      return NextResponse.json({ status: "error", code: 404, message: "Not found" });
    }

    return NextResponse.json({ status: "success", code: 200, data: permission });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: "error", code: 500, message: "Server error" });
  }
}
