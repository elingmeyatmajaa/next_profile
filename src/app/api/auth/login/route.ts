// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { signJwt } from "../../../../lib/jwt";
import { t } from "../../../../lib/i18n";
import { validateFormData } from "@/lib/utils/validations";

export async function POST(req: Request) {
  const lang = req.headers.get("accept-language");

  try {
    const formData = await req.formData();
    const errors = validateFormData(formData, ["email", "password"]);

    if (errors) {
      return NextResponse.json(
        { message: t("BAD_REQUEST", lang), errors },
        { status: 400 }
      );
    }

    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: { include: { permissions: { include: { permission: true } } } },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: t("INVALID_CREDENTIALS", lang) },
        { status: 401 }
      );
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json(
        { message: t("INVALID_CREDENTIALS", lang) },
        { status: 401 }
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles.map((r) => r.role.slug),
    };

    const token = signJwt(payload);

    // @ts-ignore
    delete user.password;

    return NextResponse.json({
      message: t("LOGIN_SUCCESS", lang),
      data: { user, token },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: t("SERVER_ERROR", lang) },
      { status: 500 }
    );
  }
}
