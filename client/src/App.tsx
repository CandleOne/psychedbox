import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import CheckoutCancel from "./pages/CheckoutCancel";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import {
  AboutPage,
  AccountPage,
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
import ShopPage from "./pages/ShopPage";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/pricing"} component={Pricing} />
      <Route path={"/checkout/success"} component={CheckoutSuccess} />
      <Route path={"/checkout/cancel"} component={CheckoutCancel} />
      <Route path={"/account"} component={AccountPage} />

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

      <Route path={"/movement"} component={Movement} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
