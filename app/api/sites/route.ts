import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireBuilderSession } from "@/lib/session";
import { resolveTemplateContent } from "@/lib/templates";

export async function GET(req: NextRequest) {
  const session = await requireBuilderSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sites = await prisma.builderSite.findMany({
    where: { ownerId: session.userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      domain: true,
      status: true,
      lastEditedAt: true,
      updatedAt: true
    }
  });

  return NextResponse.json({ sites });
}

export async function POST(req: NextRequest) {
  const session = await requireBuilderSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const templateId =
    typeof body?.templateId === "string" ? body.templateId : null;

  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  const contentJson = await resolveTemplateContent(templateId);

  const site = await prisma.builderSite.create({
    data: {
      ownerId: session.userId,
      name,
      status: "draft",
      lastEditedAt: new Date(),
      pages: {
        create: {
          title: "Home",
          contentJson
        }
      }
    },
    select: { id: true }
  });

  return NextResponse.json({ siteId: site.id }, { status: 201 });
}

