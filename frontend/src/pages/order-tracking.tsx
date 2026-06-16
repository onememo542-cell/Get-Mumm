import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, MapPin, Phone, ChefHat, MessageCircle, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { ease } from "@/lib/motion";

type StageKey = "received" | "preparing" | "on_the_way" | "delivered";

const STAGES: { key: StageKey; labelEn: string; labelAr: string; icon: React.ReactNode; descEn: string; descAr: string }[] = [
  {
    key: "received",
    labelEn: "Order Received",
    labelAr: "تم استلام الطلب",
    descEn: "Your order has been confirmed.",
    descAr: "تم تأكيد طلبك بنجاح.",
    icon: <CheckCircle2 className="w-5 h-5" />,
  },
  {
    key: "preparing",
    labelEn: "Being Prepared",
    labelAr: "جاري التحضير",
    descEn: "Our chef is cooking your meal with love.",
    descAr: "الشيف يحضّر وجبتك بكل حب.",
    icon: <ChefHat className="w-5 h-5" />,
  },
  {
    key: "on_the_way",
    labelEn: "On the Way",
    labelAr: "في الطريق إليك",
    descEn: "Your order is heading to your door.",
    descAr: "طلبك في طريقه إليك.",
    icon: <MapPin className="w-5 h-5" />,
  },
  {
    key: "delivered",
    labelEn: "Delivered",
    labelAr: "تم التوصيل",
    descEn: "Enjoy your homemade meal!",
    descAr: "استمتع بوجبتك المنزلية!",
    icon: <CheckCircle2 className="w-5 h-5" />,
  },
];

// Mock: simulate advancing stages over time
function useSimulatedStage(): StageKey {
  const [stage, setStage] = useState<StageKey>("preparing");
  useEffect(() => {
    const t1 = setTimeout(() => setStage("on_the_way"), 15000);
    const t2 = setTimeout(() => setStage("delivered"),  30000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return stage;
}

function stageIndex(key: StageKey) {
  return STAGES.findIndex((s) => s.key === key);
}

export default function OrderTrackingPage() {
  const { t, isRtl } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const { lastOrder } = useCart();
  const currentStage = useSimulatedStage();
  const currentIdx = stageIndex(currentStage);

  const order = lastOrder?.id === id ? lastOrder : null;
  const eta = order
    ? new Date(new Date(order.placedAt).getTime() + 55 * 60 * 1000).toLocaleTimeString(
        isRtl ? "ar-EG" : "en-EG",
        { hour: "2-digit", minute: "2-digit" }
      )
    : "--:--";

  return (
    <PageWrapper>
      <div className="pt-24 sm:pt-28 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-lg">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: ease.out }}
            className="text-center mb-8"
          >
            <p className="text-muted-foreground text-sm mb-1">{t("Tracking order", "تتبع الطلب")}</p>
            <h1 className="text-3xl font-serif font-bold">#{id}</h1>
            {order && (
              <p className="text-muted-foreground text-sm mt-2">
                {t(`Delivering to ${order.area}`, `التوصيل إلى ${order.area}`)}
              </p>
            )}
          </motion.div>

          {/* ETA card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1, ease: ease.out }}
            className={`bg-primary/8 border border-primary/25 rounded-2xl p-5 flex items-center gap-4 mb-8 ${
              currentStage === "delivered" ? "bg-green-500/10 border-green-500/30" : ""
            }`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${
              currentStage === "delivered" ? "bg-green-500/20" : "bg-primary/15"
            }`}>
              <Clock className={`w-7 h-7 ${currentStage === "delivered" ? "text-green-500" : "text-primary"}`} />
            </div>
            <div>
              {currentStage === "delivered" ? (
                <>
                  <p className="font-bold text-green-500 text-lg">{t("Delivered! 🎉", "تم التوصيل! 🎉")}</p>
                  <p className="text-sm text-muted-foreground">{t("Enjoy your meal!", "استمتع بوجبتك!")}</p>
                </>
              ) : (
                <>
                  <p className="font-bold text-lg">{t("Estimated Arrival", "الوصول المتوقع")}</p>
                  <p className="text-2xl font-bold text-primary">{eta}</p>
                  <p className="text-xs text-muted-foreground">{t("≈ 45–60 minutes from order", "≈ 45–60 دقيقة من تأكيد الطلب")}</p>
                </>
              )}
            </div>
          </motion.div>

          {/* Progress timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15, ease: ease.out }}
            className="bg-card border border-border rounded-2xl p-6 mb-6"
          >
            <h2 className="font-bold mb-6">{t("Order Status", "حالة الطلب")}</h2>
            <div className="relative">
              {STAGES.map((stage, idx) => {
                const done    = idx < currentIdx;
                const active  = idx === currentIdx;
                const pending = idx > currentIdx;

                return (
                  <div key={stage.key} className="flex items-start gap-4 relative">
                    {/* Vertical connector line */}
                    {idx < STAGES.length - 1 && (
                      <div className={`absolute ${isRtl ? "right-5" : "left-5"} top-10 w-0.5 h-12 rounded-full ${
                        done ? "bg-primary" : "bg-border"
                      }`} />
                    )}

                    {/* Icon circle */}
                    <motion.div
                      initial={active ? { scale: 0.7, opacity: 0 } : false}
                      animate={active ? { scale: 1, opacity: 1 } : {}}
                      transition={{ type: "spring", stiffness: 320, damping: 22 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-2 transition-colors ${
                        done    ? "bg-primary border-primary text-primary-foreground" :
                        active  ? "bg-primary/15 border-primary text-primary" :
                                  "bg-muted border-border text-muted-foreground"
                      }`}
                    >
                      {done ? <CheckCircle2 className="w-5 h-5" /> : stage.icon}
                    </motion.div>

                    {/* Text */}
                    <div className={`flex-1 pb-10 ${pending ? "opacity-40" : ""}`}>
                      <div className="flex items-center gap-2">
                        <p className={`font-semibold text-sm ${active ? "text-primary" : ""}`}>
                          {isRtl ? stage.labelAr : stage.labelEn}
                        </p>
                        {active && (
                          <motion.span
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.4, repeat: Infinity }}
                            className="text-xs text-primary font-medium"
                          >
                            {t("• Now", "• الآن")}
                          </motion.span>
                        )}
                        {done && (
                          <span className="text-xs text-muted-foreground">{t("✓ Done", "✓ تم")}</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {isRtl ? stage.descAr : stage.descEn}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Contact buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25, ease: ease.out }}
            className="space-y-3"
          >
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
              {t("Need help?", "تحتاج مساعدة؟")}
            </p>
            <a href="https://wa.me/201027671111" target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-2 border-green-500/30 text-green-700 dark:text-green-400 hover:bg-green-500/8 hover:border-green-500/50 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                {t("WhatsApp Support", "واتساب الدعم")}
              </Button>
            </a>
            <a href="tel:+201027671111">
              <Button variant="outline" className="w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                +20 10 2767 1111
              </Button>
            </a>
          </motion.div>

          {/* Navigation — separated from contact group */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.35, ease: ease.out }}
            className="pt-2 border-t border-border"
          >
            <Link href="/">
              <Button variant="ghost" className="w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground">
                <Home className="w-4 h-4" />
                {t("Back to Home", "العودة للرئيسية")}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
