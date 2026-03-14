import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { getJwtSecret } from "./jwt";

export const SESSION_COOKIE_NAME = "studio_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

export type BuilderSession = {
  userId: string;
};

export async function createSessionToken(userId: string) {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getJwtSecret());
}

async function verifySessionToken(token: string): Promise<BuilderSession | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    if (!payload.sub) {
      return null;
    }
    return { userId: payload.sub };
  } catch {
    return null;
  }
}

export async function getBuilderSession(): Promise<BuilderSession | null> {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }
  return verifySessionToken(token);
}

export async function requireBuilderSession(
  req: NextRequest
): Promise<BuilderSession | null> {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }
  return verifySessionToken(token);
}

