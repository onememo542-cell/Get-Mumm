import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Moon, Sun, Globe, User, X, LogIn, ShoppingCart, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { AuthModal } from "@/components/auth/AuthModal";
import { nav, common } from "@/locales";

/* ─── tiny icon-button shared style ─────────────────────────────────────── */
const iconBtn =
  "relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted transition-colors shrink-0";

export function Navbar() {
  const { tx, language, setLanguage, isRtl } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { totalItems, openCart } = useCart();
  const [location] = useLocation();
  const [isScrolled, setIsScrolled]        = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen]             = useState(false);
  const [authTab, setAuthTab]               = useState<"login" | "register">("login");
  const [notifCount]                        = useState(2); // placeholder — replace with real data

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = (mobileMenuOpen || authOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen, authOpen]);

  const navLinks = [
    { href: "/",            label: tx(nav.home)       },
    { href: "/menu",        label: tx(nav.menu)       },
    { href: "/for-offices", label: tx(nav.forOffices) },
    { href: "/about",       label: tx(nav.aboutUs)    },
    { href: "/blog",        label: tx(nav.blog)       },
    { href: "/contact",     label: tx(nav.contact)    },
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
      {/* ── Main header ──────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled ? "py-2" : "py-3"
        }`}
      >
        {/* Inner pill — floats when scrolled */}
        <motion.div
          animate={isScrolled ? "scrolled" : "top"}
          variants={{
            top:      { borderRadius: "0px",   boxShadow: "none" },
            scrolled: { borderRadius: "999px",  boxShadow: "0 4px 24px 0 hsl(var(--foreground)/0.08)" },
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={`mx-auto transition-all duration-300 ${
            isScrolled
              ? "max-w-4xl px-3 bg-background/95 backdrop-blur-md border border-border"
              : "max-w-7xl px-4 sm:px-6 bg-transparent border border-transparent"
          }`}
        >
          <div className="flex items-center h-12 gap-2">

            {/* Hamburger — left side on mobile only */}
            <button
              className={`lg:hidden ${iconBtn}`}
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="flex flex-col items-center lg:items-start shrink-0 absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:left-auto z-50"
            >
              <span className="text-xl font-serif font-bold text-primary tracking-tight leading-none">
                Get Mumm
              </span>
              <span className="text-[8px] uppercase tracking-widest text-muted-foreground hidden sm:block mt-0.5">
                {tx(nav.tagline)}
              </span>
            </Link>

            {/* Desktop nav — centered */}
            <nav className="hidden lg:flex items-center gap-0.5 mx-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-1.5 text-sm font-medium rounded-full transition-colors hover:text-primary hover:bg-primary/8 ${
                    location === link.href ? "text-primary" : "text-foreground/75"
                  }`}
                >
                  {link.label}
                  {location === link.href && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-primary/10 rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 38 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* ── Actions — right side ──────────────────────────────────── */}
            <div className={`flex items-center gap-0.5 ${isRtl ? "mr-auto lg:mr-0" : "ml-auto lg:ml-0"}`}>

              {/* Language toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-bold border border-border hover:border-primary hover:text-primary transition-colors"
                aria-label="Toggle language"
              >
                <Globe className="h-3 w-3" />
                {language === "en" ? "عر" : "EN"}
              </button>

              {/* Theme */}
              <button onClick={toggleTheme} className={iconBtn} aria-label="Toggle theme">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={theme}
                    initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
                    animate={{ rotate: 0,   opacity: 1, scale: 1   }}
                    exit={   { rotate:  30, opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.22 }}
                    className="flex items-center justify-center"
                  >
                    {theme === "dark"
                      ? <Sun  className="h-4 w-4" />
                      : <Moon className="h-4 w-4" />
                    }
                  </motion.span>
                </AnimatePresence>
              </button>

              {/* Notification bell */}
              <button
                className={iconBtn}
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                <AnimatePresence>
                  {notifCount > 0 && (
                    <motion.span
                      key="notif-badge"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 440, damping: 22 }}
                      className={`absolute top-0.5 ${isRtl ? "left-0.5" : "right-0.5"} min-w-[16px] h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 shadow-sm`}
                    >
                      {notifCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Auth */}
              <button
                onClick={() => openAuth("login")}
                className={`${iconBtn} hidden sm:flex`}
                aria-label="Sign in"
              >
                <User className="h-4 w-4" />
              </button>

              {/* Cart */}
              <button onClick={openCart} className={iconBtn} aria-label="Open cart">
                <ShoppingCart className="h-4 w-4" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      key="cart-badge"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 22 }}
                      className={`absolute top-0.5 ${isRtl ? "left-0.5" : "right-0.5"} min-w-[16px] h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 shadow-sm`}
                    >
                      {totalItems > 99 ? "99+" : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </motion.div>
      </header>

      {/* ── Mobile overlay ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0   }}
            exit={{ opacity: 0, y: -16    }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[55] bg-background lg:hidden flex flex-col"
            dir={isRtl ? "rtl" : "ltr"}
          >
            {/* Overlay header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
              <div className="flex flex-col">
                <span className="text-xl font-serif font-bold text-primary leading-none">Get Mumm</span>
                <span className="text-[8px] uppercase tracking-widest text-muted-foreground mt-1">
                  {tx(nav.tagline)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {/* Cart */}
                <button
                  onClick={() => { setMobileMenuOpen(false); openCart(); }}
                  className={iconBtn}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <AnimatePresence>
                    {totalItems > 0 && (
                      <motion.span
                        key="mobile-cart-badge"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className={`absolute top-0.5 ${isRtl ? "left-0.5" : "right-0.5"} min-w-[16px] h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center px-0.5`}
                      >
                        {totalItems}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
                {/* Close */}
                <button
                  className={iconBtn}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col px-4 pt-4 gap-1 flex-1 overflow-y-auto">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: isRtl ? 18 : -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.22, ease: [0.22,1,0.36,1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center py-3.5 px-4 rounded-2xl text-lg font-medium transition-colors ${
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
            <div className="px-4 pb-8 pt-4 space-y-2.5 border-t border-border">
              {/* Auth */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => openAuth("login")}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-border hover:border-primary hover:text-primary transition-colors text-sm font-semibold"
                >
                  <LogIn className="h-4 w-4" />
                  {tx(common.signIn)}
                </button>
                <button
                  onClick={() => openAuth("register")}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/85 transition-colors text-sm font-semibold"
                >
                  <User className="h-4 w-4" />
                  {tx(common.register)}
                </button>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={toggleLanguage}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-border hover:border-primary hover:text-primary transition-colors text-sm font-medium"
                >
                  <Globe className="h-4 w-4" />
                  {language === "en" ? "العربية" : "English"}
                </button>
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-border hover:border-primary hover:text-primary transition-colors text-sm font-medium"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {theme === "dark" ? tx(nav.lightMode) : tx(nav.darkMode)}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Auth Modal ─────────────────────────────────────────────────── */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultTab={authTab}
      />
    </>
  );
}
