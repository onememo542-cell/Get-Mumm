import { useLanguage } from "@/contexts/LanguageContext";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useListChefs } from "@/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Search, X, UtensilsCrossed } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerGrid, cardVariant, sectionReveal } from "@/lib/motion";
import { useSEO } from "@/hooks/useSEO";
import { WaveDivider } from "@/components/ui/WaveDivider";

export default function ChefsPage() {
  const { t, isRtl } = useLanguage();
  const { data: chefs, isLoading } = useListChefs();

  useSEO({
    title: t("Meet Our Chefs", "تعرف على طهاتنا"),
    description: t(
      "Talented women crafting authentic Egyptian meals from their homes to yours. Every dish has a story.",
      "نساء موهوبات يجهزن وجبات مصرية أصيلة من منازلهن إليكم. كل طبق له قصة."
    ),
  });

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  // Store specialty as its English value so it survives language switches
  const [activeSpecialty, setActiveSpecialty] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset specialty filter when language switches (Arabic↔English values differ)
  useEffect(() => { setActiveSpecialty(null); }, [isRtl]);

  const allSpecialties = useMemo(() => {
    if (!chefs) return [];
    const set = new Set<string>();
    chefs.forEach((chef) =>
      (isRtl ? chef.specialtiesAr : chef.specialties).forEach((s) => set.add(s))
    );
    return Array.from(set).sort();
  }, [chefs, isRtl]);

  const filteredChefs = useMemo(() => {
    if (!chefs) return [];
    let result = chefs;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.nameAr.toLowerCase().includes(q) ||
          c.bio.toLowerCase().includes(q) ||
          c.specialties.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (activeSpecialty) {
      result = result.filter((c) =>
        (isRtl ? c.specialtiesAr : c.specialties).includes(activeSpecialty)
      );
    }
    return result;
  }, [chefs, debouncedSearch, activeSpecialty, isRtl]);

  const clearAll = () => {
    setSearch("");
    setDebouncedSearch("");
    setActiveSpecialty(null);
  };

  const hasFilters = !!debouncedSearch || !!activeSpecialty;
  const gridKey = `${debouncedSearch}-${activeSpecialty}`;

  return (
    <PageWrapper>
      {/* Header */}
      <div className="bg-accent pt-28 sm:pt-32 pb-10">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <motion.div {...sectionReveal}>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold mb-3">
              {t("Meet Our Chefs", "تعرف على طهاتنا")}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-sm sm:text-base">
              {t(
                "Talented women crafting authentic meals from their homes to yours. Every dish has a story.",
                "نساء موهوبات يجهزن وجبات أصيلة من منازلهن إليكم. كل طبق له قصة."
              )}
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-md mx-auto relative"
          >
            <Search
              className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none ${isRtl ? "right-4" : "left-4"}`}
            />
            <input
              type="text"
              placeholder={t("Search chefs or specialties...", "ابحث عن شيف أو تخصص...")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full h-11 rounded-full bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm ${isRtl ? "pr-11 pl-10 text-right" : "pl-11 pr-10"}`}
              data-testid="input-chefs-search"
            />
            <AnimatePresence>
              {search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => setSearch("")}
                  className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground ${isRtl ? "left-4" : "right-4"}`}
                >
                  <X className="h-4 w-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <WaveDivider bg="var(--color-accent)" fill="var(--color-background)" flip />

      <div className="container mx-auto px-4 sm:px-6 py-10">

        {/* Specialty chips — wrap on all breakpoints so nothing is clipped */}
        {!isLoading && allSpecialties.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6"
            data-testid="filter-specialties"
          >
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-2.5">
              <button
                onClick={() => setActiveSpecialty(null)}
                className={`relative shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors whitespace-nowrap ${
                  activeSpecialty === null
                    ? "border-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary bg-background"
                }`}
                data-testid="filter-specialty-all"
              >
                {activeSpecialty === null && (
                  <motion.span
                    layoutId="specialty-pill"
                    className="absolute inset-0 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{t("All Specialties", "كل التخصصات")}</span>
              </button>

              {allSpecialties.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setActiveSpecialty(activeSpecialty === spec ? null : spec)}
                  className={`relative shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors whitespace-nowrap ${
                    activeSpecialty === spec
                      ? "border-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary hover:text-primary bg-background"
                  }`}
                  data-testid={`filter-specialty-${spec}`}
                >
                  {activeSpecialty === spec && (
                    <motion.span
                      layoutId="specialty-pill"
                      className="absolute inset-0 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{spec}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Results row */}
        <div className="flex items-center justify-between mb-6 min-h-[24px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLoading ? "loading" : `count-${filteredChefs.length}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-muted-foreground"
              data-testid="text-chefs-count"
            >
              {isLoading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                <>
                  <span className="font-semibold text-foreground">{filteredChefs.length}</span>{" "}
                  {t("chefs", "شيف")}
                </>
              )}
            </motion.div>
          </AnimatePresence>
          <AnimatePresence>
            {hasFilters && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onClick={clearAll}
                className="flex items-center gap-1.5 text-xs text-destructive hover:text-destructive/80 transition-colors font-medium"
                data-testid="button-clear-chefs-filters"
              >
                <X className="h-3.5 w-3.5" />
                {t("Clear filters", "مسح التصفية")}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.06 }}
              >
                <Skeleton className="h-[480px] w-full rounded-2xl" />
              </motion.div>
            ))}
          </div>
        ) : filteredChefs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border"
          >
            <UtensilsCrossed className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{t("No chefs found", "لم يتم العثور على شيف")}</h3>
            <p className="text-muted-foreground text-sm mb-5">
              {t("Try a different search or specialty.", "جرب بحثاً أو تخصصاً مختلفاً.")}
            </p>
            <button onClick={clearAll} className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/85 transition-colors">
              {t("Show All Chefs", "عرض كل الطهاة")}
            </button>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={gridKey}
              variants={staggerGrid}
              initial="hidden"
              animate="show"
              exit="exit"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredChefs.map((chef) => (
                <motion.div key={chef.id} variants={cardVariant}>
                  <motion.div
                    whileHover={{ y: -6, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className="group bg-card border border-card-border rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
                    data-testid={`card-chef-${chef.id}`}
                  >
                    <div className="relative h-64 sm:h-72 overflow-hidden bg-muted">
                      <img
                        src={chef.imageUrl}
                        alt={isRtl ? chef.nameAr : chef.name}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-108"
                        loading="lazy"
                      />
                      {/* Rating badge */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1.5 rounded-full shadow">
                        <Star className="h-3 w-3 fill-current" />
                        {chef.rating}
                      </div>
                      <div className="absolute bottom-3 left-3 bg-background/85 backdrop-blur-sm text-foreground text-[11px] font-medium px-2.5 py-1 rounded-full">
                        {t(`Since ${chef.joinedYear}`, `منذ ${chef.joinedYear}`)}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-serif font-bold">{isRtl ? chef.nameAr : chef.name}</h3>
                        <span className="text-xs text-muted-foreground font-medium bg-muted px-2.5 py-1 rounded-full">
                          {chef.itemCount} {t("dishes", "طبق")}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                        {isRtl ? chef.bioAr : chef.bio}
                      </p>
                      <div className="border-t border-border pt-4">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                          {t("Specialties", "التخصصات")}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {(isRtl ? chef.specialtiesAr : chef.specialties).map((spec, i) => (
                            <button
                              key={i}
                              onClick={(e) => {
                                e.stopPropagation();
                                const target = isRtl ? chef.specialtiesAr[i] : chef.specialties[i];
                                setActiveSpecialty(activeSpecialty === target ? null : target);
                              }}
                              className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                                activeSpecialty === spec
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-primary/10 text-primary hover:bg-primary/20"
                              }`}
                            >
                              {spec}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </PageWrapper>
  );
}
