import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/session";
import { verifySsoToken } from "@/lib/sso";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/sso-error", req.url));
  }

  let payload;
  try {
    payload = await verifySsoToken(token);
  } catch {
    return NextResponse.redirect(new URL("/sso-error", req.url));
  }

  const builderUser = await prisma.builderUser.upsert({
    where: {
      vaiketUserId_tenantId: {
        vaiketUserId: payload.sub,
        tenantId: payload.tenantId
      }
    },
    update: {
      email: payload.email
    },
    create: {
      vaiketUserId: payload.sub,
      email: payload.email,
      tenantId: payload.tenantId
    }
  });

  const sessionToken = await createSessionToken(builderUser.id);

  const intent = url.searchParams.get("intent") ?? payload.intent;
  const siteId = url.searchParams.get("siteId") ?? payload.siteId;

  let redirectPath = "/sites";
  if (intent === "templates") {
    redirectPath = "/templates";
  } else if (intent === "create") {
    redirectPath = "/sites/new";
  } else if (siteId) {
    redirectPath = `/sites/${encodeURIComponent(siteId)}/editor`;
  }

  const response = NextResponse.redirect(new URL(redirectPath, req.url));
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: sessionToken,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/"
  });

  return response;
}

