import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireBuilderSession } from "@/lib/session";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireBuilderSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (body?.contentJson === undefined) {
    return NextResponse.json(
      { error: "contentJson is required." },
      { status: 400 }
    );
  }

  const site = await prisma.builderSite.findFirst({
    where: { id: params.id, ownerId: session.userId },
    include: { pages: { take: 1, orderBy: { createdAt: "asc" } } }
  });

  if (!site) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (site.pages.length === 0) {
    await prisma.builderPage.create({
      data: {
        siteId: site.id,
        title: "Home",
        contentJson: body.contentJson
      }
    });
  } else {
    await prisma.builderPage.update({
      where: { id: site.pages[0].id },
      data: { contentJson: body.contentJson }
    });
  }

  await prisma.builderSite.update({
    where: { id: site.id },
    data: { lastEditedAt: new Date() }
  });

  return NextResponse.json({ ok: true });
}

