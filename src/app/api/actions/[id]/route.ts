// app/api/actions/[id]/route.ts
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

    // ID sekarang UUID string, tidak perlu Number()
    const action = await prisma.action.findUnique({
      where: { id: params.id },
    });

    if (!action) {
      return NextResponse.json(
        { status: "error", code: 404, message: t("NOT_FOUND", lang) },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: "success", code: 200, message: "OK", data: action },
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const lang = req.headers.get("accept-language") || "en";

  try {
    // Langsung gunakan string UUID
    const action = await prisma.action.findUnique({ where: { id: params.id } });
    if (!action) {
      return NextResponse.json(
        { status: "error", code: 404, message: t("NOT_FOUND", lang) },
        { status: 404 }
      );
    }

    await prisma.action.delete({ where: { id: params.id } });

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

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const lang = req.headers.get("accept-language") || "en";

  try {
    const body = await req.json();
    const { name, slug } = body;

    if (!name && !slug) {
      return NextResponse.json(
        { status: "error", code: 400, message: t("BAD_REQUEST", lang) },
        { status: 400 }
      );
    }

    const action = await prisma.action.findUnique({ where: { id: params.id } });
    if (!action) {
      return NextResponse.json(
        { status: "error", code: 404, message: t("NOT_FOUND", lang) },
        { status: 404 }
      );
    }

    const updatedAction = await prisma.action.update({
      where: { id: params.id },
      data: {
        name: name ?? action.name,
        slug: slug ?? action.slug,
      },
    });

    return NextResponse.json(
      { status: "success", code: 200, message: t("UPDATED", lang), data: updatedAction },
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