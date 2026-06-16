import { useLanguage } from "@/contexts/LanguageContext";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useListBlogPosts } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Clock, Search, X, BookOpen, ChefHat } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { motion, AnimatePresence } from "framer-motion";
import { staggerGrid, cardVariant, sectionReveal } from "@/lib/motion";
import { useSEO } from "@/hooks/useSEO";
import { WaveDivider } from "@/components/ui/WaveDivider";

const ITEMS_PER_PAGE = 6;
type FilterType = "all" | "blog" | "recipe";

export default function BlogPage() {
  const { t, isRtl } = useLanguage();
  const [filter, setFilter] = useState<FilterType>("all");

  useSEO({
    title: t("Stories & Recipes", "قصص ووصفات"),
    description: t(
      "Discover Egypt's culinary heritage, learn from our chefs, and try our favorite homemade recipes.",
      "اكتشف التراث الغني للطبخ المصري، تعلم من طهاتنا، وجرب وصفاتنا المنزلية المفضلة."
    ),
  });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => { setCurrentPage(1); }, [filter, debouncedSearch]);

  const { data: posts, isLoading, isError, error } = useListBlogPosts(
    filter === "all" ? undefined : { type: filter }
  );

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    if (!debouncedSearch) return posts;
    const q = debouncedSearch.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.titleAr.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        (p.tags ?? []).some((tag) => tag.toLowerCase().includes(q))
    );
  }, [posts, debouncedSearch]);

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const paginatedPosts = useMemo(
    () => filteredPosts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filteredPosts, currentPage]
  );

  const gridKey = `${filter}-${debouncedSearch}-${currentPage}`;

  const FILTERS: { value: FilterType; labelEn: string; labelAr: string }[] = [
    { value: "all", labelEn: "All", labelAr: "الكل" },
    { value: "blog", labelEn: "Stories", labelAr: "قصص" },
    { value: "recipe", labelEn: "Recipes", labelAr: "وصفات" },
  ];

  return (
    <PageWrapper>
      {/* Header */}
      <div className="bg-accent pt-28 sm:pt-32 pb-10">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <motion.div {...sectionReveal}>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold mb-3">
              {t("Stories & Recipes", "قصص ووصفات")}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-sm sm:text-base">
              {t(
                "Discover Egypt's culinary heritage, learn from our chefs, and try our favorite recipes.",
                "اكتشف التراث الغني للطبخ المصري، تعلم من طهاتنا، وجرب وصفاتنا المفضلة."
              )}
            </p>
          </motion.div>

          {/* Filter tabs with shared pill animation */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center gap-2 mb-6"
            data-testid="filter-blog-type"
          >
            {FILTERS.map(({ value, labelEn, labelAr }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`relative px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors ${
                  filter === value
                    ? "border-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary bg-background"
                }`}
                data-testid={`filter-blog-${value}`}
              >
                {filter === value && (
                  <motion.span
                    layoutId="blog-filter-pill"
                    className="absolute inset-0 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{isRtl ? labelAr : labelEn}</span>
              </button>
            ))}
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-md mx-auto relative"
          >
            <Search
              className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none ${isRtl ? "right-4" : "left-4"}`}
            />
            <input
              type="text"
              placeholder={t("Search posts, recipes, authors...", "ابحث في المقالات والوصفات والمؤلفين...")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full h-11 rounded-full bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm ${isRtl ? "pr-11 pl-10 text-right" : "pl-11 pr-10"}`}
              data-testid="input-blog-search"
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

      <div className="container mx-auto px-4 sm:px-6 py-12">
        {/* Results count */}
        <div className="flex items-center justify-between mb-6 min-h-[24px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLoading ? "loading" : `count-${filteredPosts.length}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-muted-foreground"
              data-testid="text-blog-count"
            >
              {isLoading ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                <>
                  <span className="font-semibold text-foreground">{filteredPosts.length}</span>{" "}
                  {t("posts", "مقال")}
                  {debouncedSearch && (
                    <span className="text-primary">
                      {" "}{t(`for "${debouncedSearch}"`, `لـ "${debouncedSearch}"`)}
                    </span>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
          {totalPages > 1 && (
            <p className="text-xs text-muted-foreground">
              {t(`Page ${currentPage} of ${totalPages}`, `صفحة ${currentPage} من ${totalPages}`)}
            </p>
          )}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="space-y-3"
              >
                <Skeleton className="h-56 w-full rounded-2xl" />
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </motion.div>
            ))}
          </div>
        ) : paginatedPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border"
          >
            <div className="text-4xl mb-4">📖</div>
            <h3 className="text-xl font-bold mb-2">{t("No posts found", "لم يتم العثور على مقالات")}</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {t("Try a different search or filter.", "جرب بحثاً أو تصفية مختلفة.")}
            </p>
            {(search || filter !== "all") && (
              <button
                onClick={() => { setSearch(""); setFilter("all"); }}
                className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/85 transition-colors"
              >
                {t("Show All Posts", "عرض كل المقالات")}
              </button>
            )}
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
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {paginatedPosts.map((post) => (
                  <motion.div key={post.id} variants={cardVariant}>
                    <Link href={`/blog/${post.slug}`}>
                      <motion.div
                        whileHover={{ y: -6, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 320, damping: 26 }}
                        className="group h-full flex flex-col bg-card border border-card-border rounded-2xl overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                        data-testid={`card-blog-${post.id}`}
                      >
                        <div className="relative h-52 overflow-hidden bg-muted shrink-0">
                          <img
                            src={post.imageUrl}
                            alt={isRtl ? post.titleAr : post.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                          <span
                            className={`absolute top-3 ${isRtl ? "right-3" : "left-3"} px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                              post.type === "recipe"
                                ? "bg-primary text-primary-foreground"
                                : "bg-background/90 backdrop-blur-sm text-foreground"
                            }`}
                          >
                            {post.type === "recipe" ? t("Recipe", "وصفة") : t("Story", "قصة")}
                          </span>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {post.readTimeMinutes} {t("min", "دقيقة")}
                            </span>
                            <span>·</span>
                            <span>
                              {new Date(post.publishedAt).toLocaleDateString(
                                isRtl ? "ar-EG" : "en-US",
                                { month: "short", day: "numeric", year: "numeric" }
                              )}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold leading-snug mb-2 group-hover:text-primary transition-colors">
                            {isRtl ? post.titleAr : post.title}
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                            {isRtl ? post.excerptAr : post.excerpt}
                          </p>
                          {(post.tags ?? []).length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {(post.tags ?? []).slice(0, 3).map((tag) => (
                                <span key={tag} className="bg-primary/10 text-primary text-[11px] font-medium px-2 py-0.5 rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center justify-between text-sm font-medium border-t border-border pt-3 mt-auto">
                            <span className="text-muted-foreground text-xs">{isRtl ? post.authorAr : post.author}</span>
                            <span className="text-primary text-xs font-bold flex items-center gap-1">
                              {t("Read →", "اقرأ ←")}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
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
