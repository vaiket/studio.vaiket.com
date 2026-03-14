"use client";

import { useState } from "react";

type EditorSite = {
  id: string;
  name: string;
  domain: string;
};

type EditorClientProps = {
  site: EditorSite;
  initialContent: unknown;
};

const blocks = ["Hero", "Features", "CTA"];

export default function EditorClient({ site, initialContent }: EditorClientProps) {
  const [name, setName] = useState(site.name);
  const [domain, setDomain] = useState(site.domain);
  const [contentText, setContentText] = useState(
    JSON.stringify(initialContent, null, 2)
  );
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);

    let parsedContent: unknown;
    try {
      parsedContent = JSON.parse(contentText);
    } catch {
      setStatus("Content JSON is invalid.");
      setSaving(false);
      return;
    }

    try {
      const metaRes = await fetch(`/api/sites/${site.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, domain })
      });

      const contentRes = await fetch(`/api/sites/${site.id}/content`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentJson: parsedContent })
      });

      if (!metaRes.ok || !contentRes.ok) {
        setStatus("Unable to save changes.");
      } else {
        setStatus("Changes saved.");
      }
    } catch {
      setStatus("Unable to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    setStatus(null);

    try {
      const res = await fetch(`/api/sites/${site.id}/publish`, {
        method: "POST"
      });

      if (!res.ok) {
        setStatus("Unable to publish.");
      } else {
        setStatus("Site published.");
      }
    } catch {
      setStatus("Unable to publish.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Site Editor</h1>
          <p className="text-sm text-slate-600">
            Drag blocks, update content, and publish when ready.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Save
          </button>
          <button
            onClick={handlePublish}
            disabled={saving}
            className="rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2 text-sm font-semibold text-emerald-700 disabled:opacity-60"
          >
            Publish
          </button>
        </div>
      </div>

      {status ? <p className="mt-3 text-sm text-slate-600">{status}</p> : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 lg:col-span-3">
          <h2 className="text-sm font-semibold text-slate-700">Blocks</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {blocks.map((block) => (
              <li
                key={block}
                className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
              >
                {block}
              </li>
            ))}
          </ul>
        </aside>

        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 lg:col-span-6">
          <h2 className="text-sm font-semibold text-slate-700">Canvas</h2>
          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-500">
            Canvas preview placeholder. Content JSON shown below.
          </div>
          <pre className="mt-4 max-h-64 overflow-auto rounded-xl bg-slate-900 p-4 text-xs text-slate-100">
            {contentText}
          </pre>
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-white p-4 lg:col-span-3">
          <h2 className="text-sm font-semibold text-slate-700">Properties</h2>
          <div className="mt-3 space-y-4">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Site name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Domain
              <input
                value={domain}
                onChange={(event) => setDomain(event.target.value)}
                placeholder="studio.vaiket.com"
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Content JSON
              <textarea
                value={contentText}
                onChange={(event) => setContentText(event.target.value)}
                rows={8}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
              />
            </label>
          </div>
        </aside>
      </div>
    </section>
  );
}

