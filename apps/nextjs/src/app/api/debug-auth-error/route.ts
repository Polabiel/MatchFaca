import { NextResponse } from "next/server";

import { readLastAuthError } from "@matchfaca/auth/config";

export const dynamic = "force-dynamic";

/**
 * Debug endpoint to read the last auth error.
 * Ported from Yield pattern — writes auth errors to /tmp for debugging.
 *
 * Use: GET /api/debug-auth-error
 * Returns: The last auth error object, or 200 with "No auth error recorded"
 */
export function GET() {
  const error = readLastAuthError();

  if (!error) {
    return NextResponse.json(
      { error: "No auth error recorded" },
      { status: 200 },
    );
  }

  return NextResponse.json(error, { status: 200 });
}
