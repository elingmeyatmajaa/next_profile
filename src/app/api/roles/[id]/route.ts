import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { t } from "@/lib/i18n";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const role = await prisma.role.findUnique({
      where: { id: params.id },
      include: {
        permissions: { include: { permission: true } },
        users: true,
      },
    });

    if (!role) return NextResponse.json({ status: "error", code: 404, message: "Not found" });

    return NextResponse.json({ status: "success", code: 200, data: role });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: "error", code: 500, message: "Server error" });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    if (!slug) {
      slug = slugify(name);
    }

    const permissions = permissionsRaw
      ? permissionsRaw.split(",").map((p) => p.trim())
      : [];

    const updatedRole = await prisma.role.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        permissions: permissions.length
          ? {
              deleteMany: {}, // hapus relasi lama
              create: permissions.map((permissionId) => ({
                permission_id: permissionId,
              })),
            }
          : undefined,
      },
      include: { permissions: { include: { permission: true } } },
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

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.role.delete({ where: { id: params.id } });
    return NextResponse.json({ status: "success", code: 200, message: "Deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: "error", code: 500, message: "Server error" });
  }
}
