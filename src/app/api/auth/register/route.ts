// app/api/auth/register/route.ts
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

    // validasi input
    const errors = validateFormData(formData, ["name", "email", "password"]);
    if (errors) {
      return apiResponse({
        status: "error",
        code: 400,
        message: t("BAD_REQUEST", lang),
        errors,
      });
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const roleIdsRaw = formData.get("roleIds") as string | null;

    let roleIds: number[] = [];
    if (roleIdsRaw) {
      try {
        roleIds = JSON.parse(roleIdsRaw);
      } catch {
        roleIds = [];
      }
    }

    // cek email sudah dipakai
    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist) {
      return apiResponse({
        status: "error",
        code: 409,
        message: t("EMAIL_EXISTS", lang),
      });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { name, email, password: hashed },
      });

      if (roleIds.length > 0) {
        const pivots = roleIds.map((rid: number) => ({
          user_id: user.id,
          role_id: rid,
        }));
        await tx.userRole.createMany({ data: pivots, skipDuplicates: true });
      }

      const userWithRoles = await tx.user.findUnique({
        where: { id: user.id },
        include: { roles: { include: { role: true } } },
      });

      // hapus password sebelum return
      // @ts-ignore
      delete userWithRoles?.password;

      return userWithRoles;
    });

    // buat JWT (auto login setelah register)
    const token = signJwt({
      sub: result?.id,
      email: result?.email,
      roles: result?.roles.map((r) => r.role.slug),
    });

    return apiResponse({
      status: "success",
      code: 201,
      message: t("CREATED", lang),
      data: result,
      token,
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
