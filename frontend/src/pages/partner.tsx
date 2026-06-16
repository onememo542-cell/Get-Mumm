import { useLanguage } from "@/contexts/LanguageContext";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { WaveDivider } from "@/components/ui/WaveDivider";
import { Button } from "@/components/ui/button";
import { HeartHandshake, TrendingUp, Clock, ShieldCheck, Users, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { sectionReveal, sectionStagger, sectionItem, staggerGrid, cardVariant } from "@/lib/motion";

const STEPS = [
  {
    step: "01",
    titleEn: "Apply Online",
    titleAr: "تقدمي بطلبك عبر الإنترنت",
    descEn: "Fill out a quick form and tell us about your cooking specialties. No experience with apps required.",
    descAr: "أملئي استمارة سريعة وأخبرينا عن تخصصاتك في الطبخ. لا تحتاجين إلى خبرة في التطبيقات.",
  },
  {
    step: "02",
    titleEn: "Kitchen Inspection",
    titleAr: "فحص المطبخ",
    descEn: "A HACCP-certified hygiene doctor visits your kitchen to verify it meets Mumm's 99 quality standards.",
    descAr: "يزور طبيب معتمد من HACCP مطبخك للتحقق من استيفائه لمعايير ممم الـ99 للجودة.",
  },
  {
    step: "03",
    titleEn: "Menu Planning",
    titleAr: "تخطيط قائمة الطعام",
    descEn: "Our team helps you design your menu, set pricing, and prepare beautiful packaging.",
    descAr: "يساعدك فريقنا في تصميم قائمتك وتحديد الأسعار وإعداد التعبئة الجميلة.",
  },
  {
    step: "04",
    titleEn: "Start Earning",
    titleAr: "ابدئي الكسب",
    descEn: "Go live on the platform. We handle orders, delivery, and payments. You focus on cooking.",
    descAr: "انطلقي على المنصة. نتولى نحن الطلبات والتوصيل والمدفوعات. أنت تركزين على الطبخ.",
  },
];

const PERKS = [
  {
    icon: <TrendingUp className="w-7 h-7 text-primary" />,
    titleEn: "Earn Up to EGP 6,000/mo",
    titleAr: "اكسبي حتى 6,000 جنيه شهرياً",
    descEn: "Our most active partners earn a full professional income — without leaving home.",
    descAr: "تكسب شريكاتنا الأكثر نشاطاً دخلاً مهنياً كاملاً — دون مغادرة المنزل.",
  },
  {
    icon: <Clock className="w-7 h-7 text-primary" />,
    titleEn: "Cook on Your Schedule",
    titleAr: "اطبخي وفق جدولك",
    descEn: "You decide when to cook and how many orders to accept. Work around your family's needs.",
    descAr: "أنت تقررين متى تطبخين وكم طلباً تقبلين. اعملي بما يتناسب مع احتياجات عائلتك.",
  },
  {
    icon: <ShieldCheck className="w-7 h-7 text-primary" />,
    titleEn: "Full Support",
    titleAr: "دعم كامل",
    descEn: "Mumm handles marketing, customer service, delivery, and monthly payments. You focus on cooking.",
    descAr: "تتولى ممم التسويق وخدمة العملاء والتوصيل والمدفوعات الشهرية. أنت تركزين على الطبخ.",
  },
  {
    icon: <BadgeCheck className="w-7 h-7 text-primary" />,
    titleEn: "Ministry-Certified",
    titleAr: "معتمدة من وزارة الصحة",
    descEn: "All Mumm Prime chefs are certified by the Egyptian Ministry of Health for added trust and credibility.",
    descAr: "جميع طهاة ممم برايم معتمدون من وزارة الصحة المصرية لمزيد من الثقة والمصداقية.",
  },
  {
    icon: <Users className="w-7 h-7 text-primary" />,
    titleEn: "A Community of 200+",
    titleAr: "مجتمع من أكثر من 200 شريك",
    descEn: "Join Cairo's largest network of home chefs — connect, share recipes, and grow together.",
    descAr: "انضمي إلى أكبر شبكة طهاة منزليين في القاهرة — تواصلي وشاركي الوصفات وانمي معاً.",
  },
  {
    icon: <HeartHandshake className="w-7 h-7 text-primary" />,
    titleEn: "Open to All Women",
    titleAr: "مفتوح لجميع النساء",
    descEn: "Egyptian women, expats, and refugees are all welcome. We partnered with Fard to include Syrian, Iraqi, and Sudanese cooks.",
    descAr: "مرحباً بالمصريات والمغتربات واللاجئات. تشاركنا مع منظمة فرد لضم الطهاة السوريات والعراقيات والسودانيات.",
  },
];

export default function PartnerPage() {
  const { t, isRtl } = useLanguage();

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="relative pt-28 sm:pt-36 pb-20 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-primary/4 z-0" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-bold mb-6">
              <HeartHandshake className="w-4 h-4" />
              {t("Become a Chef Partner", "انضمي كشريكة طاهية")}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">
              {t("Turn your kitchen into a business.", "حوّلي مطبخك إلى مشروع تجاري.")}
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {t(
                "Join 200+ home chefs already earning up to EGP 6,000/month on Mumm. We handle marketing, delivery, and payments — you focus on what you love: cooking.",
                "انضمي إلى أكثر من 200 طاهية منزلية تكسب حتى 6,000 جنيه شهرياً على ممم. نتولى نحن التسويق والتوصيل والمدفوعات — أنت تركزين على ما تحبين: الطبخ."
              )}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="mailto:info@getmumm.com?subject=Chef Partner Application">
                <Button size="lg" className="rounded-full px-8 h-14 text-base font-bold">
                  {t("Apply Now", "تقدمي الآن")}
                </Button>
              </a>
              <a href="https://wa.me/201027671111?text=I want to become a Mumm chef partner" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base font-semibold">
                  {t("Chat on WhatsApp", "تحدثي معنا على واتساب")}
                </Button>
              </a>
            </div>
            {/* Trust badge */}
            <p className="text-sm text-muted-foreground mt-5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              {t(
                "All kitchens certified against 99 international hygiene standards",
                "جميع المطابخ معتمدة وفق 99 معياراً دولياً للنظافة"
              )}
            </p>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
              <img src="/chef1.png" alt="Chef Partner" className="w-full h-full object-cover" />
            </div>
            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -bottom-6 -left-4 bg-card border border-border rounded-2xl shadow-xl p-4 hidden md:block"
            >
              <p className="text-2xl font-bold text-primary">6,000 EGP</p>
              <p className="text-sm text-muted-foreground">{t("Max monthly earnings", "أقصى دخل شهري")}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <WaveDivider bg="var(--color-background)" fill="var(--color-accent)" />

      {/* Perks */}
      <section className="py-24 bg-accent">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div {...sectionReveal} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-accent-foreground">
              {t("Why Partner with Mumm?", "لماذا تشاركين مع ممم؟")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t(
                "Everything you need to run a successful home cooking business — we've already built it for you.",
                "كل ما تحتاجينه لإدارة عمل ناجح من المطبخ المنزلي — لقد بنيناه بالفعل من أجلك."
              )}
            </p>
          </motion.div>
          <motion.div
            variants={staggerGrid}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {PERKS.map((perk, i) => (
              <motion.div
                key={i}
                variants={cardVariant}
                className="bg-background border border-border rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  {perk.icon}
                </div>
                <h3 className="font-bold text-base mb-2">{isRtl ? perk.titleAr : perk.titleEn}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{isRtl ? perk.descAr : perk.descEn}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <WaveDivider bg="var(--color-accent)" fill="var(--color-background)" flip />

      {/* How it Works */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div {...sectionReveal} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-serif font-bold">
              {t("How It Works", "كيف يعمل النظام")}
            </h2>
          </motion.div>
          <div className="space-y-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: isRtl ? 24 : -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
                className="flex gap-6 items-start bg-card border border-border rounded-2xl p-6"
              >
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-bold text-lg shrink-0">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{isRtl ? step.titleAr : step.titleEn}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{isRtl ? step.descAr : step.descEn}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider bg="var(--color-background)" fill="var(--color-primary)" />

      {/* Final CTA */}
      <motion.section
        {...sectionReveal}
        className="py-24 bg-primary text-primary-foreground"
      >
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            {t("Ready to start cooking for Cairo?", "مستعدة للطبخ لأهل القاهرة؟")}
          </h2>
          <p className="text-lg opacity-90 mb-8 leading-relaxed">
            {t(
              "Our team will guide you through hygiene certification, menu planning, and packaging to ensure your success. No experience needed — just your recipes and passion.",
              "سيرشدك فريقنا خلال شهادات النظافة وتخطيط القائمة والتعبئة لضمان نجاحك. لا خبرة مطلوبة — فقط وصفاتك وشغفك."
            )}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:info@getmumm.com?subject=Chef Partner Application">
              <Button size="lg" variant="secondary" className="rounded-full px-10 h-14 text-base font-bold bg-white text-primary hover:bg-white/90">
                {t("Start Your Journey", "ابدئي رحلتك")}
              </Button>
            </a>
            <a href="https://wa.me/201027671111" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base font-semibold border-white/40 text-white hover:bg-white/10">
                {t("WhatsApp Us", "تواصلي معنا")}
              </Button>
            </a>
          </div>
        </div>
      </motion.section>

      <WaveDivider bg="var(--color-primary)" fill="var(--color-background)" flip />
    </PageWrapper>
  );
}
