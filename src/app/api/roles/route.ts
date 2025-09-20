// app/api/roles/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { t } from "../../../lib/i18n";

export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
    return NextResponse.json({ status: "success", code: 200, data: roles });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: "error", code: 500, message: "Server error" });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json({ status: "error", code: 400, message: "Bad request" });
    }

    const newRole = await prisma.role.create({
      data: { name, slug },
    });

    return NextResponse.json({ status: "success", code: 201, data: newRole });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: "error", code: 500, message: "Server error" });
  }
}
