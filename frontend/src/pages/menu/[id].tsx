import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useGetMenuItem, useListMenuItems } from "@/api";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag,
  Clock, Star, ChefHat, Leaf, Wheat, Flame, ChevronRight,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/useSEO";
import { motion, AnimatePresence } from "framer-motion";
import { menu, common, nav } from "@/locales";

const ease = [0.22, 1, 0.36, 1] as const;

const DIETARY_CONFIG: Record<string, { icon: React.ReactNode; labelEn: string; labelAr: string; className: string }> = {
  vegan:       { icon: <Leaf className="w-3 h-3" />,  labelEn: "Vegan",       labelAr: "نباتي",        className: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" },
  "gluten-free":{ icon: <Wheat className="w-3 h-3" />, labelEn: "Gluten Free", labelAr: "خالي من الجلوتين", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  spicy:       { icon: <Flame className="w-3 h-3" />, labelEn: "Spicy",       labelAr: "حار",          className: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20" },
};

function DietaryBadge({ diet, isRtl }: { diet: string; isRtl: boolean }) {
  const cfg = DIETARY_CONFIG[diet];
  if (!cfg) return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border bg-muted text-muted-foreground border-border">
      {diet}
    </span>
  );
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.className}`}>
      {cfg.icon}
      {isRtl ? cfg.labelAr : cfg.labelEn}
    </span>
  );
}

export default function MenuItemPage() {
  const { id } = useParams();
  const { tx, isRtl } = useLanguage();
  const { toast } = useToast();
  const { addItem, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const { data: item, isLoading } = useGetMenuItem(Number(id));

  const { data: allItems } = useListMenuItems();
  const relatedItems = useMemo(() => {
    if (!item || !allItems) return [];
    return allItems
      .filter((i) => i.chefName === item.chefName && i.id !== item.id)
      .slice(0, 4);
  }, [item, allItems]);

  useSEO(item ? {
    title: isRtl ? item.nameAr : item.name,
    description: isRtl ? item.descriptionAr : item.description,
  } : {});

  /* ── Loading skeleton ───────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <PageWrapper>
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6">
            <Skeleton className="h-5 w-40 mb-10 rounded-full" />
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
              <Skeleton className="aspect-square md:h-[540px] rounded-3xl" />
              <div className="space-y-6">
                <Skeleton className="h-4 w-32 rounded-full" />
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-14 w-full rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  /* ── Not found ──────────────────────────────────────────────────────── */
  if (!item) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-4 py-32 text-center">
          <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">{tx(menu.dishNotFound)}</h2>
          <p className="text-muted-foreground mb-6">{tx(menu.dishRemoved)}</p>
          <Link href="/menu">
            <Button className="rounded-full px-8">{tx(menu.backToMenu)}</Button>
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: item.id,
        name: item.name,
        nameAr: item.nameAr,
        price: item.price,
        imageUrl: item.imageUrl || "/koshari.png",
        chefName: item.chefName,
        chefNameAr: item.chefNameAr,
      });
    }
    toast({
      title: tx(common.addedToCart),
      description: `${quantity}× ${isRtl ? item.nameAr : item.name} · ${item.price * quantity} ${tx(common.egp)}`,
    });
    openCart();
  };

  return (
    <PageWrapper>

      {/* ── Breadcrumb bar ─────────────────────────────────────────────── */}
      <div className="bg-muted/40 border-b border-border mt-16 sm:mt-20">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <nav className={`flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap ${isRtl ? "flex-row-reverse" : ""}`}>
            <Link href="/" className="hover:text-foreground transition-colors">{tx(nav.home)}</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <Link href="/menu" className="hover:text-foreground transition-colors">{tx(nav.menu)}</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <span className="text-foreground font-medium truncate max-w-[200px]">
              {isRtl ? item.nameAr : item.name}
            </span>
          </nav>
        </div>
      </div>

      {/* ── Main detail grid ───────────────────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 py-10 md:py-16">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-20 items-start">

          {/* Image — sticky on desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease }}
            className="md:sticky md:top-28"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-square bg-muted">
              <img
                src={item.imageUrl || "/koshari.png"}
                alt={isRtl ? item.nameAr : item.name}
                className="w-full h-full object-cover"
              />
              {item.isFeatured && (
                <span className={`absolute top-5 ${isRtl ? "right-5" : "left-5"} bg-primary text-primary-foreground text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md`}>
                  {tx(menu.popular)}
                </span>
              )}
              {!item.isAvailable && (
                <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center rounded-3xl">
                  <span className="bg-destructive text-destructive-foreground font-bold px-6 py-2.5 rounded-full text-sm shadow-lg">
                    {tx(menu.soldOut)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease }}
            className="space-y-7"
          >
            {/* Category + dietary */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-primary tracking-widest uppercase">
                {isRtl ? item.categoryNameAr : item.categoryName}
              </span>
              {item.dietary?.map((diet) => (
                <DietaryBadge key={diet} diet={diet} isRtl={isRtl} />
              ))}
            </div>

            {/* Name */}
            <h1 className="text-4xl sm:text-5xl font-serif font-bold leading-tight">
              {isRtl ? item.nameAr : item.name}
            </h1>

            {/* Meta row: chef · rating · prep time */}
            <div className={`flex flex-wrap items-center gap-4 text-sm pb-6 border-b border-border ${isRtl ? "flex-row-reverse" : ""}`}>
              <Link href="/chefs" className="flex items-center gap-2 group">
                <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0 group-hover:bg-primary/25 transition-colors">
                  <ChefHat className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold leading-tight group-hover:text-primary transition-colors">
                    {isRtl ? item.chefNameAr : item.chefName}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{tx(menu.homeChef)}</p>
                </div>
              </Link>

              {item.rating && (
                <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-bold text-sm">{item.rating}</span>
                </div>
              )}

              {item.prepTimeMinutes && (
                <div className="flex items-center gap-1.5 bg-muted text-muted-foreground px-3 py-1.5 rounded-full">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-sm font-medium">{item.prepTimeMinutes} {tx(menu.min)}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {isRtl ? item.descriptionAr : item.description}
            </p>

            {/* Price */}
            <div className="flex items-end gap-2 py-5 border-y border-border">
              <span className="text-5xl font-bold tabular-nums">{item.price}</span>
              <span className="text-xl text-muted-foreground pb-1">{tx(common.egp)}</span>
            </div>

            {/* Qty + Add to cart */}
            <div className={`flex flex-col sm:flex-row gap-3 ${isRtl ? "sm:flex-row-reverse" : ""}`}>
              {/* Quantity picker */}
              <div className="flex items-center justify-between border-2 border-border hover:border-primary/40 transition-colors rounded-full px-2 py-1.5 sm:w-36 shrink-0">
                <Button
                  variant="ghost" size="icon"
                  className="rounded-full h-9 w-9 hover:bg-primary/10"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={quantity}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="font-bold text-lg w-8 text-center tabular-nums"
                  >
                    {quantity}
                  </motion.span>
                </AnimatePresence>
                <Button
                  variant="ghost" size="icon"
                  className="rounded-full h-9 w-9 hover:bg-primary/10"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Add to cart */}
              <Button
                size="lg"
                className="flex-1 rounded-full h-14 text-base font-bold shadow-md hover:shadow-lg transition-shadow"
                disabled={!item.isAvailable}
                onClick={handleAddToCart}
              >
                <ShoppingBag className={`h-5 w-5 ${isRtl ? "ml-2.5" : "mr-2.5"}`} />
                {item.isAvailable
                  ? `${tx(common.addToCart)}${quantity > 1 ? ` (${quantity})` : ""}`
                  : tx(menu.soldOut)}
              </Button>
            </div>

            {/* Total callout when qty > 1 */}
            <AnimatePresence>
              {quantity > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm text-muted-foreground bg-muted/60 rounded-xl px-4 py-2.5 border border-border"
                >
                  {tx(common.total)}: <span className="font-bold text-foreground">{item.price * quantity} {tx(common.egp)}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* ── More from this chef ────────────────────────────────────────── */}
      {relatedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
          className="border-t border-border bg-muted/30"
        >
          <div className="container mx-auto px-4 sm:px-6 py-12">
            <div className={`flex items-center justify-between mb-7 ${isRtl ? "flex-row-reverse" : ""}`}>
              <div>
                <p className="text-xs font-bold text-primary tracking-widest uppercase mb-1">
                  {isRtl ? item.chefNameAr : item.chefName}
                </p>
                <h2 className="text-2xl font-serif font-bold">
                  {tx(menu.moreFromChef)}
                </h2>
              </div>
              <Link href="/menu" className={`text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 ${isRtl ? "flex-row-reverse" : ""}`}>
                {tx(menu.viewAll)}
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedItems.map((rel, i) => (
                <motion.div
                  key={rel.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * i, ease }}
                >
                  <Link href={`/menu/${rel.id}`}>
                    <div className="group bg-card border border-card-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer">
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        <img
                          src={rel.imageUrl || "/koshari.png"}
                          alt={isRtl ? rel.nameAr : rel.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-3">
                        <p className="font-bold text-sm leading-tight mb-1 line-clamp-1">
                          {isRtl ? rel.nameAr : rel.name}
                        </p>
                        <p className="text-primary font-bold text-sm">{rel.price} {tx(common.egp)}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

    </PageWrapper>
  );
}
