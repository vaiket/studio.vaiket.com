import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getBuilderSession } from "@/lib/session";

export default async function SitesPage() {
  const session = await getBuilderSession();
  if (!session) {
    redirect("/unauthorized");
  }

  const sites = await prisma.builderSite.findMany({
    where: { ownerId: session.userId },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">My Websites</h1>
          <p className="text-sm text-slate-600">
            Manage your sites, templates, and publishing.
          </p>
        </div>
        <Link
          href="/sites/new"
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
        >
          Create New
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {sites.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            No sites yet. Create your first website to get started.
          </div>
        ) : (
          sites.map((site) => (
            <div
              key={site.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div>
                <p className="text-lg font-semibold text-slate-900">
                  {site.name}
                </p>
                <p className="text-sm text-slate-500">
                  {site.domain || "No custom domain"}
                </p>
              </div>
              <div className="text-sm text-slate-500">
                <p>Status: {site.status}</p>
                <p>
                  Last edited:{" "}
                  {site.lastEditedAt
                    ? site.lastEditedAt.toISOString().slice(0, 10)
                    : "-"}
                </p>
              </div>
              <Link
                href={`/sites/${site.id}/editor`}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Edit
              </Link>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

