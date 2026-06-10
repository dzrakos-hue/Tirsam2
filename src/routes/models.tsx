import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/models")({
  head: () => ({
    meta: [
      { title: "جميع موديلات Tirsam — Tirsam Algérie" },
      { name: "description", content: "تصفح كل موديلات Tirsam من السكوترات والموتورات المتوفرة في الجزائر. صور وأسعار ومواصفات كاملة." },
      { property: "og:title", content: "جميع موديلات Tirsam" },
      { property: "og:description", content: "كل الموديلات بأسعار ومواصفات تفصيلية." },
    ],
    links: [{ rel: "canonical", href: "/models" }],
  }),
  component: () => <Outlet />,
});
