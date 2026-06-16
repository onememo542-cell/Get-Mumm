import { useState, useEffect, useLayoutEffect, useCallback } from "react";
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
    objectPosition: "50% 82%",
  },
  {
    src: "/mahshi.png",
    name: "Mahshi",         nameAr: "مَحشي",
    label: "Chef's Pick",   labelAr: "اختيار الطاهي",
    desc:  "Vine leaves and tender vegetables stuffed with herbed rice, slow-cooked to perfection.",
    descAr:"أوراق عنب وخضروات محشوة بأرز معطر ومطبوخة على نار هادئة حتى الإتقان.",
    bg: "#2E6641",  panel: "#3D8255",
    objectPosition: "50% 78%",
  },
  {
    src: "/fatta.png",
    name: "Fattah",         nameAr: "فَتَّة",
    label: "Weekend Special", labelAr: "خاص الأسبوع",
    desc:  "Crispy bread, fragrant rice and slow-braised lamb bathed in a rich garlic-vinegar broth.",
    descAr:"خبز مقرمش وأرز فاخر ولحم ضأن في مرق غني بالثوم والخل.",
    bg: "#A0670E",  panel: "#C07E1A",
    objectPosition: "50% 80%",
  },
  {
    src: "/umm_ali.png",
    name: "Umm Ali",        nameAr: "أم علي",
    label: "Sweet Finish",  labelAr: "ختام حلو",
    desc:  "Egypt's most beloved dessert — warm pastry soaked in cream, scattered with toasted nuts.",
    descAr:"أشهر حلوى مصرية — عجينة دافئة مغمورة في الكريمة مع مكسرات محمصة.",
    bg: "#7A3B10",  panel: "#9A5020",
    objectPosition: "50% 88%",
  },
] as const;

const N = DISHES.length;
const EASE = "cubic-bezier(0.4,0,0.2,1)";
const DUR  = 650;
const COLOR_TRANSITION = `background-color ${DUR}ms ${EASE}, color ${DUR}ms ${EASE}`;

const ITEM_TRANSITION = [
  "transform", "filter", "opacity", "left", "right", "height", "bottom", "top",
].map(p => `${p} ${DUR}ms ${EASE}`).join(", ");

/* First grapheme for the giant ghost letter */
function firstLetter(text: string): string {
  return [...text.trim()][0] ?? text.charAt(0);
}

/* role → absolute positioning (always uses `left`; swap sides in RTL) */
function roleStyle(
  role: "center" | "left" | "right" | "back",
  mobile: boolean,
  mirror: boolean,
  isFocused: boolean,
): React.CSSProperties {
  const leftPct  = mobile ? "14%" : "20%";
  const rightPct = mobile ? "86%" : "80%";
  /* Shift hero circle toward the image side so the text panel has room */
  const centerLeft = mobile ? "50%" : mirror ? "38%" : "62%";
  const centerH    = mobile ? "44%" : "58%";
  const centerScale = mobile
    ? (isFocused ? 1.12 : 1.05)
    : (isFocused ? 1.18 : 1.08);

  switch (role) {
    case "center": return {
      transform: `translate(-50%, -50%) scale(${centerScale})`,
      filter: "none",
      opacity: 1,
      zIndex: 20,
      left: centerLeft,
      top: mobile ? "46%" : "50%",
      height: centerH,
      bottom: "auto",
    };
    case "left": return {
      transform: "translateX(-50%) scale(1)",
      filter: "blur(3px)",
      opacity: 0.65,
      zIndex: 10,
      left: mirror ? rightPct : leftPct,
      height: mobile ? "20%" : "36%",
      bottom: mobile ? "22%" : "7%",
    };
    case "right": return {
      transform: "translateX(-50%) scale(1)",
      filter: "blur(3px)",
      opacity: 0.65,
      zIndex: 10,
      left: mirror ? leftPct : rightPct,
      height: mobile ? "20%" : "36%",
      bottom: mobile ? "22%" : "7%",
    };
    case "back": return {
      transform: "translateX(-50%) scale(1)",
      filter: "blur(6px)",
      opacity: 0.35,
      zIndex: 5,
      left: centerLeft,
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
  const [focusedIdx, setFocusedIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const isPaused = hoveredIdx !== null || focusedIdx !== null;

  /* preload */
  useEffect(() => { DISHES.forEach(d => { new window.Image().src = d.src; }); }, []);

  /* responsive */
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 640);
    window.addEventListener("resize", fn, { passive: true });
    return () => window.removeEventListener("resize", fn);
  }, []);

  /* Drive --carousel-bg on :root; CSS @property transition keeps waves + bg in sync */
  useLayoutEffect(() => {
    document.documentElement.style.setProperty("--carousel-bg", DISHES[active].bg);
  }, [active]);
  useLayoutEffect(() => {
    return () => { document.documentElement.style.removeProperty("--carousel-bg"); };
  }, []);

  const go = useCallback((dir: "next" | "prev") => {
    if (busy) return;
    setBusy(true);
    setActive(p => dir === "next" ? (p + 1) % N : (p + N - 1) % N);
    setTimeout(() => setBusy(false), DUR);
  }, [busy]);

  const selectDish = useCallback((index: number) => {
    setFocusedIdx(index);
    if (busy || index === active) return;
    setBusy(true);
    setActive(index);
    setTimeout(() => setBusy(false), DUR);
  }, [active, busy]);

  /* auto-advance — pauses while hovered or a dish image is focused */
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => go("next"), 4500);
    return () => clearInterval(id);
  }, [go, isPaused]);

  const dish  = DISHES[active];
  const cIdx  = active;
  const lIdx  = (active + N - 1) % N;
  const rIdx  = (active + 1) % N;
  const bIdx  = (active + 2) % N;

  const role = (i: number): "center"|"left"|"right"|"back" =>
    i === cIdx ? "center" : i === lIdx ? "left" : i === rIdx ? "right" : "back";

  /* Shared geometry for center circle + dot anchor */
  const centerLeft = mobile ? "50%" : isRtl ? "38%" : "62%";
  const centerTop  = mobile ? "46%" : "50%";
  const centerH    = mobile ? "44%" : "58%";
  const ghostLetter = firstLetter(isRtl ? dish.nameAr : dish.name);

  return (
    <section
      onMouseLeave={() => {
        setFocusedIdx(null);
        setHoveredIdx(null);
      }}
      style={{
        position: "relative",
        width: "100%",
        overflow: "visible",
        backgroundColor: dish.bg,
        transition: COLOR_TRANSITION,
      }}
    >
      {/* ── Top wave — hero → carousel (animates with active dish) ─────── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 96,
          transform: "translateY(-99%)",
          zIndex: 40,
          pointerEvents: "none",
          color: dish.bg,
          transition: `color ${DUR}ms ${EASE}`,
        }}
      >
        <svg
          viewBox="0 0 1440 96"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 96 }}
        >
          <path
            d="M0,24 C120,72 240,4 360,32 C480,62 600,6 720,38 C840,70 960,8 1080,34 C1200,62 1340,10 1440,24 L1440,96 L0,96 Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div
        dir={isRtl ? "rtl" : "ltr"}
        style={{ position: "relative", width: "100%", height: mobile ? "88vh" : "92vh", overflow: "hidden", zIndex: 35 }}
      >

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

        {/* ── Giant ghost letter — stays on text side, above carousel images ─ */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            ...(isRtl ? { right: 0 } : { left: 0 }),
            width: mobile ? "55%" : "46%",
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 25,
            overflow: "hidden",
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
                position: "absolute",
                top: "50%",
                ...(isRtl
                  ? { right: mobile ? "4%" : "6%", transform: "translateY(-50%)" }
                  : { left:  mobile ? "4%" : "6%", transform: "translateY(-50%)" }),
                fontFamily: "'Cairo', sans-serif",
                fontSize: mobile ? "clamp(120px, 38vw, 200px)" : "clamp(180px, 26vw, 340px)",
                fontWeight: 900,
                color: "white",
                opacity: 0.16,
                lineHeight: 0.85,
                letterSpacing: "-0.04em",
                whiteSpace: "nowrap",
              }}
            >
              {ghostLetter}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* ── Section label — vertically centered on the far edge ───────── */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            right: isRtl ? (mobile ? 10 : 14) : undefined,
            left:  isRtl ? undefined : (mobile ? 10 : 14),
            transform: "translateY(-50%)",
            zIndex: 60,
            pointerEvents: "none",
          }}
        >
          <span
            dir={isRtl ? "rtl" : "ltr"}
            style={{
              display: "inline-block",
              color: "rgba(255,255,255,0.70)",
              fontSize: isRtl ? 11 : 10,
              fontWeight: 700,
              letterSpacing: isRtl ? 0 : "0.22em",
              textTransform: isRtl ? "none" : "uppercase",
              writingMode: "vertical-rl",
              transform: isRtl ? undefined : "rotate(180deg)",
              whiteSpace: "nowrap",
            }}
          >
            {t("SIGNATURE DISHES", "أطباقنا المميزة")}
          </span>
        </div>

        {/* ── Carousel items ──────────────────────────────────────────────── */}
        <div style={{ position: "absolute", inset: 0, zIndex: 3 }}>
          {DISHES.map((d, i) => (
            <div
              key={i}
              role="button"
              tabIndex={0}
              aria-label={isRtl ? d.nameAr : d.name}
              aria-pressed={i === active}
              onClick={() => selectDish(i)}
              onFocus={() => selectDish(i)}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(prev => (prev === i ? null : prev))}
              onBlur={() => setFocusedIdx(prev => (prev === i ? null : prev))}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  selectDish(i);
                }
              }}
              style={{
                position: "absolute",
                aspectRatio: "1 / 1",
                transition: ITEM_TRANSITION,
                willChange: "transform, filter, opacity",
                cursor: "pointer",
                outline: "none",
                ...roleStyle(role(i), mobile, isRtl, i === active && (focusedIdx === i || hoveredIdx === i)),
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
                alt={isRtl ? d.nameAr : d.name}
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
                  objectPosition: d.objectPosition,
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

        {/* ── Dish info — vertically centered on the text side ───────────── */}
        <div style={{
          position: "absolute",
          top: mobile ? undefined : "48%",
          bottom: mobile ? 96 : undefined,
          transform: mobile ? undefined : "translateY(-50%)",
          right: isRtl ? (mobile ? 44 : "clamp(88px, 8vw, 128px)") : undefined,
          left:  isRtl ? undefined : (mobile ? 44 : "clamp(88px, 8vw, 128px)"),
          zIndex: 60,
          maxWidth: mobile ? 260 : 340,
          textAlign: isRtl ? "right" : "left",
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
                letterSpacing: isRtl ? 0 : "0.12em",
                textTransform: isRtl ? "none" : "uppercase",
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
                fontFamily: isRtl ? "'Cairo', sans-serif" : undefined,
                fontSize: mobile ? 28 : 44,
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
                  fontSize: 14, lineHeight: 1.65, marginBottom: mobile ? 0 : 22,
                  maxWidth: 340,
                }}
              >
                {isRtl ? dish.descAr : dish.desc}
              </motion.p>
            </AnimatePresence>
          )}

        </div>

        {/* ── Dot progress — anchored below center circle ─────────── */}
        <div style={{
          position: "absolute",
          left: centerLeft,
          top: centerTop,
          transform: "translate(-50%, calc(-50% + min(29vh, 260px)))",
          zIndex: 60,
          display: "flex",
          gap: 6,
          alignItems: "center",
          paddingBottom: mobile ? 10 : 14,
        }}>
          {DISHES.map((_, i) => (
            <button
              key={i}
              onClick={() => selectDish(i)}
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

        {/* ── Bottom CTA — always bottom-right ──────────────────────────── */}
        <div style={{
          position: "absolute",
          bottom: mobile ? 28 : 52,
          right: mobile ? 20 : 56,
          zIndex: 60,
        }}>
          <Link href="/menu">
            <motion.span
              whileHover={{ opacity: 1, x: isRtl ? -4 : 4 }}
              initial={{ opacity: 0.88 }}
              style={{
                display: "flex", alignItems: "center",
                flexDirection: isRtl ? "row-reverse" : "row",
                gap: 8, color: "white",
                fontSize: `clamp(16px, 3vw, 42px)`,
                fontWeight: 800,
                letterSpacing: isRtl ? 0 : "-0.02em",
                lineHeight: 1,
                textTransform: isRtl ? "none" : "uppercase",
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

      {/* ── Bottom wave — carousel → stats (animates with active dish) ─── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 96,
          transform: "translateY(99%)",
          zIndex: 40,
          pointerEvents: "none",
          color: dish.bg,
          transition: `color ${DUR}ms ${EASE}`,
        }}
      >
        <svg
          viewBox="0 0 1440 96"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 96 }}
        >
          <path
            d="M0,72 C120,24 240,96 360,60 C480,24 600,88 720,54 C840,20 960,84 1080,56 C1200,28 1340,82 1440,72 L1440,0 L0,0 Z"
            fill="currentColor"
          />
        </svg>
      </div>

    </section>
  );
}
