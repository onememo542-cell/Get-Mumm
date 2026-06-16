import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useListMenuItems, useListCategories } from "@/api";
import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useSearch, useLocation } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { WaveDivider } from "@/components/ui/WaveDivider";
import {
  Search, X, SlidersHorizontal, Star, Clock,
  ChevronDown, Plus, Minus, ShoppingCart, ArrowUpDown,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { motion, AnimatePresence } from "framer-motion";
import { staggerGrid, cardVariant, sectionReveal, ease } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { menu, common } from "@/locales";

const ITEMS_PER_PAGE = 9;

const DIETARY_OPTIONS = [
  { value: "vegetarian", labelEn: "Vegetarian", labelAr: "نباتي" },
  { value: "vegan", labelEn: "Vegan", labelAr: "فيغان" },
  { value: "low_cal", labelEn: "Low Cal", labelAr: "قليل السعرات" },
  { value: "gluten_free", labelEn: "Gluten Free", labelAr: "خالي من الغلوتين" },
  { value: "halal", labelEn: "Halal", labelAr: "حلال" },
];

const PRICE_RANGES = [
  { labelEn: "Any price", labelAr: "أي سعر", max: null },
  { labelEn: "Under 50 EGP", labelAr: "أقل من 50 ج.م", max: 50 },
  { labelEn: "Under 80 EGP", labelAr: "أقل من 80 ج.م", max: 80 },
  { labelEn: "Under 120 EGP", labelAr: "أقل من 120 ج.م", max: 120 },
];

const SORT_OPTIONS = [
  { value: "popular", labelEn: "Most Popular", labelAr: "الأكثر طلباً" },
  { value: "rating", labelEn: "Highest Rated", labelAr: "الأعلى تقييماً" },
  { value: "price-asc", labelEn: "Price: Low → High", labelAr: "السعر: من الأقل" },
  { value: "price-desc", labelEn: "Price: High → Low", labelAr: "السعر: من الأعلى" },
  { value: "prep-asc", labelEn: "Fastest First", labelAr: "الأسرع تحضيراً" },
];

export default function MenuPage() {
  const { t, tx, isRtl } = useLanguage();
  const { toast } = useToast();
  const { addItem, updateQty, items: cartItems, totalItems, openCart } = useCart();
  const searchString = useSearch();
  const [, navigate] = useLocation();

  const selectCategory = (id: number | null) => {
    navigate(id !== null ? `/menu?category=${id}` : "/menu");
  };

  useSEO({
    title: tx(menu.ourMenu),
    description: tx(menu.heroDesc),
  });

  const [search, setSearch]                 = useState("");
  const [debSearch, setDebSearch]           = useState("");
  const [activeCategory, setActiveCategory] = useState<number | null>(() => {
    const params = new URLSearchParams(searchString);
    const cat = params.get("category");
    return cat ? Number(cat) : null;
  });
  const [activeDietary, setActiveDietary]   = useState<string[]>([]);
  const [priceRangeIdx, setPriceRangeIdx]   = useState(0);
  const [sortKey, setSortKey]               = useState("popular");
  const [currentPage, setCurrentPage]       = useState(1);
  const [filtersOpen, setFiltersOpen]       = useState(false);
  const [sortOpen, setSortOpen]             = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const cat = params.get("category");
    setActiveCategory(cat ? Number(cat) : null);
  }, [searchString]);

  useEffect(() => {
    const timer = setTimeout(() => setDebSearch(search), 320);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => { setCurrentPage(1); }, [activeCategory, activeDietary, priceRangeIdx, debSearch, sortKey]);

  const { data: categories, isLoading: isCatsLoading } = useListCategories();
  const { data: rawItems, isLoading: isItemsLoading }  = useListMenuItems({
    search: debSearch || undefined,
    maxPrice: PRICE_RANGES[priceRangeIdx].max ?? undefined,
  });

  const categoryCounts = useMemo<Record<number, number>>(() => {
    if (!rawItems) return {};
    return rawItems.reduce<Record<number, number>>((acc, item) => {
      if (item.categoryId != null) {
        acc[item.categoryId] = (acc[item.categoryId] ?? 0) + 1;
      }
      return acc;
    }, {});
  }, [rawItems]);

  const filteredItems = useMemo(() => {
    if (!rawItems) return [];
    let out = rawItems;

    if (activeCategory !== null) {
      out = out.filter((item) => item.categoryId === activeCategory);
    }

    if (activeDietary.length > 0) {
      out = out.filter((item) =>
        activeDietary.every((d) => item.dietary.includes(d))
      );
    }

    out = [...out].sort((a, b) => {
      switch (sortKey) {
        case "rating":     return (b.rating ?? 0) - (a.rating ?? 0);
        case "price-asc":  return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "prep-asc":   return (a.prepTimeMinutes ?? 999) - (b.prepTimeMinutes ?? 999);
        default:           return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });

    return out;
  }, [rawItems, activeCategory, activeDietary, sortKey]);

  const totalPages     = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(
    () => filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filteredItems, currentPage]
  );

  const activeFilterCount =
    (activeCategory !== null ? 1 : 0) +
    activeDietary.length +
    (priceRangeIdx > 0 ? 1 : 0) +
    (debSearch ? 1 : 0);

  const clearAll = () => {
    setSearch(""); setDebSearch("");
    setActiveDietary([]);
    setPriceRangeIdx(0);
    setSortKey("popular");
    setCurrentPage(1);
    navigate("/menu");
  };

  const toggleDietary = (val: string) =>
    setActiveDietary((prev) =>
      prev.includes(val) ? prev.filter((d) => d !== val) : [...prev, val]
    );

  const gridKey = `${currentPage}-${activeCategory}-${debSearch}-${priceRangeIdx}-${activeDietary.join(",")}-${sortKey}`;
  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === sortKey);

  return (
    <PageWrapper>

      {/* ── Hero header ─────────────────────────────────────────────────── */}
      <div className="bg-accent pt-28 sm:pt-32 pb-10">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div {...sectionReveal} className="text-center mb-8">
            <h1 className="text-3xl sm:text-5xl font-serif font-bold mb-3">
              {tx(menu.ourMenu)}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              {tx(menu.heroDesc)}
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12, ease: ease.out }}
            className="max-w-lg mx-auto relative"
          >
            <Search className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none ${isRtl ? "right-4" : "left-4"}`} />
            <Input
              placeholder={tx(menu.searchPlaceholder)}
              className={`h-12 rounded-full bg-background shadow-sm border-border text-sm ${isRtl ? "pr-11 pl-11" : "pl-11 pr-11"}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <AnimatePresence>
              {search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.14 }}
                  onClick={() => setSearch("")}
                  className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors ${isRtl ? "left-4" : "right-4"}`}
                >
                  <X className="h-4 w-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <WaveDivider bg="var(--color-accent)" fill="var(--color-background)" flip />

      <div className="container mx-auto px-4 sm:px-6 py-8">

        {/* ── Category tabs ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.08, ease: ease.out }}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-5"
        >
          <button
            onClick={() => selectCategory(null)}
            className={`relative shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
              activeCategory === null
                ? "border-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary bg-background"
            }`}
          >
            {activeCategory === null && (
              <motion.span
                layoutId="cat-pill"
                className="absolute inset-0 bg-primary rounded-full -z-0"
                transition={{ type: "spring", stiffness: 400, damping: 34 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tx(menu.all)}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-normal ${
                activeCategory === null
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}>
                {rawItems?.length ?? 0}
              </span>
            </span>
          </button>

          {isCatsLoading
            ? Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-9 w-28 rounded-full shrink-0" />)
            : categories?.map((cat) => {
                const count = categoryCounts[cat.id] ?? 0;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => selectCategory(isActive ? null : cat.id)}
                    className={`relative shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                      isActive
                        ? "border-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-primary hover:text-primary bg-background"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="cat-pill"
                        className="absolute inset-0 bg-primary rounded-full -z-0"
                        transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      />
                    )}
                    <span className="relative z-10">{isRtl ? cat.nameAr : cat.name}</span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={count}
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ duration: 0.18 }}
                        className={`relative z-10 text-xs px-1.5 py-0.5 rounded-full font-normal ${
                          isActive
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {count}
                      </motion.span>
                    </AnimatePresence>
                  </button>
                );
              })}
        </motion.div>

        {/* ── Filter + Sort row ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.14, ease: ease.out }}
          className="flex flex-wrap items-center gap-2 mb-5"
        >
          <button
            onClick={() => { setFiltersOpen(!filtersOpen); setSortOpen(false); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
              filtersOpen || activeDietary.length > 0 || priceRangeIdx > 0
                ? "bg-primary/10 border-primary text-primary"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary bg-background"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {tx(menu.filters)}
            <AnimatePresence>
              {(activeDietary.length > 0 || priceRangeIdx > 0) && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                >
                  {activeDietary.length + (priceRangeIdx > 0 ? 1 : 0)}
                </motion.span>
              )}
            </AnimatePresence>
            <motion.span animate={{ rotate: filtersOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="h-3.5 w-3.5" />
            </motion.span>
          </button>

          {PRICE_RANGES.slice(1).map((range, i) => (
            <button
              key={i}
              onClick={() => setPriceRangeIdx(priceRangeIdx === i + 1 ? 0 : i + 1)}
              className={`shrink-0 px-3.5 py-2 rounded-full text-sm font-medium border transition-all ${
                priceRangeIdx === i + 1
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary hover:text-foreground bg-background"
              }`}
            >
              {isRtl ? range.labelAr : range.labelEn}
            </button>
          ))}

          <div className="flex-1" />

          <AnimatePresence>
            {activeFilterCount > 0 && (
              <motion.button
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.18 }}
                onClick={clearAll}
                className="flex items-center gap-1 px-3.5 py-2 rounded-full text-sm font-medium border border-dashed border-destructive/50 text-destructive hover:bg-destructive/8 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                {t(`Clear (${activeFilterCount})`, `مسح (${activeFilterCount})`)}
              </motion.button>
            )}
          </AnimatePresence>

          <div className="relative">
            <button
              onClick={() => { setSortOpen(!sortOpen); setFiltersOpen(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                sortKey !== "popular" || sortOpen
                  ? "bg-primary/10 border-primary text-primary"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary bg-background"
              }`}
            >
              <ArrowUpDown className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isRtl ? activeSortLabel?.labelAr : activeSortLabel?.labelEn}
              </span>
              <span className="sm:hidden">{tx(menu.sort)}</span>
              <motion.span animate={{ rotate: sortOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="h-3.5 w-3.5" />
              </motion.span>
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: ease.out }}
                  className={`absolute top-full mt-2 ${isRtl ? "left-0" : "right-0"} z-30 min-w-[190px] bg-card border border-border rounded-2xl shadow-xl overflow-hidden py-1`}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortKey(opt.value); setSortOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between gap-3 ${
                        sortKey === opt.value
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground hover:bg-muted/60"
                      }`}
                    >
                      <span>{isRtl ? opt.labelAr : opt.labelEn}</span>
                      {sortKey === opt.value && <span className="text-primary text-xs">✓</span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Dietary filter panel ─────────────────────────────────────────── */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.26, ease: ease.out }}
              className="overflow-hidden mb-5"
            >
              <div className="bg-muted/40 border border-border rounded-2xl p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  {tx(menu.dietaryPref)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_OPTIONS.map((opt, i) => (
                    <motion.button
                      key={opt.value}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.22 }}
                      onClick={() => toggleDietary(opt.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                        activeDietary.includes(opt.value)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:border-primary hover:text-foreground bg-background"
                      }`}
                    >
                      {isRtl ? opt.labelAr : opt.labelEn}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results bar ────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-5 min-h-[26px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={isItemsLoading ? "loading" : `count-${filteredItems.length}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.18 }}
              className="text-sm text-muted-foreground flex items-center"
            >
              {isItemsLoading ? (
                <Skeleton className="h-4 w-28" />
              ) : (
                <>
                  <span className="font-semibold text-foreground">{filteredItems.length}</span>
                  &nbsp;{tx(menu.dishesFound)}
                  {activeFilterCount > 0 && (
                    <span className="text-primary font-medium">&nbsp;{tx(menu.filtered)}</span>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {totalItems > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 10 }}
                transition={{ type: "spring", stiffness: 340, damping: 26 }}
                onClick={openCart}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-bold shadow-md hover:bg-primary/85 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                {totalItems} {tx(menu.inCart)}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* ── Grid ──────────────────────────────────────────────────────── */}
        {isItemsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(9).fill(0).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-52 w-full rounded-2xl" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : paginatedItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: ease.out }}
            className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border"
          >
            <div className="text-5xl mb-4">🍽️</div>
            <h3 className="text-xl font-bold mb-2">{tx(menu.noDishesFound)}</h3>
            <p className="text-muted-foreground mb-6 text-sm">
              {tx(menu.tryAdjusting)}
            </p>
            <button
              onClick={clearAll}
              className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/85 transition-colors"
            >
              {tx(menu.clearFilters)}
            </button>
          </motion.div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={gridKey}
                variants={staggerGrid}
                initial="hidden"
                animate="show"
                exit="exit"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {paginatedItems.map((item) => {
                  const cartQty = cartItems.find((e) => e.id === item.id)?.qty ?? 0;
                  return (
                    <motion.div
                      key={item.id}
                      variants={cardVariant}
                      whileHover={{ y: -5, scale: 1.015 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 340, damping: 28 }}
                      className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
                    >
                      {/* ── Image ─────────────────────────────────────────── */}
                      <div className="relative h-52 overflow-hidden bg-muted shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={isRtl ? item.nameAr : item.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />

                        {/* Add to cart button — slides up on hover */}
                        <div className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-250 ease-out">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addItem({
                                id: item.id, name: item.name, nameAr: item.nameAr,
                                price: item.price, imageUrl: item.imageUrl,
                                chefName: item.chefName, chefNameAr: item.chefNameAr,
                              });
                              toast({
                                title: tx(common.addedToCart),
                                description: `${isRtl ? item.nameAr : item.name} · ${item.price} ${tx(common.egp)}`,
                              });
                            }}
                            className="flex items-center gap-2 bg-primary text-primary-foreground font-bold text-sm px-5 py-2.5 rounded-full shadow-lg hover:bg-primary/85 transition-colors active:scale-95"
                          >
                            <Plus className="w-4 h-4" />
                            {tx(common.addToCart)}
                          </button>
                        </div>

                        {/* Cart qty badge on image */}
                        <AnimatePresence>
                          {cartQty > 0 && (
                            <motion.div
                              key="qty"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              transition={{ type: "spring", stiffness: 400, damping: 24 }}
                              className={`absolute bottom-2 ${isRtl ? "left-2" : "right-2"} flex items-center gap-1 bg-primary text-primary-foreground rounded-full shadow-md px-2 py-0.5`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateQty(item.id, -1); }}
                                className="hover:opacity-70 transition-opacity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold min-w-[14px] text-center">{cartQty}</span>
                              <button
                                onClick={(e) => {
                                  e.preventDefault(); e.stopPropagation();
                                  addItem({
                                    id: item.id, name: item.name, nameAr: item.nameAr,
                                    price: item.price, imageUrl: item.imageUrl,
                                    chefName: item.chefName, chefNameAr: item.chefNameAr,
                                  });
                                }}
                                className="hover:opacity-70 transition-opacity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Badges */}
                        {item.isFeatured && (
                          <span className={`absolute top-3 ${isRtl ? "right-3" : "left-3"} bg-primary text-primary-foreground text-[11px] font-bold px-2.5 py-1 rounded-full shadow`}>
                            {tx(menu.popular)}
                          </span>
                        )}
                        {item.dietary.includes("vegetarian") && (
                          <span className={`absolute top-3 ${isRtl ? "left-3" : "right-3"} bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                            {tx(menu.veg)}
                          </span>
                        )}
                      </div>

                      {/* ── Card body ─────────────────────────────────────── */}
                      <Link href={`/menu/${item.id}`} className="flex flex-col flex-1 p-4 hover:no-underline">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h3 className="font-bold text-base leading-snug text-card-foreground">
                            {isRtl ? item.nameAr : item.name}
                          </h3>
                          <span className="font-bold text-primary whitespace-nowrap text-sm shrink-0">
                            {item.price} {tx(common.egp)}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-3 flex-1">
                          {isRtl ? item.descriptionAr : item.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3 mt-auto">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            {isRtl ? item.chefNameAr : item.chefName}
                          </span>
                          <div className="flex items-center gap-3">
                            {item.rating != null && (
                              <span className="flex items-center gap-0.5">
                                <Star className="h-3 w-3 fill-primary text-primary" />
                                {item.rating}
                              </span>
                            )}
                            {item.prepTimeMinutes != null && (
                              <span className="flex items-center gap-0.5">
                                <Clock className="h-3 w-3" />
                                {item.prepTimeMinutes}{tx(menu.minShort)}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => {
                setCurrentPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              isRtl={isRtl}
            />
          </>
        )}
      </div>
    </PageWrapper>
  );
}
