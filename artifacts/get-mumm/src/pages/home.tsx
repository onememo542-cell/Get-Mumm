import { useLanguage } from "@/contexts/LanguageContext";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useGetFeaturedItems, useListCategories, useListTestimonials } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { WaveDivider } from "@/components/ui/WaveDivider";
import { useSEO } from "@/hooks/useSEO";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Star, ArrowRight, ArrowLeft, Quote } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  wordReveal,
  fadeUp,
  fadeUpTransition,
  sectionReveal,
  sectionStagger,
  sectionItem,
  staggerGrid,
  cardVariant,
} from "@/lib/motion";

export default function Home() {
  const { t, isRtl } = useLanguage();
  const { data: featuredItems, isLoading: isFeaturedLoading } = useGetFeaturedItems();
  const { data: categories, isLoading: isCategoriesLoading } = useListCategories();
  const { data: testimonials, isLoading: isTestimonialsLoading } = useListTestimonials();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useSEO({
    title: t("Homemade Meals Delivered with Love", "وجبات منزلية بنكهة الحب"),
    description: t(
      "Experience the warmth of a grandmother's kitchen, delivered fresh to your door in Cairo and Giza. Support local women and enjoy authentic Egyptian flavors.",
      "استمتع بدفء مطبخ الجدة، يصلك طازجاً إلى باب منزلك في القاهرة والجيزة. ادعم النساء المحليات واستمتع بالنكهات المصرية الأصيلة."
    ),
  });

  const heroHeadline = t(
    "Homemade Meals Delivered with Love",
    "وجبات منزلية بنكهة الحب"
  );
  const heroWords = heroHeadline.split(" ");

  const stats = [
    { value: "200+", label: t("Active Kitchens", "مطبخ نشط") },
    { value: "193K", label: t("Facebook Followers", "متابع على فيسبوك") },
    { value: "80%", label: t("Repeat Customers", "عملاء متكررون") },
    { value: "2015", label: t("Founded in Cairo", "تأسست في القاهرة") },
  ];

  return (
    <PageWrapper>
      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[94vh] flex items-center justify-center overflow-hidden bg-background">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <motion.img
            src="/koshari.png"
            alt="Delicious Egyptian Food"
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 0.22, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center mt-16">
          {/* Word-by-word headline reveal */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-foreground mb-6 leading-tight">
            {heroWords.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden">
                <motion.span
                  className="inline-block"
                  {...wordReveal(i, 0.05)}
                >
                  {word}
                </motion.span>
                {i < heroWords.length - 1 && (
                  <span className="inline-block">&nbsp;</span>
                )}
              </span>
            ))}
          </h1>

          <motion.p
            {...fadeUp}
            animate={fadeUp.animate}
            transition={fadeUpTransition(0.55)}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            {t(
              "Experience the warmth of a grandmother's kitchen, delivered fresh to your door in Cairo and Giza. Support local women and enjoy authentic Egyptian flavors.",
              "استمتع بدفء مطبخ الجدة، يصلك طازجاً إلى باب منزلك في القاهرة والجيزة. ادعم النساء المحليات واستمتع بالنكهات المصرية الأصيلة."
            )}
          </motion.p>

          <motion.div
            {...fadeUp}
            animate={fadeUp.animate}
            transition={fadeUpTransition(0.72)}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/menu">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base px-9 py-6 rounded-full bg-primary hover:bg-primary/85 text-primary-foreground shadow-xl font-bold"
              >
                {t("Explore Menu", "تصفح المنيو")}
              </Button>
            </Link>
            <Link href="/for-offices">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base px-9 py-6 rounded-full border-2 bg-background/50 backdrop-blur-sm font-semibold"
              >
                {t("For Offices", "للشركات")}
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator — direct child of section so bottom-8 is correct */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-foreground/25 flex items-start justify-center pt-1.5 mx-auto"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <motion.div
              className="w-1 h-2.5 bg-primary rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            />
          </motion.div>
          <p className="text-[10px] font-medium text-muted-foreground mt-2 uppercase tracking-widest">
            {t("Scroll", "مرر")}
          </p>
        </motion.div>
      </section>

      <WaveDivider bg="var(--color-background)" fill="var(--color-accent)" />

      {/* ─── Stats Strip ───────────────────────────────────────────────── */}
      <section className="bg-accent py-14 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            variants={sectionStagger}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {stats.map((stat, i) => (
              <motion.div key={i} variants={sectionItem} className="flex flex-col">
                <motion.span
                  className="text-4xl md:text-5xl font-bold text-primary mb-2 tabular-nums"
                  initial={{ opacity: 0, y: 20, scale: 0.85 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.09 }}
                >
                  {stat.value}
                </motion.span>
                <span className="text-accent-foreground font-semibold text-sm">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <WaveDivider bg="var(--color-accent)" fill="var(--color-background)" flip />

      {/* ─── Featured Dishes ───────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div {...sectionReveal} className="text-center mb-14">
            <span className="inline-block bg-primary/10 text-primary font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
              {t("Chef's Picks", "اختيارات الطهاة")}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              {t("Featured Dishes", "الأطباق المميزة")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t(
                "Taste the authenticity of our most loved homemade recipes.",
                "تذوق أصالة وصفاتنا المنزلية الأكثر شعبية."
              )}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {isFeaturedLoading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-64 w-full rounded-[2rem]" />
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="featured-grid"
                variants={staggerGrid}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {featuredItems?.slice(0, 3).map((item) => (
                  <motion.div key={item.id} variants={cardVariant}>
                    <Link href={`/menu/${item.id}`}>
                      <motion.div
                        whileHover={{ y: -8, scale: 1.015 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 320, damping: 26 }}
                        className="group bg-card border border-card-border rounded-[2rem] overflow-hidden hover:shadow-2xl hover:border-primary/20 transition-all duration-500 h-full flex flex-col cursor-pointer"
                      >
                        <div className="relative h-64 overflow-hidden bg-muted">
                          <img
                            src={item.imageUrl || "/koshari.png"}
                            alt={isRtl ? item.nameAr : item.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <motion.div
                            className={`absolute top-4 ${isRtl ? "right-4" : "left-4"} bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold`}
                            initial={{ opacity: 0, x: isRtl ? 10 : -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            {isRtl ? item.categoryNameAr : item.categoryName}
                          </motion.div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-xl leading-tight">{isRtl ? item.nameAr : item.name}</h3>
                            <span className="font-bold text-primary whitespace-nowrap ml-2 bg-primary/10 px-2.5 py-1 rounded-xl text-sm">
                              {item.price} {t("EGP", "ج.م")}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-1">
                            {isRtl ? item.descriptionAr : item.description}
                          </p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-border pt-4">
                            <span className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] text-white font-bold">
                                {(isRtl ? item.chefNameAr : item.chefName).charAt(0)}
                              </span>
                              {isRtl ? item.chefNameAr : item.chefName}
                            </span>
                            {item.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-primary text-primary" />
                                <span className="font-medium">{item.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div {...sectionReveal} className="text-center mt-12">
            <Link href="/menu">
              <Button variant="outline" size="lg" className="rounded-full px-8 font-semibold border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                {t("View Full Menu", "عرض القائمة كاملة")}
                {isRtl
                  ? <ArrowLeft className="mr-2 h-4 w-4" />
                  : <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <WaveDivider bg="var(--color-background)" fill="var(--color-accent)" />

      {/* ─── Categories Grid ───────────────────────────────────────────── */}
      <section className="py-24 bg-accent">
        <div className="container mx-auto px-4">
          <motion.div {...sectionReveal} className="text-center mb-14">
            <span className="inline-block bg-primary/15 text-primary font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
              {t("All Categories", "جميع التصنيفات")}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-2 text-accent-foreground">
              {t("Browse by Category", "تصفح بالتصنيفات")}
            </h2>
          </motion.div>

          <AnimatePresence mode="wait">
            {isCategoriesLoading ? (
              <motion.div
                key="cat-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
              >
                {Array(4).fill(0).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-[2rem]" />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="cat-grid"
                variants={staggerGrid}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
              >
                {categories?.slice(0, 4).map((cat) => (
                  <motion.div key={cat.id} variants={cardVariant}>
                    <Link href={`/menu?category=${cat.id}`}>
                      <motion.div
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 340, damping: 24 }}
                        className="relative aspect-square rounded-[2rem] overflow-hidden group cursor-pointer shadow-lg"
                      >
                        <img
                          src={cat.imageUrl || "/mahshi.png"}
                          alt={isRtl ? cat.nameAr : cat.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent group-hover:from-black/85 transition-colors duration-300" />
                        <div className="absolute inset-0 flex flex-col items-center justify-end text-white p-5 text-center">
                          <h3 className="text-xl md:text-2xl font-bold font-serif mb-1 drop-shadow-sm">
                            {isRtl ? cat.nameAr : cat.name}
                          </h3>
                          <p className="text-sm opacity-75">{cat.itemCount} {t("items", "أطباق")}</p>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <WaveDivider bg="var(--color-accent)" fill="var(--color-background)" flip />

      {/* ─── Testimonials ─────────────────────────────────────────────── */}
      <section className="py-24 bg-background overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div {...sectionReveal} className="text-center mb-4">
            <span className="inline-block bg-primary/10 text-primary font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
              {t("Real Reviews", "آراء حقيقية")}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-2">
              {t("What They Say", "ماذا يقولون عنا")}
            </h2>
          </motion.div>

          {isTestimonialsLoading ? (
            /* Loading skeleton */
            <div className="flex items-center justify-center gap-4 py-16">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-[300px] w-[300px] rounded-2xl flex-shrink-0" />
              ))}
            </div>
          ) : (
            <>
              {/* ── Desktop: fanned stacked cards ───────────────────────── */}
              <div
                className="hidden md:flex items-center justify-center"
                style={{ minHeight: 460, paddingTop: 48, paddingBottom: 48 }}
              >
                <div className="relative flex items-center justify-center">
                  {testimonials?.slice(0, 3).map((testimonial, i) => {
                    const ROTATIONS = [-11, -5, 4];
                    const isHov = hoveredIdx === i;
                    const isOtherHov = hoveredIdx !== null && !isHov;
                    const pushX = isOtherHov ? (i < (hoveredIdx ?? 0) ? -28 : 28) : 0;

                    return (
                      <motion.div
                        key={testimonial.id}
                        style={{
                          position: "relative",
                          width: 320,
                          height: 320,
                          margin: "0 -44px",
                          zIndex: isHov ? 30 : 3 - i,
                          cursor: "pointer",
                          flexShrink: 0,
                        }}
                        animate={{
                          rotate: isHov ? 0 : ROTATIONS[i],
                          scale: isHov ? 1.09 : isOtherHov ? 0.87 : 1,
                          opacity: isOtherHov ? 0.58 : 1,
                          y: isHov ? -18 : 0,
                          x: pushX,
                        }}
                        transition={{ type: "spring", stiffness: 340, damping: 30 }}
                        onHoverStart={() => setHoveredIdx(i)}
                        onHoverEnd={() => setHoveredIdx(null)}
                      >
                        {/* Glass outer shell */}
                        <div
                          className="absolute inset-0 rounded-2xl"
                          style={{
                            background: "linear-gradient(to bottom, rgba(255,255,255,0.13), transparent)",
                            border: "1px solid rgba(0,0,0,0.06)",
                            boxShadow: "0 28px 48px rgba(0,0,0,0.12)",
                            backdropFilter: "blur(12px)",
                          }}
                        />
                        {/* Inner card */}
                        <div className="absolute inset-[14px] rounded-xl bg-card text-foreground shadow-2xl ring-1 ring-border overflow-hidden flex flex-col">
                          <div className="p-5 flex flex-col h-full">
                            {/* Quote icon */}
                            <div className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 ring-1 ring-primary/20 mb-3 flex-shrink-0">
                              <Quote className="h-4 w-4 text-primary" />
                            </div>
                            {/* Quote text */}
                            <p className="text-sm leading-relaxed text-foreground flex-1 mb-3">
                              {isRtl ? testimonial.quoteAr : testimonial.quote}
                            </p>
                            {/* Footer: avatar + name | stars */}
                            <div className="pt-3 border-t border-border flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <img
                                  src={testimonial.avatarUrl || "/chef2.png"}
                                  alt={isRtl ? testimonial.nameAr : testimonial.name}
                                  className="h-7 w-7 rounded-full object-cover ring-2 ring-primary/20"
                                />
                                <div>
                                  <p className="text-xs font-semibold leading-tight">
                                    {isRtl ? testimonial.nameAr : testimonial.name}
                                  </p>
                                  {testimonial.role && (
                                    <p className="text-xs text-muted-foreground leading-tight">
                                      {isRtl ? testimonial.roleAr : testimonial.role}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                                <span className="text-xs font-semibold">{testimonial.rating}.0</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* ── Mobile: vertical card stack ──────────────────────────── */}
              <motion.div
                className="md:hidden flex flex-col gap-5 mt-8"
                variants={staggerGrid}
                initial="hidden"
                animate="show"
              >
                {testimonials?.slice(0, 3).map((testimonial) => (
                  <motion.div
                    key={testimonial.id}
                    variants={cardVariant}
                    className="bg-card rounded-2xl p-6 border border-border shadow-md"
                  >
                    <div className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 ring-1 ring-primary/20 mb-3">
                      <Quote className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground mb-5">
                      {isRtl ? testimonial.quoteAr : testimonial.quote}
                    </p>
                    <div className="pt-3 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.avatarUrl || "/chef2.png"}
                          alt={isRtl ? testimonial.nameAr : testimonial.name}
                          className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/20"
                        />
                        <div>
                          <p className="text-sm font-bold">{isRtl ? testimonial.nameAr : testimonial.name}</p>
                          {testimonial.role && (
                            <p className="text-xs text-muted-foreground">{isRtl ? testimonial.roleAr : testimonial.role}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <span className="text-xs font-semibold">{testimonial.rating}.0</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </section>

      <WaveDivider bg="var(--color-background)" fill="var(--color-secondary)" />

      {/* ─── For Offices Teaser ───────────────────────────────────────── */}
      <section className="py-24 bg-secondary text-secondary-foreground overflow-hidden relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: isRtl ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-block bg-white/15 text-white font-semibold text-sm px-4 py-1.5 rounded-full mb-6">
                {t("For Companies", "للشركات")}
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
                {t("Elevate Your Office Lunch", "ارتقِ بغداء شركتك")}
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-lg leading-relaxed">
                {t(
                  "Treat your team to real, healthy, homemade food. Flexible corporate subscriptions and catering options available.",
                  "قدم لفريقك طعاماً حقيقياً وصحياً منزلي الصنع. باقات مرنة للشركات وخيارات تقديم طعام متنوعة."
                )}
              </p>
              <Link href="/for-offices">
                <Button size="lg" className="rounded-full px-8 bg-white text-secondary hover:bg-white/90 font-bold shadow-lg">
                  {t("Learn More", "اعرف المزيد")}
                </Button>
              </Link>
            </motion.div>
            <motion.div
              className="hidden lg:block relative"
              initial={{ opacity: 0, x: isRtl ? -40 : 40, rotate: 0 }}
              whileInView={{ opacity: 1, x: 0, rotate: 3 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              <img
                src="/office_catering.png"
                alt="Office Catering"
                className="rounded-[3rem] shadow-2xl scale-105"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <WaveDivider bg="var(--color-secondary)" fill="var(--color-background)" flip />

      {/* ─── App Download CTA ─────────────────────────────────────────── */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div {...sectionReveal}>
            <span className="inline-block bg-primary/10 text-primary font-semibold text-sm px-4 py-1.5 rounded-full mb-6">
              {t("Mobile App", "تطبيق الجوال")}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              {t("Get the App", "حمل التطبيق")}
            </h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              {t(
                "Order your favorite homemade meals faster and track your delivery in real-time.",
                "اطلب وجباتك المنزلية المفضلة بشكل أسرع وتتبع التوصيل في الوقت الفعلي."
              )}
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 340, damping: 22 }}>
              <Button size="lg" className="h-16 px-8 rounded-2xl bg-foreground text-background hover:bg-foreground/85 flex items-center gap-3 cursor-not-allowed opacity-70" disabled>
                <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.19 2.31-.88 3.5-.8 1.48.06 2.65.65 3.37 1.72-2.91 1.78-2.45 5.56.35 6.78-.65 1.63-1.46 3.2-2.3 4.47M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25" />
                </svg>
                <div className={isRtl ? "text-right" : "text-left"}>
                  <div className="text-xs opacity-75">{t("Coming Soon", "قريباً")}</div>
                  <div className="font-bold text-lg leading-none">App Store</div>
                </div>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 340, damping: 22 }}>
              <a href="https://play.google.com/store/apps/details?id=com.getmumm.mummprime" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="h-16 px-8 rounded-2xl bg-foreground text-background hover:bg-foreground/85 flex items-center gap-3">
                  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a1.986 1.986 0 0 1-.505-1.309V3.123c0-.495.188-.95.504-1.309zM14.54 12.748l2.616 2.616-12.213 7.052 9.597-9.668zm.725-.725l4.575-2.641a1.217 1.217 0 0 1 1.157 2.12l-4.575 2.641-1.157-2.12zm-1.156-2.12L4.512 2.85l12.213 7.053-2.616 2.616z" />
                  </svg>
                  <div className={isRtl ? "text-right" : "text-left"}>
                    <div className="text-xs opacity-75">GET IT ON</div>
                    <div className="font-bold text-lg leading-none">Google Play</div>
                  </div>
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}
