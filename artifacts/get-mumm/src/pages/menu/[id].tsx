import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { PageWrapper, fadeInUp, staggerContainer, staggerItem } from "@/components/layout/PageWrapper";
import { useGetMenuItem, getGetMenuItemQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Clock, Star } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/useSEO";

export default function MenuItemPage() {
  const { id } = useParams();
  const { t, isRtl } = useLanguage();
  const { toast } = useToast();
  const { addItem, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const { data: item, isLoading } = useGetMenuItem(Number(id), {
    query: { enabled: !!id, queryKey: getGetMenuItemQueryKey(Number(id)) }
  });

  useSEO(
    item
      ? {
          title: isRtl ? item.nameAr : item.name,
          description: isRtl ? item.descriptionAr : item.description,
        }
      : {}
  );

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-4 py-24">
          <div className="grid md:grid-cols-2 gap-12">
            <Skeleton className="h-[400px] md:h-[600px] rounded-3xl" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-48" />
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (!item) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-4 py-32 text-center">
          <h2 className="text-3xl font-bold mb-4">{t("Item not found", "لم يتم العثور على الطبق")}</h2>
          <Link href="/menu">
            <Button>{t("Back to Menu", "العودة للقائمة")}</Button>
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="bg-primary/5 py-8 border-b border-border mt-20">
        <div className="container mx-auto px-4">
          <Link href="/menu" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium">
            {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            {t("Back to Menu", "العودة للقائمة")}
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-square md:aspect-auto md:h-[600px]">
            <img 
              src={item.imageUrl || "/koshari.png"} 
              alt={isRtl ? item.nameAr : item.name} 
              className="w-full h-full object-cover"
            />
            {item.isFeatured && (
              <span className={`absolute top-6 ${isRtl ? 'right-6' : 'left-6'} bg-primary text-primary-foreground text-sm font-bold px-4 py-1.5 rounded-full shadow-md`}>
                {t("Popular", "الأكثر طلباً")}
              </span>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-3 text-sm font-bold text-primary tracking-wider uppercase">
                <span>{isRtl ? item.categoryNameAr : item.categoryName}</span>
                {item.dietary?.map((diet) => (
                  <span key={diet} className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                    {diet}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-4">
                {isRtl ? item.nameAr : item.name}
              </h1>
              <div className="flex items-center gap-6 text-muted-foreground border-b border-border pb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold">
                    {(isRtl ? item.chefNameAr : item.chefName).charAt(0)}
                  </div>
                  <span>{isRtl ? item.chefNameAr : item.chefName}</span>
                </div>
                {item.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{item.rating}</span>
                  </div>
                )}
                {item.prepTimeMinutes && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{item.prepTimeMinutes} {t("mins", "دقيقة")}</span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {isRtl ? item.descriptionAr : item.description}
            </p>

            <div className="flex items-center justify-between py-6 border-y border-border">
              <span className="text-4xl font-bold text-foreground">
                {item.price} <span className="text-xl text-muted-foreground">{t("EGP", "ج.م")}</span>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center justify-between border border-border rounded-full p-2 w-full sm:w-40">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full h-10 w-10" 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full h-10 w-10" 
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                size="lg" 
                className="flex-1 rounded-full h-14 text-lg font-bold shadow-lg"
                disabled={!item.isAvailable}
                onClick={() => {
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
                    title: t("Added to cart!", "أُضيف إلى السلة!"),
                    description: `${quantity}× ${isRtl ? item.nameAr : item.name} · ${item.price * quantity} ${t("EGP", "ج.م")}`,
                  });
                  openCart();
                }}
              >
                <ShoppingBag className={`h-5 w-5 ${isRtl ? "ml-2" : "mr-2"}`} />
                {item.isAvailable ? t("Add to Cart", "أضف للسلة") : t("Sold Out", "نفذت الكمية")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
