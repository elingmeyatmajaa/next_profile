import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { t } from "../../../../lib/i18n";
import bcrypt from "bcryptjs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const lang = req.headers.get("accept-language");

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        roles: { include: { role: true } },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: t("NOT_FOUND", lang) },
        { status: 404 }
      );
    }

    const { password, ...safeUser } = user as any;

    return NextResponse.json(
      { status: "success", code: 200, message: "OK", data: safeUser },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { status: "error", code: 500, message: t("SERVER_ERROR", lang) },
      { status: 500 }
    );
  }
}


export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const lang = req.headers.get("accept-language");

  try {
    const body = await req.json();
    const { name, email, password, roleIds } = body;

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { message: t("NOT_FOUND", lang) },
        { status: 404 }
      );
    }

    let hashedPassword: string | undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const result = await prisma.$transaction(async (tx: any) => {
      await tx.user.update({
        where: { id },
        data: {
          name: name ?? existing.name,
          email: email ?? existing.email,
          ...(hashedPassword && { password: hashedPassword }),
        },
      });

      if (Array.isArray(roleIds)) {
        await tx.userRole.deleteMany({ where: { user_id: id } });

        const pivotData = roleIds.map((rid: string) => ({
          user_id: id,
          role_id: rid,
        }));

        await tx.userRole.createMany({
          data: pivotData,
          skipDuplicates: true,
        });
      }

      return tx.user.findUnique({
        where: { id },
        include: { roles: { include: { role: true } } },
      });
    });

    if (result) {
      // @ts-ignore
      delete result.password;
    }

    return NextResponse.json(
      { message: t("UPDATED", lang), data: result },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: t("SERVER_ERROR", lang) },
      { status: 500 }
    );
  }
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const lang = req.headers.get("accept-language");

  try {
    const existing = await prisma.user.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { message: t("NOT_FOUND", lang) },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx: any) => {
      await tx.userRole.deleteMany({ where: { user_id: id } });
      await tx.user.delete({ where: { id } });
    });

    return NextResponse.json(
      { message: t("DELETED", lang) },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: t("SERVER_ERROR", lang) },
      { status: 500 }
    );
  }
}