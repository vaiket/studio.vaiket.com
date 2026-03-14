import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold text-emerald-700">
          Vaiket Studio
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          Website Builder
        </h1>
        <p className="mt-2 text-slate-600">
          Launch and manage Vaiket sites with templates, editor blocks, and
          instant publishing.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/sites"
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
          >
            Open Studio
          </Link>
          <Link
            href="/templates"
            className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700"
          >
            Browse Templates
          </Link>
        </div>
      </div>
    </main>
  );
}

