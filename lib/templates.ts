import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export type TemplateSummary = {
  id: string;
  name: string;
  category: string;
  contentJson: Prisma.JsonValue;
};

const defaultTemplates: TemplateSummary[] = [
  {
    id: "starter-hero",
    name: "Starter Hero",
    category: "Business",
    contentJson: {
      blocks: [
        {
          type: "hero",
          heading: "Launch something beautiful",
          subheading: "A clean hero layout ready for Vaiket Studio.",
          cta: "Get Started"
        },
        {
          type: "features",
          items: ["Fast setup", "Flexible sections", "Launch-ready"]
        },
        {
          type: "cta",
          heading: "Publish in minutes",
          button: "Publish Now"
        }
      ]
    }
  },
  {
    id: "portfolio-grid",
    name: "Portfolio Grid",
    category: "Creative",
    contentJson: {
      blocks: [
        {
          type: "hero",
          heading: "Showcase your best work",
          subheading: "A bold layout for designers and studios.",
          cta: "View Projects"
        },
        {
          type: "features",
          items: ["Project tiles", "Testimonials", "Contact CTA"]
        }
      ]
    }
  },
  {
    id: "product-launch",
    name: "Product Launch",
    category: "SaaS",
    contentJson: {
      blocks: [
        {
          type: "hero",
          heading: "Meet your next product",
          subheading: "Feature-focused launch page with CTA sections.",
          cta: "Request Access"
        },
        {
          type: "features",
          items: ["Feature callouts", "Social proof", "FAQ"]
        }
      ]
    }
  }
];

export async function listTemplates(): Promise<TemplateSummary[]> {
  const dbTemplates = await prisma.builderTemplate.findMany({
    select: {
      id: true,
      name: true,
      category: true,
      contentJson: true
    },
    orderBy: { name: "asc" }
  });

  if (dbTemplates.length > 0) {
    return dbTemplates;
  }

  return defaultTemplates;
}

export async function resolveTemplateContent(
  templateId?: string | null
): Promise<Prisma.JsonValue> {
  if (!templateId) {
    return defaultTemplates[0].contentJson;
  }

  const dbTemplate = await prisma.builderTemplate.findUnique({
    where: { id: templateId },
    select: { contentJson: true }
  });

  if (dbTemplate?.contentJson) {
    return dbTemplate.contentJson;
  }

  const fallback = defaultTemplates.find((template) => template.id === templateId);
  if (fallback) {
    return fallback.contentJson;
  }

  return defaultTemplates[0].contentJson;
}

