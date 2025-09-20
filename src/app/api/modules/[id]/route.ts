import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";
import { t } from "@/lib/i18n";

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

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const lang = req.headers.get("accept-language") || "en";
  const moduleId = params.id;

  try {
    const body = await req.json();
    const { name, slug, actions } = body;

    // validasi minimal
    if (!name && !slug && !actions) {
      return NextResponse.json(
        { status: "error", code: 400, message: t("BAD_REQUEST", lang) },
        { status: 400 }
      );
    }

    // cek module exist
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
    });
    if (!module) {
      return NextResponse.json(
        { status: "error", code: 404, message: t("NOT_FOUND", lang) },
        { status: 404 }
      );
    }

    // update nama dan slug
    const updatedModule = await prisma.module.update({
      where: { id: moduleId },
      data: {
        name: name ?? module.name,
        slug: slug ?? module.slug,
      },
    });

    // update actions (ModuleAction pivot)
    if (actions && Array.isArray(actions)) {
      // hapus relasi lama
      await prisma.moduleAction.deleteMany({
        where: { module_id: moduleId },
      });

      // buat relasi baru
      const moduleActionData = actions.map((actionSlug: string) => ({
        module_id: moduleId,
        action_id: actionSlug, // pastikan ini adalah id action, bukan slug
      }));
      await prisma.moduleAction.createMany({
        data: moduleActionData,
        skipDuplicates: true,
      });
    }

    return NextResponse.json(
      { status: "success", code: 200, message: t("UPDATED", lang), data: updatedModule },
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