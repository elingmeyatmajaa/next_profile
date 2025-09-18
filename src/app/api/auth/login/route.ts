// app/api/auth/login/route.ts
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { signJwt } from "../../../../lib/jwt";
import { t } from "../../../../lib/i18n";
import { apiResponse } from "../../../../lib/apiResponse";
import { validateFormData } from "@/lib/utils/validations";

export async function POST(req: Request) {
  const lang = req.headers.get("accept-language") || "en";

  try {
    const formData = await req.formData();
    const errors = validateFormData(formData, ["email", "password"]);

    if (errors) {
      return apiResponse({
        status: "error",
        code: 400,
        message: t("BAD_REQUEST", lang),
        errors,
      });
    }

    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: {
              include: { permissions: { include: { permission: true } } },
            },
          },
        },
      },
    });

    if (!user) {
      return apiResponse({
        status: "error",
        code: 401,
        message: t("INVALID_CREDENTIALS", lang),
      });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return apiResponse({
        status: "error",
        code: 401,
        message: t("INVALID_CREDENTIALS", lang),
      });
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

    return apiResponse({
      status: "success",
      code: 200,
      message: t("LOGIN_SUCCESS", lang),
      data: { user, token },
    });
  } catch (err) {
    console.error(err);
    return apiResponse({
      status: "error",
      code: 500,
      message: t("SERVER_ERROR", lang),
    });
  }
}
