import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";
import { t } from "@/lib/i18n";

export async function POST(req: Request) {
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

    // Jika pakai refresh token di DB, bisa hapus token tsb:
    // await prisma.refreshToken.deleteMany({ where: { userId: decoded.sub } });

    // Logout dengan JWT stateless biasanya cukup di client hapus token
    return NextResponse.json(
      { status: "success", code: 200, message: t("LOGOUT_SUCCESS", lang) },
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
