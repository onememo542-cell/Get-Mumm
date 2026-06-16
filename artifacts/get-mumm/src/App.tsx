import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import { pageVariants } from "@/lib/motion";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Home is kept eager — first paint is instant
import Home from "@/pages/home";

// All secondary pages are lazy-loaded — dramatically reduces initial bundle
const MenuPage            = lazy(() => import("@/pages/menu"));
const MenuItemPage        = lazy(() => import("@/pages/menu/[id]"));
const ChefsPage           = lazy(() => import("@/pages/chefs"));
const BlogPage            = lazy(() => import("@/pages/blog"));
const BlogPostPage        = lazy(() => import("@/pages/blog/[slug]"));
const ForOfficesPage      = lazy(() => import("@/pages/for-offices"));
const AboutPage           = lazy(() => import("@/pages/about"));
const SubscriptionsPage   = lazy(() => import("@/pages/subscriptions"));
const ContactPage         = lazy(() => import("@/pages/contact"));
const PrivacyPage         = lazy(() => import("@/pages/privacy"));
const TermsPage           = lazy(() => import("@/pages/terms"));
const DeliveryAreasPage   = lazy(() => import("@/pages/delivery-areas"));
const PartnerPage         = lazy(() => import("@/pages/partner"));
const CheckoutPage        = lazy(() => import("@/pages/checkout"));
const OrderConfirmationPage = lazy(() => import("@/pages/order-confirmation"));
const OrderTrackingPage   = lazy(() => import("@/pages/order-tracking"));
const NotFound            = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function PageSpinner() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-5">
      <div className="w-9 h-9 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground select-none">
        Get Mumm
      </span>
    </div>
  );
}

function AnimatedRoutes() {
  const [location] = useLocation();

  return (
    <Suspense fallback={<PageSpinner />}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location}
          variants={pageVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          className="flex-1 flex flex-col"
          style={{ willChange: "opacity, transform, filter" }}
        >
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/menu" component={MenuPage} />
            <Route path="/menu/:id" component={MenuItemPage} />
            <Route path="/chefs" component={ChefsPage} />
            <Route path="/blog" component={BlogPage} />
            <Route path="/blog/:slug" component={BlogPostPage} />
            <Route path="/for-offices" component={ForOfficesPage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/subscriptions" component={SubscriptionsPage} />
            <Route path="/contact" component={ContactPage} />
            <Route path="/privacy" component={PrivacyPage} />
            <Route path="/terms" component={TermsPage} />
            <Route path="/delivery-areas" component={DeliveryAreasPage} />
            <Route path="/partner" component={PartnerPage} />
            <Route path="/checkout" component={CheckoutPage} />
            <Route path="/order-confirmation" component={OrderConfirmationPage} />
            <Route path="/order/:id" component={OrderTrackingPage} />
            <Route component={NotFound} />
          </Switch>
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
}

function Router() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 flex flex-col">
        <AnimatedRoutes />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="get-mumm:theme">
        <LanguageProvider>
          <CartProvider>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <ErrorBoundary>
                  <Router />
                </ErrorBoundary>
              </WouterRouter>
              <Toaster />
            </TooltipProvider>
          </CartProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
