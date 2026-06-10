import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { data: products } = await supabaseAdmin
          .from("products").select("slug,updated_at").eq("is_visible", true);

        const staticPaths = [
          { path: "/", priority: "1.0", changefreq: "weekly" },
          { path: "/models", priority: "0.9", changefreq: "daily" },
          { path: "/about", priority: "0.6", changefreq: "monthly" },
          { path: "/faq", priority: "0.6", changefreq: "monthly" },
          { path: "/contact", priority: "0.6", changefreq: "monthly" },
          { path: "/privacy", priority: "0.3", changefreq: "yearly" },
          { path: "/terms", priority: "0.3", changefreq: "yearly" },
        ];
        const productEntries = (products || []).map((p: any) => ({
          path: `/models/${p.slug}`, priority: "0.8", changefreq: "weekly", lastmod: p.updated_at,
        }));
        const entries = [...staticPaths, ...productEntries];
        const urls = entries.map((e: any) => [
          "  <url>",
          `    <loc>${BASE_URL}${e.path}</loc>`,
          e.lastmod ? `    <lastmod>${new Date(e.lastmod).toISOString()}</lastmod>` : null,
          `    <changefreq>${e.changefreq}</changefreq>`,
          `    <priority>${e.priority}</priority>`,
          "  </url>",
        ].filter(Boolean).join("\n"));
        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...urls,
          "</urlset>",
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
