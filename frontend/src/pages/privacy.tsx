import { useLanguage } from "@/contexts/LanguageContext";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ShieldAlert } from "lucide-react";

export default function PrivacyPage() {
  const { t, isRtl } = useLanguage();

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-32 max-w-4xl">
        <div className="flex items-center gap-4 mb-8 border-b pb-8">
          <ShieldAlert className="w-12 h-12 text-primary" />
          <h1 className="text-4xl font-serif font-bold">
            {t("Privacy Policy", "سياسة الخصوصية")}
          </h1>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">{t("1. Information We Collect", "1. المعلومات التي نجمعها")}</h2>
            <p className="text-muted-foreground">
              {t("When you use Get Mumm, we collect personal information you provide to us directly, such as your name, email address, phone number, and delivery address. We also collect order history and dietary preferences to improve your experience.", "عند استخدامك لمنصة ممم، نقوم بجمع المعلومات الشخصية التي تقدمها لنا مباشرة، مثل اسمك وبريدك الإلكتروني ورقم هاتفك وعنوان التوصيل. كما نجمع سجل الطلبات وتفضيلاتك الغذائية لتحسين تجربتك.")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">{t("2. How We Use Your Information", "2. كيف نستخدم معلوماتك")}</h2>
            <ul className="list-disc pl-6 rtl:pr-6 space-y-2 text-muted-foreground">
              <li>{t("To process and deliver your orders via our home chefs.", "لمعالجة وتوصيل طلباتك عبر طهاة المنزل لدينا.")}</li>
              <li>{t("To communicate with you regarding your order status.", "للتواصل معك بشأن حالة طلبك.")}</li>
              <li>{t("To send promotional offers (only if you opt-in).", "لإرسال العروض الترويجية (فقط في حال موافقتك).")}</li>
              <li>{t("To improve our platform and services.", "لتحسين منصتنا وخدماتنا.")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">{t("3. Sharing with Third Parties", "3. مشاركة المعلومات مع أطراف ثالثة")}</h2>
            <p className="text-muted-foreground">
              {t("We only share your delivery details (name, phone, address) with the chef preparing your food and the courier delivering it. We do not sell your personal data to marketing agencies.", "نشارك فقط تفاصيل التوصيل الخاصة بك (الاسم، الهاتف، العنوان) مع الشيف الذي يحضر طعامك ومندوب التوصيل. نحن لا نبيع بياناتك الشخصية لوكالات التسويق.")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">{t("4. Data Security", "4. أمن البيانات")}</h2>
            <p className="text-muted-foreground">
              {t("We implement industry-standard security measures to protect your personal information from unauthorized access or disclosure.", "نحن نطبق معايير الأمان المعتمدة في الصناعة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو الكشف عنها.")}
            </p>
          </section>

          <p className="text-sm text-muted-foreground mt-12 pt-8 border-t">
            {t("Last updated: November 2023", "آخر تحديث: نوفمبر 2023")}
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
