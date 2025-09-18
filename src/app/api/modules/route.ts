// app/api/modules/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { t } from "../../../lib/i18n";

export async function POST(req: Request) {
  const lang = req.headers.get("accept-language");
  try {
    const body = await req.json();
    const { name, slug, actionIds } = body; // actionIds: number[]

    if (!name || !slug || !Array.isArray(actionIds)) {
      return NextResponse.json({ message: t("BAD_REQUEST", lang) }, { status: 400 });
    }

    // Transaction: create module + create pivot records
    const result = await prisma.$transaction(async (tx) => {
      const module = await tx.module.create({
        data: { name, slug },
      });

      const pivots = actionIds.map((aid: number) => ({
        module_id: module.id,
        action_id: aid,
      }));

      // createMany on ModuleAction
      await tx.moduleAction.createMany({
        data: pivots,
        skipDuplicates: true,
      });

      const moduleWithActions = await tx.module.findUnique({
        where: { id: module.id },
        include: { actions: { include: { action: true } } },
      });

      return moduleWithActions;
    });

    return NextResponse.json({ message: t("CREATED", lang), data: result }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: t("SERVER_ERROR", req.headers.get("accept-language")) }, { status: 500 });
  }
}
