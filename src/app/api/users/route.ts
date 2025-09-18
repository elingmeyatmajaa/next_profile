// app/api/users/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";
import { t } from "../../../lib/i18n";

export async function POST(req: Request) {
  const lang = req.headers.get("accept-language");
  try {
    const body = await req.json();
    const { name, email, password, roleIds } = body; // roleIds: number[]

    if (!name || !email || !password || !Array.isArray(roleIds)) {
      return NextResponse.json({ message: t("BAD_REQUEST", lang) }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { name, email, password: hashed },
      });

      const pivotData = roleIds.map((rid: number) => ({ user_id: user.id, role_id: rid }));
      await tx.userRole.createMany({ data: pivotData, skipDuplicates: true });

      const userWithRoles = await tx.user.findUnique({
        where: { id: user.id },
        include: { roles: { include: { role: true } } },
      });

      // remove password from returned object
      if (userWithRoles) {
        // @ts-ignore
        delete userWithRoles.password;
      }

      return userWithRoles;
    });

    return NextResponse.json({ message: t("CREATED", lang), data: result }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: t("SERVER_ERROR", req.headers.get("accept-language")) }, { status: 500 });
  }
}
