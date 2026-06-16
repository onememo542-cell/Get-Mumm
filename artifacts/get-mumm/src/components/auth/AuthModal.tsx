import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ease } from "@/lib/motion";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
}

export function AuthModal({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) {
  const { t, isRtl } = useLanguage();
  const { toast } = useToast();
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ name: "", email: "", password: "" });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: t("Welcome back!", "أهلاً بعودتك!"),
        description: t("You're signed in to Get Mumm.", "تم تسجيل دخولك إلى ممم."),
      });
      onClose();
    }, 900);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name || !regForm.email || !regForm.password) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: t("Account created!", "تم إنشاء حسابك!"),
        description: t("Welcome to Get Mumm.", "أهلاً بك في ممم."),
      });
      onClose();
    }, 900);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 32, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.32, ease: ease.out }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[61] max-w-md mx-auto"
            dir={isRtl ? "rtl" : "ltr"}
          >
            <div className="bg-card border border-border rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-0">
                <div>
                  <h2 className="text-2xl font-serif font-bold">
                    {tab === "login" ? t("Welcome back", "أهلاً بعودتك") : t("Create account", "إنشاء حساب")}
                  </h2>
                  <p className="text-muted-foreground text-sm mt-0.5">
                    {tab === "login"
                      ? t("Sign in to track your orders.", "سجل دخولك لتتابع طلباتك.")
                      : t("Join Get Mumm today.", "انضم إلى ممم اليوم.")}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted transition-colors shrink-0"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab switcher */}
              <div className="px-6 pt-5">
                <div className="flex bg-muted rounded-xl p-1 relative">
                  <motion.div
                    layoutId="auth-tab-bg"
                    className="absolute top-1 bottom-1 rounded-lg bg-card shadow-sm"
                    style={{ width: "calc(50% - 4px)", left: tab === "login" ? 4 : "calc(50%)" }}
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                  {(["login", "register"] as const).map((t_) => (
                    <button
                      key={t_}
                      onClick={() => { setTab(t_); setShowPass(false); }}
                      className={`relative z-10 flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
                        tab === t_ ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t_ === "login" ? t("Sign In", "تسجيل الدخول") : t("Register", "إنشاء حساب")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Forms */}
              <div className="px-6 pb-6 pt-4">
                <AnimatePresence mode="wait">
                  {tab === "login" ? (
                    <motion.form
                      key="login"
                      initial={{ opacity: 0, x: isRtl ? 16 : -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isRtl ? -16 : 16 }}
                      transition={{ duration: 0.22, ease: ease.out }}
                      onSubmit={handleLogin}
                      className="space-y-4"
                    >
                      <div className="relative">
                        <Mail className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none ${isRtl ? "right-3.5" : "left-3.5"}`} />
                        <Input
                          type="email"
                          placeholder={t("Email address", "البريد الإلكتروني")}
                          className={`h-11 ${isRtl ? "pr-10" : "pl-10"}`}
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="relative">
                        <Lock className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none ${isRtl ? "right-3.5" : "left-3.5"}`} />
                        <Input
                          type={showPass ? "text" : "password"}
                          placeholder={t("Password", "كلمة المرور")}
                          className={`h-11 ${isRtl ? "pr-10 pl-10" : "pl-10 pr-10"}`}
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors ${isRtl ? "left-3.5" : "right-3.5"}`}
                        >
                          {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <div className="flex justify-end">
                        <button type="button" className="text-xs text-primary hover:underline">
                          {t("Forgot password?", "نسيت كلمة المرور؟")}
                        </button>
                      </div>
                      <Button
                        type="submit"
                        className="w-full h-11 rounded-xl font-bold text-base"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            {t("Signing in…", "جاري الدخول…")}
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            {t("Sign In", "تسجيل الدخول")}
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        )}
                      </Button>
                      <p className="text-center text-sm text-muted-foreground">
                        {t("Don't have an account?", "ليس لديك حساب؟")}{" "}
                        <button type="button" onClick={() => setTab("register")} className="text-primary font-semibold hover:underline">
                          {t("Register", "سجل الآن")}
                        </button>
                      </p>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="register"
                      initial={{ opacity: 0, x: isRtl ? -16 : 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isRtl ? 16 : -16 }}
                      transition={{ duration: 0.22, ease: ease.out }}
                      onSubmit={handleRegister}
                      className="space-y-4"
                    >
                      <div className="relative">
                        <User className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none ${isRtl ? "right-3.5" : "left-3.5"}`} />
                        <Input
                          type="text"
                          placeholder={t("Full name", "الاسم الكامل")}
                          className={`h-11 ${isRtl ? "pr-10" : "pl-10"}`}
                          value={regForm.name}
                          onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="relative">
                        <Mail className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none ${isRtl ? "right-3.5" : "left-3.5"}`} />
                        <Input
                          type="email"
                          placeholder={t("Email address", "البريد الإلكتروني")}
                          className={`h-11 ${isRtl ? "pr-10" : "pl-10"}`}
                          value={regForm.email}
                          onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="relative">
                        <Lock className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none ${isRtl ? "right-3.5" : "left-3.5"}`} />
                        <Input
                          type={showPass ? "text" : "password"}
                          placeholder={t("Create password", "إنشاء كلمة مرور")}
                          className={`h-11 ${isRtl ? "pr-10 pl-10" : "pl-10 pr-10"}`}
                          value={regForm.password}
                          onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors ${isRtl ? "left-3.5" : "right-3.5"}`}
                        >
                          {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <Button
                        type="submit"
                        className="w-full h-11 rounded-xl font-bold text-base"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            {t("Creating account…", "جاري إنشاء الحساب…")}
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            {t("Create Account", "إنشاء الحساب")}
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        )}
                      </Button>
                      <p className="text-center text-sm text-muted-foreground">
                        {t("Already have an account?", "لديك حساب بالفعل؟")}{" "}
                        <button type="button" onClick={() => setTab("login")} className="text-primary font-semibold hover:underline">
                          {t("Sign In", "تسجيل الدخول")}
                        </button>
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Divider */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">{t("or continue with", "أو تابع مع")}</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Social auth */}
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 h-10 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </button>
                  <button className="flex items-center justify-center gap-2 h-10 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                    </svg>
                    Facebook
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
