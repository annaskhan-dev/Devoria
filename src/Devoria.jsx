import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════════ */

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200;12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior:smooth; font-size:16px; }
  body { background:#080810; color:#e8e6f0; font-family:'Bricolage Grotesque',sans-serif; overflow-x:hidden; }
  
  /* Hides native cursor everywhere on desktop safely */
  @media (min-width: 901px) {
    html, body, a, button, [role='button'], input, textarea, select { 
      cursor: none !important; 
    }
  }

  /* Core Custom Cursor Positioning Classes */
  .custom-cursor-pointer {
    position: fixed;
    left: 0;
    top: 0;
    border-radius: 50%;
    pointer-events: none !important;
    zIndex: 999999; 
    will-change: transform;
    transform: translate3d(var(--cx, -100px), var(--cy, -100px), 0) translate(-50%, -50%);
  }

  .custom-cursor-ring {
    position: fixed;
    left: 0;
    top: 0;
    border-radius: 50%;
    pointer-events: none !important;
    zIndex: 999998;
    will-change: transform;
    transform: translate3d(var(--rx, -100px), var(--ry, -100px), 0) translate(-50%, -50%);
  }

  ::-webkit-scrollbar { width:3px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(148,130,255,0.3); border-radius:2px; }
  input, textarea { font-family:inherit; color-scheme:dark; }
  a { text-decoration:none; }

  :root {
    --p: #9482FF;
    --p2: #6C5CE7;
    --a: #00D4AA;
    --a2: #00B890;
    --rose: #FF6B9D;
    --amber: #FFB347;
    --bg: #080810;
    --bg1: #0D0D1A;
    --bg2: #111124;
    --border: rgba(148,130,255,0.12);
    --border2: rgba(148,130,255,0.22);
    --text: #e8e6f0;
    --muted: rgba(232,230,240,0.45);
    --faint: rgba(232,230,240,0.18);
  }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:none; } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes pulse    { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(1.6); } }
  @keyframes spin     { to { transform:rotate(360deg); } }
  @keyframes marquee  { from { transform:translateX(0); } to { transform:translateX(-50%); } }
  @keyframes floatUp  { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-18px); } }
  @keyframes shimmer  { from { background-position:200% center; } to { background-position:-200% center; } }
  @keyframes borderGlow { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
  @keyframes scrollDot { 0%,100% { opacity:0; transform:translateY(0); } 40%,60% { opacity:1; } 100% { transform:translateY(16px); } }
  @keyframes gradFlow { 0% { background-position:0% 50%; } 50% { background-position:100% 50%; } 100% { background-position:0% 50%; } }
  @keyframes orbFloat1 { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(60px,-40px) scale(1.1); } 66% { transform:translate(-30px,50px) scale(0.95); } }
  @keyframes orbFloat2 { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(-50px,30px) scale(1.05); } 66% { transform:translate(40px,-60px) scale(0.9); } }
  @keyframes orbFloat3 { 0%,100% { transform:translate(0,0); } 50% { transform:translate(30px,30px); } }
  @keyframes lineGrow { from { scaleX:0; } to { scaleX:1; } }
  @keyframes countUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }
  @keyframes cardSlide { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:none; } }
  @keyframes dotBounce { 0%,100% { transform:translateY(0); opacity:0.4; } 50% { transform:translateY(-6px); opacity:1; } }
  @keyframes ringExpand { from { transform:scale(0.8); opacity:0; } to { transform:scale(1); opacity:1; } }
  @keyframes navIn { from { opacity:0; transform:translateY(-100%); } to { opacity:1; transform:none; } }

  /* ── Desktop & Mobile Responsive Layout Logic ── */
  .nav-links { display: flex; gap: 36px; align-items: center; }
  .mob-menu { display: none; }
  .hamburger { display: none; }

  @media (max-width: 900px) {
    .nav-links { display: none !important; }
    .hamburger { display: flex !important; }
    .mob-menu { display: none; }
    .mob-menu.open { display: flex !important; }
  }
  @media (max-width: 640px) {
    .hero-btns { flex-direction:column; align-items:stretch; }
    .hero-btns a { text-align:center; }
    .stats-grid { grid-template-columns:repeat(2,1fr) !important; }
    .svc-grid { grid-template-columns:1fr !important; }
    .process-tabs { flex-wrap:wrap; justify-content:center; }
    .footer-inner { flex-direction:column; text-align:center; gap:24px; }
    .cta-row { flex-direction:column; align-items:stretch; }
    .cta-row input, .cta-row button { width:100% !important; }
  }
`;

/* ═══════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════ */
const SERVICES = [
  {
    icon: "◈",
    title: "Web Development",
    desc: "Blazing-fast, pixel-perfect digital products engineered for scale. React, Next.js, performance-obsessed.",
    tag: "Core",
    col: "#9482FF",
    rgb: "148,130,255",
  },
  {
    icon: "◎",
    title: "AI Chatbot Design",
    desc: "Intelligent conversational agents trained on your brand — converting, supporting, and delighting 24/7.",
    tag: "New",
    col: "#00D4AA",
    rgb: "0,212,170",
  },
  {
    icon: "◐",
    title: "UI / UX Design",
    desc: "From wireframes to polished systems. Interfaces people feel, remember, and return to.",
    tag: "Creative",
    col: "#FF6B9D",
    rgb: "255,107,157",
  },
  {
    icon: "◉",
    title: "Digital Marketing",
    desc: "Data-driven growth engines. SEO, performance ads, content, and social that moves the needle.",
    tag: "Growth",
    col: "#FFB347",
    rgb: "255,179,71",
  },
  {
    icon: "◌",
    title: "Startup Launchpads",
    desc: "Full-stack launch packages. Idea to shipped product in weeks, not months — without compromise.",
    tag: "Popular",
    col: "#00D4AA",
    rgb: "0,212,170",
  },
  {
    icon: "◑",
    title: "Brand Identity",
    desc: "Logos, design systems, brand guidelines — a visual language that commands attention.",
    tag: "Core",
    col: "#9482FF",
    rgb: "148,130,255",
  },
];

const PROJECTS = [
  {
    name: "NexaFlow",
    cat: "Web · Brand",
    year: "2024",
    col: "#9482FF",
    rgb: "148,130,255",
    bg: "linear-gradient(145deg,#12102a 0%,#1e1850 100%)",
  },
  {
    name: "Orbita AI",
    cat: "AI · UI/UX",
    year: "2024",
    col: "#00D4AA",
    rgb: "0,212,170",
    bg: "linear-gradient(145deg,#071f1a 0%,#0d3d32 100%)",
  },
  {
    name: "Velox App",
    cat: "Product Design",
    year: "2024",
    col: "#FF6B9D",
    rgb: "255,107,157",
    bg: "linear-gradient(145deg,#1f0d16 0%,#3d1428 100%)",
  },
  {
    name: "Lumos Health",
    cat: "Web · Marketing",
    year: "2023",
    col: "#FFB347",
    rgb: "255,179,71",
    bg: "linear-gradient(145deg,#1f1200 0%,#3d2600 100%)",
  },
  {
    name: "Drift Protocol",
    cat: "Brand · Web3",
    year: "2024",
    col: "#00D4AA",
    rgb: "0,212,170",
    bg: "linear-gradient(145deg,#061520 0%,#0a2a3d 100%)",
  },
];

const TESTIMONIALS = [
  {
    name: "Aria Chen",
    role: "Co-founder, NexaFlow",
    text: "Devoria didn't just build our site — they built our brand's digital soul. The craftsmanship is extraordinary.",
    init: "AC",
    col: "#9482FF",
  },
  {
    name: "Marcus Webb",
    role: "CEO, Orbita AI",
    text: "The AI chatbot they built increased our lead conversion by 340%. The ROI in the first month was unbelievable.",
    init: "MW",
    col: "#00D4AA",
  },
  {
    name: "Priya Nair",
    role: "Head of Product, Velox",
    text: "Working with Devoria felt like having a world-class design team inside our startup. Fast, brilliant, and invested.",
    init: "PN",
    col: "#FF6B9D",
  },
  {
    name: "James Okafor",
    role: "Founder, Lumos Health",
    text: "Zero to launch in 3 weeks. Their process is surgical — every decision intentional, every pixel considered.",
    init: "JO",
    col: "#FFB347",
  },
];

const TECH = [
  "React",
  "Next.js",
  "TypeScript",
  "Figma",
  "Three.js",
  "OpenAI",
  "Tailwind",
  "Framer Motion",
  "Node.js",
  "Supabase",
  "Vercel",
  "GraphQL",
  "Stripe",
  "AWS",
  "Webflow",
];

const PROCESS = [
  {
    n: "01",
    t: "Discovery",
    d: "Deep-dive into your vision, goals, audience, and competitive landscape. We listen before we create.",
    icon: "○",
  },
  {
    n: "02",
    t: "Strategy",
    d: "A tailored roadmap with clear milestones, measurable outcomes, and zero ambiguity.",
    icon: "◇",
  },
  {
    n: "03",
    t: "Design",
    d: "High-fidelity interfaces that balance beauty with function. Every interaction considered.",
    icon: "△",
  },
  {
    n: "04",
    t: "Build",
    d: "Production-grade engineering. Fast, scalable, accessible — built to last.",
    icon: "□",
  },
  {
    n: "05",
    t: "Launch",
    d: "Ship with confidence. Full QA, performance optimization, and monitoring from day one.",
    icon: "☆",
  },
  {
    n: "06",
    t: "Grow",
    d: "Ongoing analytics, A/B testing, and iterative improvements to sustain momentum.",
    icon: "◈",
  },
];

/* ═══════════════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════════════ */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setV(true);
      },
      { threshold },
    );
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [threshold]);
  return [ref, v];
}

function useCounter(target, dur = 2200, active = false) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setN(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(step);
      else setN(target);
    };
    requestAnimationFrame(step);
  }, [active, target, dur]);
  return n;
}

function useMobile() {
  const [mob, setMob] = useState(false);
  useEffect(() => {
    const check = () => setMob(window.innerWidth <= 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mob;
}

/* ═══════════════════════════════════════════════════════════════
   CURSOR (OPTIMIZED STRUCTURAL LAYER MAPPING)
═══════════════════════════════════════════════════════════════ */
function Cursor() {
  const mob = useMobile();
  const [hov, setHov] = useState(false);
  
  const pointerRef = useRef({ x: -100, y: -100 });
  const trailingRef = useRef({ x: -100, y: -100 });
  
  const targetPointerRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);

  useEffect(() => {
    if (mob) return;

    const move = (e) => {
      targetPointerRef.current = { x: e.clientX, y: e.clientY };
    };

    const loop = () => {
      // Fluid inertial interpolation tracks
      pointerRef.current.x += (targetPointerRef.current.x - pointerRef.current.x) * 0.4;
      pointerRef.current.y += (targetPointerRef.current.y - pointerRef.current.y) * 0.4;

      trailingRef.current.x += (pointerRef.current.x - trailingRef.current.x) * 0.25;
      trailingRef.current.y += (pointerRef.current.y - trailingRef.current.y) * 0.25;

      // Directly update CSS properties on document root structure to avoid virtual DOM dropouts
      document.documentElement.style.setProperty("--cx", `${pointerRef.current.x}px`);
      document.documentElement.style.setProperty("--cy", `${pointerRef.current.y}px`);
      document.documentElement.style.setProperty("--rx", `${trailingRef.current.x}px`);
      document.documentElement.style.setProperty("--ry", `${trailingRef.current.y}px`);
      
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    window.addEventListener("mousemove", move);

    const onEnt = (e) => {
      if (e.target.closest("a, button, .hamburger, [role='button'], input, textarea, select")) {
        setHov(true);
      }
    };
    const onLv = () => setHov(false);

    document.addEventListener("mouseover", onEnt);
    document.addEventListener("mouseout", onLv);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", onEnt);
      document.removeEventListener("mouseout", onLv);
      cancelAnimationFrame(rafRef.current);
    };
  }, [mob]);

  if (mob) return null;

  return (
    <>
      {/* Central Pointer Dot */}
      <div 
        className="custom-cursor-pointer"
        style={{ 
          width: hov ? "6px" : "8px", 
          height: hov ? "6px" : "8px", 
          background: hov ? "#00D4AA" : "var(--p)", 
          transition: "width 0.25s cubic-bezier(0.25, 1, 0.5, 1), height 0.25s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.25s ease",
          zIndex: 999999
        }} 
      />
      
      {/* Smooth Lag Trailing Ring */}
      <div 
        className="custom-cursor-ring"
        style={{ 
          width: hov ? "54px" : "28px", 
          height: hov ? "54px" : "28px", 
          border: `1.5px solid ${hov ? "#00D4AA" : "var(--p)"}`, 
          background: hov ? "rgba(0, 212, 170, 0.05)" : "transparent",
          transition: "width 0.3s cubic-bezier(0.25, 1, 0.5, 1), height 0.3s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s ease, background 0.3s ease", 
          opacity: 0.85, 
          zIndex: 999998
        }} 
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PARTICLE CANVAS
═══════════════════════════════════════════════════════════════ */
function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext("2d");
    let W, H, pts, raf;
    const init = () => {
      W = c.width = window.innerWidth;
      H = c.height = window.innerHeight;
      const cnt = window.innerWidth < 640 ? 30 : 60;
      pts = Array.from({ length: cnt }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.2 + 0.3,
        col: Math.random() > 0.5 ? "148,130,255" : "0,212,170",
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p) => {
        p.x = (p.x + p.vx + W) % W;
        p.y = (p.y + p.vy + H) % H;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.col},0.55)`;
        ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x,
            dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(148,130,255,${(1 - d / 110) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    init();
    draw();
    window.addEventListener("resize", init);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", init);
    };
  }, []);
  return (
    <canvas
      ref={ref}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   FADE WRAPPER
═══════════════════════════════════════════════════════════════ */
function Fade({ children, delay = 0, y = 36, style: s }) {
  const [ref, v] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: v ? 1 : 0,
        transform: v ? "none" : `translateY(${y}px)`,
        transition: `opacity 0.9s ease ${delay}s, transform 0.9s cubic-bezier(.16,1,.3,1) ${delay}s`,
        ...s,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LABEL
═══════════════════════════════════════════════════════════════ */
function Label({ children, color = "var(--p)" }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 20,
      }}
    >
      <div style={{ width: 18, height: 1, background: color }} />
      <span
        style={{
          color,
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontFamily: "'DM Mono',monospace",
        }}
      >
        {children}
      </span>
      <div style={{ width: 18, height: 1, background: color }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);
  const links = ["Services", "Work", "Process", "About", "Contact"];
  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 500,
          height: 50,
          padding: "0 5%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(8,8,16,0.9)" : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          borderBottom: scrolled ? "1px solid var(--border)" : "none",
          transition: "all 0.4s ease",
          animation: "navIn 0.8s ease",
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontFamily: "'Bricolage Grotesque',sans-serif",
            fontWeight: 800,
            fontSize: 22,
            letterSpacing: "-0.03em",
            background:
              "linear-gradient(135deg,#9482FF 0%,#e8e6f0 50%,#00D4AA 100%)",
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "gradFlow 6s ease infinite",
          }}
        >
          Devoria
        </div>

        {/* Desktop links */}
        <div className="nav-links">
          {links.slice(0, 4).map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              style={{
                color: "var(--muted)",
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "0.02em",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "var(--text)")}
              onMouseLeave={(e) => (e.target.style.color = "var(--muted)")}
            >
              {l}
            </a>
          ))}
          <a
            href="#contact"
            style={{
              background: "transparent",
              border: "1px solid var(--border2)",
              color: "var(--text)",
              padding: "9px 22px",
              borderRadius: 100,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              transition: "all 0.3s",
              fontFamily: "'DM Mono',monospace",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--p)";
              e.currentTarget.style.borderColor = "var(--p)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "var(--border2)";
            }}
          >
            Start Project
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            background: "none",
            border: "1px solid var(--border2)",
            borderRadius: 8,
            padding: "8px 10px",
            color: "var(--text)",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            alignItems: "center",
            position: "relative",
            zIndex: 600
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 18,
                height: 1.5,
                background: "var(--text)",
                borderRadius: 1,
                transition: "all 0.3s",
                transform: menuOpen
                  ? i === 0
                    ? "rotate(45deg) translate(4px,4px)"
                    : i === 2
                      ? "rotate(-45deg) translate(4px,-4px)"
                      : "scaleX(0)"
                  : "none",
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`mob-menu ${menuOpen ? "open" : ""}`}
        style={{
          position: "fixed",
          top: 68,
          left: 0,
          right: 0,
          zIndex: 499,
          background: "rgba(8,8,16,0.97)",
          backdropFilter: "blur(24px)",
          flexDirection: "column",
          padding: "24px 5% 32px",
          borderBottom: "1px solid var(--border)",
          gap: 4,
        }}
      >
        {links.map((l) => (
          <a
            key={l}
            href={`#${l.toLowerCase()}`}
            onClick={() => setMenuOpen(false)}
            style={{
              color: "var(--muted)",
              fontSize: 16,
              fontWeight: 500,
              padding: "14px 0",
              borderBottom: "1px solid var(--border)",
              display: "block",
            }}
            onMouseEnter={(e) => (e.target.style.color = "var(--text)")}
            onMouseLeave={(e) => (e.target.style.color = "var(--muted)")}
          >
            {l}
          </a>
        ))}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════ */
function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [wordIdx, setWordIdx] = useState(0);
  const [wordVis, setWordVis] = useState(true);
  const words = ["Websites.", "Chatbots.", "Products.", "Brands.", "Growth."];
  const mob = useMobile();

  useEffect(() => {
    setTimeout(() => setLoaded(true), 80);
  }, []);
  useEffect(() => {
    const t = setInterval(() => {
      setWordVis(false);
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % words.length);
        setWordVis(true);
      }, 400);
    }, 2800);
    return () => clearInterval(t);
  }, [words.length]);
  const onMove = (e) => {
    if (!mob)
      setMouse({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
  };

  return (
    <section
      onMouseMove={onMove}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        padding: "120px 5% 80px",
        textAlign: "center",
        zIndex: 1,
      }}
    >
      {/* Background orbs */}
      <div
        style={{
          position: "absolute",
          width: "min(700px,90vw)",
          height: "min(700px,90vw)",
          top: "-10%",
          left: "-15%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(148,130,255,0.09) 0%, transparent 65%)",
          animation: "orbFloat1 14s ease-in-out infinite",
          pointerEvents: "none",
          transform: mob
            ? "none"
            : `translate(${(mouse.x - 0.5) * -40}px,${(mouse.y - 0.5) * -40}px)`,
          transition: "transform 1.2s cubic-bezier(.23,1,.32,1)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "min(500px,70vw)",
          height: "min(500px,70vw)",
          bottom: "0%",
          right: "-10%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,212,170,0.07) 0%, transparent 65%)",
          animation: "orbFloat2 18s ease-in-out infinite",
          pointerEvents: "none",
          transform: mob
            ? "none"
            : `translate(${(mouse.x - 0.5) * 30}px,${(mouse.y - 0.5) * 30}px)`,
          transition: "transform 1.2s cubic-bezier(.23,1,.32,1)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "min(300px,50vw)",
          height: "min(300px,50vw)",
          top: "40%",
          left: "55%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,107,157,0.06) 0%, transparent 65%)",
          animation: "orbFloat3 10s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)",
          backgroundSize: "clamp(50px,6vw,88px) clamp(50px,6vw,88px)",
          opacity: 0.4,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, var(--bg) 100%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 920,
          opacity: loaded ? 1 : 0,
          transform: loaded ? "none" : "translateY(24px)",
          transition: "all 1s ease",
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(148,130,255,0.08)",
            border: "1px solid rgba(148,130,255,0.2)",
            borderRadius: 100,
            padding: "8px 18px",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--a)",
              animation: "pulse 2.5s ease-in-out infinite",
            }}
          />
          <span
            style={{
              color: "rgba(148,130,255,0.9)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontFamily: "'DM Mono',monospace",
            }}
          >
            Digital Agency for Startups
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "clamp(44px,7.5vw,110px)",
            fontWeight: 800,
            lineHeight: 0.98,
            letterSpacing: "-0.04em",
            margin: "0 0 28px",
            color: "var(--text)",
          }}
        >
          We craft
          <br />
          <span
            style={{
              display: "inline-block",
              background:
                "linear-gradient(135deg,#9482FF 0%,#FF6B9D 40%,#00D4AA 80%)",
              backgroundSize: "200% 200%",
              animation: "gradFlow 5s ease infinite",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              opacity: wordVis ? 1 : 0,
              transform: wordVis ? "none" : "translateY(20px) scale(0.95)",
              transition: "opacity 0.35s ease,transform 0.35s ease",
            }}
          >
            {words[wordIdx]}
          </span>
        </h1>

        {/* Sub */}
        <p
          style={{
            color: "var(--muted)",
            fontSize: "clamp(15px,2vw,18px)",
            lineHeight: 1.75,
            maxWidth: 520,
            margin: "0 auto 52px",
          }}
        >
          Devoria builds the digital infrastructure modern startups need to grow
          — from product design and AI to brand and marketing.
        </p>

        {/* CTAs */}
        <div
          className="hero-btns"
          style={{
            display: "flex",
            gap: 14,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href="#services"
            style={{
              background: "var(--p)",
              color: "#fff",
              padding: "15px 36px",
              borderRadius: 100,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.03em",
              boxShadow: "0 0 40px rgba(148,130,255,0.35)",
              transition: "transform 0.25s,box-shadow 0.25s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 0 60px rgba(148,130,255,0.55)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow =
                "0 0 40px rgba(148,130,255,0.35)";
            }}
          >
            Explore Services →
          </a>
          <a
            href="#work"
            style={{
              background: "transparent",
              border: "1px solid rgba(232,230,240,0.15)",
              color: "var(--text)",
              padding: "15px 36px",
              borderRadius: 100,
              fontSize: 14,
              fontWeight: 500,
              transition: "border-color 0.25s,background 0.25s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(148,130,255,0.4)";
              e.currentTarget.style.background = "rgba(148,130,255,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(232,230,240,0.15)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            View Our Work
          </a>
        </div>

        {/* Trust strip */}
        <div
          style={{
            marginTop: 60,
            display: "flex",
            gap: "clamp(20px,4vw,48px)",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {[
            "50+ Startups launched",
            "3× average growth",
            "Shipped in weeks",
          ].map((t, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <span
                style={{ color: "var(--a)", fontSize: 12, fontWeight: 600 }}
              >
                ✓
              </span>
              <span
                style={{
                  color: "var(--faint)",
                  fontSize: 12,
                  fontFamily: "'DM Mono',monospace",
                  letterSpacing: "0.05em",
                }}
              >
                {t}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          opacity: loaded ? 0.4 : 0,
          transition: "opacity 1.5s ease 2s",
        }}
      >
        <div
          style={{
            width: 24,
            height: 38,
            border: "1.5px solid rgba(148,130,255,0.35)",
            borderRadius: 12,
            display: "flex",
            justifyContent: "center",
            padding: "5px 0",
          }}
        >
          <div
            style={{
              width: 3,
              height: 8,
              background: "var(--p)",
              borderRadius: 2,
              animation: "scrollDot 2.2s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MARQUEE STRIP
═══════════════════════════════════════════════════════════════ */
function MarqueeStrip() {
  const items = [...TECH, ...TECH];
  return (
    <div
      style={{
        overflow: "hidden",
        padding: "22px 0",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          display: "flex",
          animation: "marquee 30s linear infinite",
          whiteSpace: "nowrap",
        }}
      >
        {items.map((t, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 24,
              padding: "0 24px",
              color: "var(--faint)",
              fontSize: 11,
              fontFamily: "'DM Mono',monospace",
              fontWeight: 500,
              letterSpacing: "0.15em",
            }}
          >
            <span
              style={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: "var(--p)",
                display: "inline-block",
              }}
            />
            {t.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STATS
═══════════════════════════════════════════════════════════════ */
const STATS = [
  { v: 120, s: "+", l: "Projects Delivered", col: "var(--p)" },
  { v: 98, s: "%", l: "Client Satisfaction", col: "var(--a)" },
  { v: 3, s: "×", l: "Avg. Client Growth", col: "var(--rose)" },
  { v: 24, s: "h", l: "Response Time", col: "var(--amber)" },
];

function Stats() {
  const [ref, v] = useInView(0.25);
  const n0 = useCounter(STATS[0].v, 2000, v);
  const n1 = useCounter(STATS[1].v, 2000, v);
  const n2 = useCounter(STATS[2].v, 2000, v);
  const n3 = useCounter(STATS[3].v, 2000, v);
  const counts = [n0, n1, n2, n3];
  return (
    <section
      style={{ padding: "clamp(48px,8vw,80px) 5%", position: "relative", zIndex: 1 }}
      ref={ref}
    >
      <div
        className="stats-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 1,
          border: "1px solid var(--border)",
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        {STATS.map((s, i) => {
          const n = counts[i];
          return (
            <div
              key={i}
              style={{
                padding: "clamp(28px,5vw,52px) 20px",
                textAlign: "center",
                background: i % 2 === 0 ? "var(--bg1)" : "var(--bg2)",
                borderRight: i < 3 ? "1px solid var(--border)" : "none",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `radial-gradient(circle at 50% 0%, rgba(${i === 0 ? "148,130,255" : i === 1 ? "0,212,170" : i === 2 ? "255,107,157" : "255,179,71"},0.06) 0%, transparent 60%)`,
                }}
              />
              <div
                style={{
                  fontFamily: "'Bricolage Grotesque',sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(36px,5vw,56px)",
                  color: "var(--text)",
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  animationName: v ? "countUp" : "none",
                  animationDuration: "0.6s",
                  animationTimingFunction: "ease",
                  animationFillMode: "both",
                  animationDelay: `${i * 0.12}s`,
                }}
              >
                {n}
                <span style={{ color: s.col, fontSize: "0.65em" }}>{s.s}</span>
              </div>
              <div
                style={{
                  color: "var(--muted)",
                  fontSize: 11,
                  fontFamily: "'DM Mono',monospace",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginTop: 12,
                }}
              >
                {s.l}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SERVICES
═══════════════════════════════════════════════════════════════ */
function Services() {
  const [hov, setHov] = useState(null);
  return (
    <section
      id="services"
      style={{
        padding: "clamp(48px,8vw,100px) 5%",
        position: "relative",
        zIndex: 1,
      }}
    >
      <Fade style={{ textAlign: "center", marginBottom: "clamp(40px,6vw,72px)" }}>
        <Label>What We Do</Label>
        <h2
          style={{
            fontSize: "clamp(32px,5vw,60px)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "var(--text)",
          }}
        >
          Services built for <br />
          <span
            style={{
              background: "linear-gradient(135deg,var(--p),var(--a))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ambitious founders
          </span>
        </h2>
      </Fade>
      <div
        className="svc-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap: 14,
        }}
      >
        {SERVICES.map((s, i) => (
          <Fade key={i} delay={i * 0.07}>
            <div
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              style={{
                background: hov === i ? `rgba(${s.rgb},0.05)` : "rgba(255,255,255,0.02)",
                border: `1px solid ${hov === i ? s.col + "33" : "var(--border)"}`,
                borderRadius: 16,
                padding: "clamp(24px,4vw,40px)",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.4s cubic-bezier(.23,1,.32,1)",
                transform: hov === i ? "translateY(-6px)" : "none",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -40,
                  right: -40,
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: `radial-gradient(circle,${s.col}22 0%,transparent 70%)`,
                  opacity: hov === i ? 1 : 0,
                  transition: "opacity 0.4s",
                }}
              />
              {/* Tag */}
              <div
                style={{
                  position: "absolute",
                  top: 18,
                  right: 18,
                  background: `rgba(${s.rgb},0.1)`,
                  border: `1px solid rgba(${s.rgb},0.2)`,
                  color: s.col,
                  fontSize: 9,
                  fontFamily: "'DM Mono',monospace",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  padding: "4px 10px",
                  borderRadius: 100,
                  textTransform: "uppercase",
                }}
              >
                {s.tag}
              </div>
              {/* Icon */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  border: `1px solid rgba(${s.rgb},0.25)`,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: s.col,
                  fontSize: 20,
                  marginBottom: 22,
                  background: `rgba(${s.rgb},0.06)`,
                  transition: "transform 0.3s",
                  transform: hov === i ? "scale(1.1)" : "none",
                }}
              >
                {s.icon}
              </div>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  marginBottom: 12,
                  color: "var(--text)",
                  letterSpacing: "-0.01em",
                }}
              >
                {s.title}
              </h3>
              <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
                {s.desc}
              </p>
            </div>
          </Fade>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   WORK / PROJECTS SECTION
═══════════════════════════════════════════════════════════════ */
function Work() {
  const [hov, setHov] = useState(null);
  return (
    <section
      id="work"
      style={{
        padding: "clamp(48px,8vw,100px) 5%",
        background: "var(--bg1)",
        position: "relative",
        zIndex: 1,
      }}
    >
      <Fade style={{ textAlign: "center", marginBottom: "clamp(40px,6vw,72px)" }}>
        <Label color="var(--a)">Selected Work</Label>
        <h2
          style={{
            fontSize: "clamp(32px,5vw,60px)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "var(--text)",
          }}
        >
          Production-grade <br />
          <span
            style={{
              background: "linear-gradient(135deg,var(--a),var(--p))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            digital experiences
          </span>
        </h2>
      </Fade>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        {PROJECTS.map((p, i) => (
          <Fade key={i} delay={i * 0.05} y={20}>
            <div
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "clamp(20px,3vw,36px) 24px",
                borderBottom: "1px solid var(--border)",
                position: "relative",
                transition: "all 0.3s ease",
                background: hov === i ? "rgba(255,255,255,0.01)" : "transparent",
              }}
            >
              {/* Overlay background block on hover */}
              <div
                style={{
                  position: "absolute",
                  inset: "4px 0",
                  background: p.bg,
                  borderRadius: 12,
                  zIndex: -1,
                  opacity: hov === i ? 0.12 : 0,
                  transform: hov === i ? "scale(1)" : "scale(0.98)",
                  transition: "all 0.4s cubic-bezier(.16,1,.3,1)",
                }}
              />

              <div style={{ display: "flex", alignItems: "center", gap: "clamp(16px,4vw,40px)" }}>
                <span
                  style={{
                    fontFamily: "'DM Mono',monospace",
                    fontSize: 12,
                    color: hov === i ? p.col : "var(--faint)",
                    transition: "color 0.3s",
                  }}
                >
                  0{i + 1}
                </span>
                <h3
                  style={{
                    fontSize: "clamp(22px,3.5vw,40px)",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: hov === i ? "#fff" : "var(--text)",
                    transform: hov === i ? "translateX(10px)" : "none",
                    transition: "all 0.3s cubic-bezier(.16,1,.3,1)",
                  }}
                >
                  {p.name}
                </h3>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(20px,5vw,64px)",
                  textAlign: "right",
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--muted)",
                    fontFamily: "'Bricolage Grotesque',sans-serif",
                  }}
                >
                  {p.cat}
                </span>
                <span
                  style={{
                    fontFamily: "'DM Mono',monospace",
                    fontSize: 12,
                    color: "var(--faint)",
                    display: window.innerWidth < 500 ? "none" : "block",
                  }}
                >
                  {p.year}
                </span>
              </div>
            </div>
          </Fade>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROCESS / ROADMAP SECTION
═══════════════════════════════════════════════════════════════ */
function Process() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <section
      id="process"
      style={{
        padding: "clamp(48px,8vw,100px) 5%",
        position: "relative",
        zIndex: 1,
      }}
    >
      <Fade style={{ textAlign: "center", marginBottom: 52 }}>
        <Label>How We Shipped</Label>
        <h2
          style={{
            fontSize: "clamp(32px,5vw,60px)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "var(--text)",
          }}
        >
          A highly deliberate <br />
          <span
            style={{
              background: "linear-gradient(135deg,var(--rose),var(--p))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            engineering workflow
          </span>
        </h2>
      </Fade>

      {/* Process Interactive Tabs */}
      <div
        className="process-tabs"
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border)",
          maxWidth: 960,
          margin: "0 auto 40px",
          paddingBottom: 12,
          gap: 12,
        }}
      >
        {PROCESS.map((p, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            style={{
              background: "none",
              border: "none",
              color: activeTab === i ? "var(--text)" : "var(--faint)",
              fontSize: 14,
              fontWeight: 600,
              padding: "8px 12px",
              cursor: "pointer",
              transition: "all 0.3s",
              position: "relative",
              fontFamily: "'Bricolage Grotesque',sans-serif",
            }}
          >
            <span
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: 10,
                marginRight: 6,
                color: activeTab === i ? "var(--p)" : "inherit",
              }}
            >
              {p.n}
            </span>
            {p.t}
            {activeTab === i && (
              <div
                style={{
                  position: "absolute",
                  bottom: -13,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: "var(--p)",
                  animation: "lineGrow 0.35s ease forwards",
                  transformOrigin: "left",
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Render Active Stage Content Cards Layout */}
      <div style={{ maxWidth: 760, margin: "0 auto", minHeight: 180 }}>
        {PROCESS.map((p, i) => {
          if (i !== activeTab) return null;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 32,
                alignItems: "flex-start",
                animation: "fadeIn 0.5s ease both",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: "rgba(148,130,255,0.08)",
                  border: "1px solid var(--border2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  color: "var(--p)",
                  flexShrink: 0,
                }}
              >
                {p.icon}
              </div>
              <div>
                <h3
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "var(--text)",
                    marginBottom: 12,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {p.t}
                </h3>
                <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.7 }}>
                  {p.d}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TESTIMONIALS SECTION
═══════════════════════════════════════════════════════════════ */
function Testimonials() {
  return (
    <section
      id="about"
      style={{
        padding: "clamp(48px,8vw,100px) 5%",
        background: "var(--bg2)",
        position: "relative",
        zIndex: 1,
      }}
    >
      <Fade style={{ textAlign: "center", marginBottom: "clamp(40px,6vw,72px)" }}>
        <Label color="var(--amber)">Testimonials</Label>
        <h2
          style={{
            fontSize: "clamp(32px,5vw,60px)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "var(--text)",
          }}
        >
          Trusted by world-class <br />
          <span
            style={{
              background: "linear-gradient(135deg,var(--amber),var(--rose))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            startup founders
          </span>
        </h2>
      </Fade>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: 16,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {TESTIMONIALS.map((t, i) => (
          <Fade key={i} delay={i * 0.08}>
            <div
              style={{
                background: "var(--bg1)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: "32px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontSize: 56,
                  fontFamily: "serif",
                  color: "var(--faint)",
                  lineHeight: 1,
                  position: "absolute",
                  top: 16,
                  left: 20,
                  pointerEvents: "none",
                }}
              >
                “
              </div>
              <p
                style={{
                  color: "var(--text)",
                  fontSize: 15,
                  lineHeight: 1.65,
                  marginBottom: 28,
                  position: "relative",
                  zIndex: 2,
                }}
              >
                {t.text}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: `${t.col}15`,
                    border: `1px solid ${t.col}44`,
                    color: t.col,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: "'DM Mono',monospace",
                  }}
                >
                  {t.init}
                </div>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                    {t.name}
                  </h4>
                  <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          </Fade>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CTA / CONTACT SECTION
═══════════════════════════════════════════════════════════════ */
function Contact() {
  const [email, setEmail] = useState("");
  const [subbed, setSubbed] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (email.trim().length > i) {
      setSubbed(true);
      setEmail("");
    }
  };
  const i = 3;

  return (
    <section
      id="contact"
      style={{
        padding: "clamp(60px,10vw,130px) 5%",
        position: "relative",
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          background: "radial-gradient(circle at 50% 50%, #0e0d26 0%, var(--bg1) 100%)",
          border: "1px solid var(--border2)",
          borderRadius: 24,
          padding: "clamp(32px,6vw,64px) clamp(20px,5vw,48px)",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            background: "radial-gradient(circle, rgba(148,130,255,0.08) 0%, transparent 70%)",
            top: "-20%",
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        />

        <Fade>
          <Label color="var(--p)">Get Shipped</Label>
          <h2
            style={{
              fontSize: "clamp(32px,5.5vw,68px)",
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: "-0.04em",
              color: "var(--text)",
              marginBottom: 20,
            }}
          >
            Ready to build your <br />
            <span
              style={{
                background: "linear-gradient(135deg,#9482FF 0%,#00D4AA 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              unfair advantage?
            </span>
          </h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "clamp(14px,1.8vw,16px)",
              maxWidth: 460,
              margin: "0 auto 40px",
              lineHeight: 1.6,
            }}
          >
            Drop your email below. We’ll reach out within 24 hours to schedule a discovery call
            and outline your project timeline.
          </p>
        </Fade>

        <Fade delay={0.1}>
          {subbed ? (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                background: "rgba(0,212,170,0.08)",
                border: "1px solid rgba(0,212,170,0.2)",
                padding: "14px 28px",
                borderRadius: 100,
                color: "var(--a)",
                fontSize: 14,
                fontWeight: 600,
                animation: "ringExpand 0.4s ease",
              }}
            >
              ✓ Thank you! We will get back to you shortly.
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="cta-row"
              style={{
                display: "flex",
                background: "rgba(8,8,16,0.4)",
                border: "1px solid var(--border2)",
                padding: 6,
                borderRadius: 100,
                maxWidth: 480,
                margin: "0 auto",
                alignItems: "center",
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "var(--text)",
                  padding: "0 20px",
                  fontSize: 14,
                  flexGrow: 1,
                  height: 44,
                }}
              />
              <button
                type="submit"
                style={{
                  background: "var(--text)",
                  color: "var(--bg)",
                  border: "none",
                  outline: "none",
                  padding: "0 24px",
                  height: 44,
                  borderRadius: 100,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.opacity = 0.9)}
                onMouseLeave={(e) => (e.target.style.opacity = 1)}
              >
                Let's Talk
              </button>
            </form>
          )}
        </Fade>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "40px 5%",
        background: "#05050b",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        className="footer-inner"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            color: "var(--faint)",
            fontSize: 11,
            fontFamily: "'DM Mono',monospace",
            letterSpacing: "0.06em",
          }}
        >
          © 2025 DEVORIA AGENCY. ALL RIGHTS RESERVED.
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {["Twitter", "LinkedIn", "Dribbble", "GitHub"].map((s) => (
            <a
              key={s}
              href="#"
              style={{
                color: "var(--faint)",
                fontSize: 11,
                fontFamily: "'DM Mono',monospace",
                letterSpacing: "0.06em",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "var(--p)")}
              onMouseLeave={(e) => (e.target.style.color = "var(--faint)")}
            >
              {s.toUpperCase()}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════════ */
export default function App() {
  return (
    <>
      <style>{G}</style>
      <Cursor />
      <div
        style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}
      >
        <Particles />

        <Navbar />
        <Hero />
        <MarqueeStrip />
        <Stats />
        <Services />
        <Work />
        <Process />
        <Testimonials />
        <Contact />
        <Footer />
      </div>
    </>
  );
}