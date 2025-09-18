// app/api/actions/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { t } from "../../../lib/i18n";

export async function POST(req: Request) {
  const lang = req.headers.get("accept-language");
  try {
    const body = await req.json();
    const { name, slug } = body;
    if (!name || !slug) return NextResponse.json({ message: t("BAD_REQUEST", lang) }, { status: 400 });

    const action = await prisma.action.create({
      data: { name, slug },
    });

    return NextResponse.json({ message: t("CREATED", lang), data: action }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: t("SERVER_ERROR", req.headers.get("accept-language")) }, { status: 500 });
  }
}
