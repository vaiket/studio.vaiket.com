import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getBuilderSession } from "@/lib/session";
import EditorClient from "./EditorClient";

export default async function EditorPage({
  params
}: {
  params: { id: string };
}) {
  const session = await getBuilderSession();
  if (!session) {
    redirect("/unauthorized");
  }

  const site = await prisma.builderSite.findFirst({
    where: { id: params.id, ownerId: session.userId },
    include: { pages: true }
  });

  if (!site) {
    notFound();
  }

  const page = site.pages[0];

  return (
    <EditorClient
      site={{
        id: site.id,
        name: site.name,
        domain: site.domain ?? ""
      }}
      initialContent={page?.contentJson ?? { blocks: [] }}
    />
  );
}

