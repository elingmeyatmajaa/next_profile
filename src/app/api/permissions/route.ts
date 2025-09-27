import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";

    // filter pencarian
    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { slug: { contains: search } }, // kalau model ada slug
          ],
        }
      : {};

    // total data
    const total = await prisma.permission.count({ where });

    // data dengan pagination
    const permissions = await prisma.permission.findMany({
      where,
      include: {
        module: true,
        action: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json(
      {
        status: "success",
        code: 200,
        message: "OK",
        data: permissions,
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
    console.error("Error fetching permissions:", err);
    return NextResponse.json(
      { status: "error", code: 500, message: "Server error" },
      { status: 500 }
    );
  }
}
