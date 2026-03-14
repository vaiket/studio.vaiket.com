import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireBuilderSession } from "@/lib/session";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireBuilderSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const site = await prisma.builderSite.findFirst({
    where: { id: params.id, ownerId: session.userId },
    select: { id: true }
  });

  if (!site) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.builderSite.update({
    where: { id: site.id },
    data: {
      status: "published",
      publishedAt: new Date(),
      lastEditedAt: new Date()
    }
  });

  return NextResponse.json({ ok: true });
}

