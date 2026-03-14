"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type TemplateSummary = {
  id: string;
  name: string;
  category: string;
};

export default function NewSitePage() {
  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [templates, setTemplates] = useState<TemplateSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const res = await fetch("/api/templates");
        if (!res.ok) return;
        const data = await res.json();
        setTemplates(data.templates ?? []);
      } catch {
        setTemplates([]);
      }
    };
    loadTemplates();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, templateId: templateId || null })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Unable to create site.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      router.push(`/sites/${data.siteId}/editor`);
    } catch {
      setError("Unable to create site.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-900">Create a Site</h1>
      <p className="mt-2 text-sm text-slate-600">
        Start with a name and optional template.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5 rounded-2xl border border-slate-200 bg-white p-6"
      >
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            Site name
          </label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            placeholder="Studio Launch"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            Template
          </label>
          <select
            value={templateId}
            onChange={(event) => setTemplateId(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">No template</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name} · {template.category}
              </option>
            ))}
          </select>
        </div>

        {error ? (
          <p className="text-sm text-rose-600">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Site"}
        </button>
      </form>
    </section>
  );
}
