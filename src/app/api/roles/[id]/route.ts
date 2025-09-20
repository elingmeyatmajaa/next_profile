import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
  try {
    const body = await req.json();
    const { name, slug, permissions } = body; // permissions: array of permission IDs

    // Update role data
    const updatedRole = await prisma.role.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        permissions: permissions
          ? {
              // Hapus role_permission lama, set yang baru
              deleteMany: {},
              create: permissions.map((permissionId: string) => ({
                permission_id: permissionId,
              })),
            }
          : undefined,
      },
      include: { permissions: { include: { permission: true } } },
    });

    return NextResponse.json({
      status: "success",
      code: 200,
      data: updatedRole,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      status: "error",
      code: 500,
      message: "Server error",
    });
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
