import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Mail, Lock, User, LogIn, UserPlus, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const [remember, setRemember] = useState(false);

  const [loginForm, setLoginForm]   = useState({ email: "", password: "" });
  const [regForm, setRegForm]       = useState({ name: "", email: "", password: "" });

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

  const iconSide = (side: "l" | "r") => {
    if (side === "l") return isRtl ? "right-3.5" : "left-3.5";
    return isRtl ? "left-3.5" : "right-3.5";
  };
  const padL = isRtl ? "pr-10" : "pl-10";
  const padLR = isRtl ? "pr-10 pl-10" : "pl-10 pr-10";

  const inputCls =
    "w-full h-12 rounded-xl text-sm text-white placeholder:text-white/25 " +
    "bg-[#222220] border border-white/[0.08] " +
    "focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20 " +
    "transition-all duration-200";

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
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 36, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.3, ease: ease.out }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[61] max-w-sm mx-auto"
            dir={isRtl ? "rtl" : "ltr"}
          >
            {/* Card */}
            <div
              className="relative overflow-hidden rounded-[28px]"
              style={{
                background: "#17161a",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 40px 80px rgba(0,0,0,0.65), 0 0 0 0.5px rgba(255,255,255,0.04) inset",
              }}
            >
              {/* Amber top glow */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-40"
                style={{
                  background: "radial-gradient(ellipse 60% 60% at 50% -10%, rgba(245,200,60,0.12) 0%, transparent 100%)",
                }}
              />

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 z-10 p-1.5 rounded-full transition-colors"
                style={{
                  right: isRtl ? "auto" : 16,
                  left: isRtl ? 16 : "auto",
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.4)",
                }}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="px-7 pb-7 pt-6 relative">
                {/* Shield icon badge */}
                <div className="flex justify-center mb-4">
                  <div
                    className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center"
                    style={{
                      background: "#242220",
                      border: "1px solid rgba(255,255,255,0.09)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                    }}
                  >
                    <ShieldCheck className="w-6 h-6 text-amber-400" />
                  </div>
                </div>

                {/* Title */}
                <div className="text-center mb-5">
                  <h2 className="text-xl font-bold text-white tracking-tight mb-1">
                    {tab === "login"
                      ? t("Welcome to Mumm", "أهلاً في ممم")
                      : t("Join Get Mumm", "انضم إلى ممم")}
                  </h2>
                  <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.38)" }}>
                    {tab === "login"
                      ? t("Sign in to track your orders", "سجل الدخول لمتابعة طلباتك")
                      : t("Create your free account today", "أنشئ حسابك المجاني الآن")}
                  </p>
                </div>

                {/* Tab pills */}
                <div
                  className="flex rounded-xl p-[3px] mb-5 relative"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <motion.div
                    layoutId="dark-tab-bg"
                    className="absolute top-[3px] bottom-[3px] rounded-[10px]"
                    style={{
                      width: "calc(50% - 3px)",
                      left: tab === "login" ? 3 : "calc(50%)",
                      background: "rgba(255,255,255,0.09)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                    }}
                    transition={{ type: "spring", stiffness: 460, damping: 38 }}
                  />
                  {(["login", "register"] as const).map((t_) => (
                    <button
                      key={t_}
                      onClick={() => { setTab(t_); setShowPass(false); }}
                      className="relative z-10 flex-1 py-2 text-xs font-semibold rounded-[10px] transition-colors"
                      style={{ color: tab === t_ ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)" }}
                    >
                      {t_ === "login" ? t("Sign In", "تسجيل الدخول") : t("Register", "إنشاء حساب")}
                    </button>
                  ))}
                </div>

                {/* Forms */}
                <AnimatePresence mode="wait">
                  {tab === "login" ? (
                    <motion.form
                      key="login"
                      initial={{ opacity: 0, x: isRtl ? 14 : -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isRtl ? -14 : 14 }}
                      transition={{ duration: 0.2, ease: ease.out }}
                      onSubmit={handleLogin}
                      className="space-y-3"
                    >
                      {/* Email */}
                      <div>
                        <label
                          className="block mb-1.5 text-[10px] font-semibold tracking-[0.11em] uppercase"
                          style={{ color: "rgba(255,255,255,0.38)" }}
                        >
                          {t("Email Address", "البريد الإلكتروني")}
                        </label>
                        <div className="relative">
                          <Mail className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${iconSide("l")}`} style={{ color: "rgba(255,255,255,0.28)" }} />
                          <input
                            type="email"
                            placeholder={t("Enter your email", "أدخل بريدك الإلكتروني")}
                            className={`${inputCls} ${padL}`}
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <label
                          className="block mb-1.5 text-[10px] font-semibold tracking-[0.11em] uppercase"
                          style={{ color: "rgba(255,255,255,0.38)" }}
                        >
                          {t("Passcode", "كلمة المرور")}
                        </label>
                        <div className="relative">
                          <Lock className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${iconSide("l")}`} style={{ color: "rgba(255,255,255,0.28)" }} />
                          <input
                            type={showPass ? "text" : "password"}
                            placeholder="••••••••"
                            className={`${inputCls} ${padLR}`}
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className={`absolute top-1/2 -translate-y-1/2 transition-colors ${iconSide("r")}`}
                            style={{ color: "rgba(255,255,255,0.3)" }}
                          >
                            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Remember + Forgot */}
                      <div className="flex items-center justify-between pt-0.5">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                            className="w-3.5 h-3.5 rounded accent-amber-400"
                            style={{ accentColor: "#f5c83a" }}
                          />
                          <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                            {t("Maintain session", "حفظ الجلسة")}
                          </span>
                        </label>
                        <button
                          type="button"
                          className="text-[11px] font-medium transition-colors"
                          style={{ color: "#f5c83a" }}
                        >
                          {t("Recover access", "استعادة الوصول")}
                        </button>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 mt-1 transition-all active:scale-[0.98] disabled:opacity-70"
                        style={{
                          background: loading
                            ? "rgba(245,200,60,0.5)"
                            : "linear-gradient(135deg, #f5c83a 0%, #e8a020 100%)",
                          color: "#1a1300",
                          boxShadow: loading ? "none" : "0 6px 24px rgba(245,185,40,0.30)",
                        }}
                      >
                        {loading ? (
                          <>
                            <span
                              className="w-4 h-4 rounded-full border-2 animate-spin"
                              style={{ borderColor: "rgba(0,0,0,0.15)", borderTopColor: "rgba(0,0,0,0.55)" }}
                            />
                            {t("Signing in…", "جاري الدخول…")}
                          </>
                        ) : (
                          <>
                            {t("Authenticate", "تسجيل الدخول")}
                            <LogIn className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <p className="text-center text-[11px] pt-1" style={{ color: "rgba(255,255,255,0.28)" }}>
                        {t("Don't have an account?", "ليس لديك حساب؟")}{" "}
                        <button
                          type="button"
                          onClick={() => setTab("register")}
                          className="font-semibold transition-colors"
                          style={{ color: "#f5c83a" }}
                        >
                          {t("Register", "سجل الآن")}
                        </button>
                      </p>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="register"
                      initial={{ opacity: 0, x: isRtl ? -14 : 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isRtl ? 14 : -14 }}
                      transition={{ duration: 0.2, ease: ease.out }}
                      onSubmit={handleRegister}
                      className="space-y-3"
                    >
                      {/* Name */}
                      <div>
                        <label
                          className="block mb-1.5 text-[10px] font-semibold tracking-[0.11em] uppercase"
                          style={{ color: "rgba(255,255,255,0.38)" }}
                        >
                          {t("Full Name", "الاسم الكامل")}
                        </label>
                        <div className="relative">
                          <User className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${iconSide("l")}`} style={{ color: "rgba(255,255,255,0.28)" }} />
                          <input
                            type="text"
                            placeholder={t("Your full name", "اسمك الكامل")}
                            className={`${inputCls} ${padL}`}
                            value={regForm.name}
                            onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          className="block mb-1.5 text-[10px] font-semibold tracking-[0.11em] uppercase"
                          style={{ color: "rgba(255,255,255,0.38)" }}
                        >
                          {t("Email Address", "البريد الإلكتروني")}
                        </label>
                        <div className="relative">
                          <Mail className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${iconSide("l")}`} style={{ color: "rgba(255,255,255,0.28)" }} />
                          <input
                            type="email"
                            placeholder={t("Enter your email", "أدخل بريدك الإلكتروني")}
                            className={`${inputCls} ${padL}`}
                            value={regForm.email}
                            onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <label
                          className="block mb-1.5 text-[10px] font-semibold tracking-[0.11em] uppercase"
                          style={{ color: "rgba(255,255,255,0.38)" }}
                        >
                          {t("Passcode", "كلمة المرور")}
                        </label>
                        <div className="relative">
                          <Lock className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${iconSide("l")}`} style={{ color: "rgba(255,255,255,0.28)" }} />
                          <input
                            type={showPass ? "text" : "password"}
                            placeholder="••••••••"
                            className={`${inputCls} ${padLR}`}
                            value={regForm.password}
                            onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                            required
                            minLength={6}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className={`absolute top-1/2 -translate-y-1/2 transition-colors ${iconSide("r")}`}
                            style={{ color: "rgba(255,255,255,0.3)" }}
                          >
                            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 mt-1 transition-all active:scale-[0.98] disabled:opacity-70"
                        style={{
                          background: loading
                            ? "rgba(245,200,60,0.5)"
                            : "linear-gradient(135deg, #f5c83a 0%, #e8a020 100%)",
                          color: "#1a1300",
                          boxShadow: loading ? "none" : "0 6px 24px rgba(245,185,40,0.30)",
                        }}
                      >
                        {loading ? (
                          <>
                            <span
                              className="w-4 h-4 rounded-full border-2 animate-spin"
                              style={{ borderColor: "rgba(0,0,0,0.15)", borderTopColor: "rgba(0,0,0,0.55)" }}
                            />
                            {t("Creating account…", "جاري إنشاء الحساب…")}
                          </>
                        ) : (
                          <>
                            {t("Create Account", "إنشاء الحساب")}
                            <UserPlus className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <p className="text-center text-[11px] pt-1" style={{ color: "rgba(255,255,255,0.28)" }}>
                        {t("Already have an account?", "لديك حساب بالفعل؟")}{" "}
                        <button
                          type="button"
                          onClick={() => setTab("login")}
                          className="font-semibold transition-colors"
                          style={{ color: "#f5c83a" }}
                        >
                          {t("Sign In", "تسجيل الدخول")}
                        </button>
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Divider + Social auth */}
                <div className="mt-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                    <span className="text-[10px] font-medium tracking-wide" style={{ color: "rgba(255,255,255,0.25)" }}>
                      {t("OR CONTINUE WITH", "أو تابع مع")}
                    </span>
                    <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </button>
                    <button
                      type="button"
                      className="h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                      </svg>
                      Facebook
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
