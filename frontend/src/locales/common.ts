// Strings shared across two or more feature domains.
// Usage: const { tx } = useLanguage(); → tx(common.egp)

export const common = {
  egp:            ["EGP",        "ج.م"],
  error:          ["Error",      "خطأ"],
  total:          ["Total",      "الإجمالي"],
  subtotal:       ["Subtotal",   "المجموع الفرعي"],
  delivery:       ["Delivery",   "التوصيل"],
  free:           ["Free",       "مجاني"],
  signIn:         ["Sign In",    "تسجيل الدخول"],
  register:       ["Register",   "إنشاء حساب"],
  fullName:       ["Full Name",  "الاسم الكامل"],
  phoneNumber:    ["Phone Number", "رقم الهاتف"],
  addToCart:      ["Add to Cart",    "أضف للسلة"],
  addedToCart:    ["Added to cart!", "أُضيف إلى السلة!"],
  cartEmpty:      ["Your cart is empty", "سلتك فارغة"],
  forOffices:     ["For Offices", "للشركات"],
  learnMore:      ["Learn More",  "اعرف المزيد"],
  comingSoon:     ["Coming Soon", "قريباً"],
  home:           ["Home",       "الرئيسية"],
  menu:           ["Menu",       "القائمة"],
  browseMenu:     ["Browse Menu","تصفح المنيو"],
  backToHome:     ["Back to Home","العودة للرئيسية"],
  needHelp:       ["Need help?", "تحتاج مساعدة؟"],
} as const;
