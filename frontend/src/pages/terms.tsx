import { useLanguage } from "@/contexts/LanguageContext";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { FileText } from "lucide-react";

export default function TermsPage() {
  const { t, isRtl } = useLanguage();

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-32 max-w-4xl">
        <div className="flex items-center gap-4 mb-8 border-b pb-8">
          <FileText className="w-12 h-12 text-primary" />
          <h1 className="text-4xl font-serif font-bold">
            {t("Terms of Service", "شروط الخدمة")}
          </h1>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">{t("1. Acceptance of Terms", "1. قبول الشروط")}</h2>
            <p className="text-muted-foreground">
              {t("By accessing and using Get Mumm, you accept and agree to be bound by the terms and provision of this agreement.", "بوصولك واستخدامك لمنصة ممم، فإنك تقبل وتوافق على الالتزام بشروط وأحكام هذه الاتفاقية.")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">{t("2. Platform Role", "2. دور المنصة")}</h2>
            <p className="text-muted-foreground">
              {t("Get Mumm acts as a marketplace connecting independent home chefs with customers. While we enforce strict hygiene and quality standards, the chefs are independent contractors.", "تعمل ممم كسوق يربط بين طهاة المنزل المستقلين والعملاء. وبينما نفرض معايير صارمة للنظافة والجودة، فإن الطهاة هم متعاقدون مستقلون.")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">{t("3. Ordering and Cancellation", "3. الطلبات والإلغاء")}</h2>
            <ul className="list-disc pl-6 rtl:pr-6 space-y-2 text-muted-foreground">
              <li>{t("Orders must be placed within the specified timeframes for each chef.", "يجب تقديم الطلبات خلال الأطر الزمنية المحددة لكل شيف.")}</li>
              <li>{t("Cancellations are only accepted before the chef has started preparation.", "تُقبل الإلغاءات فقط قبل أن يبدأ الشيف في التحضير.")}</li>
              <li>{t("Get Mumm reserves the right to cancel orders in case of unforeseen circumstances.", "تحتفظ ممم بالحق في إلغاء الطلبات في حالة الظروف غير المتوقعة.")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">{t("4. Food Allergies", "4. الحساسية الغذائية")}</h2>
            <p className="text-muted-foreground">
              {t("Customers are responsible for explicitly mentioning any food allergies in the order notes. However, Get Mumm cannot guarantee a 100% allergen-free environment.", "يتحمل العملاء مسؤولية ذكر أي حساسية غذائية بوضوح في ملاحظات الطلب. ومع ذلك، لا يمكن لممم ضمان بيئة خالية من مسببات الحساسية بنسبة 100٪.")}
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
