export function getJwtSecret(): Uint8Array {
  const secret = process.env.BUILDER_SSO_SECRET;
  if (!secret) {
    throw new Error("Missing BUILDER_SSO_SECRET");
  }
  return new TextEncoder().encode(secret);
}

