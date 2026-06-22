import { useLanguage } from "@/contexts/LanguageContext";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useGetSiteSummary } from "@/api";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Heart, Users, Utensils, ShieldCheck, Award } from "lucide-react";
import { sectionReveal, sectionStagger, sectionItem, staggerGrid, cardVariant } from "@/lib/motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { WaveDivider } from "@/components/ui/WaveDivider";

export default function AboutPage() {
  const { t } = useLanguage();
  const { data: summary } = useGetSiteSummary();

  const values = [
    {
      icon: <Heart className="w-7 h-7 text-rose-500" />,
      title: t("Made with Love", "صُنع بحب"),
      desc: t(
        "Every meal is crafted by a mother, grandmother, or skilled home chef — people who cook for family first.",
        "كل وجبة يتم تحضيرها بعناية على يد أم أو جدة أو طاهية منزلية ماهرة — أشخاص يطبخون للعائلة أولاً."
      ),
    },
    {
      icon: <Users className="w-7 h-7 text-primary" />,
      title: t("Empowering Women", "تمكين المرأة"),
      desc: t(
        "Our chefs earn up to EGP 6,000/month from home. We partnered with Fard to include Syrian, Iraqi, and Sudanese refugee women.",
        "تكسب طهاتنا ما يصل إلى 6,000 جنيه شهرياً من المنزل. تشاركنا مع منظمة فرد لضم النساء اللاجئات السوريات والعراقيات والسودانيات."
      ),
    },
    {
      icon: <ShieldCheck className="w-7 h-7 text-green-600" />,
      title: t("99 Quality Standards", "99 معياراً للجودة"),
      desc: t(
        "Every kitchen is inspected against 99 international hygiene standards by HACCP-certified doctors, with regular and surprise checks.",
        "يتم فحص كل مطبخ وفق 99 معياراً دولياً للنظافة بواسطة أطباء معتمدين من HACCP، مع زيارات دورية ومفاجئة."
      ),
    },
    {
      icon: <Utensils className="w-7 h-7 text-amber-500" />,
      title: t("Authentic Taste", "مذاق أصيل"),
      desc: t(
        "Preserving Egypt's culinary heritage — from koshari and molokhia to konafa and feteer — through traditional recipes passed down for generations.",
        "الحفاظ على تراث المطبخ المصري — من الكشري والملوخية إلى الكنافة والفطير — عبر وصفات تقليدية توارثتها الأجيال."
      ),
    },
  ];

  const recognitions = [
    {
      name: "500 Startups",
      role: t("Investor & Accelerator", "مستثمر ومسرّع أعمال"),
      logo: "🚀",
    },
    {
      name: "A15",
      role: t("Lead Investor", "المستثمر الرئيسي"),
      logo: "💼",
    },
    {
      name: t("World Economic Forum", "المنتدى الاقتصادي العالمي"),
      role: t("Top 100 MENA Startups", "أفضل 100 شركة ناشئة في الشرق الأوسط وأفريقيا"),
      logo: "🌍",
    },
    {
      name: "IFC",
      role: t("Digital Innovation Recognition", "تقدير ريادة الابتكار الرقمي"),
      logo: "🏆",
    },
  ];

  return (
    <PageWrapper>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="py-28 sm:py-36 bg-background overflow-hidden">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <motion.div {...sectionReveal}>
            <span className="inline-block bg-primary/10 text-primary text-sm font-bold px-4 py-1.5 rounded-full mb-6">
              {t("Founded 2015 · Cairo, Egypt", "تأسست 2015 · القاهرة، مصر")}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
              {t("More than just food.", "أكثر من مجرد طعام.")}
              <br />
              <span className="text-primary">{t("We are a movement.", "نحن حركة مجتمعية.")}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mx-auto max-w-3xl">
              {t(
                "Get Mumm was founded to solve two problems at once: busy people in Cairo who miss real, homemade food, and talented women — including refugees — who need flexible, dignified work they can do from home.",
                "تأسست ممم لحل مشكلتين في آنٍ واحد: الأشخاص المشغولون في القاهرة الذين يفتقدون الطعام المنزلي الحقيقي، والنساء الموهوبات — بمن فيهن اللاجئات — اللاتي يحتجن إلى عمل مرن وكريم من المنزل."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      <WaveDivider bg="var(--color-background)" fill="var(--color-primary)" />

      {/* ── Name Origin ───────────────────────────────────────────── */}
      <section className="py-20 bg-primary text-primary-foreground overflow-hidden">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <p className="text-6xl md:text-8xl font-serif font-bold opacity-20 mb-4 leading-none select-none">𓅓𓅓𓅓</p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                {t('What does "Mumm" mean?', 'ماذا تعني كلمة "ممم"؟')}
              </h2>
              <p className="text-lg opacity-90 leading-relaxed">
                {t(
                  '"Mumm" is a 7,000-year-old Ancient Egyptian hieroglyphic word that means "food." It evolved into the very first word every Egyptian toddler learns when they\'re hungry — a universal expression of craving something delicious, homemade, and comforting.',
                  '"ممم" كلمة هيروغليفية مصرية قديمة عمرها 7,000 سنة تعني "الطعام". تطورت لتصبح أول كلمة يتعلمها كل طفل مصري حين يجوع — تعبير عالمي عن الشوق لشيء لذيذ ومنزلي ومريح.'
                )}
              </p>
            </div>
            <div className="bg-primary-foreground/10 rounded-3xl p-8 border border-primary-foreground/20">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center shrink-0 text-xl">👨‍💼</div>
                <div>
                  <p className="font-bold text-lg">Waleed Abd El Rahman</p>
                  <p className="opacity-75 text-sm">{t("Founder & CEO, Mumm", "المؤسس والرئيس التنفيذي، ممم")}</p>
                </div>
              </div>
              <blockquote className="text-base opacity-90 italic leading-relaxed border-l-4 border-primary-foreground/30 pl-4">
                {t(
                  '"The idea came when we realised the offering on the market is either affordable junk food or expensive clean food. We saw a gap — and thousands of incredible home cooks who could fill it."',
                  '"جاءت الفكرة حين أدركنا أن الخيارات المتاحة في السوق إما وجبات سريعة رخيصة أو طعام صحي غالي الثمن. رأينا فجوة — وآلاف الطهاة المنزليين الرائعين الذين يمكنهم ملؤها."'
                )}
              </blockquote>
            </div>
          </motion.div>
        </div>
      </section>

      <WaveDivider bg="var(--color-primary)" fill="var(--color-background)" flip />

      {/* ── Story ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src="/family_dining.png"
                alt="Family Dining"
                className="rounded-3xl shadow-xl w-full"
              />
              <div className="absolute -bottom-8 -right-6 w-56 p-5 bg-card border rounded-2xl shadow-xl hidden md:block">
                <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wide">{t("Social Impact", "الأثر الاجتماعي")}</p>
                <p className="text-sm text-muted-foreground leading-snug">
                  {t(
                    "Recognized by the World Economic Forum + IFC for Gender Equality & Zero Hunger goals.",
                    "معترف بها من المنتدى الاقتصادي العالمي و IFC في مجالات المساواة بين الجنسين والقضاء على الجوع."
                  )}
                </p>
              </div>
            </motion.div>
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="text-3xl font-serif font-bold">{t("Our Story", "قصتنا")}</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                {t(
                  "Mumm started in November 2015 when Waleed Abd El Rahman spotted a gap: Cairo's lunch market offered either cheap junk food or expensive restaurant meals — nothing felt like home. Meanwhile, thousands of talented women across the city were cooking incredible meals for their families every day, with no way to turn that skill into income.",
                  "انطلقت ممم في نوفمبر 2015 حين لاحظ وليد عبدالرحمن فجوة: سوق الغداء في القاهرة يقدم إما وجبات سريعة رخيصة أو وجبات مطعم مكلفة — لا شيء يشبه طعام البيت. في الوقت ذاته، كانت آلاف النساء الموهوبات في أنحاء المدينة يطبخن وجبات رائعة لعائلاتهن يومياً، دون طريقة لتحويل تلك المهارة إلى دخل."
                )}
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                {t(
                  "We built Mumm as the bridge between these two worlds. Today we work with 200+ active kitchens, maintain 80% repeat customers, and have created over 120 jobs — including a partnership with Fard nonprofit to employ Syrian, Iraqi, and Sudanese refugee women.",
                  "بنينا ممم جسراً بين هذين العالمين. اليوم نتعاون مع أكثر من 200 مطبخ نشط، ونحافظ على 80% من العملاء المتكررين، وأوجدنا أكثر من 120 فرصة عمل — بما فيها شراكة مع منظمة فرد غير الربحية لتوظيف النساء اللاجئات السوريات والعراقيات والسودانيات."
                )}
              </p>
              <Link href="/partner">
                <Button variant="outline" className="rounded-full px-6 font-semibold border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                  {t("Become a Chef Partner →", "انضم كطاهية شريكة →")}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats (conditional) ───────────────────────────────────── */}
      {summary && (
        <>
          <WaveDivider bg="var(--color-background)" fill="var(--color-primary)" />
          <section className="py-20 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4">
              <motion.div
                variants={sectionStagger}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
              >
                {[
                  { value: `${(summary?.mealsDelivered ?? 0).toLocaleString()}+`, label: t("Meals Delivered", "وجبة تم توصيلها") },
                  { value: `${summary?.chefsEmpowered ?? 0}+`, label: t("Active Kitchens", "مطبخ نشط") },
                  { value: "80%", label: t("Repeat Customers", "عملاء متكررون") },
                  { value: summary?.avgRating ?? "4.8", label: t("Average Rating", "متوسط التقييم") },
                ].map((stat, i) => (
                  <motion.div key={i} variants={sectionItem} className="flex flex-col">
                    <span className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</span>
                    <span className="opacity-85 font-medium text-sm">{stat.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
          <WaveDivider bg="var(--color-primary)" fill="var(--color-accent)" flip />
        </>
      )}

      {/* wave when no stats */}
      {!summary && <WaveDivider bg="var(--color-background)" fill="var(--color-accent)" />}

      {/* ── Values ───────────────────────────────────────────────── */}
      <section className="py-24 bg-accent">
        <div className="container mx-auto px-4">
          <motion.div {...sectionReveal} className="text-center mb-14">
            <span className="inline-block bg-primary/15 text-primary font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
              {t("What We Believe", "ما نؤمن به")}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-accent-foreground">{t("Our Values", "قيمنا")}</h2>
          </motion.div>
          <motion.div
            variants={staggerGrid}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
          >
            {values.map((v, i) => (
              <motion.div
                key={i}
                variants={cardVariant}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="flex flex-col items-center text-center p-6 bg-card rounded-2xl border border-card-border hover:shadow-xl hover:border-primary/20 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mb-5">
                  {v.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <WaveDivider bg="var(--color-accent)" fill="var(--color-background)" flip />

      {/* ── Backers & Recognition ─────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div {...sectionReveal} className="text-center mb-12">
            <span className="inline-block bg-primary/10 text-primary font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
              {t("Trusted By", "يثق بنا")}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3">
              {t("Backed & Recognised", "بدعم من ومعترف بها")}
            </h2>
            <p className="text-muted-foreground">
              {t(
                "Trusted by leading investors and recognized by global institutions.",
                "يثق بها كبار المستثمرين ومعترف بها من مؤسسات عالمية."
              )}
            </p>
          </motion.div>
          <motion.div
            variants={staggerGrid}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {recognitions.map((r, i) => (
              <motion.div
                key={i}
                variants={cardVariant}
                whileHover={{ y: -4, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="flex flex-col items-center text-center p-6 bg-card border border-card-border rounded-2xl hover:shadow-lg hover:border-primary/20 transition-all"
              >
                <div className="text-4xl mb-3">{r.logo}</div>
                <p className="font-bold text-sm">{r.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{r.role}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div {...sectionReveal} className="mt-16 bg-primary/8 border border-primary/20 rounded-3xl p-8 md:p-12 text-center">
            <Award className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-serif font-bold mb-3">
              {t("UN Sustainable Development Goals", "أهداف التنمية المستدامة للأمم المتحدة")}
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t(
                "Mumm actively contributes to three UN SDGs: Zero Hunger (#2), Gender Equality (#5), and Decent Work & Economic Growth (#8).",
                "تساهم ممم بنشاط في تحقيق ثلاثة أهداف من أهداف الأمم المتحدة: القضاء على الجوع (#2)، والمساواة بين الجنسين (#5)، والعمل اللائق والنمو الاقتصادي (#8)."
              )}
            </p>
            <div className="flex justify-center gap-4 mt-6 flex-wrap">
              {["🏆 Zero Hunger", "⚖️ Gender Equality", "📈 Economic Growth"].map((goal) => (
                <span key={goal} className="bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full">
                  {goal}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}
