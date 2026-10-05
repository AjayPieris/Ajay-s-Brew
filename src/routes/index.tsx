import { createFileRoute } from "@tanstack/react-router";
import CoffeePage from "../components/CoffeePage";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Ajay's Brew | Chikmagalur Specialty Coffee" },
      { name: "description", content: "Single-estate coffee from Chikmagalur and Coorg, roasted in small batches by Ajay's Brew." },
      { property: "og:title", content: "Ajay's Brew | Chikmagalur Specialty Coffee" },
      { property: "og:description", content: "Trace our coffee from the Kudremukh hills to your cup." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CoffeePage,
});
