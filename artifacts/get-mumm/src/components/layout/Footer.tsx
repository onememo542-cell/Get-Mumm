import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { WaveDivider } from "@/components/ui/WaveDivider";

const SOCIAL = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/getmumm",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 1.926-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 1.927 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-1.924 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-1.928-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/GetMumm",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/mumm",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/201027671111",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
];

export function Footer() {
  const { t, isRtl } = useLanguage();

  return (
    <>
      <WaveDivider bg="var(--color-background)" fill="var(--color-card)" />
      <footer className="bg-card pt-10 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand column */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-primary">Get Mumm</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {t(
                '"Mumm" is a 7,000-year-old hieroglyphic word for food — the first word every Egyptian toddler learns. We connect talented home chefs with people who miss real, homemade flavors.',
                '"ممم" كلمة هيروغليفية عمرها 7,000 سنة تعني الطعام — أول كلمة يتعلمها كل طفل مصري. نربط الطهاة المنزليين الموهوبين بمن يشتاقون للطعام المنزلي الأصيل.'
              )}
            </p>
            <div className="flex items-center gap-2 pt-2">
              {SOCIAL.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-base mb-4">{t("Quick Links", "روابط سريعة")}</h4>
            <ul className="space-y-3">
              {[
                ["/menu", t("Our Menu", "قائمة الطعام")],
                ["/chefs", t("Meet Our Chefs", "طهاة ممم")],
                ["/for-offices", t("For Offices", "للشركات")],
                ["/subscriptions", t("Mumm Prime", "ممم برايم")],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-base mb-4">{t("Company", "الشركة")}</h4>
            <ul className="space-y-3">
              {[
                ["/about", t("Our Story", "قصتنا")],
                ["/blog", t("Blog & Recipes", "المدونة والوصفات")],
                ["/partner", t("Become a Partner", "انضم كشريك")],
                ["/delivery-areas", t("Delivery Areas", "مناطق التوصيل")],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-base mb-4">{t("Contact", "تواصل معنا")}</h4>
            <ul className="space-y-3 text-sm">
              <li className="text-muted-foreground">
                7, 161 Street, Maadi<br />
                Cairo, Egypt 11728
              </li>
              <li>
                <a href="mailto:info@getmumm.com" className="text-muted-foreground hover:text-primary transition-colors">
                  info@getmumm.com
                </a>
              </li>
              <li>
                <a href="tel:+201027671111" dir="ltr" className={`text-muted-foreground hover:text-primary transition-colors block ${isRtl ? "text-right" : ""}`}>
                  +20 10 27671111
                </a>
              </li>
            </ul>

            {/* App badges */}
            <div className="mt-5 flex flex-col gap-2">
              <a
                href="https://play.google.com/store/apps/details?id=com.getmumm.mummprime"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border hover:border-primary transition-colors text-xs text-muted-foreground hover:text-primary"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a1.986 1.986 0 0 1-.505-1.309V3.123c0-.495.188-.95.504-1.309zM14.54 12.748l2.616 2.616-12.213 7.052 9.597-9.668zm.725-.725l4.575-2.641a1.217 1.217 0 0 1 1.157 2.12l-4.575 2.641-1.157-2.12zm-1.156-2.12L4.512 2.85l12.213 7.053-2.616 2.616z" />
                </svg>
                {t("Google Play", "جوجل بلاي")}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Mumm. {t("All rights reserved.", "جميع الحقوق محفوظة.")}
            {" · "}
            <span className="text-primary/70 font-medium">{t("Founded 2015", "تأسست 2015")}</span>
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("Privacy Policy", "سياسة الخصوصية")}
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("Terms of Service", "شروط الخدمة")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
