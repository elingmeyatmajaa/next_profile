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
    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { status: "error", code: 400, message: t("BAD_REQUEST", lang) },
        { status: 400 }
      );
    }

    const newModule = await prisma.module.create({
      data: { name, slug },
    });

    return NextResponse.json(
      { status: "success", code: 201, message: t("CREATED", lang), data: newModule },
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