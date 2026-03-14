import Link from "next/link";

export default function SsoErrorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <div className="rounded-2xl border border-rose-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold text-rose-600">SSO Error</p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          We could not verify your token.
        </h1>
        <p className="mt-2 text-slate-600">
          Please return to the Vaiket dashboard and try launching Studio again.
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

