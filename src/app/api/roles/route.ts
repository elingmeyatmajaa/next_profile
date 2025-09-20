// app/api/roles/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { t } from "../../../lib/i18n";
import { slugify } from "@/lib/slugify";

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
  const lang = req.headers.get("accept-language") || "en";

  try {
    const formData = await req.formData();
    const name = formData.get("name")?.toString() || null;
    let slug = formData.get("slug")?.toString() || null;
    const permissionsRaw = formData.get("permissions")?.toString() || ""; // "id1,id2,id3"

    if (!name) {
      return NextResponse.json(
        { status: "error", code: 400, message: t("BAD_REQUEST", lang) },
        { status: 400 }
      );
    }

    // auto-generate slug dari name jika tidak ada
    if (!slug) {
      slug = slugify(name);
    }

    const permissions = permissionsRaw
      ? permissionsRaw.split(",").map((p) => p.trim())
      : [];

    const newRole = await prisma.role.create({
      data: {
        name,
        slug,
        permissions: permissions.length
          ? {
              create: permissions.map((permissionId) => ({
                permission: { connect: { id: permissionId } },
              })),
            }
          : undefined,
      },
      include: {
        permissions: { include: { permission: true } },
      },
    });

    return NextResponse.json(
      { status: "success", code: 201, data: newRole },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST role error:", err);
    return NextResponse.json(
      { status: "error", code: 500, message: t("SERVER_ERROR", lang) },
      { status: 500 }
    );
  }
}