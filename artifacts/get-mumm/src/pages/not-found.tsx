import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { ease, wordReveal, animateStagger, animateFadeUp } from "@/lib/motion";
import { errors } from "@/locales";

const floatAnimate = {
  y: [0, -14, 0],
  rotate: [-2, 2, -2],
};

const floatTransition = {
  duration: 4.5,
  ease: "easeInOut" as const,
  repeat: Infinity,
};

const WORDS_EN = ["Page", "Not", "Found"];
const WORDS_AR = ["الصفحة", "غير", "موجودة"];

export default function NotFound() {
  const [, navigate] = useLocation();
  const { tx, isRtl } = useLanguage();

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden px-6 py-20"
    >
      {/* Ambient blobs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-primary/10 blur-[100px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 w-[360px] h-[360px] rounded-full bg-primary/8 blur-[80px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      {/* Floating bowl emoji */}
      <motion.div
        animate={floatAnimate}
        transition={floatTransition}
        className="mb-8 select-none"
        style={{ fontSize: "clamp(3.5rem, 10vw, 6rem)", lineHeight: 1 }}
        aria-hidden
      >
        🍲
      </motion.div>

      {/* Giant 404 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6, filter: "blur(20px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.75, ease: ease.spring }}
        className="relative select-none"
        aria-hidden
      >
        <span
          className="font-serif block leading-none tracking-tight text-primary"
          style={{ fontSize: "clamp(7rem, 25vw, 16rem)", lineHeight: 0.85 }}
        >
          404
        </span>
        <span
          className="absolute inset-0 font-serif block leading-none tracking-tight text-foreground/5 translate-x-1 translate-y-1 -z-10"
          style={{ fontSize: "clamp(7rem, 25vw, 16rem)", lineHeight: 0.85 }}
        >
          404
        </span>
      </motion.div>

      {/* "Page Not Found" word reveal */}
      <motion.div
        className="mt-6 flex gap-3 overflow-hidden"
        initial="initial"
        animate="animate"
      >
        {(isRtl ? WORDS_AR : WORDS_EN).map((word, i) => (
          <div key={word} className="overflow-hidden">
            <motion.span
              {...wordReveal(i, 0.5)}
              className="block font-serif text-2xl sm:text-3xl md:text-4xl text-foreground"
            >
              {word}
            </motion.span>
          </div>
        ))}
      </motion.div>

      {/* Body copy + CTA */}
      <motion.div
        variants={animateStagger}
        initial="hidden"
        animate="show"
        className="mt-8 flex flex-col items-center gap-6 text-center max-w-md"
      >
        <motion.p
          variants={animateFadeUp}
          className="text-muted-foreground text-base sm:text-lg leading-relaxed"
        >
          {tx(errors.notFoundBody)}
        </motion.p>

        <motion.div variants={animateFadeUp} className="flex gap-3 flex-wrap justify-center">
          <motion.button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-lg hover:shadow-primary/30 transition-shadow"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            {tx(errors.backToHome)}
          </motion.button>

          <motion.button
            onClick={() => navigate("/menu")}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-border text-foreground font-semibold text-sm hover:bg-accent transition-colors"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            {tx(errors.browseMenu)}
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Decorative divider dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="mt-16 flex gap-2"
        aria-hidden
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary/40"
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </motion.div>
    </div>
  );
}
