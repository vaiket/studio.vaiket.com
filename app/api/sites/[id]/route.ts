import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireBuilderSession } from "@/lib/session";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireBuilderSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const site = await prisma.builderSite.findFirst({
    where: { id: params.id, ownerId: session.userId },
    include: { pages: { take: 1, orderBy: { createdAt: "asc" } } }
  });

  if (!site) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    site: {
      id: site.id,
      name: site.name,
      domain: site.domain,
      status: site.status,
      lastEditedAt: site.lastEditedAt,
      publishedAt: site.publishedAt,
      page: site.pages[0] ?? null
    }
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireBuilderSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : undefined;
  const domain =
    typeof body?.domain === "string" ? body.domain.trim() : undefined;
  const status =
    body?.status === "draft" || body?.status === "published"
      ? body.status
      : undefined;

  const data: Record<string, unknown> = {};
  if (name) {
    data.name = name;
    data.lastEditedAt = new Date();
  }
  if (domain !== undefined) {
    data.domain = domain.length > 0 ? domain : null;
    data.lastEditedAt = new Date();
  }
  if (status) {
    data.status = status;
    if (status === "published") {
      data.publishedAt = new Date();
    }
    if (status === "draft") {
      data.publishedAt = null;
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No changes provided." }, { status: 400 });
  }

  const site = await prisma.builderSite.findFirst({
    where: { id: params.id, ownerId: session.userId },
    select: { id: true }
  });

  if (!site) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.builderSite.update({
    where: { id: site.id },
    data,
    select: { id: true }
  });

  return NextResponse.json({ siteId: updated.id });
}
