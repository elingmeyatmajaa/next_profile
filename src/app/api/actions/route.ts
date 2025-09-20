// app/api/actions/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { t } from "../../../lib/i18n";
import { verifyJwt } from "@/lib/jwt";

export async function GET(req: Request) {
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
    const decoded: any = verifyJwt(token);

    if (!decoded) {
      return NextResponse.json(
        { status: "error", code: 401, message: t("INVALID_CREDENTIALS", lang) },
        { status: 401 }
      );
    }

    const actions = await prisma.action.findMany();

    return NextResponse.json(
      { status: "success", code: 200, message: "OK", data: actions },
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

    const action = await prisma.action.create({
      data: { name, slug },
    });

    return NextResponse.json(
      { status: "success", code: 201, message: t("CREATED", lang), data: action },
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
