import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";

/* ─── Dish data ─────────────────────────────────────────────────────────────
   Each food has a warm bg that echoes the dish's dominant hue,
   and a slightly lighter panel tint for the gradient.
   ────────────────────────────────────────────────────────────────────────── */
const DISHES = [
  {
    src: "/koshari.png",
    name: "Koshari",        nameAr: "كُشري",
    label: "Most Loved",    labelAr: "الأكثر طلباً",
    desc:  "Egypt's iconic street dish — rice, pasta, lentils and tangy tomato sauce all in one bowl.",
    descAr:"أشهر أكلة شعبية مصرية — أرز ومعكرونة وعدس مع صلصة الطماطم الحامضة في طبق واحد.",
    bg: "#C44E22",  panel: "#D96A3A",
  },
  {
    src: "/mahshi.png",
    name: "Mahshi",         nameAr: "مَحشي",
    label: "Chef's Pick",   labelAr: "اختيار الطاهي",
    desc:  "Vine leaves and tender vegetables stuffed with herbed rice, slow-cooked to perfection.",
    descAr:"أوراق عنب وخضروات محشوة بأرز معطر ومطبوخة على نار هادئة حتى الإتقان.",
    bg: "#2E6641",  panel: "#3D8255",
  },
  {
    src: "/fatta.png",
    name: "Fattah",         nameAr: "فَتَّة",
    label: "Weekend Special", labelAr: "خاص الأسبوع",
    desc:  "Crispy bread, fragrant rice and slow-braised lamb bathed in a rich garlic-vinegar broth.",
    descAr:"خبز مقرمش وأرز فاخر ولحم ضأن في مرق غني بالثوم والخل.",
    bg: "#A0670E",  panel: "#C07E1A",
  },
  {
    src: "/umm_ali.png",
    name: "Umm Ali",        nameAr: "أم علي",
    label: "Sweet Finish",  labelAr: "ختام حلو",
    desc:  "Egypt's most beloved dessert — warm pastry soaked in cream, scattered with toasted nuts.",
    descAr:"أشهر حلوى مصرية — عجينة دافئة مغمورة في الكريمة مع مكسرات محمصة.",
    bg: "#7A3B10",  panel: "#9A5020",
  },
] as const;

const N = DISHES.length;
const EASE = "cubic-bezier(0.4,0,0.2,1)";
const DUR  = 650;

const ITEM_TRANSITION = [
  "transform", "filter", "opacity", "left", "right", "height", "bottom",
].map(p => `${p} ${DUR}ms ${EASE}`).join(", ");

/* role → absolute positioning */
function roleStyle(role: "center" | "left" | "right" | "back", mobile: boolean): React.CSSProperties {
  switch (role) {
    case "center": return {
      transform: `translateX(-50%) scale(${mobile ? 1.05 : 1.12})`,
      filter: "none",
      opacity: 1,
      zIndex: 20,
      left: "50%",
      height: mobile ? "44%" : "66%",
      bottom: mobile ? "18%" : "4%",
    };
    case "left": return {
      transform: "translateX(-50%) scale(1)",
      filter: "blur(3px)",
      opacity: 0.65,
      zIndex: 10,
      left: mobile ? "17%" : "24%",
      height: mobile ? "20%" : "36%",
      bottom: mobile ? "22%" : "7%",
    };
    case "right": return {
      transform: "translateX(-50%) scale(1)",
      filter: "blur(3px)",
      opacity: 0.65,
      zIndex: 10,
      left: mobile ? "83%" : "76%",
      height: mobile ? "20%" : "36%",
      bottom: mobile ? "22%" : "7%",
    };
    case "back": return {
      transform: "translateX(-50%) scale(1)",
      filter: "blur(6px)",
      opacity: 0.35,
      zIndex: 5,
      left: "50%",
      height: mobile ? "14%" : "24%",
      bottom: mobile ? "22%" : "7%",
    };
  }
}

export function FoodCarousel() {
  const { t, isRtl } = useLanguage();
  const [active, setActive]       = useState(0);
  const [busy, setBusy]           = useState(false);
  const [mobile, setMobile]       = useState(() => window.innerWidth < 640);
  const [isHovered, setIsHovered] = useState(false);

  /* preload */
  useEffect(() => { DISHES.forEach(d => { new window.Image().src = d.src; }); }, []);

  /* responsive */
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 640);
    window.addEventListener("resize", fn, { passive: true });
    return () => window.removeEventListener("resize", fn);
  }, []);

  /* sync --carousel-bg CSS variable so hero + stats waves always match */
  useEffect(() => {
    document.documentElement.style.setProperty("--carousel-bg", DISHES[active].bg);
  }, [active]);
  useEffect(() => {
    document.documentElement.style.setProperty("--carousel-bg", DISHES[0].bg);
    return () => { document.documentElement.style.removeProperty("--carousel-bg"); };
  }, []);

  const go = useCallback((dir: "next" | "prev") => {
    if (busy) return;
    setBusy(true);
    setActive(p => dir === "next" ? (p + 1) % N : (p + N - 1) % N);
    setTimeout(() => setBusy(false), DUR);
  }, [busy]);

  /* auto-advance — pauses while the user hovers over the carousel */
  useEffect(() => {
    if (isHovered) return;
    const id = setInterval(() => go("next"), 4500);
    return () => clearInterval(id);
  }, [go, isHovered]);

  const dish  = DISHES[active];
  const cIdx  = active;
  const lIdx  = (active + N - 1) % N;
  const rIdx  = (active + 1) % N;
  const bIdx  = (active + 2) % N;

  const role = (i: number): "center"|"left"|"right"|"back" =>
    i === cIdx ? "center" : i === lIdx ? "left" : i === rIdx ? "right" : "back";

  return (
    <section
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        backgroundColor: dish.bg,
        transition: `background-color ${DUR}ms ${EASE}`,
      }}
    >
      <div style={{ position: "relative", width: "100%", height: mobile ? "88vh" : "92vh", overflow: "hidden", zIndex: 35 }}>

        {/* ── Grain overlay ──────────────────────────────────────────────── */}
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0, zIndex: 50, pointerEvents: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
            opacity: 0.32,
          }}
        />

        {/* ── Giant ghost text ─────────────────────────────────────────────
             NO overflow:hidden here — the outer section already clips.
             The inner clip was what sliced the top/bottom of the letters. */}
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            pointerEvents: "none", userSelect: "none", zIndex: 2,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={active}
              initial={{ opacity: 0, y: 28, filter: "blur(14px)" }}
              animate={{ opacity: 1, y: 0,  filter: "blur(0px)"  }}
              exit={  { opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: "clamp(72px, 20vw, 280px)",
                fontWeight: 900,
                color: "white",
                opacity: 0.09,
                lineHeight: 1,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
              }}
            >
              {isRtl ? dish.nameAr : dish.name}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* ── Section label — vertically centered on the side edge ──────────
             Rotated 90° so it reads bottom-to-top on LTR, top-to-bottom on RTL. */}
        <div style={{
          position: "absolute",
          top: "50%",
          [isRtl ? "right" : "left"]: 16,
          transform: isRtl
            ? "translateY(-50%) rotate(90deg)"
            : "translateY(-50%) rotate(-90deg)",
          transformOrigin: "center center",
          zIndex: 60,
          whiteSpace: "nowrap",
        }}>
          <span style={{
            color: "rgba(255,255,255,0.70)", fontSize: 10,
            fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase",
          }}>
            {t("SIGNATURE DISHES", "أطباقنا المميزة")}
          </span>
        </div>

        {/* ── Carousel items ──────────────────────────────────────────────── */}
        <div style={{ position: "absolute", inset: 0, zIndex: 3 }}>
          {DISHES.map((d, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                aspectRatio: "1 / 1",
                transition: ITEM_TRANSITION,
                willChange: "transform, filter, opacity",
                ...roleStyle(role(i), mobile),
              }}
            >
              {/* Pulse skeleton — visible while image is decoding */}
              <div
                aria-hidden
                style={{
                  position: "absolute", inset: 0,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.12)",
                  animation: "carousel-pulse 1.6s ease-in-out infinite",
                }}
              />
              <img
                src={d.src}
                alt={d.name}
                draggable={false}
                /* i===0 is the hero dish — already preloaded, mark it high priority */
                fetchPriority={i === 0 ? "high" : "auto"}
                loading="eager"
                /* Fade in once decoded — hides skeleton automatically */
                onLoad={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  img.style.opacity = "1";
                  const skel = img.previousSibling as HTMLElement | null;
                  if (skel) skel.style.display = "none";
                }}
                style={{
                  position: "relative",
                  width: "100%", height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  borderRadius: "50%",
                  userSelect: "none",
                  display: "block",
                  opacity: 0,
                  transition: "opacity 0.45s ease",
                  boxShadow: role(i) === "center"
                    ? "0 32px 80px rgba(0,0,0,0.40)"
                    : "0 8px 24px rgba(0,0,0,0.25)",
                }}
              />
            </div>
          ))}
        </div>

        {/* ── Bottom vignette gradient ────────────────────────────────────── */}
        <div
          aria-hidden
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: "40%", zIndex: 15, pointerEvents: "none",
            background: `linear-gradient(to top, ${dish.bg} 0%, ${dish.bg}99 30%, transparent 100%)`,
            transition: `background ${DUR}ms ${EASE}`,
          }}
        />

        {/* ── Bottom-left: info + nav ─────────────────────────────────────── */}
        <div style={{
          position: "absolute",
          bottom: mobile ? 24 : 56,
          [isRtl ? "right" : "left"]: mobile ? 20 : 48,
          zIndex: 60,
          maxWidth: 360,
        }}>
          {/* Label badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`lbl-${active}`}
              initial={{ opacity: 0, x: isRtl ? 12 : -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={  { opacity: 0, x: isRtl ? -12 : 12 }}
              transition={{ duration: 0.28 }}
              style={{
                display: "inline-block", marginBottom: 10,
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "white", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.12em", textTransform: "uppercase",
                padding: "4px 14px", borderRadius: 999,
              }}
            >
              {isRtl ? dish.labelAr : dish.label}
            </motion.div>
          </AnimatePresence>

          {/* Dish name */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`nm-${active}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={  { opacity: 0, y: -14 }}
              transition={{ duration: 0.36, delay: 0.04 }}
              style={{
                color: "white",
                fontSize: mobile ? 28 : 40,
                fontWeight: 800, lineHeight: 1.15, marginBottom: 8,
              }}
            >
              {isRtl ? dish.nameAr : dish.name}
            </motion.p>
          </AnimatePresence>

          {/* Description — desktop only */}
          {!mobile && (
            <AnimatePresence mode="wait">
              <motion.p
                key={`dsc-${active}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={  { opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.10 }}
                style={{
                  color: "rgba(255,255,255,0.78)",
                  fontSize: 14, lineHeight: 1.65, marginBottom: 22,
                  maxWidth: 320,
                }}
              >
                {isRtl ? dish.descAr : dish.desc}
              </motion.p>
            </AnimatePresence>
          )}

          {/* Nav arrows */}
          <div style={{ display: "flex", gap: 10, marginTop: mobile ? 14 : 0 }}>
            {([
              { dir: isRtl ? "next" : "prev", Icon: ArrowLeft  },
              { dir: isRtl ? "prev" : "next", Icon: ArrowRight },
            ] as const).map(({ dir, Icon }) => (
              <button
                key={dir}
                onClick={() => go(dir)}
                aria-label={dir}
                style={{
                  width: mobile ? 44 : 54, height: mobile ? 44 : 54,
                  borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.55)",
                  background: "transparent", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: `transform 150ms, background 150ms, border-color 150ms`,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  el.style.transform = "scale(1.10)";
                  el.style.background = "rgba(255,255,255,0.15)";
                  el.style.borderColor = "rgba(255,255,255,0.95)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  el.style.transform = "scale(1)";
                  el.style.background = "transparent";
                  el.style.borderColor = "rgba(255,255,255,0.55)";
                }}
              >
                <Icon size={mobile ? 20 : 24} color="white" strokeWidth={2.25} />
              </button>
            ))}
          </div>
        </div>

        {/* ── Dot progress ───────────────────────────────────────────────── */}
        <div style={{
          position: "absolute",
          bottom: mobile ? 80 : 68,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 60,
          display: "flex",
          gap: 6,
          alignItems: "center",
        }}>
          {DISHES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (busy || i === active) return;
                setBusy(true);
                setActive(i);
                setTimeout(() => setBusy(false), DUR);
              }}
              aria-label={`Go to dish ${i + 1}`}
              style={{
                width: i === active ? 22 : 6,
                height: 6, borderRadius: 999,
                background: i === active ? "white" : "rgba(255,255,255,0.38)",
                border: "none", cursor: "pointer",
                padding: 0,
                transition: `width 300ms ${EASE}, background 300ms ${EASE}`,
              }}
            />
          ))}
        </div>

        {/* ── Bottom-right: CTA ───────────────────────────────────────────── */}
        <div style={{
          position: "absolute",
          bottom: mobile ? 28 : 60,
          [isRtl ? "left" : "right"]: mobile ? 20 : 40,
          zIndex: 60,
        }}>
          <Link href="/menu">
            <motion.span
              whileHover={{ opacity: 1, x: isRtl ? -4 : 4 }}
              initial={{ opacity: 0.88 }}
              style={{
                display: "flex", alignItems: "center",
                gap: 8, color: "white",
                fontSize: `clamp(16px, 3vw, 42px)`,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              {t("ORDER NOW", "اطلب الآن")}
              {isRtl
                ? <ArrowLeft  size={mobile ? 18 : 30} strokeWidth={2.25} />
                : <ArrowRight size={mobile ? 18 : 30} strokeWidth={2.25} />}
            </motion.span>
          </Link>
        </div>

      </div>


    </section>
  );
}
