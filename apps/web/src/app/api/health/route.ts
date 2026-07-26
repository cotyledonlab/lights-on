import { database } from "@lights-on/database";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await database.$queryRaw`SELECT 1`;
    return NextResponse.json(
      { service: "web", status: "ok" },
      {
        headers: {
          "cache-control": "no-store"
        }
      }
    );
  } catch {
    return NextResponse.json(
      { service: "web", status: "unavailable" },
      {
        headers: {
          "cache-control": "no-store"
        },
        status: 503
      }
    );
  }
}
