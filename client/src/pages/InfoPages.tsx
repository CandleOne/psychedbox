import GenericPage from "./GenericPage";
import SiteFooter from "@/components/SiteFooter";
import SiteNavbar from "@/components/SiteNavbar";
import { useSEO } from "@/hooks/useSEO";
import { useJsonLd } from "@/hooks/useJsonLd";

function PageShell({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <SiteNavbar />

      <section style={{ backgroundColor: "#FF6B6B" }} className="px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/80 text-xs uppercase tracking-[0.2em] font-bold mb-4">{eyebrow}</p>
          <h1 className="text-white text-4xl md:text-6xl font-black leading-tight max-w-3xl mb-6">{title}</h1>
          <p className="text-white text-lg md:text-xl max-w-3xl">{description}</p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">{children}</div>
      </section>

      <SiteFooter />
    </div>
  );
}

function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <article className="rounded-xl border border-gray-200 p-6 bg-white">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </article>
  );
}

export function AccountPage() {
  useSEO({
    title: "Your Account — Manage Your Subscription",
    description: "Manage your PsychedBox subscription, track deliveries, update billing, and set your preferences all in one place.",
    canonical: "/account",
  });

  return (
    <PageShell
      eyebrow="Account"
      title="Your Account"
      description="Everything you need to manage your membership, deliveries, and preferences in one place."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard title="Manage Subscription" description="Switch plans, update billing details, and review renewal dates with full control." />
        <InfoCard title="Track Deliveries" description="Check shipping status for your current and upcoming boxes with order visibility." />
        <InfoCard title="Member Preferences" description="Set content preferences and email settings so your experience stays personalized." />
        <InfoCard title="Need Help Fast" description="Contact support directly from your account for shipping, billing, or membership questions." />
      </div>
    </PageShell>
  );
}

export function MonthlyBoxesPage() {
  return (
    <GenericPage
      eyebrow="Shop"
      title="Monthly Boxes"
      description="Explore monthly puzzle boxes featuring community stories, themed goodies, and exclusive content."
      canonical="/shop/monthly-boxes"
      seoTitle="Monthly Subscription Boxes — Psychedelic Puzzle Art & Goodies"
      seoDescription="Subscribe to PsychedBox and receive a monthly puzzle portrait of an inspiring psychedelic community member, curated themed goodies, and their story. Plans from $29/mo."
    />
  );
}

export function GiftSubscriptionsPage() {
  return (
    <GenericPage
      eyebrow="Shop"
      title="Gift Subscriptions"
      description="Send PsychedBox as a thoughtful gift and share discovery with someone you care about."
      canonical="/shop/gift-subscriptions"
      seoTitle="Gift a PsychedBox Subscription — Unique Psychedelic Art Gift"
      seoDescription="Give the gift of discovery. PsychedBox gift subscriptions include monthly puzzle art, community stories, and curated goodies. A truly unique gift for any occasion."
    />
  );
}

export function PastPuzzlesPage() {
  return (
    <GenericPage
      eyebrow="Shop"
      title="Past Puzzles"
      description="Browse previous featured community members and revisit past puzzle drops."
      canonical="/shop/past-puzzles"
      seoTitle="Past Puzzle Drops — Previous Featured Community Members"
      seoDescription="Browse past PsychedBox puzzle portraits featuring inspiring members of the psychedelic community. Revisit their stories and explore previous monthly drops."
    />
  );
}

export function MemberGalleryPage() {
  return (
    <GenericPage
      eyebrow="Community"
      title="Member Gallery"
      description="See puzzle builds, community creations, and highlights shared by members."
      canonical="/community/member-gallery"
      seoTitle="Member Gallery — Community Puzzle Builds & Creations"
      seoDescription="See how PsychedBox members are completing and displaying their puzzle portraits. A gallery of community creativity and connection."
    />
  );
}

export function StoriesPage() {
  return (
    <GenericPage
      eyebrow="Community"
      title="Stories"
      description="Read stories from featured members and community voices."
      canonical="/community/stories"
      seoTitle="Community Stories — Psychedelic Wellness & Personal Journeys"
      seoDescription="Read first-person stories from psychedelic community members featured in PsychedBox. Journeys of healing, advocacy, art, and transformation."
    />
  );
}

export function EventsPage() {
  return (
    <GenericPage
      eyebrow="Community"
      title="Events"
      description="Find upcoming events, circles, and community gatherings."
      canonical="/community/events"
      seoTitle="Events — Psychedelic Community Gatherings & Circles"
      seoDescription="Find upcoming PsychedBox community events, member circles, and psychedelic culture gatherings near you."
    />
  );
}

export function MissionPage() {
  return (
    <GenericPage
      eyebrow="About"
      title="Our Mission"
      description="Learn how PsychedBox uses storytelling and art to support education, safety, and community care."
      canonical="/about/our-mission"
      seoTitle="Our Mission — Psychedelic Education, Art & Community Care"
      seoDescription="PsychedBox exists to educate and connect the psychedelic community through art and storytelling — while giving back to partners advancing harm reduction and equity."
    />
  );
}

export function HowItWorksPage() {
  useSEO({
    title: "How It Works — Monthly Psychedelic Subscription Box",
    description: "Learn how PsychedBox works: we curate a monthly community story, ship a puzzle box with themed goodies, and donate 10% of revenues to movement partners.",
    canonical: "/about/how-it-works",
  });

  const steps = [
    {
      title: "1) We curate each monthly theme",
      description: "Every month centers around a featured community voice, designed to educate and inspire through art and story.",
    },
    {
      title: "2) Your box arrives with puzzle + story",
      description: "Each delivery includes a featured puzzle portrait, themed goodies, and a story spotlighting impact in the movement.",
    },
    {
      title: "3) A portion supports partner organizations",
      description: "Your membership helps fund aligned organizations focused on education, harm reduction, and community wellness.",
    },
    {
      title: "4) Stay connected all month",
      description: "Members get access to exclusive updates, content, and opportunities to engage with the broader community.",
    },
  ];

  return (
    <PageShell
      eyebrow="About"
      title="How It Works"
      description="From curation to community impact, here's how a PsychedBox subscription works month to month."
    >
      <div className="space-y-4">
        {steps.map((step) => (
          <InfoCard key={step.title} title={step.title} description={step.description} />
        ))}
      </div>
    </PageShell>
  );
}

export function AboutPage() {
  useSEO({
    title: "About Us — PsychedBox",
    description: "PsychedBox blends art, storytelling, and community care to make the psychedelic movement more human, informed, and accessible. Learn about our vision and approach.",
    canonical: "/about-us",
  });

  return (
    <PageShell
      eyebrow="Company"
      title="About Us"
      description="PsychedBox blends art, storytelling, and community care to make the movement more human, informed, and accessible."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoCard
          title="Our Vision"
          description="A connected community where education, safety, and creative expression can grow side by side."
        />
        <InfoCard
          title="Our Approach"
          description="Each monthly box centers a community story and creates tangible support for movement-aligned organizations."
        />
        <InfoCard
          title="Our Commitment"
          description="We prioritize responsible storytelling, inclusive representation, and partner transparency."
        />
      </div>
    </PageShell>
  );
}

export function ContactPage() {
  useSEO({
    title: "Contact Us — PsychedBox Support & Partnerships",
    description: "Get in touch with PsychedBox for subscription support, partnership inquiries, media requests, or general questions. We reply within 1–2 business days.",
    canonical: "/contact",
  });

  return (
    <PageShell
      eyebrow="Company"
      title="Contact"
      description="Reach out for support, partnerships, or general questions—we'd love to hear from you."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard
          title="General Support"
          description="For account, orders, and shipping questions: support@psychedbox.com"
        />
        <InfoCard
          title="Partnerships"
          description="For movement and giveback collaborations: partnerships@psychedbox.com"
        />
        <InfoCard
          title="Media & Stories"
          description="For storytelling features and press requests: stories@psychedbox.com"
        />
        <InfoCard
          title="Response Window"
          description="We typically reply within 1–2 business days, Monday through Friday."
        />
      </div>
    </PageShell>
  );
}

export function CareersPage() {
  return (
    <GenericPage
      eyebrow="Company"
      title="Careers"
      description="Explore ways to build with us and support the movement."
      canonical="/careers"
      seoTitle="Careers — Join the PsychedBox Team"
      seoDescription="Interested in building the psychedelic community through art and storytelling? Explore open roles and opportunities to work with PsychedBox."
    />
  );
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How often do PsychedBox boxes ship?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Boxes ship monthly. Once your order is processed, you'll receive tracking details when it leaves our fulfillment team.",
      },
    },
    {
      "@type": "Question",
      name: "Can I gift a PsychedBox subscription?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Gift subscriptions are available and can be sent directly to a recipient with a personalized note.",
      },
    },
    {
      "@type": "Question",
      name: "What if I need to skip or cancel my PsychedBox subscription?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can manage plan changes from your account settings before the next renewal date.",
      },
    },
    {
      "@type": "Question",
      name: "Does PsychedBox donate to causes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. A portion of proceeds supports mission-aligned movement partners focused on education, safety, and equity.",
      },
    },
  ],
};

export function FAQPage() {
  useSEO({
    title: "FAQ — Frequently Asked Questions",
    description: "Answers to common questions about PsychedBox subscriptions, shipping, gifting, cancellations, and our giveback program.",
    canonical: "/faq",
  });
  useJsonLd(faqSchema);

  const faqs = [
    {
      question: "How often do boxes ship?",
      answer: "Boxes ship monthly. Once your order is processed, you'll receive tracking details when it leaves our fulfillment team.",
    },
    {
      question: "Can I gift a subscription?",
      answer: "Yes. Gift subscriptions are available and can be sent directly to a recipient with a personalized note.",
    },
    {
      question: "What if I need to skip or cancel?",
      answer: "You can manage plan changes from your account settings before the next renewal date.",
    },
    {
      question: "Do you support causes with each purchase?",
      answer: "Yes. A portion of proceeds supports mission-aligned movement partners focused on education, safety, and equity.",
    },
  ];

  return (
    <PageShell
      eyebrow="Support"
      title="Frequently Asked Questions"
      description="Quick answers to the most common questions from members and first-time subscribers."
    >
      <div className="space-y-4">
        {faqs.map((item) => (
          <article key={item.question} className="rounded-xl border border-gray-200 p-6 bg-white">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{item.question}</h3>
            <p className="text-gray-600">{item.answer}</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}

export function ShippingPage() {
  useSEO({
    title: "Shipping Info — Delivery Times & Tracking",
    description: "Learn about PsychedBox shipping times, processing windows, tracking, and international delivery options.",
    canonical: "/shipping-info",
  });

  return (
    <PageShell
      eyebrow="Support"
      title="Shipping Info"
      description="Everything you need to know about processing times, delivery windows, and tracking."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard
          title="Processing Time"
          description="Orders are usually processed in 2–4 business days before leaving our fulfillment center."
        />
        <InfoCard
          title="Delivery Window"
          description="Standard deliveries typically arrive within 5–10 business days after shipment."
        />
        <InfoCard
          title="Tracking"
          description="A tracking link is emailed as soon as your order ships so you can follow each step."
        />
        <InfoCard
          title="International Shipping"
          description="Availability varies by destination and local carrier support. Rates are shown at checkout."
        />
      </div>
    </PageShell>
  );
}

export function ReturnsPage() {
  return (
    <GenericPage
      eyebrow="Support"
      title="Returns"
      description="Understand return options and support steps for order issues."
      canonical="/returns"
      seoTitle="Returns & Refunds — PsychedBox Support"
      seoDescription="Need to return or report an issue with your PsychedBox? Learn about our returns process and how to contact our support team."
    />
  );
}

export function PrivacyPage() {
  return (
    <GenericPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="Learn how we handle your data and protect your privacy."
      canonical="/privacy-policy"
      seoTitle="Privacy Policy — PsychedBox"
      seoDescription="Read PsychedBox's privacy policy to understand how we collect, use, and protect your personal information."
      noIndex
    />
  );
}

export function TermsPage() {
  return (
    <GenericPage
      eyebrow="Legal"
      title="Terms Of Service"
      description="Review the terms that apply to using PsychedBox products and services."
      canonical="/terms-of-service"
      seoTitle="Terms of Service — PsychedBox"
      seoDescription="Review the terms and conditions that apply to your PsychedBox subscription and use of our website."
      noIndex
    />
  );
}
