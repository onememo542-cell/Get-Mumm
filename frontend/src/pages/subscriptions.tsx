import { useLanguage } from "@/contexts/LanguageContext";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useListSubscriptionPlans } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Check, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { sectionReveal } from "@/lib/motion";
import { WaveDivider } from "@/components/ui/WaveDivider";

export default function SubscriptionsPage() {
  const { t, isRtl } = useLanguage();
  const { data: plans, isLoading } = useListSubscriptionPlans();

  return (
    <PageWrapper>
      <div className="bg-accent pt-32 pb-20 text-center px-4">
        <motion.div {...sectionReveal}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
            {t("Food sorted, all week.", "طعامك مرتب طوال الأسبوع.")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("Subscribe and save. Enjoy fresh, homemade meals delivered on your schedule.", "اشترك ووفر. استمتع بوجبات منزلية طازجة تصلك حسب جدولك.")}
          </p>
        </motion.div>
      </div>

      <WaveDivider bg="var(--color-accent)" fill="var(--color-background)" flip />

      <div className="container mx-auto px-4 py-24">
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-[500px] rounded-[2rem]" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans?.map((plan) => (
              <div 
                key={plan.id} 
                className={`relative flex flex-col bg-card border rounded-[2rem] p-8 transition-transform hover:-translate-y-2 ${
                  plan.isPopular ? 'border-primary shadow-xl shadow-primary/10' : 'shadow-sm'
                }`}
              >
                {plan.isPopular && (
                  <div className={`absolute -top-4 ${isRtl ? 'right-8' : 'left-8'} bg-primary text-primary-foreground text-sm font-bold px-4 py-1 rounded-full`}>
                    {t("Most Popular", "الأكثر طلباً")}
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{isRtl ? plan.nameAr : plan.name}</h3>
                  <p className="text-muted-foreground text-sm min-h-[40px]">
                    {isRtl ? plan.descriptionAr : plan.description}
                  </p>
                </div>

                <div className="mb-8">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground"> {t("EGP", "ج.م")} / {
                    plan.period === 'weekly' ? t("week", "أسبوع") : 
                    plan.period === 'monthly' ? t("month", "شهر") : t("day", "يوم")
                  }</span>
                </div>

                <div className="flex-1 space-y-4 mb-8">
                  {(isRtl ? plan.featuresAr : plan.features).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  size="lg" 
                  variant={plan.isPopular ? "default" : "outline"}
                  className={`w-full rounded-xl ${plan.isPopular ? 'h-14 text-lg shadow-md' : 'h-12 border-2'}`}
                >
                  {t("Subscribe Now", "اشترك الآن")}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How it works simple step */}
      <div className="bg-primary/5 py-24">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl font-serif font-bold mb-12">{t("How Subscriptions Work", "كيف يعمل الاشتراك")}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-2xl border shadow-sm">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">1</div>
              <h3 className="font-bold mb-2">{t("Pick a Plan", "اختر خطة")}</h3>
              <p className="text-muted-foreground text-sm">{t("Select the bundle that fits your lifestyle.", "اختر الباقة التي تناسب نمط حياتك.")}</p>
            </div>
            <div className="bg-background p-6 rounded-2xl border shadow-sm">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">2</div>
              <h3 className="font-bold mb-2">{t("Customize", "خصص وجباتك")}</h3>
              <p className="text-muted-foreground text-sm">{t("Choose your favorite meals for the week.", "اختر وجباتك المفضلة للأسبوع.")}</p>
            </div>
            <div className="bg-background p-6 rounded-2xl border shadow-sm">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">3</div>
              <h3 className="font-bold mb-2">{t("Enjoy", "استمتع")}</h3>
              <p className="text-muted-foreground text-sm">{t("Receive fresh food at your doorstep.", "استلم طعامك الطازج على باب منزلك.")}</p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
