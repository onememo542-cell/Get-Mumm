import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useCart, FREE_DELIVERY_THRESHOLD } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ease } from "@/lib/motion";
import { cart, common } from "@/locales";

export function CartDrawer() {
  const { t, tx, isRtl } = useLanguage();
  const { items, totalItems, subtotal, deliveryFee, total, updateQty, removeItem, closeCart, isOpen } = useCart();
  const [, navigate] = useLocation();

  const toCheckout = () => { closeCart(); navigate("/checkout"); };
  const remaining = FREE_DELIVERY_THRESHOLD - subtotal;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer panel */}
          <motion.div
            key="cart-panel"
            initial={{ x: isRtl ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isRtl ? "-100%" : "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 38 }}
            dir={isRtl ? "rtl" : "ltr"}
            className={`fixed top-0 ${isRtl ? "left-0" : "right-0"} h-full w-full max-w-sm z-[61] bg-background border-${isRtl ? "r" : "l"} border-border flex flex-col shadow-2xl`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-lg">{tx(cart.yourCart)}</h2>
                {totalItems > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </div>
              <button onClick={closeCart} className="p-2 rounded-full hover:bg-muted transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free delivery progress */}
            {subtotal > 0 && subtotal < FREE_DELIVERY_THRESHOLD && (
              <div className="px-5 py-3 bg-primary/8 border-b border-border">
                <div className="flex items-center gap-2 text-xs font-medium mb-1.5">
                  <Truck className="w-3.5 h-3.5 text-primary" />
                  <span>
                    {t(
                      `Add ${remaining} EGP more for free delivery!`,
                      `أضف ${remaining} ج.م للتوصيل المجاني!`
                    )}
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100)}%` }}
                    transition={{ duration: 0.5, ease: ease.out }}
                  />
                </div>
              </div>
            )}
            {subtotal >= FREE_DELIVERY_THRESHOLD && subtotal > 0 && (
              <div className="px-5 py-3 bg-green-500/10 border-b border-border">
                <div className="flex items-center gap-2 text-xs font-semibold text-green-600 dark:text-green-400">
                  <Truck className="w-3.5 h-3.5" />
                  {tx(cart.freeDelivery)}
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4 px-4 space-y-3">
              <AnimatePresence initial={false}>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-full py-16 text-center"
                  >
                    <div className="text-6xl mb-4">🛒</div>
                    <h3 className="font-bold text-lg mb-2">{tx(common.cartEmpty)}</h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      {tx(cart.addDishes)}
                    </p>
                    <Link href="/menu" onClick={closeCart}>
                      <Button className="rounded-full px-6 font-bold">
                        {tx(cart.browseMenu)}
                      </Button>
                    </Link>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isRtl ? -20 : 20, height: 0, marginBottom: 0, paddingBottom: 0 }}
                      transition={{ duration: 0.22 }}
                      className="flex items-center gap-3 bg-muted/40 rounded-2xl p-3"
                    >
                      {/* Image */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-muted">
                        <img
                          src={item.imageUrl}
                          alt={isRtl ? item.nameAr : item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm leading-snug truncate">
                          {isRtl ? item.nameAr : item.name}
                        </p>
                        <p className="text-primary font-bold text-sm mt-0.5">
                          {(item.price * item.qty).toFixed(0)} {tx(common.egp)}
                        </p>
                        {item.qty > 1 && (
                          <p className="text-muted-foreground text-xs">
                            {item.price} × {item.qty}
                          </p>
                        )}
                      </div>

                      {/* Qty controls */}
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center gap-1.5 bg-background border border-border rounded-full px-2 py-1">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={item.qty}
                              initial={{ opacity: 0, scale: 0.7 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.7 }}
                              transition={{ duration: 0.12 }}
                              className="text-sm font-bold min-w-[18px] text-center"
                            >
                              {item.qty}
                            </motion.span>
                          </AnimatePresence>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer — totals + checkout */}
            <AnimatePresence>
              {items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  className="border-t border-border px-5 py-5 space-y-3 bg-background"
                >
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>{tx(cart.subtotal)}</span>
                      <span>{subtotal.toFixed(0)} {tx(common.egp)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>{tx(common.delivery)}</span>
                      {deliveryFee === 0 ? (
                        <span className="text-green-500 font-semibold">{tx(common.free)}</span>
                      ) : (
                        <span>{deliveryFee} {tx(common.egp)}</span>
                      )}
                    </div>
                    <div className="flex justify-between font-bold text-base border-t border-border pt-2 mt-2">
                      <span>{tx(common.total)}</span>
                      <span className="text-primary">{total.toFixed(0)} {tx(common.egp)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={toCheckout}
                    className="w-full h-12 rounded-xl font-bold text-base flex items-center justify-center gap-2"
                  >
                    {tx(cart.proceedToCheckout)}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <button
                    onClick={closeCart}
                    className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                  >
                    {tx(cart.continueShopping)}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
