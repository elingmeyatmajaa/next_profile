import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const permissions = await prisma.permission.findMany({
      include: {
        module: true,
        action: true,
      },
    });

    return NextResponse.json({ status: "success", code: 200, data: permissions });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: "error", code: 500, message: "Server error" });
  }
}
