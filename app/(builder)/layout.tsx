import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getBuilderSession } from "@/lib/session";

export default async function BuilderLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getBuilderSession();
  if (!session) {
    redirect("/unauthorized");
  }

  const builderUser = await prisma.builderUser.findUnique({
    where: { id: session.userId }
  });

  if (!builderUser) {
    redirect("/unauthorized");
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-semibold text-emerald-700">
              Connected to Vaiket
            </p>
            <p className="text-xs text-slate-500">{builderUser.email}</p>
          </div>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link className="text-slate-600 hover:text-slate-900" href="/sites">
              Sites
            </Link>
            <Link
              className="text-slate-600 hover:text-slate-900"
              href="/templates"
            >
              Templates
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}

