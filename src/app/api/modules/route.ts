import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { t } from "@/lib/i18n";
import { slugify } from "@/lib/slugify";

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
    const formData = await req.formData();
    const name = formData.get("name")?.toString() || null;
    let slug = formData.get("slug")?.toString() || null;
    const actionsRaw = formData.get("actions")?.toString() || ""; // "create,read,update"

    if (!name) {
      return NextResponse.json(
        { status: "error", code: 400, message: t("BAD_REQUEST", lang) },
        { status: 400 }
      );
    }

    // Generate slug otomatis dari name jika tidak ada
    if (!slug) slug = slugify(name);

    const actions = actionsRaw
      ? actionsRaw.split(",").map((a) => a.trim())
      : [];

    // Buat module
    const newModule = await prisma.module.create({
      data: { name, slug },
    });

    // Hubungkan actions ke module jika ada
    if (actions.length > 0) {
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

    // Ambil module beserta ModuleAction dan permissions untuk return
    const moduleWithRelations = await prisma.module.findUnique({
      where: { id: newModule.id },
      include: {
        ModuleAction: {
          include: { action: true },
        },
        permissions: true,
      },
    });

    return NextResponse.json(
      { status: "success", code: 201, message: t("CREATED", lang), data: moduleWithRelations },
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