// app/api/actions/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";
import { t } from "@/lib/i18n";
import { slugify } from "@/lib/slugify";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;
  const search = searchParams.get("search");

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

    // filter by name
    const where = search
      ? {
          name: {
            contains: search,
          },
        }
      : {};

    const [total, actions] = await Promise.all([
      prisma.action.count({ where }),
      prisma.action.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }, 
      }),
    ]);

    return NextResponse.json(
      {
        status: "success",
        code: 200,
        message: "OK",
        data: actions,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
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



export async function POST(req: Request) {
  const lang = req.headers.get("accept-language") || "en";

  try {
    let name: string | null = null;
    let slug: string | null = null;

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await req.json();
      name = body.name;
      slug = body.slug ?? slugify(body.name); // generate slug jika tidak ada
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      name = formData.get("name")?.toString() || null;
      slug = formData.get("slug")?.toString() || (name ? slugify(name) : null);
    }

    if (!name) {
      return NextResponse.json(
        { status: "error", code: 400, message: t("BAD_REQUEST", lang) },
        { status: 400 }
      );
    }

    const action = await prisma.action.create({ data: { name, slug: slug! } });

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