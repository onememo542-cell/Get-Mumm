import { useLanguage } from "@/contexts/LanguageContext";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { WaveDivider } from "@/components/ui/WaveDivider";
import { useSubmitContact } from "@/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { sectionReveal } from "@/lib/motion";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    sublabel: "@getmumm · 24K followers",
    sublabelAr: "@getmumm · 24 ألف متابع",
    href: "https://www.instagram.com/getmumm",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 1.926-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 1.927 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-1.924 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-1.928-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    sublabel: "GetMumm · 193K followers",
    sublabelAr: "GetMumm · 193 ألف متابع",
    href: "https://www.facebook.com/GetMumm",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    sublabel: "+20 10 27671111",
    sublabelAr: "+20 10 27671111",
    href: "https://wa.me/201027671111",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  const { t, isRtl } = useLanguage();
  const { toast } = useToast();
  const submitContact = useSubmitContact();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    submitContact.mutate(data, {
        onSuccess: () => {
          toast({
            title: t("Message sent!", "تم إرسال رسالتك!"),
            description: t("We'll get back to you shortly.", "سنرد عليك في أقرب وقت ممكن."),
          });
          form.reset();
        },
        onError: () => {
          toast({
            title: t("Error", "خطأ"),
            description: t("Failed to send message. Please try again.", "فشل إرسال الرسالة. يرجى المحاولة مرة أخرى."),
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <PageWrapper>
      <div className="bg-accent pt-28 sm:pt-32 pb-12">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <motion.div {...sectionReveal}>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              {t("Get in Touch", "تواصل معنا")}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t(
                "Have a question about an order or want to become a chef partner? We'd love to hear from you.",
                "لديك سؤال حول طلب أو تريد الانضمام كشريك؟ يسعدنا تواصلك معنا."
              )}
            </p>
          </motion.div>
        </div>
      </div>

      <WaveDivider bg="var(--color-accent)" fill="var(--color-background)" flip />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12 lg:gap-20">

          {/* Left column — contact info + social */}
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="text-base font-bold mb-5 border-b pb-3 text-muted-foreground uppercase tracking-wider">
                {t("Contact Info", "معلومات الاتصال")}
              </h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-foreground">7, 161 Street</p>
                    <p className="text-muted-foreground">Maadi, Cairo, Egypt 11728</p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <a href="tel:+201027671111" dir="ltr" className={`font-semibold text-sm text-foreground hover:text-primary transition-colors ${isRtl ? "w-full text-right" : ""}`}>
                    +20 10 27671111
                  </a>
                </li>
                <li className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <a href="mailto:info@getmumm.com" className="font-semibold text-sm text-foreground hover:text-primary transition-colors">
                    info@getmumm.com
                  </a>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="text-base font-bold mb-5 border-b pb-3 text-muted-foreground uppercase tracking-wider">
                {t("Follow Us", "تابعنا")}
              </h3>
              <div className="flex flex-col gap-3">
                {SOCIAL_LINKS.map(({ label, sublabel, sublabelAr, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <span className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                      {icon}
                    </span>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground">{isRtl ? sublabelAr : sublabel}</p>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            className="md:col-span-2 bg-card border rounded-3xl p-8 shadow-sm"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Full Name", "الاسم الكامل")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("Your name", "اسمك")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Email", "البريد الإلكتروني")}</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Phone Number (Optional)", "رقم الهاتف (اختياري)")}</FormLabel>
                        <FormControl>
                          <Input placeholder="+20 100 000 0000" {...field} dir="ltr" className={isRtl ? "text-right" : ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Subject (Optional)", "الموضوع (اختياري)")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("How can we help?", "كيف يمكننا المساعدة؟")} {...field} />
                        </FormControl>
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
                      <FormLabel>{t("Message", "الرسالة")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("Tell us more...", "أخبرنا المزيد...")}
                          className="min-h-[150px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" className="w-full h-14 text-base rounded-xl font-bold" disabled={submitContact.isPending}>
                  {submitContact.isPending ? t("Sending...", "جاري الإرسال...") : t("Send Message", "إرسال الرسالة")}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
