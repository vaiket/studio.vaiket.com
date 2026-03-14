"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type TemplateSummary = {
  id: string;
  name: string;
  category: string;
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<TemplateSummary[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
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

  const handleUseTemplate = async (template: TemplateSummary) => {
    setBusyId(template.id);
    setError(null);

    try {
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${template.name} Site`,
          templateId: template.id
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Unable to create site.");
        setBusyId(null);
        return;
      }

      const data = await res.json();
      router.push(`/sites/${data.siteId}/editor`);
    } catch {
      setError("Unable to create site.");
      setBusyId(null);
    }
  };

  return (
    <section>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Templates</h1>
        <p className="mt-2 text-sm text-slate-600">
          Start from a curated layout and customize it in the editor.
        </p>
      </div>

      {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {templates.map((template) => (
          <div
            key={template.id}
            className="rounded-2xl border border-slate-200 bg-white p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {template.category}
            </p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">
              {template.name}
            </h2>
            <button
              onClick={() => handleUseTemplate(template)}
              disabled={busyId === template.id}
              className="mt-4 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-60"
            >
              {busyId === template.id ? "Creating..." : "Use Template"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

