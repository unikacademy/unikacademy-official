import { NextResponse } from "next/server";

export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function err(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export async function withDB(
  fn: () => Promise<NextResponse>,
  errorLabel = "operation",
): Promise<NextResponse> {
  try {
    return await fn();
  } catch (error) {
    console.error(`Error during ${errorLabel}:`, error);
    return err(`Failed to ${errorLabel}`);
  }
}
