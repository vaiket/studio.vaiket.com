import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold text-slate-700">Unauthorized</p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          Please open Studio from your Vaiket dashboard.
        </h1>
        <p className="mt-2 text-slate-600">
          Studio requires a secure SSO session to access your websites.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
        >
          Back to Studio Home
        </Link>
      </div>
    </main>
  );
}

