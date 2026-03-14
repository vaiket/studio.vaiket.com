import { jwtVerify } from "jose";
import { getJwtSecret } from "./jwt";

export type SsoPayload = {
  sub: string;
  tenantId: number;
  email: string;
  siteId?: string;
  intent?: "create" | "templates";
};

export async function verifySsoToken(token: string): Promise<SsoPayload> {
  const { payload } = await jwtVerify(token, getJwtSecret());

  if (typeof payload.sub !== "string" || payload.sub.length === 0) {
    throw new Error("Missing sub");
  }

  const rawTenantId = payload.tenantId;
  const tenantId =
    typeof rawTenantId === "number"
      ? rawTenantId
      : Number.parseInt(String(rawTenantId ?? ""), 10);

  if (!Number.isFinite(tenantId)) {
    throw new Error("Missing tenantId");
  }

  if (typeof payload.email !== "string" || payload.email.length === 0) {
    throw new Error("Missing email");
  }

  const siteId = typeof payload.siteId === "string" ? payload.siteId : undefined;
  const intent =
    payload.intent === "create" || payload.intent === "templates"
      ? payload.intent
      : undefined;

  return {
    sub: payload.sub,
    tenantId,
    email: payload.email,
    siteId,
    intent
  };
}

