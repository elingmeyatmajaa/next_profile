import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { verifyJwt } from "../../../../lib/jwt";
import { apiResponse } from "../../../../lib/apiResponse";
import { t } from "../../../../lib/i18n";

export async function GET(req: Request) {
  const lang = req.headers.get("accept-language") || "en";
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return apiResponse({
      status: "error",
      code: 401,
      message: t("INVALID_CREDENTIALS", lang),
    });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = verifyJwt(token);

    if (!decoded) {
      return apiResponse({
        status: "error",
        code: 401,
        message: t("INVALID_CREDENTIALS", lang),
      });
    }

    const user = await prisma.user.findUnique({
  where: { id: Number(decoded.sub) },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return apiResponse({
        status: "error",
        code: 404,
        message: t("NOT_FOUND", lang),
      });
    }

    // hapus password sebelum return
    // @ts-ignore
    delete user.password;

    return apiResponse({
      status: "success",
      code: 200,
      message: t("SUCCESS", lang),
      data: user,
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
