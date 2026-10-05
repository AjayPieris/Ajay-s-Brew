import { createFileRoute, useNavigate } from "@tanstack/react-router";
import OrderView from "../components/OrderView";
import { menuItems } from "../components/CoffeePage";

export const Route = createFileRoute("/order")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Order Estate Coffee | Ajay's Brew" },
      { name: "description", content: "Order freshly roasted single-estate specialty coffee and cold brews from Ajay's Brew." },
    ],
  }),
  component: OrderRouteComponent,
});

function OrderRouteComponent() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      <OrderView
        isOpen={true}
        onClose={() => navigate({ to: "/" })}
        menuItems={menuItems}
        initialItemName="Cold Brew"
      />
    </div>
  );
}
