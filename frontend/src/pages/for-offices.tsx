import { useLanguage } from "@/contexts/LanguageContext";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { sectionReveal, sectionStagger, sectionItem } from "@/lib/motion";
import { WaveDivider } from "@/components/ui/WaveDivider";
import { useSubmitOfficeInquiry } from "@/api";
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
import { offices, common } from "@/locales";

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
  const { tx, isRtl } = useLanguage();
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
            title: tx(offices.inquirySent),
            description: tx(offices.teamWillContact),
          });
          form.reset();
        },
        onError: () => {
          toast({
            title: tx(common.error),
            description: tx(offices.failedToSend),
            variant: "destructive",
          });
        }
      }
    );
  };

  const benefits = [
    {
      icon: <UtensilsCrossed className="w-8 h-8 text-primary" />,
      title: tx(offices.virtualCafeteria),
      desc: tx(offices.virtualCafeteriaDesc),
    },
    {
      icon: <CalendarClock className="w-8 h-8 text-primary" />,
      title: tx(offices.reliableDelivery),
      desc: tx(offices.reliableDeliveryDesc),
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: tx(offices.highestQuality),
      desc: tx(offices.highestQualityDesc),
    },
    {
      icon: <Building2 className="w-8 h-8 text-primary" />,
      title: tx(offices.flexibleBilling),
      desc: tx(offices.flexibleBillingDesc),
    },
  ];

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-background">
        <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div {...sectionReveal}>
            <span className="inline-block bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-bold mb-6">
              Get Mumm {tx(offices.corporate)}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">
              {tx(offices.heroTitle)}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {tx(offices.heroDesc)}
            </p>
            <div className="flex items-center gap-4">
              <Button size="lg" className="rounded-full px-8 h-14 text-lg" onClick={() => document.getElementById("inquiry-form")?.scrollIntoView({ behavior: "smooth" })}>
                {tx(offices.getQuote)}
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
              {tx(offices.whyMumm)}
            </h2>
            <p className="text-muted-foreground text-lg">
              {tx(offices.whyMummDesc)}
            </p>
          </div>

          <motion.div
            variants={sectionStagger}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-80px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {benefits.map((benefit, i) => (
              <motion.div key={i} variants={sectionItem} className="bg-background border rounded-3xl p-8 hover:shadow-lg transition-shadow">
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
              <h2 className="text-3xl font-serif font-bold mb-4">{tx(offices.formTitle)}</h2>
              <p className="text-muted-foreground">
                {tx(offices.formDesc)}
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
                        <FormLabel>{tx(offices.companyName)}</FormLabel>
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
                        <FormLabel>{tx(offices.contactPerson)}</FormLabel>
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
                        <FormLabel>{tx(offices.workEmail)}</FormLabel>
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
                        <FormLabel>{tx(common.phoneNumber)}</FormLabel>
                        <FormControl><Input {...field} dir="ltr" className={isRtl ? "text-right" : ""} /></FormControl>
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
                        <FormLabel>{tx(offices.numEmployees)}</FormLabel>
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
                        <FormLabel>{tx(offices.officeLocation)}</FormLabel>
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
                        <FormLabel>{tx(offices.frequency)}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger dir={isRtl ? "rtl" : "ltr"}>
                              <SelectValue placeholder={tx(offices.selectFrequency)} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent dir={isRtl ? "rtl" : "ltr"}>
                            <SelectItem value="daily">{tx(offices.daily)}</SelectItem>
                            <SelectItem value="weekly">{tx(offices.weekly)}</SelectItem>
                            <SelectItem value="monthly">{tx(offices.monthly)}</SelectItem>
                            <SelectItem value="one_time">{tx(offices.oneTimeEvent)}</SelectItem>
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
                      <FormLabel>{tx(offices.additionalReqs)}</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[120px]"
                          placeholder={tx(offices.additionalReqsPlaceholder)}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" size="lg" className="w-full h-14 text-lg rounded-xl" disabled={submitInquiry.isPending}>
                  {submitInquiry.isPending ? tx(offices.sending) : tx(offices.submitInquiry)}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
