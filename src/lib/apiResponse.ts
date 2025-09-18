// lib/apiResponse.ts
import { NextResponse } from "next/server";

type ApiResponseOptions = {
  status: "success" | "error";
  code: number;
  message: string;
  data?: any;
  errors?: Record<string, any>;
  token?: string;
};

export function apiResponse({
  status,
  code,
  message,
  data,
  errors,
  token,
}: ApiResponseOptions) {
  return NextResponse.json(
    {
      status,
      code,
      message,
      ...(data !== undefined && { data }),
      ...(errors !== undefined && { errors }),
      ...(token !== undefined && { token }),
    },
    { status: code }
  );
}
