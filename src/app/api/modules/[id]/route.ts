import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";
import { t } from "@/lib/i18n";
import { slugify } from "@/lib/slugify";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const lang = req.headers.get("accept-language") || "en";
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { status: "error", code: 401, message: t("INVALID_CREDENTIALS", lang) },
      { status: 401 }
    );
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = verifyJwt(token);
    if (!decoded) {
      return NextResponse.json(
        { status: "error", code: 401, message: t("INVALID_CREDENTIALS", lang) },
        { status: 401 }
      );
    }

    const moduleData = await prisma.module.findUnique({
      where: { id: params.id },
      include: {
        ModuleAction: {
          include: { action: true },
        },
      },
    });

    if (!moduleData) {
      return NextResponse.json(
        { status: "error", code: 404, message: t("NOT_FOUND", lang) },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: "success", code: 200, message: "OK", data: moduleData },
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
  req: Request,
  { params }: { params: { id: string } }
) {
  const lang = req.headers.get("accept-language") || "en";
  const moduleId = params.id;

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

    // cek module exist
    const existingModule = await prisma.module.findUnique({ where: { id: moduleId } });
    if (!existingModule) {
      return NextResponse.json(
        { status: "error", code: 404, message: t("NOT_FOUND", lang) },
        { status: 404 }
      );
    }

    // update nama dan slug
    const updatedModule = await prisma.module.update({
      where: { id: moduleId },
      data: { name, slug },
    });

    // update actions (ModuleAction pivot)
    if (actions.length > 0) {
      // hapus relasi lama
      await prisma.moduleAction.deleteMany({ where: { module_id: moduleId } });

      // ambil action ids dari slug
      const actionRecords = await prisma.action.findMany({
        where: { slug: { in: actions } },
      });

      const moduleActionData = actionRecords.map(act => ({
        module_id: moduleId,
        action_id: act.id,
      }));

      await prisma.moduleAction.createMany({
        data: moduleActionData,
        skipDuplicates: true,
      });
    }

    // return module beserta relasi
    const moduleWithRelations = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { ModuleAction: { include: { action: true } }, permissions: true },
    });

    return NextResponse.json(
      { status: "success", code: 200, message: t("UPDATED", lang), data: moduleWithRelations },
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

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const lang = req.headers.get("accept-language") || "en";

  try {
    const moduleData = await prisma.module.findUnique({ where: { id: params.id } });
    if (!moduleData) {
      return NextResponse.json(
        { status: "error", code: 404, message: t("NOT_FOUND", lang) },
        { status: 404 }
      );
    }

    await prisma.module.delete({ where: { id: params.id } });

    return NextResponse.json(
      { status: "success", code: 200, message: t("DELETED", lang) },
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