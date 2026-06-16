import { useLanguage } from "@/contexts/LanguageContext";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { MapPin, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function DeliveryAreasPage() {
  const { t, isRtl } = useLanguage();

  const areas = [
    { name: "Maadi & Degla", nameAr: "المعادي ودجلة" },
    { name: "New Cairo (Tagamoa)", nameAr: "القاهرة الجديدة (التجمع)" },
    { name: "Heliopolis", nameAr: "مصر الجديدة" },
    { name: "Nasr City", nameAr: "مدينة نصر" },
    { name: "Zamalek", nameAr: "الزمالك" },
    { name: "Dokki & Zamalek", nameAr: "الدقي والزمالك" },
    { name: "Mohandeseen", nameAr: "المهندسين" },
    { name: "Sheikh Zayed", nameAr: "الشيخ زايد" },
    { name: "6th of October", nameAr: "السادس من أكتوبر" }
  ];

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-32 max-w-4xl text-center">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8">
          <MapPin className="w-10 h-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
          {t("Where we deliver", "أماكن التوصيل")}
        </h1>
        <p className="text-xl text-muted-foreground mb-16">
          {t("We are currently serving most of Greater Cairo and Giza. Our chefs ensure your food arrives fresh and warm.", "نحن نخدم حالياً معظم مناطق القاهرة الكبرى والجيزة. يضمن طهاتنا وصول طعامك طازجاً وساخناً.")}
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-left">
          {areas.map((area, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className={`bg-card border rounded-2xl p-6 flex items-center gap-4 hover:border-primary transition-colors ${isRtl ? 'text-right flex-row-reverse' : ''}`}
            >
              <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
              <span className="font-bold text-lg">{isRtl ? area.nameAr : area.name}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 bg-secondary/10 rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-4">{t("Don't see your area?", "لا تجد منطقتك؟")}</h2>
          <p className="text-muted-foreground mb-6">
            {t("We are constantly expanding. Leave us your email and area, and we'll let you know when we reach you.", "نحن نتوسع باستمرار. اترك لنا بريدك الإلكتروني ومنطقتك، وسنعلمك عندما نصل إليك.")}
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="text" 
              placeholder={t("Your area", "منطقتك")} 
              className="flex-1 h-12 px-4 rounded-xl border bg-background"
            />
            <input 
              type="email" 
              placeholder={t("Email address", "البريد الإلكتروني")} 
              className="flex-1 h-12 px-4 rounded-xl border bg-background"
            />
            <button className="h-12 px-8 bg-primary text-primary-foreground rounded-xl font-bold whitespace-nowrap">
              {t("Notify Me", "أعلمني")}
            </button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}
