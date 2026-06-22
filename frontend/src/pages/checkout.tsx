import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart, PlacedOrder, FREE_DELIVERY_THRESHOLD } from "@/contexts/CartContext";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShoppingBag, MapPin, Phone, User, FileText, CreditCard, Banknote, ChevronRight, Truck } from "lucide-react";
import { sectionReveal, ease } from "@/lib/motion";
import { Link } from "wouter";
import { checkout, common, cart, home, nav } from "@/locales";
import { endpoints } from "@/api/endpoints";

const AREAS_EN = ["Maadi", "New Cairo", "Heliopolis", "Zamalek", "Downtown Cairo", "Dokki", "Mohandessin", "Nasr City", "Shubra", "6th of October", "Sheikh Zayed"];
const AREAS_AR = ["المعادي", "القاهرة الجديدة", "مصر الجديدة (هليوبوليس)", "الزمالك", "وسط القاهرة", "الدقي", "المهندسين", "مدينة نصر", "شبرا", "السادس من أكتوبر", "الشيخ زايد"];

export default function CheckoutPage() {
  const { t, tx, isRtl } = useLanguage();
  const { items, subtotal, deliveryFee, total, clearCart, setLastOrder } = useCart();
  const [, navigate] = useLocation();

  const [form, setForm] = useState({
    name: "", phone: "", area: "", street: "", building: "", notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const set = (field: string, val: string) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setApiError(null);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())     e.name     = tx(checkout.nameRequired);
    if (!form.phone.trim())    e.phone    = tx(checkout.phoneRequired);
    if (!form.area)            e.area     = tx(checkout.selectArea);
    if (!form.street.trim())   e.street   = tx(checkout.streetRequired);
    if (!form.building.trim()) e.building = tx(checkout.buildingRequired);
    return e;
  };

  const placeOrder = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    if (items.length === 0) return;

    setLoading(true);
    setApiError(null);

    try {
      const response = await endpoints.createOrder({
        customerName: form.name,
        phone:        form.phone,
        area:         form.area,
        street:       form.street,
        building:     form.building,
        notes:        form.notes,
        paymentMethod,
        items: items.map((item) => ({
          menuItemId: String(item.id),
          qty:        item.qty,
        })),
      });

      const order: PlacedOrder = {
        id:           response.id,
        items:        items.map((i) => ({ ...i })),
        subtotal:     response.subtotal,
        deliveryFee:  response.deliveryFee,
        total:        response.total,
        customerName: response.customerName,
        phone:        response.phone,
        area:         response.area,
        street:       response.street,
        building:     response.building,
        notes:        response.notes,
        placedAt:     response.placedAt,
        estimatedDeliveryAt: response.estimatedDeliveryAt,
      };

      setLastOrder(order);
      clearCart();
      navigate("/order-confirmation");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to place order. Please try again.";
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !loading) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-4 py-32 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-2">{tx(common.cartEmpty)}</h2>
          <p className="text-muted-foreground mb-6">{tx(checkout.addItemsBefore)}</p>
          <Link href="/menu">
            <Button className="rounded-full px-8 font-bold">{tx(cart.browseMenu)}</Button>
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="pt-24 sm:pt-28 pb-16">
        <div className="container mx-auto px-4 sm:px-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
            <Link href="/menu" className="hover:text-primary transition-colors">{tx(nav.menu)}</Link>
            <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? "rotate-180" : ""}`} />
            <span className="text-foreground font-medium">{tx(checkout.title)}</span>
          </nav>

          <motion.h1
            {...sectionReveal}
            className="text-3xl font-serif font-bold mb-8"
          >
            {tx(checkout.title)}
          </motion.h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left: Form ─────────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Delivery details */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: ease.out }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {tx(checkout.deliveryDetails)}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">{tx(common.fullName)} *</label>
                    <div className="relative">
                      <User className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none ${isRtl ? "right-3" : "left-3"}`} />
                      <Input
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder={tx(checkout.namePlaceholder)}
                        className={`h-11 ${isRtl ? "pr-9" : "pl-9"} ${errors.name ? "border-destructive" : ""}`}
                      />
                    </div>
                    {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">{tx(common.phoneNumber)} *</label>
                    <div className="relative">
                      <Phone className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none ${isRtl ? "right-3" : "left-3"}`} />
                      <Input
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        placeholder="+20 10 XXXX XXXX"
                        className={`h-11 ${isRtl ? "pr-9" : "pl-9"} ${errors.phone ? "border-destructive" : ""}`}
                        type="tel"
                      />
                    </div>
                    {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                  </div>

                  {/* Area */}
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium mb-1.5 block">{tx(checkout.deliveryArea)} *</label>
                    <div className="flex flex-wrap gap-2">
                      {AREAS_EN.map((area, i) => (
                        <button
                          key={area}
                          onClick={() => set("area", area)}
                          className={`px-3.5 py-2 rounded-full text-sm border transition-all ${
                            form.area === area
                              ? "bg-primary text-primary-foreground border-primary font-semibold"
                              : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                          }`}
                        >
                          {isRtl ? AREAS_AR[i] : area}
                        </button>
                      ))}
                    </div>
                    {errors.area && <p className="text-destructive text-xs mt-2">{errors.area}</p>}
                  </div>

                  {/* Street */}
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium mb-1.5 block">{tx(checkout.streetAddress)} *</label>
                    <Input
                      value={form.street}
                      onChange={(e) => set("street", e.target.value)}
                      placeholder={tx(checkout.streetPlaceholder)}
                      className={`h-11 ${errors.street ? "border-destructive" : ""}`}
                    />
                    {errors.street && <p className="text-destructive text-xs mt-1">{errors.street}</p>}
                  </div>

                  {/* Building */}
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">{tx(checkout.buildingApartment)} *</label>
                    <Input
                      value={form.building}
                      onChange={(e) => set("building", e.target.value)}
                      placeholder={tx(checkout.buildingPlaceholder)}
                      className={`h-11 ${errors.building ? "border-destructive" : ""}`}
                    />
                    {errors.building && <p className="text-destructive text-xs mt-1">{errors.building}</p>}
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">{tx(checkout.notesOptional)}</label>
                    <div className="relative">
                      <FileText className={`absolute top-3.5 h-4 w-4 text-muted-foreground pointer-events-none ${isRtl ? "right-3" : "left-3"}`} />
                      <textarea
                        value={form.notes}
                        onChange={(e) => set("notes", e.target.value)}
                        placeholder={tx(checkout.notesPlaceholder)}
                        rows={2}
                        className={`w-full rounded-lg border border-border bg-background text-sm px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 ${isRtl ? "pr-9" : "pl-9"}`}
                      />
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Payment method */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08, ease: ease.out }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  {tx(checkout.paymentMethod)}
                </h2>
                <div className="space-y-3">
                  {/* Cash on delivery */}
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "cod" ? "border-primary bg-primary/8" : "border-border hover:border-primary/50"
                  }`}>
                    <input type="radio" className="sr-only" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === "cod" ? "border-primary" : "border-muted-foreground"}`}>
                      {paymentMethod === "cod" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <Banknote className="w-6 h-6 text-green-500 shrink-0" />
                    <div>
                      <p className="font-semibold">{tx(checkout.cashOnDelivery)}</p>
                      <p className="text-sm text-muted-foreground">{tx(checkout.cashDesc)}</p>
                    </div>
                  </label>

                  {/* Card — coming soon */}
                  <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-border opacity-50 cursor-not-allowed">
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground shrink-0" />
                    <CreditCard className="w-6 h-6 text-blue-400 shrink-0" />
                    <div>
                      <p className="font-semibold flex items-center gap-2">
                        {tx(checkout.creditDebitCard)}
                        <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-normal">
                          {tx(home.comingSoon)}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground">{tx(checkout.cardBrands)}</p>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* API error */}
              {apiError && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-destructive/10 border border-destructive/30 text-destructive rounded-xl px-4 py-3 text-sm font-medium"
                >
                  {apiError}
                </motion.div>
              )}
            </div>

            {/* ── Right: Order Summary ────────────────────────────────────── */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1, ease: ease.out }}
                className="bg-card border border-border rounded-2xl p-5 sticky top-24"
              >
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  {tx(checkout.orderSummary)}
                  <span className="text-sm font-normal text-muted-foreground">({items.length} {tx(checkout.items)})</span>
                </h2>

                {/* Item list */}
                <div className="space-y-3 mb-4 max-h-56 overflow-y-auto">
                  {items.map((item) => (
                    <div key={String(item.id)} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                        <img src={item.imageUrl} alt={isRtl ? item.nameAr : item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{isRtl ? item.nameAr : item.name}</p>
                        <p className="text-xs text-muted-foreground">× {item.qty}</p>
                      </div>
                      <p className="text-sm font-semibold shrink-0">
                        {(item.price * item.qty).toFixed(0)} {tx(common.egp)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-border pt-4 space-y-2 text-sm mb-5">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{tx(cart.subtotal)}</span>
                    <span>{subtotal.toFixed(0)} {tx(common.egp)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>{tx(checkout.deliveryFee)}</span>
                    {deliveryFee === 0
                      ? <span className="text-green-500 font-semibold">{tx(common.free)}</span>
                      : <span>{deliveryFee} {tx(common.egp)}</span>
                    }
                  </div>
                  {subtotal < FREE_DELIVERY_THRESHOLD && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                      <Truck className="w-3.5 h-3.5 shrink-0" />
                      {t(`Add ${FREE_DELIVERY_THRESHOLD - subtotal} EGP for free delivery`, `أضف ${FREE_DELIVERY_THRESHOLD - subtotal} ج.م للتوصيل المجاني`)}
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base border-t border-border pt-3">
                    <span>{tx(common.total)}</span>
                    <span className="text-primary">{total.toFixed(0)} {tx(common.egp)}</span>
                  </div>
                </div>

                {/* CTA */}
                <Button
                  onClick={placeOrder}
                  disabled={loading}
                  className="w-full h-12 rounded-xl font-bold text-base"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      {tx(checkout.placingOrder)}
                    </span>
                  ) : (
                    tx(checkout.placeOrder)
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-3">
                  {tx(checkout.estimatedDelivery)}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
