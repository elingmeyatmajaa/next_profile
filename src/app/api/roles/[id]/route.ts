import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { t } from "@/lib/i18n";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        permissions: { include: { permission: true } },
        users: true,
      },
    });

    if (!role) {
      return NextResponse.json(
        { status: "error", code: 404, message: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: "success", code: 200, data: role },
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const lang = req.headers.get("accept-language") || "en";

  try {
    const formData = await req.formData();
    const name = formData.get("name")?.toString() || null;
    let slug = formData.get("slug")?.toString() || null;
    const permissionsRaw = formData.get("permissions")?.toString() || "";

    if (!name) {
      return NextResponse.json(
        { status: "error", code: 400, message: t("BAD_REQUEST", lang) },
        { status: 400 }
      );
    }

    if (!slug) slug = slugify(name);

    const permissions = permissionsRaw
      ? permissionsRaw.split(",").map((p) => p.trim())
      : [];

    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        name,
        slug,
        permissions: permissions.length
          ? {
              deleteMany: {},
              create: permissions.map((permissionId) => ({
                permission_id: permissionId,
              })),
            }
          : undefined,
      },
      include: {
        permissions: { include: { permission: true } },
      },
    });

    return NextResponse.json(
      { status: "success", code: 200, data: updatedRole },
      { status: 200 }
    );
  } catch (err) {
    console.error("PUT role error:", err);
    return NextResponse.json(
      { status: "error", code: 500, message: t("SERVER_ERROR", lang) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.role.delete({
      where: { id },
    });

    return NextResponse.json(
      { status: "success", code: 200, message: "Deleted" },
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
