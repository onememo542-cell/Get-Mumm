import { useLanguage } from "@/contexts/LanguageContext";
import { PageWrapper, fadeInUp, staggerContainer, staggerItem } from "@/components/layout/PageWrapper";
import { WaveDivider } from "@/components/ui/WaveDivider";
import { useSubmitOfficeInquiry } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Building2, UtensilsCrossed, CalendarClock, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const formSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  headCount: z.coerce.number().min(1, "Must be at least 1"),
  deliveryArea: z.string().optional(),
  frequency: z.enum(["daily", "weekly", "monthly", "one_time"]),
  message: z.string().min(10, "Please provide more details"),
});

export default function ForOfficesPage() {
  const { t, isRtl } = useLanguage();
  const { toast } = useToast();
  const submitInquiry = useSubmitOfficeInquiry();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      headCount: 10,
      deliveryArea: "",
      frequency: "weekly",
      message: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    submitInquiry.mutate(
      { data },
      {
        onSuccess: () => {
          toast({
            title: t("Inquiry sent!", "تم إرسال طلبك!"),
            description: t("Our corporate team will contact you shortly.", "سيتواصل معك فريق الشركات قريباً."),
          });
          form.reset();
        },
        onError: () => {
          toast({
            title: t("Error", "خطأ"),
            description: t("Failed to send inquiry.", "فشل إرسال الطلب."),
            variant: "destructive",
          });
        }
      }
    );
  };

  const benefits = [
    {
      icon: <UtensilsCrossed className="w-8 h-8 text-primary" />,
      title: t("Virtual Cafeteria", "كافيتيريا افتراضية"),
      desc: t("Let employees choose their own daily meals from our diverse menu.", "دع موظفيك يختارون وجباتهم اليومية من قائمة طعامنا المتنوعة.")
    },
    {
      icon: <CalendarClock className="w-8 h-8 text-primary" />,
      title: t("Reliable Delivery", "توصيل دقيق"),
      desc: t("Hot, fresh food arrives precisely on time for your team's lunch break.", "طعام ساخن وطازج يصل في الوقت المحدد لاستراحة غداء فريقك.")
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: t("Highest Quality", "أعلى جودة"),
      desc: t("Strict hygiene standards and premium ingredients for every single meal.", "معايير نظافة صارمة ومكونات ممتازة لكل وجبة.")
    },
    {
      icon: <Building2 className="w-8 h-8 text-primary" />,
      title: t("Flexible Billing", "فواتير مرنة"),
      desc: t("Subsidize fully, partially, or let employees pay. Easy monthly invoicing.", "ادعم الوجبات كلياً أو جزئياً. فواتير شهرية ميسرة.")
    }
  ];

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-background">
        <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeInUp}>
            <span className="inline-block bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-bold mb-6">
              Get Mumm {t("Corporate", "للشركات")}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">
              {t("Fuel your team with real food.", "غذي فريقك بطعام حقيقي.")}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {t(
                "Say goodbye to sad desk lunches and unhealthy fast food. Treat your team to authentic, homemade Egyptian meals cooked with love.",
                "وداعاً لغداء المكتب الممل والوجبات السريعة غير الصحية. قدم لفريقك وجبات مصرية أصيلة مطبوخة بحب."
              )}
            </p>
            <div className="flex items-center gap-4">
              <Button size="lg" className="rounded-full px-8 h-14 text-lg" onClick={() => document.getElementById("inquiry-form")?.scrollIntoView({ behavior: "smooth" })}>
                {t("Get a Quote", "احصل على عرض سعر")}
              </Button>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl relative">
              <img 
                src="/office_catering.png" 
                alt="Office catering" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-secondary rounded-full -z-10" />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full -z-10" />
          </motion.div>
        </div>
      </section>

      <WaveDivider bg="var(--color-background)" fill="var(--color-accent)" />

      {/* Benefits */}
      <section className="py-24 bg-accent">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              {t("Why Get Mumm for your office?", "لماذا ممم لشركتك؟")}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t("We make corporate dining simple, delicious, and impactful.", "نجعل طعام الشركات بسيطاً، لذيذاً، وذو أثر إيجابي.")}
            </p>
          </div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {benefits.map((benefit, i) => (
              <motion.div key={i} variants={staggerItem} className="bg-background border rounded-3xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <WaveDivider bg="var(--color-accent)" fill="var(--color-background)" flip />

      {/* Inquiry Form */}
      <section id="inquiry-form" className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-card border rounded-[2.5rem] p-8 md:p-12 shadow-xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif font-bold mb-4">{t("Corporate Inquiry", "طلب للشركات")}</h2>
              <p className="text-muted-foreground">
                {t("Fill out the form below and our team will craft a custom meal plan for your company.", "املأ النموذج أدناه وسيقوم فريقنا بتصميم خطة وجبات مخصصة لشركتك.")}
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Company Name", "اسم الشركة")}</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Contact Person", "اسم مسؤول التواصل")}</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Work Email", "البريد الإلكتروني للعمل")}</FormLabel>
                        <FormControl><Input type="email" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Phone Number", "رقم الهاتف")}</FormLabel>
                        <FormControl><Input {...field} dir="ltr" className={isRtl ? 'text-right' : ''}/></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="headCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Number of Employees", "عدد الموظفين")}</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deliveryArea"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Office Location", "موقع الشركة")}</FormLabel>
                        <FormControl><Input {...field} placeholder="Maadi, New Cairo..." /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Frequency", "معدل التوصيل")}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger dir={isRtl ? "rtl" : "ltr"}>
                              <SelectValue placeholder={t("Select frequency", "اختر المعدل")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent dir={isRtl ? "rtl" : "ltr"}>
                            <SelectItem value="daily">{t("Daily", "يومياً")}</SelectItem>
                            <SelectItem value="weekly">{t("Weekly", "أسبوعياً")}</SelectItem>
                            <SelectItem value="monthly">{t("Monthly", "شهرياً")}</SelectItem>
                            <SelectItem value="one_time">{t("One-time event", "حدث لمرة واحدة")}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Additional Requirements", "متطلبات إضافية")}</FormLabel>
                      <FormControl>
                        <Textarea 
                          className="min-h-[120px]" 
                          placeholder={t("Tell us about your team's dietary needs, budget, or preferred time.", "أخبرنا عن احتياجات فريقك، الميزانية، أو وقت التوصيل المفضل.")}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" size="lg" className="w-full h-14 text-lg rounded-xl" disabled={submitInquiry.isPending}>
                  {submitInquiry.isPending ? t("Sending...", "جاري الإرسال...") : t("Submit Inquiry", "إرسال الطلب")}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
