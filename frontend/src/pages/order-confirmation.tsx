import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, MapPin, ShoppingBag, ArrowRight, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { ease } from "@/lib/motion";
import { orders, common, cart } from "@/locales";

const checkmarkVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1, transition: { duration: 0.6, delay: 0.3, ease: ease.out } },
};

export default function OrderConfirmationPage() {
  const { tx, isRtl } = useLanguage();
  const { lastOrder } = useCart();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!lastOrder) navigate("/");
  }, [lastOrder, navigate]);

  if (!lastOrder) return null;

  const placedTime = new Date(lastOrder.placedAt);
  const eta = new Date(placedTime.getTime() + 55 * 60 * 1000);
  const etaStr = eta.toLocaleTimeString(isRtl ? "ar-EG" : "en-EG", { hour: "2-digit", minute: "2-digit" });

  return (
    <PageWrapper>
      <div className="pt-24 sm:pt-28 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-xl">

          {/* Animated success card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: ease.out }}
            className="bg-card border border-border rounded-3xl p-8 text-center mb-6 shadow-xl"
          >
            {/* Checkmark animation */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                className="w-24 h-24 rounded-full bg-green-500/15 flex items-center justify-center"
              >
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                  <motion.circle
                    cx="26" cy="26" r="24"
                    stroke="#22c55e" strokeWidth="3"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.15, ease: ease.out }}
                    strokeLinecap="round"
                  />
                  <motion.path
                    d="M14 26 L22 34 L38 18"
                    stroke="#22c55e" strokeWidth="3.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={checkmarkVariants}
                    initial="hidden"
                    animate="visible"
                  />
                </svg>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.4, ease: ease.out }}
            >
              <p className="text-green-500 font-bold text-sm uppercase tracking-wider mb-2">
                {tx(orders.orderConfirmed)}
              </p>
              <h1 className="text-3xl font-serif font-bold mb-1">{tx(orders.thankYou)}</h1>
              <h2 className="text-2xl font-serif font-semibold text-primary mb-3">{lastOrder.customerName}!</h2>
              <p className="text-muted-foreground text-sm mb-5">
                {tx(orders.feastDesc)}
              </p>

              {/* Order ID */}
              <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-full mb-6">
                <span className="text-muted-foreground text-sm">{tx(orders.orderNumber)}</span>
                <span className="font-bold text-foreground text-sm">#{lastOrder.id}</span>
              </div>

              {/* ETA */}
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div className="bg-primary/8 border border-primary/20 rounded-2xl p-4">
                  <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-0.5">{tx(orders.estimatedArrival)}</p>
                  <p className="font-bold text-lg">{etaStr}</p>
                  <p className="text-xs text-muted-foreground">{tx(orders.eta)}</p>
                </div>
                <div className="bg-muted/50 border border-border rounded-2xl p-4">
                  <MapPin className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-0.5">{tx(orders.deliveringTo)}</p>
                  <p className="font-bold text-sm leading-snug">{lastOrder.area}</p>
                  <p className="text-xs text-muted-foreground truncate">{lastOrder.street}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Order items summary */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.55, ease: ease.out }}
            className="bg-card border border-border rounded-2xl p-5 mb-6"
          >
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-primary" />
              {tx(orders.yourOrder)}
            </h3>
            <div className="space-y-3">
              {lastOrder.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg overflow-hidden bg-muted shrink-0">
                    <img src={item.imageUrl} alt={isRtl ? item.nameAr : item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{isRtl ? item.nameAr : item.name}</p>
                    <p className="text-xs text-muted-foreground">× {item.qty}</p>
                  </div>
                  <p className="text-sm font-semibold shrink-0">{(item.price * item.qty).toFixed(0)} {tx(common.egp)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-4 pt-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>{tx(cart.subtotal)}</span>
                <span>{lastOrder.subtotal.toFixed(0)} {tx(common.egp)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{tx(common.delivery)}</span>
                {lastOrder.deliveryFee === 0
                  ? <span className="text-green-500 font-semibold">{tx(common.free)}</span>
                  : <span>{lastOrder.deliveryFee} {tx(common.egp)}</span>
                }
              </div>
              <div className="flex justify-between font-bold">
                <span>{tx(orders.totalPaid)}</span>
                <span className="text-primary">{lastOrder.total.toFixed(0)} {tx(common.egp)}</span>
              </div>
            </div>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.65, ease: ease.out }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <Link href={`/order/${lastOrder.id}`}>
              <Button className="w-full h-12 rounded-xl font-bold text-base flex items-center justify-center gap-2">
                {tx(orders.trackMyOrder)}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full h-12 rounded-xl font-bold flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                {tx(orders.backToHome)}
              </Button>
            </Link>
          </motion.div>

          {/* Help */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-sm text-muted-foreground mt-6"
          >
            {tx(orders.needHelp)}{" "}
            <a href="https://wa.me/201027671111" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
              {tx(orders.whatsappUs)}
            </a>
          </motion.p>
        </div>
      </div>
    </PageWrapper>
  );
}
