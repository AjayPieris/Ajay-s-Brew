import { ArrowDown, ArrowRight, ArrowUp, ArrowUpRight, Check, Clock, Coffee, ExternalLink, Facebook, Flame, Instagram, Leaf, Mail, Menu, MessageCircle, ShieldCheck, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type PointerEvent as ReactPointerEvent } from "react";
import filterPour from "../assets/gallery-filter-pour.jpg";
import pourOver from "../assets/gallery-pourover.jpg";
import cafe from "../assets/gallery-cafe.jpg";
import hills from "../assets/gallery-hills.jpg";
import heroVideo from "../assets/Hero.mp4";
import journeySeed from "../assets/journey-seed.jpg";
import journeyFlower from "../assets/journey-flower.jpg";
import journeyCherries from "../assets/journey-cherries.jpg";
import journeyDrying from "../assets/journey-drying.jpg";
import journeyRoasting from "../assets/journey-roasting.jpg";
import journeyPour from "../assets/journey-pour.jpg";
import { journeyStages } from "./CoffeeJourney";
import OrderView from "./OrderView";

const journeyImages = [journeySeed, journeyFlower, journeyCherries, journeyDrying, journeyRoasting, journeyPour];

export const menuItems = [
  {
    name: "Filter Kaapi",
    note: "Traditional South Indian drip brewed in brass",
    price: "$4.50",
    roast: 3,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Cold Brew",
    note: "Chikmagalur Single-Estate 18-hour slow steep",
    price: "$6.00",
    roast: 3,
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Masala Chai Latte",
    note: "House estate spice blend with steamed microfoam",
    price: "$5.00",
    roast: 1,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Cardamom Cappuccino",
    note: "Crushed green cardamom infused with silky espresso",
    price: "$5.50",
    roast: 2,
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Ajay's Cold Foam",
    note: "Signature estate iced brew capped with a velvety jaggery cloud & toasted spices",
    price: "$7.00",
    roast: 2,
    signature: true,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Monsoon Malabar Espresso",
    note: "Low-acid, sea-wind cured Malabar beans with rich crema",
    price: "$5.00",
    roast: 3,
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Cortado with Jaggery",
    note: "Dark cane sweetness balanced 1:1 with ristretto shot",
    price: "$5.50",
    roast: 2,
    image: "https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Mysore Filter Cold Coffee",
    note: "Signature slow-churned decoction over organic condensed cream and roasted chicory",
    price: "$6.50",
    roast: 3,
    signature: true,
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=1200&q=80",
  },
];

const testimonials = [
  { quote: "Their filter kaapi tastes like the first quiet morning back home—deep, bright and beautifully balanced.", name: "Ananya R.", city: "Bengaluru", initials: "AR" },
  { quote: "You can taste the estate in every cup. The Monsoon Malabar has become my daily ritual.", name: "Rohan M.", city: "Mumbai", initials: "RM" },
  { quote: "This is Chikmagalur coffee told honestly: patient sourcing, precise roasting, no shortcuts.", name: "Priya K.", city: "Chikmagalur", initials: "PK" },
];

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { (entry.target as HTMLElement).dataset["visible"] = "true"; observer.unobserve(entry.target); }
    }), { threshold: 0.18 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function HeroCup() {
  return (
    <div className="hero-photo-wrap">
      <video
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-label="Estate coffee brew visual"
      />
      <span className="hero-photo-caption">Estate No. 04<br />Chikmagalur</span>
    </div>
  );
}

function TiltCard({
  item,
  index,
  onOrder,
}: {
  item: typeof menuItems[number];
  index: number;
  onOrder?: (name: string) => void;
}) {
  const onMove = (event: ReactPointerEvent<HTMLElement>) => {
    const node = event.currentTarget;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    node.style.setProperty("--rx", `${(0.5 - y) * 12}deg`);
    node.style.setProperty("--ry", `${(x - 0.5) * 12}deg`);
    node.style.setProperty("--mx", `${x * 100}%`);
    node.style.setProperty("--my", `${y * 100}%`);
  };
  return (
    <article
      className={`menu-card ${item.signature ? "signature" : ""}`}
      onPointerMove={onMove}
      onPointerLeave={(e) => {
        e.currentTarget.style.setProperty("--rx", "0deg");
        e.currentTarget.style.setProperty("--ry", "0deg");
      }}
      onClick={() => onOrder?.(item.name)}
      data-reveal
      style={{ "--delay": `${index * 60}ms`, cursor: "pointer" } as CSSProperties}
    >
      <div className="menu-card-media">
        <img
          src={item.image}
          alt={item.name}
          width={800}
          height={600}
          loading="lazy"
          className="menu-card-img"
        />
        <div className="menu-card-overlay" />
      </div>

      <div className="menu-card-top">
        <span className="menu-badge">
          {item.signature ? (
            <>
              <Sparkles size={11} className="badge-sparkle" /> Signature
            </>
          ) : (
            `No. ${String(index + 1).padStart(2, "0")}`
          )}
        </span>
        <div className="roast-wrapper" title={`Roast intensity: ${item.roast} of 3`}>
          <span className="roast-label">Roast</span>
          <span className="roast-dots" aria-label={`${item.roast} of 3 roast level`}>
            {[1, 2, 3].map((dot) => (
              <i key={dot} className={dot <= item.roast ? "active" : ""} />
            ))}
          </span>
        </div>
      </div>

      <div className="menu-card-content">
        {item.signature && <span className="signature-kicker">Estate Selection · Kudremukh</span>}
        <h3>{item.name}</h3>
        <p>{item.note}</p>
        <div className="menu-card-footer">
          <div className="price-tag">
            <small>Single Estate</small>
            <strong>{item.price}</strong>
          </div>
          <button
            type="button"
            className="menu-action-btn"
            aria-label={`Order ${item.name}`}
            onClick={(e) => {
              e.stopPropagation();
              onOrder?.(item.name);
            }}
          >
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;
    const update = () => {
      const rect = node.getBoundingClientRect();
      const max = node.offsetHeight - window.innerHeight;
      const next = Math.max(0, Math.min(1, -rect.top / max));
      setProgress(next);
      setStage(Math.min(5, Math.floor(next * 5.999)));
    };
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const scaled = progress * 5;
  const activeImage = Math.min(5, Math.floor(scaled));
  const blend = scaled - activeImage;
  const currentStage = journeyStages[stage] ?? journeyStages[0]!;
  return (
    <section ref={sectionRef} id="journey" className="journey-section">
      <div className="journey-sticky">
        <div className="journey-heading"><span>From farm to cup</span><strong>0{stage + 1} / 06</strong></div>
        <div className="journey-film" aria-hidden="true">
          {journeyImages.map((src, index) => {
            const opacity = index === activeImage ? 1 - (activeImage < 5 ? blend : 0) : index === activeImage + 1 ? blend : 0;
            return <img key={src} src={src} alt="" width={1536} height={1024} loading={index < 2 ? "eager" : "lazy"} style={{ opacity, transform: `scale(${1.035 + Math.abs(index - scaled) * 0.018}) translateY(${(index - scaled) * 1.2}%)` }} />;
          })}
          <div className="journey-vignette" />
        </div>
        <div className="journey-copy" key={stage}><small>{currentStage.kicker}</small><h2>{currentStage.title}</h2><p>{currentStage.copy}</p></div>
        <div className="progress-rail">{journeyStages.map((_, i) => <span key={i} className={i <= stage ? "active" : ""} />)}</div>
        <div className="mobile-stages">{journeyStages.map((item, i) => <article key={item.title} className={i === stage ? "active" : ""}><span>0{i + 1}</span><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef(0);
  useEffect(() => { if (paused) return undefined; const timer = window.setInterval(() => setActive((v) => (v + 1) % testimonials.length), 6000); return () => clearInterval(timer); }, [paused]);
  const quote = testimonials[active] ?? testimonials[0]!;
  return <section className="testimonials" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onPointerDown={(e) => { startX.current = e.clientX; setPaused(true); }} onPointerUp={(e) => { if (Math.abs(e.clientX - startX.current) > 50) setActive((v) => (v + (e.clientX < startX.current ? 1 : testimonials.length - 1)) % testimonials.length); }}>
    <span className="section-index">04 / Guest notes</span><div className="quote-mark">“</div><blockquote key={active}>{quote.quote}</blockquote><div className="quote-person"><span>{quote.initials}</span><p><strong>{quote.name}</strong><small>{quote.city}</small></p></div><div className="quote-nav">{testimonials.map((_, i) => <button key={i} aria-label={`Show testimonial ${i + 1}`} className={i === active ? "active" : ""} onClick={() => setActive(i)} />)}</div>
  </section>;
}

function Location() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Colombo", weekday: "short", hour: "numeric", hour12: false }).formatToParts(new Date());
    const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0); const day = parts.find((p) => p.type === "weekday")?.value ?? "";
    setOpen(hour >= 8 && hour < (day === "Sat" || day === "Sun" ? 22 : 21));
  }, []);
  return (
    <section id="visit" className="location-section">
      <div className="location-card" data-reveal>
        <span className="section-index">05 / Visit</span>
        <h2>Come for the<br /><em>slow pour.</em></h2>
        <div className="open-state">
          <i className={open ? "open" : ""} />
          {open ? "Open Now" : "Closed"}
        </div>
        <address>
          <strong>Ajay's Brew</strong><br />
          03, Pesalai, Mannar<br />
          Sri Lanka<br />
          <a href="tel:+94764630969">+94 764630969</a>
        </address>
        <div className="hours">
          <p><span>Mon–Fri</span>8:00 AM – 9:00 PM</p>
          <p><span>Sat–Sun</span>8:00 AM – 10:00 PM</p>
        </div>
      </div>
      <div className="map" aria-label="Map of Ajay's Brew in Pesalai, Mannar, Sri Lanka">
        <svg
          className="map-vector"
          viewBox="0 0 900 650"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="urban-blocks" width="28" height="28" patternUnits="userSpaceOnUse">
              <rect width="22" height="22" rx="2" fill="rgba(74, 53, 37, 0.05)" />
            </pattern>
            <pattern id="palm-groves" width="36" height="36" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="rgba(90, 68, 48, 0.07)" />
              <circle cx="28" cy="26" r="1.5" fill="rgba(90, 68, 48, 0.07)" />
            </pattern>
          </defs>

          {/* Base Land Background in warm tan */}
          <rect width="900" height="650" fill="var(--tan)" />

          {/* Coconut groves & terrain pattern */}
          <rect x="0" y="160" width="900" height="490" fill="url(#palm-groves)" />

          {/* Residential town sectors */}
          <rect x="250" y="220" width="390" height="175" fill="url(#urban-blocks)" />
          <rect x="70" y="320" width="180" height="140" fill="url(#urban-blocks)" />
          <rect x="660" y="250" width="190" height="180" fill="url(#urban-blocks)" />

          {/* Palk Bay / Gulf of Mannar (Coastal Sea to the North) */}
          <path
            d="M 0,0 L 900,0 L 900,165 C 780,145 660,180 540,158 C 420,135 300,178 180,148 C 90,135 40,148 0,138 Z"
            fill="color-mix(in oklab, var(--tan) 76%, var(--background))"
          />
          {/* Depth / wave contour lines */}
          <path
            d="M 0,55 Q 260,85 520,60 T 900,70"
            fill="none"
            stroke="color-mix(in oklab, var(--background) 12%, transparent)"
            strokeWidth="1.5"
            strokeDasharray="6,8"
          />
          <path
            d="M 0,105 Q 300,135 600,108 T 900,118"
            fill="none"
            stroke="color-mix(in oklab, var(--background) 14%, transparent)"
            strokeWidth="1.5"
            strokeDasharray="8,10"
          />
          {/* Sandy Shoreline / Coastal Beach */}
          <path
            d="M 0,138 C 40,148 90,135 180,148 C 300,178 420,135 540,158 C 660,180 780,145 900,165"
            fill="none"
            stroke="#d5bd9b"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Waterway Label */}
          <text
            x="450"
            y="72"
            textAnchor="middle"
            fill="color-mix(in oklab, var(--background) 48%, transparent)"
            fontSize="10"
            letterSpacing="0.32em"
            fontFamily="var(--font-sans)"
            fontWeight="600"
          >
            PALK BAY · GULF OF MANNAR
          </text>

          {/* Secondary streets and grid */}
          <path d="M 0,215 C 240,225 520,210 900,220" fill="none" stroke="rgba(255,255,255,0.72)" strokeWidth="5" strokeLinecap="round" />
          <path d="M 0,265 C 260,260 520,270 900,265" fill="none" stroke="rgba(255,255,255,0.72)" strokeWidth="5" strokeLinecap="round" />
          <path d="M 0,445 C 300,455 600,435 900,450" fill="none" stroke="rgba(255,255,255,0.68)" strokeWidth="5" strokeLinecap="round" />

          {/* North-South Roads */}
          <path d="M 230,480 L 235,310 L 220,215 L 210,148" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="6" strokeLinecap="round" />
          <path d="M 450,470 L 450,305 L 455,215 L 450,152" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="7" strokeLinecap="round" />
          <path d="M 610,480 L 610,310 L 605,215 L 615,160" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="6" strokeLinecap="round" />
          <path d="M 750,480 L 745,310 L 755,215" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="5" strokeLinecap="round" />
          <path d="M 120,480 L 125,310 L 115,215 L 110,145" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="5" strokeLinecap="round" />

          {/* Mannar - Talaimannar Railway Line */}
          <path d="M 0,405 C 280,410 560,395 900,405" fill="none" stroke="#5a4232" strokeWidth="2.5" />
          <path d="M 0,405 C 280,410 560,395 900,405" fill="none" stroke="#5a4232" strokeWidth="6" strokeDasharray="2,6" />

          {/* Primary Arterial: A14 Highway (Mannar - Talaimannar Road) */}
          <path d="M 0,310 C 280,315 540,295 900,315" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="12" strokeLinecap="round" />
          <path d="M 0,310 C 280,315 540,295 900,315" fill="none" stroke="var(--accent)" strokeWidth="7" strokeLinecap="round" />

          {/* Highway Badge */}
          <g transform="translate(180, 298)">
            <rect x="-6" y="-10" width="135" height="14" rx="3" fill="var(--background)" opacity="0.85" />
            <text x="61" y="0" textAnchor="middle" fill="var(--tan)" fontSize="7.5" fontWeight="700" letterSpacing="0.14em">
              A14 · MANNAR HWY
            </text>
          </g>

          {/* Street Labels */}
          <text x="465" y="195" fill="color-mix(in oklab, var(--background) 75%, transparent)" fontSize="8" fontWeight="600" letterSpacing="0.12em">
            BEACH RD
          </text>
          <text x="622" y="250" fill="color-mix(in oklab, var(--background) 75%, transparent)" fontSize="8" fontWeight="600" letterSpacing="0.12em">
            CHURCH RD
          </text>
          <text x="246" y="250" fill="color-mix(in oklab, var(--background) 75%, transparent)" fontSize="8" fontWeight="600" letterSpacing="0.12em">
            HARBOR RD
          </text>
          <text x="735" y="422" fill="color-mix(in oklab, var(--background) 75%, transparent)" fontSize="7.5" fontWeight="600" letterSpacing="0.14em">
            RAILWAY TO TALAIMANNAR →
          </text>

          {/* Landmark: St. Anne's Church */}
          <g transform="translate(605, 175)">
            <rect x="-8" y="-8" width="16" height="16" rx="3" fill="var(--secondary)" stroke="var(--background)" strokeWidth="1.5" />
            <path d="M 0,-4 L 0,4 M -3,-1 L 3,-1" stroke="var(--primary)" strokeWidth="1.5" />
            <text x="14" y="3" fill="var(--background)" fontSize="8" fontWeight="700" letterSpacing="0.08em">
              St. Anne's Shrine
            </text>
          </g>

          {/* Landmark: Pesalai Station */}
          <g transform="translate(370, 405)">
            <circle cx="0" cy="0" r="5" fill="var(--secondary)" stroke="var(--background)" strokeWidth="1.5" />
            <text x="10" y="3" fill="var(--background)" fontSize="8" fontWeight="700" letterSpacing="0.08em">
              Pesalai Station
            </text>
          </g>

          {/* Landmark: Fisheries Jetty */}
          <g transform="translate(205, 142)">
            <rect x="-12" y="-3" width="24" height="6" rx="2" fill="var(--background)" opacity="0.75" />
            <text x="0" y="15" textAnchor="middle" fill="var(--background)" fontSize="7.5" fontWeight="600" letterSpacing="0.08em">
              Fisheries Jetty
            </text>
          </g>

          {/* Ajay's Brew Pin (03, Pesalai, Mannar) */}
          <g transform="translate(450, 275)">
            <circle cx="0" cy="0" r="28" fill="var(--accent)" opacity="0.22" className="map-pulse-ring" />
            <circle cx="0" cy="0" r="14" fill="var(--accent)" opacity="0.35" />
            <path
              d="M 0,0 C -12,-12 -12,-26 0,-34 C 12,-26 12,-12 0,0 Z"
              fill="var(--accent)"
              filter="drop-shadow(0 6px 10px rgba(0,0,0,0.35))"
            />
            <circle cx="0" cy="-21" r="5.5" fill="var(--foreground)" />

            <g transform="translate(0, -42)">
              <rect x="-55" y="-15" width="110" height="20" rx="4" fill="var(--secondary)" stroke="var(--accent)" strokeWidth="1" />
              <circle cx="-42" cy="-5" r="2.5" fill="#34d399" />
              <text x="3" y="-2" textAnchor="middle" fill="var(--foreground)" fontSize="8.5" fontWeight="700" letterSpacing="0.12em">
                AJAY'S BREW · 03
              </text>
            </g>
          </g>
        </svg>

        {/* Top Control Bar with Compass and Direct Google Maps Link */}
        <div className="map-top-bar">
          <div className="map-compass" title="North orientation">
            <span>N</span>
            <i />
          </div>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Pesalai,+Mannar,+Sri+Lanka"
            target="_blank"
            rel="noopener noreferrer"
            className="map-gmaps-link"
            aria-label="Open Pesalai, Mannar in Google Maps"
          >
            <ExternalLink size={12} />
            <span>Open Google Maps</span>
          </a>
        </div>

        {/* Scale Indicator */}
        <div className="map-scale" aria-hidden="true">
          <span>500 m</span>
          <div className="scale-line" />
        </div>

        {/* Bottom-Left City / Region Badge */}
        <div className="map-caption">
          <h3>Pesalai, Mannar</h3>
          <span>Northern Province · Sri Lanka</span>
          <small>9.0882° N, 79.8241° E</small>
        </div>
      </div>
    </section>
  );
}

export default function CoffeePage() {
  const [navOpen, setNavOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [orderItemName, setOrderItemName] = useState("Cold Brew");

  const handleOpenOrder = (name?: string) => {
    setOrderItemName(name || "Cold Brew");
    setOrderOpen(true);
  };

  useReveal();
  useEffect(() => {
    const cursor = document.querySelector<HTMLElement>(".cursor-ring");
    const move = (e: PointerEvent) => { if (cursor) { cursor.style.left = `${e.clientX}px`; cursor.style.top = `${e.clientY}px`; } };
    window.addEventListener("pointermove", move); return () => window.removeEventListener("pointermove", move);
  }, []);
  const submit = (e: FormEvent) => { e.preventDefault(); setSent(true); };
  return <main><div className="cursor-ring" /><div className="grain" />
    <header className="site-nav"><a className="wordmark" href="#top">Ajay's Brew</a><nav className={navOpen ? "open" : ""}>{[["Journey", "#journey"], ["Menu", "#menu"], ["Visit", "#visit"]].map(([label, href]) => <a key={label} href={href} onClick={() => setNavOpen(false)}>{label}</a>)}<button className="nav-order" type="button" onClick={() => handleOpenOrder("Filter Kaapi")}>Order beans <ArrowRight size={15} /></button></nav><button className="nav-toggle" aria-label="Toggle menu" onClick={() => setNavOpen((v) => !v)}>{navOpen ? <X /> : <Menu />}</button></header>
    <section id="top" className="hero"><div className="hero-copy"><span className="eyebrow">Pesalai · Mannar, Sri Lanka</span><h1>{["Roasted", "in", "the", "Isle,", "Brewed", "with", "Heart"].map((word, i) => <span key={word} style={{ "--word-delay": `${i * 80}ms` } as CSSProperties}>{word} </span>)}</h1><p>Ajay's Brew — Single-Estate Beans<br />from Mannar, Sri Lanka</p><div className="hero-actions"><button className="button button-primary" type="button" onClick={() => handleOpenOrder("Cold Brew")}>Order Now <ArrowRight size={17} /></button><a className="button button-ghost" href="#menu">View Menu</a></div></div><div className="hero-art"><HeroCup /></div><div className="scroll-cue"><span>Trace the bean</span><i /><ArrowDown size={14} /></div><div className="bleed-word">Mannar.</div></section>
    <JourneySection />
    <section id="menu" className="menu-section"><header data-reveal><span className="section-index">02 / The menu</span><h2>Small batch.<br /><em>Big character.</em></h2><p>Estate coffees, familiar rituals, and a little Karnataka warmth.</p></header><div className="menu-grid">{menuItems.map((item, i) => <TiltCard key={item.name} item={item} index={i} onOrder={handleOpenOrder} />)}</div><div className="menu-bleed">Roasted.</div></section>
    <section className="gallery-section"><header><span className="section-index">03 / Field notes</span><h2>From our corner of<br /><em>the Western Ghats.</em></h2></header><div className="marquee row-one">{[hills, pourOver, cafe, filterPour, hills, pourOver, cafe, filterPour].map((src, i) => <img key={i} src={src} alt={["Coffee harvest in the Chikmagalur hills", "Pour-over coffee brewed by a sunlit window", "Ajay's Brew cafe interior with cane furniture", "Filter coffee poured into a brass tumbler"][i % 4]} width={i % 4 === 3 ? 1024 : 1280} height={i % 4 === 3 ? 1280 : 960} loading="lazy" />)}</div><div className="marquee row-two">{[filterPour, cafe, pourOver, hills, filterPour, cafe, pourOver, hills].map((src, i) => <img key={i} src={src} alt="A moment from Ajay's Brew" width={1280} height={960} loading="lazy" />)}</div></section>
    <Testimonials /><Location />
    <footer className="site-footer">
      <div className="footer-glow" />
      <div className="footer-grain-overlay" />

      {/* Top Luxury Gilded Header Bar */}
      <div className="footer-top-crest-bar">
        <div className="crest-line" />
        <div className="footer-crest-badge">
          <Coffee size={14} className="crest-coffee-icon" />
          <span className="crest-title">AJAY'S BREW ROASTERS</span>
          <span className="crest-sep">✦</span>
          <span className="crest-sub">ESTD 2014</span>
        </div>
        <div className="crest-line" />
      </div>

      {/* Top Hero Strip: Brand Narrative & VIP Dispatch Card */}
      <div className="footer-hero-strip">
        <div className="footer-brand-block">
          <span className="footer-eyebrow">Artisan Estate Roastery · Pesalai &amp; Western Ghats</span>
          <h2 className="footer-title">
            The slow pour. <br />
            <em>The sacred ritual.</em>
          </h2>
          <p className="footer-mission">
            Cultivated under wild rainforest canopies at 4,000 feet, micro-batch drum roasted, and served fresh at our coastal tasting room in Pesalai, Mannar. Every cup is an ode to patience and time-honored South Indian coffee heritage.
          </p>
          <div className="footer-trust-pills">
            <span className="trust-pill"><Leaf size={13} /> Shade-Grown Arabica &amp; Robusta</span>
            <span className="trust-pill"><Flame size={13} /> Micro-Batch Drum Roasted</span>
            <span className="trust-pill"><Coffee size={13} /> Traditional Brass Decoction</span>
            <span className="trust-pill"><Clock size={13} /> Roasted Within 48h</span>
          </div>
        </div>

        <div className="footer-vip-card">
          <div className="vip-card-glow" />
          <h3>Private harvest dispatches &amp; micro-lot access.</h3>
          <p>
            Join our inner circle of slow coffee devotees. Fortnightly notes on seasonal cuppings, rare estate lots, and home brewing rituals.
          </p>
          <form onSubmit={submit} className="newsletter-form">
            <div className="newsletter-input-wrap">
              <Mail size={15} className="newsletter-icon" />
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="Enter your email address..."
                aria-label="Email address"
              />
              <button type="submit" aria-label="Subscribe to newsletter">
                {sent ? (
                  <>
                    <Check size={14} /> Joined Circle
                  </>
                ) : (
                  <>
                    <span>Claim Invite</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </form>
          {sent ? (
            <div className="newsletter-success">
              <Check size={14} />
              <span>Welcome to the estate circle. Check your inbox for your first cupping guide.</span>
            </div>
          ) : (
            <div className="vip-micro-perks">
              <span><ShieldCheck size={12} /> Zero spam</span>
              <span className="perk-dot">·</span>
              <span>Fortnightly drops</span>
              <span className="perk-dot">·</span>
              <span>10% on first whole-bean order</span>
            </div>
          )}
        </div>
      </div>



      {/* Mid Divider with Back to Top */}
      <div className="footer-mid-divider">
        <div className="divider-line" />
        <a href="#top" className="back-to-top-btn" aria-label="Back to top">
          <span>Back to top</span>
          <ArrowUp size={13} />
        </a>
        <div className="divider-line" />
      </div>

      {/* Giant Architectural Signature Watermark */}
      <div className="footer-giant-word" aria-hidden="true">
        <span>AJAY'S BREW</span>
      </div>

      {/* Bottom Bar: Copyright, Socials, Credits */}
      <div className="footer-bottom-bar">
        <div className="footer-copyright">
          <span>© 2026 Ajay's Brew Roastery &amp; Estate Co.</span>
          <span className="footer-sep">·</span>
          <span>Crafted with quiet reverence for the bean.</span>
        </div>

        <div className="footer-social-strip">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon">
            <Instagram size={15} />
          </a>
          <a href="https://wa.me/94764630969" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Concierge" className="social-icon">
            <MessageCircle size={15} />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon">
            <Facebook size={15} />
          </a>
        </div>

        <div className="footer-legal-tag">
          <span>Pesalai, Mannar · Sri Lanka</span>
        </div>
      </div>
    </footer>
    <OrderView
      isOpen={orderOpen}
      onClose={() => setOrderOpen(false)}
      menuItems={menuItems}
      initialItemName={orderItemName}
    />
  </main>;
}