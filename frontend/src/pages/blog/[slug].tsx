import { useLanguage } from "@/contexts/LanguageContext";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useGetBlogPost, getGetBlogPostQueryKey } from "@/api";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";

export default function BlogPostPage() {
  const { slug } = useParams();
  const { t, isRtl } = useLanguage();

  useSEO({
    title: t("Stories & Recipes", "قصص ووصفات"),
    description: t(
      "Discover Egypt's culinary heritage and authentic homemade recipes.",
      "اكتشف التراث الغني للطبخ المصري والوصفات المنزلية الأصيلة."
    ),
  });

  const { data: post, isLoading } = useGetBlogPost(slug || "", {
    query: { enabled: !!slug, queryKey: getGetBlogPostQueryKey(slug || "") }
  });

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-4 py-24 max-w-4xl">
          <Skeleton className="h-[400px] w-full rounded-3xl mb-12" />
          <Skeleton className="h-12 w-3/4 mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (!post) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-4 py-32 text-center">
          <h2 className="text-3xl font-bold mb-4">{t("Post not found", "لم يتم العثور على المقال")}</h2>
          <Link href="/blog">
            <Button>{t("Back to Blog", "العودة للمدونة")}</Button>
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="relative pt-32 pb-20 bg-background overflow-hidden border-b border-border">
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:underline mb-8 font-medium">
            {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            {t("Back to Blog", "العودة للمدونة")}
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
              {post.type === 'recipe' ? t("Recipe", "وصفة") : t("Story", "قصة")}
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground font-medium">
              <Clock className="w-4 h-4" />
              {post.readTimeMinutes} {t("min read", "دقائق للقراءة")}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-8">
            {isRtl ? post.titleAr : post.title}
          </h1>

          <div className="flex items-center justify-between border-t border-border pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-lg">
                {(isRtl ? post.authorAr : post.author).charAt(0)}
              </div>
              <div>
                <p className="font-bold">{isRtl ? post.authorAr : post.author}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(post.publishedAt).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <img 
          src={post.imageUrl || "/fatta.png"} 
          alt={isRtl ? post.titleAr : post.title}
          className="w-full aspect-[21/9] object-cover rounded-3xl mb-16 shadow-lg"
        />

        <div 
          className="prose prose-lg dark:prose-invert prose-p:leading-relaxed prose-headings:font-serif max-w-none"
          dangerouslySetInnerHTML={{ __html: isRtl ? post.contentAr : post.content }}
        />

        {post.tags && post.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-border">
            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
              {t("Tags", "الوسوم")}
            </h4>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="bg-muted text-muted-foreground px-3 py-1.5 rounded-lg text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
