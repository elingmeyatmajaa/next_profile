// app/api/roles/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { t } from "../../../lib/i18n";

export async function POST(req: Request) {
  const lang = req.headers.get("accept-language");
  try {
    const body = await req.json();
    const { name, slug, permissions } = body;
    // permissions: [{ name, slug }, ...] or array of permission ids? We'll accept array of objects

    if (!name || !slug || !Array.isArray(permissions)) {
      return NextResponse.json({ message: t("BAD_REQUEST", lang) }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const role = await tx.role.create({ data: { name, slug } });

      const permIds: number[] = [];

      for (const p of permissions) {
        if (p.id) {
          permIds.push(p.id);
          continue;
        }
        // upsert permission by slug
        const permission = await tx.permission.upsert({
          where: { slug: p.slug },
          update: {},
          create: { name: p.name, slug: p.slug },
        });
        permIds.push(permission.id);
      }

      const pivotData = permIds.map((pid) => ({ role_id: role.id, permission_id: pid }));
      await tx.rolePermission.createMany({ data: pivotData, skipDuplicates: true });

      const roleWithPerms = await tx.role.findUnique({
        where: { id: role.id },
        include: { permissions: { include: { permission: true } } },
      });

      return roleWithPerms;
    });

    return NextResponse.json({ message: t("CREATED", lang), data: result }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: t("SERVER_ERROR", req.headers.get("accept-language")) }, { status: 500 });
  }
}
