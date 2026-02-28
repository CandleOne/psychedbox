import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import CartDrawer from "@/components/CartDrawer";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import Home from "./pages/Home";
import {
  AboutPage,
  CareersPage,
  ContactPage,
  EventsPage,
  FAQPage,
  GiftSubscriptionsPage,
  HowItWorksPage,
  MemberGalleryPage,
  MissionPage,
  MonthlyBoxesPage,
  PastPuzzlesPage,
  PrivacyPage,
  ReturnsPage,
  ShippingPage,
  StoriesPage,
  TermsPage,
} from "./pages/InfoPages";
import Movement from "./pages/Movement";
import FebPodcastBlog from "./pages/blog/FebPodcastBlog";

// Lazy-loaded heavy pages (code splitting)
const Pricing = lazy(() => import("./pages/Pricing"));
const ShopPage = lazy(() => import("./pages/ShopPage"));
const BlogList = lazy(() => import("./pages/BlogList"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));
const CheckoutCancel = lazy(() => import("./pages/CheckoutCancel"));

function LazyFallback() {
  return (
    <div className="flex items-center justify-center py-32">
      <Loader2 size={32} className="animate-spin text-gray-400" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<LazyFallback />}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/pricing"} component={Pricing} />
        <Route path={"/checkout/success"} component={CheckoutSuccess} />
        <Route path={"/checkout/cancel"} component={CheckoutCancel} />
        <Route path={"/login"} component={LoginPage} />
        <Route path={"/signup"} component={SignupPage} />
        <Route path={"/forgot-password"} component={ForgotPasswordPage} />
        <Route path={"/reset-password"} component={ResetPasswordPage} />
        <Route path={"/verify-email"} component={VerifyEmailPage} />
        <Route path={"/account"} component={AccountPage} />
        <Route path={"/admin"} component={AdminPage} />

      <Route path={"/shop"} component={ShopPage} />
      <Route path={"/shop/monthly-boxes"} component={MonthlyBoxesPage} />
      <Route path={"/shop/gift-subscriptions"} component={GiftSubscriptionsPage} />
      <Route path={"/shop/past-puzzles"} component={PastPuzzlesPage} />

      <Route path={"/community/member-gallery"} component={MemberGalleryPage} />
      <Route path={"/community/stories"} component={StoriesPage} />
      <Route path={"/community/events"} component={EventsPage} />

      <Route path={"/about/our-mission"} component={MissionPage} />
      <Route path={"/about/how-it-works"} component={HowItWorksPage} />

      <Route path={"/about-us"} component={AboutPage} />
      <Route path={"/contact"} component={ContactPage} />
      <Route path={"/careers"} component={CareersPage} />

      <Route path={"/faq"} component={FAQPage} />
      <Route path={"/shipping-info"} component={ShippingPage} />
      <Route path={"/returns"} component={ReturnsPage} />

      <Route path={"/privacy-policy"} component={PrivacyPage} />
      <Route path={"/terms-of-service"} component={TermsPage} />

      <Route path={"/blog"} component={BlogList} />
      <Route path={"/blog/:slug"} component={BlogPost} />

      <Route path={"/movement"} component={Movement} />
      <Route path={"/blog/feb-2026-top-psychedelic-podcasts"} component={FebPodcastBlog} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
              <CartDrawer />
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
