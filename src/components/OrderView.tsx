import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Coffee,
  Flame,
  Info,
  MapPin,
  MessageCircle,
  Minus,
  Package,
  Phone,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
  X,
  ExternalLink,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import CoffeeFillCup from "./CoffeeFillCup";

export interface MenuItemData {
  name: string;
  note: string;
  price: string;
  roast: number;
  image: string;
  signature?: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  size: string;
  prep: string;
  milk: string;
  sweetness: string;
  unitPrice: number;
  quantity: number;
  image: string;
}

const OWNER_WHATSAPP_NUMBER = "+94764630969";
const OWNER_WHATSAPP_RAW = "94764630969";
const OWNER_DISPLAY_PHONE = "+94 76 463 0969";

const PREP_OPTIONS = [
  { id: "brewed-iced", label: "Cold Brewed / Iced", icon: "🧊", extra: 0 },
  { id: "brewed-hot", label: "Fresh Hot Pour", icon: "☕", extra: 0 },
  { id: "beans-whole", label: "Whole Estate Beans (Roasted 48h)", icon: "📦", extra: 1.5 },
  { id: "beans-filter", label: "Traditional Brass Drip Grind", icon: "🏺", extra: 1.5 },
];

const SIZE_OPTIONS = [
  { id: "reg", label: "Regular (250 ml / 250g)", multiplier: 1.0 },
  { id: "large", label: "Large (380 ml / 500g)", multiplier: 1.35 },
  { id: "reserve", label: "Master Batch (1 kg Beans)", multiplier: 2.5 },
];

const MILK_OPTIONS = [
  { id: "whole", label: "Farm Fresh Milk", extra: 0 },
  { id: "oat", label: "Organic Oat Milk", extra: 0.75 },
  { id: "almond", label: "Roasted Almond Milk", extra: 0.75 },
  { id: "black", label: "Pure Black (No Milk)", extra: 0 },
];

const SWEETNESS_OPTIONS = [
  { id: "jaggery", label: "Organic Palm Jaggery", extra: 0.25 },
  { id: "none", label: "Unsweetened (Pure Roast)", extra: 0 },
  { id: "cane", label: "Raw Cane Sugar", extra: 0 },
];

interface OrderConfirmationData {
  orderId: string;
  items: CartItem[];
  total: number;
  fulfillment: "pickup" | "delivery";
  name: string;
  phone: string;
  address?: string;
  notes?: string;
}

interface OrderViewProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItemData[];
  initialItemName?: string;
}

export default function OrderView({
  isOpen,
  onClose,
  menuItems,
  initialItemName,
}: OrderViewProps) {
  const fallbackItem: MenuItemData = useMemo(() => ({
    name: "Cold Brew",
    note: "16-hour slow immersion steeped with organic palm jaggery.",
    price: "$6.50",
    roast: 2,
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&auto=format&fit=crop&q=80",
  }), []);

  // Find initial item or default to first
  const defaultItem = useMemo(() => {
    if (!menuItems || menuItems.length === 0) return fallbackItem;
    if (!initialItemName) return menuItems[0] || fallbackItem;
    const match = menuItems.find(
      (m) => m.name.toLowerCase() === initialItemName.toLowerCase()
    );
    return match || menuItems[0] || fallbackItem;
  }, [initialItemName, menuItems, fallbackItem]);

  const [activeItem, setActiveItem] = useState<MenuItemData>(defaultItem);
  const [prep, setPrep] = useState<string>("brewed-iced");
  const [size, setSize] = useState<string>("reg");
  const [milk, setMilk] = useState<string>("whole");
  const [sweetness, setSweetness] = useState<string>("jaggery");
  const [quantity, setQuantity] = useState<number>(1);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isBagOpen, setIsBagOpen] = useState(false);

  // Checkout Form State
  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("+94 ");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmationData | null>(null);

  // When initialItemName changes, sync active item
  useEffect(() => {
    if (initialItemName && menuItems && menuItems.length > 0) {
      const match = menuItems.find(
        (m) => m.name.toLowerCase() === initialItemName.toLowerCase()
      );
      if (match) {
        setActiveItem(match);
        if (match.name.toLowerCase().includes("cold")) {
          setPrep("brewed-iced");
        } else {
          setPrep("brewed-hot");
        }
      }
    }
  }, [initialItemName, menuItems]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return undefined;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (orderConfirmation) {
          setOrderConfirmation(null);
        }
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, orderConfirmation]);

  // Calculate current item unit price based on options
  const basePriceNumber = parseFloat(activeItem.price.replace(/[^0-9.]/g, "")) || 5.0;
  const currentSizeMultiplier = SIZE_OPTIONS.find((s) => s.id === size)?.multiplier || 1.0;
  const currentPrepExtra = PREP_OPTIONS.find((p) => p.id === prep)?.extra || 0;
  const currentMilkExtra = MILK_OPTIONS.find((m) => m.id === milk)?.extra || 0;
  const currentSweetnessExtra = SWEETNESS_OPTIONS.find((s) => s.id === sweetness)?.extra || 0;

  const currentUnitPrice = Number(
    ((basePriceNumber + currentPrepExtra + currentMilkExtra + currentSweetnessExtra) * currentSizeMultiplier).toFixed(2)
  );
  const currentTotal = Number((currentUnitPrice * quantity).toFixed(2));

  // Add active item to cart
  const handleAddToCart = () => {
    const prepLabel = PREP_OPTIONS.find((p) => p.id === prep)?.label || prep;
    const sizeLabel = SIZE_OPTIONS.find((s) => s.id === size)?.label || size;
    const milkLabel = MILK_OPTIONS.find((m) => m.id === milk)?.label || milk;
    const sweetnessLabel = SWEETNESS_OPTIONS.find((s) => s.id === sweetness)?.label || sweetness;

    const newItem: CartItem = {
      id: `${activeItem.name}-${size}-${prep}-${milk}-${sweetness}-${Date.now()}`,
      name: activeItem.name,
      size: sizeLabel,
      prep: prepLabel,
      milk: milkLabel,
      sweetness: sweetnessLabel,
      unitPrice: currentUnitPrice,
      quantity,
      image: activeItem.image,
    };

    setCart((prev) => [...prev, newItem]);
    setIsBagOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const deliveryFee = fulfillment === "delivery" ? 2.5 : 0;
  const finalTotal = cartTotal + deliveryFee;

  // Real-time Coffee Fill percentage calculation
  const fillPercentage = useMemo(() => {
    let score = 0;
    // 1. Brew selected
    if (activeItem) score += 20;
    // 2. Prep & Size selected
    if (prep && size) score += 20;
    // 3. Customer name entered (>= 2 chars)
    if (customerName.trim().length >= 2) score += 20;
    // 4. Contact / WhatsApp entered (has at least 8 digits)
    const phoneDigits = customerPhone.replace(/[^0-9]/g, "");
    if (phoneDigits.length >= 8) score += 20;
    // 5. Fulfillment mode: pickup is auto +20%; delivery requires address >= 5 chars
    if (fulfillment === "pickup") {
      score += 20;
    } else if (customerAddress.trim().length >= 5) {
      score += 20;
    }
    return Math.min(100, Math.max(20, score));
  }, [activeItem, prep, size, customerName, customerPhone, fulfillment, customerAddress]);

  // Construct luxury formatted WhatsApp message to +94764630969
  const buildWhatsAppUrl = (order: OrderConfirmationData) => {
    const fulfillmentLabel =
      order.fulfillment === "pickup"
        ? "📍 Pickup at Flagship Roastery (03, Pesalai, Mannar)"
        : `🚚 Express Island Delivery\n   📍 *Delivery Address:* ${order.address || "Standard Address"}`;

    const itemsList = order.items
      .map(
        (item, idx) =>
          `${idx + 1}. *${item.quantity}x ${item.name}*\n   • Size: ${item.size}\n   • Style: ${item.prep}\n   • Milk: ${item.milk} | Sweetness: ${item.sweetness}\n   • Price: $${(item.unitPrice * item.quantity).toFixed(2)}`
      )
      .join("\n\n");

    const notesSnippet = order.notes?.trim()
      ? `\n\n📝 *Brewing / Roasting Notes:* ${order.notes.trim()}`
      : "";

    const fullMessage =
      `☕ *AJAY'S BREW — NEW ESTATE ORDER #${order.orderId}*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Customer Name:* ${order.name}\n` +
      `📞 *Customer Phone:* ${order.phone}\n` +
      `📦 *Fulfillment:* ${fulfillmentLabel}${notesSnippet}\n\n` +
      `☕ *ORDER ITEMS:*\n` +
      `${itemsList}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💵 *TOTAL PAYABLE: $${order.total.toFixed(2)}*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `✨ _Hello Ajay, I have submitted this order via your website. Please confirm roast availability & preparation time!_`;

    return `https://wa.me/${OWNER_WHATSAPP_RAW}?text=${encodeURIComponent(fullMessage)}`;
  };

  // Final Order Submission: Dispatches to WhatsApp and presents receipt
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const itemsToOrder: CartItem[] =
      cart.length > 0
        ? cart
        : [
            {
              id: `${activeItem.name}-${Date.now()}`,
              name: activeItem.name,
              size: SIZE_OPTIONS.find((s) => s.id === size)?.label || size,
              prep: PREP_OPTIONS.find((p) => p.id === prep)?.label || prep,
              milk: MILK_OPTIONS.find((m) => m.id === milk)?.label || milk,
              sweetness: SWEETNESS_OPTIONS.find((s) => s.id === sweetness)?.label || sweetness,
              unitPrice: currentUnitPrice,
              quantity,
              image: activeItem.image,
            },
          ];

    const orderId = `AB-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderData: OrderConfirmationData = {
      orderId,
      items: itemsToOrder,
      total: cart.length > 0 ? finalTotal : currentTotal + deliveryFee,
      fulfillment,
      name: customerName.trim() || "Artisan Coffee Connoisseur",
      phone: customerPhone.trim(),
      address: customerAddress.trim(),
      notes: customerNotes.trim(),
    };

    setIsSubmitting(true);

    // Direct launch of WhatsApp with the pre-filled order receipt
    const targetUrl = buildWhatsAppUrl(orderData);
    if (typeof window !== "undefined") {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setOrderConfirmation(orderData);
      setCart([]);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="order-overlay" role="dialog" aria-modal="true" aria-label="Order Coffee">
      <div className="order-backdrop" onClick={onClose} />

      <div className="order-modal-container">
        {/* Top Header */}
        <header className="order-modal-header">
          <div className="order-header-left">
            <button
              onClick={onClose}
              className="order-back-btn"
              aria-label="Back to menu"
            >
              <ArrowLeft size={15} />
              <span>Back to Estate</span>
            </button>
            <div className="order-brand-badge">
              <Coffee size={14} className="badge-icon" />
              <span>AJAY'S BREW · ARTISAN CONCIERGE</span>
            </div>
          </div>

          <div className="order-header-right">
            {/* WhatsApp direct indicator */}
            <div className="whatsapp-direct-indicator" title={`Orders sent directly to ${OWNER_DISPLAY_PHONE}`}>
              <MessageCircle size={14} className="wa-icon" />
              <span>Orders to WhatsApp: <strong>{OWNER_DISPLAY_PHONE}</strong></span>
            </div>

            <button
              onClick={() => setIsBagOpen(!isBagOpen)}
              className={`order-bag-pill ${cart.length > 0 ? "has-items" : ""}`}
              aria-label="View Order Bag"
            >
              <ShoppingBag size={14} />
              <span>Order Bag</span>
              {cart.length > 0 && (
                <span className="bag-count">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
            <button
              onClick={onClose}
              className="order-close-btn"
              aria-label="Close order dialog"
            >
              <X size={17} />
            </button>
          </div>
        </header>

        {/* Confirmation Screen */}
        {orderConfirmation ? (
          <div className="order-confirmation-screen">
            <div className="conf-badge">
              <Sparkles size={14} />
              <span>ORDER DISPATCHED VIA WHATSAPP</span>
            </div>
            <div className="conf-icon-wrap">
              <Check size={36} />
            </div>
            <h2>The Ritual Has Commenced.</h2>
            <p className="conf-subtitle">
              Order <strong>#{orderConfirmation.orderId}</strong> was sent directly to Ajay&apos;s WhatsApp (<strong>{OWNER_DISPLAY_PHONE}</strong>) for fresh preparation at Pesalai Roastery.
            </p>

            <div className="conf-ticket">
              <div className="ticket-header">
                <div>
                  <span className="ticket-label">Fulfillment Mode</span>
                  <strong>
                    {orderConfirmation.fulfillment === "pickup"
                      ? "📍 Pick Up at Flagship Roastery (03, Pesalai, Mannar)"
                      : `🚚 Express Delivery: ${orderConfirmation.address || "Mannar / Islandwide"}`}
                  </strong>
                </div>
                <div className="ticket-time">
                  <Clock size={14} />
                  <span>Est. 15–20 Mins</span>
                </div>
              </div>

              <div className="ticket-customer-row">
                <div>
                  <span className="ticket-label">Customer</span>
                  <span>{orderConfirmation.name} ({orderConfirmation.phone})</span>
                </div>
                <div>
                  <span className="ticket-label">WhatsApp Sent To</span>
                  <strong className="text-emerald-400">{OWNER_DISPLAY_PHONE}</strong>
                </div>
              </div>

              <div className="ticket-items">
                {orderConfirmation.items.map((it) => (
                  <div key={it.id} className="ticket-item-row">
                    <div className="ticket-item-info">
                      <span className="qty">{it.quantity}x</span>
                      <div>
                        <strong>{it.name}</strong>
                        <small>{it.size} · {it.prep}</small>
                        <span className="ticket-extras">{it.milk} · {it.sweetness}</span>
                      </div>
                    </div>
                    <span className="ticket-price">
                      ${(it.unitPrice * it.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="ticket-footer">
                <span>Total Amount</span>
                <strong>${orderConfirmation.total.toFixed(2)}</strong>
              </div>
            </div>

            <div className="conf-actions">
              <a
                href={buildWhatsAppUrl(orderConfirmation)}
                target="_blank"
                rel="noopener noreferrer"
                className="conf-whatsapp-btn"
              >
                <MessageCircle size={16} />
                <span>Reopen WhatsApp Chat ({OWNER_DISPLAY_PHONE})</span>
                <ExternalLink size={14} />
              </a>
              <button
                onClick={() => {
                  setOrderConfirmation(null);
                  onClose();
                }}
                className="conf-done-btn"
              >
                Back to Estate
              </button>
            </div>
          </div>
        ) : (
          /* Main Order Customizer Layout */
          <div className="order-modal-body">
            <div className="order-content-grid">
              {/* 1. Left Column: Product Showcase & Menu Switcher */}
              <section className="order-product-showcase">
                <div className="order-image-card">
                  <img
                    src={activeItem.image}
                    alt={activeItem.name}
                    className="order-main-img"
                  />
                  <div className="order-img-overlay" />
                  <div className="order-img-badges">
                    {activeItem.signature && (
                      <span className="signature-pill">
                        <Sparkles size={11} /> Master Reserve
                      </span>
                    )}
                    <span className="roast-pill">
                      <Flame size={12} /> Roast Level {activeItem.roast}/3
                    </span>
                  </div>
                </div>

                <div className="order-product-meta">
                  <div className="order-title-wrap">
                    <h2>{activeItem.name}</h2>
                    <span className="order-price-display">
                      ${currentUnitPrice.toFixed(2)}
                    </span>
                  </div>
                  <p className="order-product-desc">{activeItem.note}</p>
                  <div className="order-terroir-strip">
                    <span className="terroir-item">Single Estate · 4,000 ft Kudremukh</span>
                    <span className="sep">•</span>
                    <span className="terroir-item">Small-Batch Micro Roast</span>
                  </div>
                </div>

                {/* Quick Switcher of Menu Items */}
                <div className="order-quick-switcher">
                  <span className="switcher-label">Choose Another Estate Brew:</span>
                  <div className="switcher-pills">
                    {menuItems.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          setActiveItem(item);
                          setQuantity(1);
                        }}
                        className={`switcher-pill ${item.name === activeItem.name ? "active" : ""}`}
                      >
                        <img src={item.image} alt={item.name} />
                        <div className="switcher-pill-info">
                          <span>{item.name}</span>
                          <small>{item.price}</small>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* 2. Middle: Customizer Options */}
              <section className="order-customizer-section">
                {/* 01. Preparation Mode */}
                <div className="option-group">
                  <label className="option-heading">
                    <span>01 / Preparation &amp; Roast Type</span>
                    <small>Select freshly brewed pour or roasted whole beans</small>
                  </label>
                  <div className="option-chips-grid">
                    {PREP_OPTIONS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPrep(p.id)}
                        className={`option-chip ${prep === p.id ? "selected" : ""}`}
                      >
                        <span className="chip-icon">{p.icon}</span>
                        <div className="chip-copy">
                          <strong>{p.label}</strong>
                          {p.extra > 0 && <small>+${p.extra.toFixed(2)}</small>}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 02. Serving Size */}
                <div className="option-group">
                  <label className="option-heading">
                    <span>02 / Serving Volume</span>
                    <small>Select your cup volume or roast pouch size</small>
                  </label>
                  <div className="option-chips-grid three-col">
                    {SIZE_OPTIONS.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSize(s.id)}
                        className={`option-chip ${size === s.id ? "selected" : ""}`}
                      >
                        <div className="chip-copy">
                          <strong>{s.label}</strong>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 03. Milk & Sweetness */}
                <div className="options-dual-grid">
                  <div className="option-group">
                    <label className="option-heading">
                      <span>03 / Milk Artisan Blend</span>
                    </label>
                    <div className="option-chips-column">
                      {MILK_OPTIONS.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setMilk(m.id)}
                          className={`option-chip mini ${milk === m.id ? "selected" : ""}`}
                        >
                          <span>{m.label}</span>
                          {m.extra > 0 && <small>+${m.extra.toFixed(2)}</small>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="option-group">
                    <label className="option-heading">
                      <span>04 / Sweetener</span>
                    </label>
                    <div className="option-chips-column">
                      {SWEETNESS_OPTIONS.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSweetness(s.id)}
                          className={`option-chip mini ${sweetness === s.id ? "selected" : ""}`}
                        >
                          <span>{s.label}</span>
                          {s.extra > 0 && <small>+${s.extra.toFixed(2)}</small>}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quantity & Add to Bag Bar */}
                <div className="order-add-bar">
                  <div className="qty-control">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span>{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="add-to-bag-btn"
                  >
                    <ShoppingBag size={15} />
                    <span>Add to Bag</span>
                    <span className="btn-price">• ${currentTotal.toFixed(2)}</span>
                  </button>
                </div>
              </section>

              {/* 3. Right Column: Dynamic Coffee Cup Animation + Checkout Panel */}
              <section className={`order-checkout-panel ${isBagOpen ? "open" : ""}`}>
                <div className="checkout-panel-inner">
                  {/* Dynamic Coffee Cup Widget that fills up in real time */}
                  <CoffeeFillCup
                    fillPercentage={fillPercentage}
                    customerName={customerName}
                    itemName={activeItem.name}
                  />

                  {/* Order Bag Items (Accordion / scroll) */}
                  <div className="checkout-header">
                    <h3>Your Order Bag</h3>
                    <span className="item-count">
                      {cart.length > 0 ? `${cart.length} in bag` : "1 customizing"}
                    </span>
                  </div>

                  {cart.length > 0 && (
                    <div className="cart-items-scroll">
                      {cart.map((item) => (
                        <div key={item.id} className="cart-item-row">
                          <img src={item.image} alt={item.name} className="cart-item-thumb" />
                          <div className="cart-item-details">
                            <strong>{item.name}</strong>
                            <small>{item.size} · {item.prep}</small>
                            <span className="cart-item-specs">{item.milk} · {item.sweetness}</span>
                            <div className="cart-item-qty">
                              <button onClick={() => handleUpdateQuantity(item.id, -1)}>
                                <Minus size={11} />
                              </button>
                              <span>{item.quantity}</span>
                              <button onClick={() => handleUpdateQuantity(item.id, 1)}>
                                <Plus size={11} />
                              </button>
                            </div>
                          </div>
                          <div className="cart-item-end">
                            <span className="price">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                            <button
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="remove-btn"
                              aria-label="Remove item"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Fulfillment Mode Toggle */}
                  <div className="fulfillment-toggle">
                    <button
                      type="button"
                      onClick={() => setFulfillment("pickup")}
                      className={`ful-btn ${fulfillment === "pickup" ? "active" : ""}`}
                    >
                      <MapPin size={13} />
                      <span>Pesalai Pickup (Free)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFulfillment("delivery")}
                      className={`ful-btn ${fulfillment === "delivery" ? "active" : ""}`}
                    >
                      <Truck size={13} />
                      <span>Express Delivery (+$2.50)</span>
                    </button>
                  </div>

                  {/* Checkout Details Form */}
                  <form onSubmit={handlePlaceOrder} className="checkout-details-form">
                    <div className="form-field">
                      <label htmlFor="customer-name">
                        Your Full Name <span className="req">*</span>
                      </label>
                      <input
                        id="customer-name"
                        type="text"
                        required
                        placeholder="e.g. Ajay Perera"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="customer-phone">
                        Your WhatsApp / Phone Number <span className="req">*</span>
                      </label>
                      <div className="input-with-icon">
                        <Phone size={14} className="input-icon" />
                        <input
                          id="customer-phone"
                          type="tel"
                          required
                          placeholder="+94 7X XXX XXXX"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    {fulfillment === "delivery" && (
                      <div className="form-field">
                        <label htmlFor="customer-address">
                          Delivery Address (Mannar / Islandwide) <span className="req">*</span>
                        </label>
                        <input
                          id="customer-address"
                          type="text"
                          required
                          placeholder="No. 12, Main Street, Pesalai / Colombo"
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                        />
                      </div>
                    )}

                    <div className="form-field">
                      <label htmlFor="customer-notes">Roasting or Brewing Notes (Optional)</label>
                      <input
                        id="customer-notes"
                        type="text"
                        placeholder="e.g. Fine grind for filter, extra hot"
                        value={customerNotes}
                        onChange={(e) => setCustomerNotes(e.target.value)}
                      />
                    </div>

                    {/* Price Breakdown */}
                    <div className="price-summary-card">
                      <div className="summary-row">
                        <span>Items Subtotal</span>
                        <span>${(cart.length > 0 ? cartTotal : currentTotal).toFixed(2)}</span>
                      </div>
                      <div className="summary-row">
                        <span>
                          {fulfillment === "pickup"
                            ? "Pickup (03, Pesalai, Mannar)"
                            : "Island Express Delivery"}
                        </span>
                        <span>{fulfillment === "pickup" ? "FREE" : `$${deliveryFee.toFixed(2)}`}</span>
                      </div>
                      <div className="summary-row total-row">
                        <strong>Grand Total</strong>
                        <strong>${(cart.length > 0 ? finalTotal : currentTotal + deliveryFee).toFixed(2)}</strong>
                      </div>
                    </div>

                    {/* Prominent WhatsApp Order Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="place-order-whatsapp-btn"
                    >
                      <div className="btn-wa-icon-wrap">
                        <MessageCircle size={18} />
                      </div>
                      <div className="btn-wa-text">
                        <span className="main-label">
                          {isSubmitting ? "Brewing Order Ticket..." : "Order via WhatsApp"}
                        </span>
                        <span className="sub-label">
                          Direct to {OWNER_DISPLAY_PHONE}
                        </span>
                      </div>
                      <ArrowRight size={16} className="btn-arrow" />
                    </button>

                    <div className="checkout-trust-guarantee">
                      <ShieldCheck size={13} />
                      <span>Direct WhatsApp Concierge · Freshly roasted within 48h</span>
                    </div>
                  </form>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
