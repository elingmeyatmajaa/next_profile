import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { t } from "@/lib/i18n";

export async function GET(req: Request) {
  const lang = req.headers.get("accept-language") || "en";

  try {
    const modules = await prisma.module.findMany({
      include: {
        ModuleAction: {
          include: {
            action: true,
          },
        },
        permissions: true,
      },
    });

    return NextResponse.json({
      status: "success",
      code: 200,
      message: t("SUCCESS", lang),
      data: modules,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      status: "error",
      code: 500,
      message: t("SERVER_ERROR", lang),
    });
  }
}
export async function POST(req: Request) {
  const lang = req.headers.get("accept-language") || "en";

  try {
    const body = await req.json();
    const { name, slug, actions } = body; // actions = ["create","read"] misal

    if (!name || !slug) {
      return NextResponse.json(
        { status: "error", code: 400, message: t("BAD_REQUEST", lang) },
        { status: 400 }
      );
    }

    // Buat module
    const newModule = await prisma.module.create({
      data: { name, slug },
    });

    // Jika ada actions, hubungkan ke module via ModuleAction
    if (actions && actions.length > 0) {
      const actionRecords = await prisma.action.findMany({
        where: { slug: { in: actions } },
      });

      const moduleActionsData = actionRecords.map((act) => ({
        module_id: newModule.id,
        action_id: act.id,
      }));

      await prisma.moduleAction.createMany({
        data: moduleActionsData,
        skipDuplicates: true,
      });
    }

    // Optional: fetch module beserta ModuleAction untuk return
    const moduleWithActions = await prisma.module.findUnique({
      where: { id: newModule.id },
      include: { ModuleAction: true },
    });

    return NextResponse.json(
      { status: "success", code: 201, message: t("CREATED", lang), data: moduleWithActions },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { status: "error", code: 500, message: t("SERVER_ERROR", lang) },
      { status: 500 }
    );
  }
}
