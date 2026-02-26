import { Link } from "wouter";
import { Package, BookOpen, Users, ShoppingCart, HelpCircle, Newspaper } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteNavbar from "@/components/SiteNavbar";
import { useSEO } from "@/hooks/useSEO";

type GenericPageProps = {
  eyebrow?: string;
  title: string;
  description: string;
  canonical?: string;
  seoTitle?: string;
  seoDescription?: string;
  noIndex?: boolean;
};

const quickLinks = [
  { label: "Monthly Boxes", description: "Browse subscription plans and see what's inside.", href: "/shop/monthly-boxes", icon: Package },
  { label: "The Movement", description: "Learn about our mission, pillars, and partners.", href: "/movement", icon: Users },
  { label: "Community Stories", description: "Read first-person stories from featured community members.", href: "/community/stories", icon: BookOpen },
  { label: "Shop", description: "Explore ceremony tools, art, and community essentials.", href: "/shop", icon: ShoppingCart },
  { label: "Blog", description: "Articles on psychedelic culture, wellness, and community.", href: "/blog", icon: Newspaper },
  { label: "FAQ", description: "Quick answers to common questions about PsychedBox.", href: "/faq", icon: HelpCircle },
];

export default function GenericPage({
  eyebrow = "PsychedBox",
  title,
  description,
  canonical,
  seoTitle,
  seoDescription,
  noIndex,
}: GenericPageProps) {
  useSEO({
    title: seoTitle ?? title,
    description: seoDescription ?? description,
    canonical,
    noIndex,
  });

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
        <div className="max-w-5xl mx-auto">
          <p className="text-gray-600 text-lg mb-8">This page is on its way. In the meantime, here are some places you might find what you're looking for:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {quickLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl border border-gray-200 p-5 bg-white hover:border-gray-300 hover:shadow-sm transition-all group"
              >
                <div style={{ backgroundColor: "#FF6B6B" }} className="w-9 h-9 rounded-full flex items-center justify-center mb-3">
                  <link.icon size={16} className="text-white" />
                </div>
                <p className="font-bold text-gray-900 mb-1 group-hover:text-[#FF6B6B] transition-colors">{link.label}</p>
                <p className="text-gray-500 text-sm">{link.description}</p>
              </Link>
            ))}
          </div>

          <div style={{ backgroundColor: "#F7F7F7" }} className="rounded-xl p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="font-bold text-gray-900 mb-1">Still can't find what you need?</p>
              <p className="text-gray-500 text-sm">Drop us a line at <strong>support@psychedbox.com</strong> and we'll point you in the right direction.</p>
            </div>
            <a
              href="mailto:support@psychedbox.com"
              style={{ backgroundColor: "#1a1a1a" }}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-white font-bold hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
