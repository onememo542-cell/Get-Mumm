import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Moon, Sun, Globe, User, Phone, X, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { AuthModal } from "@/components/auth/AuthModal";

export function Navbar() {
  const { t, language, setLanguage, isRtl } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();
  const [isScrolled, setIsScrolled]       = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen]             = useState(false);
  const [authTab, setAuthTab]               = useState<"login" | "register">("login");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => { setMobileMenuOpen(false); }, [location]);

  // Prevent body scroll when mobile menu or auth modal is open
  useEffect(() => {
    document.body.style.overflow = (mobileMenuOpen || authOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen, authOpen]);

  const navLinks = [
    { href: "/",           label: t("Home",       "الرئيسية") },
    { href: "/menu",       label: t("Menu",        "المنيو")   },
    { href: "/for-offices",label: t("For Offices", "للشركات")  },
    { href: "/about",      label: t("About Us",    "من نحن")   },
    { href: "/blog",       label: t("Blog",        "المدونة")  },
    { href: "/contact",    label: t("Contact",     "تواصل")    },
  ];

  const toggleLanguage = () => setLanguage(language === "en" ? "ar" : "en");
  const toggleTheme    = () => setTheme(theme === "dark" ? "light" : "dark");

  const openAuth = (tab: "login" | "register" = "login") => {
    setAuthTab(tab);
    setAuthOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* ── Main header bar ──────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex flex-col items-start shrink-0 z-50">
            <span className="text-xl sm:text-2xl font-serif font-bold text-primary tracking-tight leading-none">
              Get Mumm
            </span>
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground hidden sm:block mt-0.5">
              {t("Homemade Meals Delivered with Love", "وجبات منزلية بنكهة الحب")}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:text-primary hover:bg-primary/8 ${
                  location === link.href ? "text-primary" : "text-foreground/80"
                }`}
              >
                {link.label}
                {location === link.href && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-primary/10 rounded-lg"
                    transition={{ type: "spring", stiffness: 380, damping: 35 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions row */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold border border-border hover:border-primary hover:text-primary transition-colors"
              aria-label="Toggle language"
            >
              <Globe className="h-3.5 w-3.5" />
              {language === "en" ? "عر" : "EN"}
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Auth icon — visible on all sizes */}
            <button
              onClick={() => openAuth("login")}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Sign in"
              title={t("Sign in", "تسجيل الدخول")}
            >
              <User className="h-4 w-4" />
            </button>

            {/* Phone — md+ only */}
            <a
              href="tel:+201027671111"
              className="hidden md:flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors px-2"
            >
              <Phone className="h-3.5 w-3.5" />
              010 2767 1111
            </a>

            {/* Order Now — sm+ */}
            <Link href="/menu">
              <Button
                size="sm"
                className="hidden sm:inline-flex rounded-full bg-primary text-primary-foreground hover:bg-primary/85 font-bold shadow-sm px-5"
              >
                {t("Order Now", "اطلب الآن")}
              </Button>
            </Link>

            {/* Hamburger — always shows ≡, never X (X lives inside the overlay) */}
            <button
              className="lg:hidden p-2 rounded-full hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile full-screen overlay — z-[55] sits above header (z-50) ──── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-0 z-[55] bg-background lg:hidden flex flex-col overflow-y-auto"
            dir={isRtl ? "rtl" : "ltr"}
          >
            {/* Overlay header — single close button, no duplicate */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
              <div>
                <span className="text-xl font-serif font-bold text-primary block leading-none">Get Mumm</span>
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5 block">
                  {t("Homemade Meals Delivered with Love", "وجبات منزلية بنكهة الحب")}
                </span>
              </div>
              <button
                className="p-2 rounded-full hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col px-4 pt-4 gap-1 flex-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: isRtl ? 16 : -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.22 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center py-3.5 px-4 rounded-xl text-lg font-medium transition-colors ${
                      location === link.href
                        ? "bg-primary/10 text-primary font-bold"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label}
                    {location === link.href && (
                      <span className={`${isRtl ? "mr-auto" : "ml-auto"} w-1.5 h-1.5 rounded-full bg-primary`} />
                    )}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Bottom section */}
            <div className="px-4 pb-8 pt-5 space-y-3 border-t border-border">

              {/* Auth buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => openAuth("login")}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border hover:border-primary hover:text-primary transition-colors text-sm font-semibold"
                >
                  <LogIn className="h-4 w-4" />
                  {t("Sign In", "تسجيل الدخول")}
                </button>
                <button
                  onClick={() => openAuth("register")}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/85 transition-colors text-sm font-semibold"
                >
                  <User className="h-4 w-4" />
                  {t("Register", "إنشاء حساب")}
                </button>
              </div>

              {/* Utility toggles */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={toggleLanguage}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border hover:border-primary hover:text-primary transition-colors text-sm font-medium"
                >
                  <Globe className="h-4 w-4" />
                  {language === "en" ? "العربية" : "English"}
                </button>
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border hover:border-primary hover:text-primary transition-colors text-sm font-medium"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {theme === "dark" ? t("Light Mode", "الوضع الفاتح") : t("Dark Mode", "الوضع الداكن")}
                </button>
              </div>

              {/* Order Now CTA */}
              <Link href="/menu" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full rounded-xl h-12 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/85">
                  {t("Order Now", "اطلب الآن")}
                </Button>
              </Link>

              {/* Phone */}
              <a
                href="tel:+201027671111"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-2"
              >
                <Phone className="h-4 w-4" />
                +20 10 2767 1111
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Auth Modal ──────────────────────────────────────────────────────── */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultTab={authTab}
      />
    </>
  );
}
