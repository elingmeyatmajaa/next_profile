// app/api/users/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";
import { t } from "../../../lib/i18n";

export async function GET(req: Request) {
  const lang = req.headers.get("accept-language");
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        include: {
          roles: { include: { role: true } },
        },
        orderBy: { id: "desc" }, // biar urut terbaru dulu
      }),
      prisma.user.count(),
    ]);

    // hapus password dari setiap user
    const safeUsers = users.map((u) => {
      const { password, ...rest } = u as any;
      return rest;
    });

  
    return NextResponse.json(
      {
        status: "success",
        code: 200,
        message: "OK",
        data: safeUsers,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
          nextPage: page < Math.ceil(total / limit) ? page + 1 : null,
          prevPage: page > 1 ? page - 1 : null,
        },
      },
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

// app/api/users/route.ts
export async function POST(req: Request) {
  const lang = req.headers.get("accept-language");
  try {
    const form = await req.formData();

    const name = form.get("name") as string | null;
    const email = form.get("email") as string | null;
    const password = form.get("password") as string | null;
    const roleIdsRaw = form.getAll("roleIds"); // bisa multiple field "roleIds"
    const roleIds = roleIdsRaw.map((r) => String(r)); // UUID[]

    if (!name || !email || !password || roleIds.length === 0) {
      return NextResponse.json(
        { message: t("BAD_REQUEST", lang) },
        { status: 400 }
      );
    }

    // contoh jika ada file upload
    const avatar = form.get("avatar") as File | null;
    let avatarUrl: string | null = null;

    if (avatar) {
      // ⚡ contoh: simpan avatar ke /uploads atau cloud storage
      const bytes = await avatar.arrayBuffer();
      const buffer = Buffer.from(bytes);
      // TODO: save buffer ke filesystem atau S3, lalu set avatarUrl
      avatarUrl = `/uploads/${avatar.name}`;
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      // create user
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashed,
          ...(avatarUrl && { avatar: avatarUrl }),
        },
      });

      // assign roles
      if (roleIds.length > 0) {
        const pivotData = roleIds.map((rid: string) => ({
          user_id: user.id,
          role_id: rid,
        }));
        await tx.userRole.createMany({ data: pivotData, skipDuplicates: true });
      }

      const userWithRoles = await tx.user.findUnique({
        where: { id: user.id },
        include: { roles: { include: { role: true } } },
      });

      if (userWithRoles) {
        // @ts-ignore
        delete userWithRoles.password;
      }

      return userWithRoles;
    });

    return NextResponse.json(
      { message: t("CREATED", lang), data: result },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: t("SERVER_ERROR", lang) },
      { status: 500 }
    );
  }
}
