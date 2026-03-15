import { NextRequest } from "next/server";

export default function nextSearch(
  next_request: NextRequest,
  key: string
): string | null {
  return next_request.nextUrl.searchParams.get(key);
}
