import { HeartHandshake, Sprout, ShieldCheck, BookOpen } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteNavbar from "@/components/SiteNavbar";
import { useSEO } from "@/hooks/useSEO";
import { useJsonLd } from "@/hooks/useJsonLd";

const movementPillars = [
  {
    icon: BookOpen,
    title: "Education & Storytelling",
    description:
      "We amplify voices, lived experience, and practical knowledge so people can make informed choices and feel less alone.",
  },
  {
    icon: ShieldCheck,
    title: "Harm Reduction & Safety",
    description:
      "We support organizations focused on safety resources, peer support, and community-led care for real-world wellbeing.",
  },
  {
    icon: Sprout,
    title: "Access & Equity",
    description:
      "We prioritize partner work that expands access to education, healing spaces, and opportunity for underserved communities.",
  },
];

const donationPartners = [
  {
    name: "The Zendo Project",
    logo: "/partners/zendo-project.png",
    donateUrl: "https://www.every.org/zendoproject?utm_campaign=donate-link#/donate/card",
    logoWrapperClassName: "",
  },
  {
    name: "DanceSafe",
    logo: "/partners/dancesafe.webp",
    donateUrl: "https://dancesafe.org/donate/?srsltid=AfmBOor62cnd5UJt4Ys7htm6eUy7OecXlDIRB3sh_ofkaggmPckGZcRQ",
    logoWrapperClassName: "",
  },
  {
    name: "Heroic Hearts Project",
    logo: "/partners/heroic-hearts.png",
    donateUrl: "https://heroicheartsproject.org/how-to-help/donate/",
    logoWrapperClassName: "",
  },
  {
    name: "Bicycle Day (Tricycle Day)",
    logo: "/partners/tricycle-day.png",
    donateUrl: "https://www.tricycleday.com/",
    logoWrapperClassName: "",
  },
  {
    name: "Fireside Project",
    logo: "/partners/fireside-project.png",
    donateUrl: "https://firesideproject.org/donate",
    logoWrapperClassName: "inline-block rounded-lg px-3 py-2 bg-gradient-to-r from-[#4f5d8f] via-[#744b73] to-[#b24747]",
  },
];

const movementSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "The Movement | PsychedBox",
  description:
    "PsychedBox donates 10% of revenues to psychedelic harm reduction, education, and equity partners including The Zendo Project, DanceSafe, and Heroic Hearts Project.",
  url: "https://psychedbox.com/movement",
  publisher: {
    "@type": "Organization",
    name: "PsychedBox",
    url: "https://psychedbox.com",
  },
};

export default function Movement() {
  useSEO({
    title: "The Movement — Psychedelic Education, Harm Reduction & Community",
    description:
      "PsychedBox donates 10% of revenues to psychedelic harm reduction, education, and equity partners including The Zendo Project, DanceSafe, and Heroic Hearts Project.",
    canonical: "/movement",
  });
  useJsonLd(movementSchema);

  return (
    <div className="min-h-screen bg-white">
      <SiteNavbar />

      <section style={{ backgroundColor: "#FF6B6B" }} className="px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-white/80 text-xs uppercase tracking-[0.2em] font-bold mb-4">Our Movement</p>
          <h1 className="text-white text-4xl md:text-6xl font-black leading-tight max-w-3xl mb-6">
            Building a healthier psychedelic culture through community support
          </h1>
          <p className="text-white text-lg md:text-xl max-w-3xl">
            Every box fuels stories, education, and direct support for mission-aligned partners doing the day-to-day work in community wellness.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">What the movement means right now</h2>
          <p className="text-gray-600 text-lg max-w-4xl mb-10">
            The current movement is about balancing curiosity with care: celebrating creative and personal transformation while centering safety, ethics, and inclusive access.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {movementPillars.map((pillar) => (
              <article key={pillar.title} className="rounded-xl border border-gray-200 p-6 bg-white">
                <div style={{ backgroundColor: "#FF6B6B" }} className="w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <pillar.icon size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pillar.title}</h3>
                <p className="text-gray-600">{pillar.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: "#F7F7F7" }} className="px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HeartHandshake style={{ color: "#FF6B6B" }} size={22} />
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Partners we donate to</h2>
          </div>
          <p className="text-gray-600 text-lg max-w-4xl mb-10 mx-auto">
            We regularly contribute to partner organizations advancing education, harm reduction, and equitable community wellness.
          </p>

          <p className="text-gray-900 text-lg font-semibold mb-10">
            <span style={{ color: "#FF6B6B" }}>10% of revenues</span> are donated to these causes, and another
            <span style={{ color: "#FF6B6B" }}> 10%</span> is given to the person featured in that month&apos;s puzzle.
          </p>

          <div className="flex flex-wrap justify-center gap-8">
            {donationPartners.map((partner) => (
              <article key={partner.name} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] text-center">
                <a href={partner.donateUrl} target="_blank" rel="noreferrer" className="inline-block mb-4">
                  <span className={partner.logoWrapperClassName}>
                    <img src={partner.logo} alt={`${partner.name} logo`} className="h-16 w-auto object-contain" />
                  </span>
                </a>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{partner.name}</h3>
                <a
                  href={partner.donateUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ backgroundColor: "#FF6B6B" }}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-white font-bold hover:opacity-90 transition-opacity"
                >
                  Visit / Donate
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: "#1a1a1a" }} className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-white text-3xl md:text-4xl font-extrabold mb-4">Want to partner with us?</h2>
          <p className="text-white/80 text-lg mb-8">
            If your organization aligns with our mission, we’d love to connect and explore a donation partnership.
          </p>
          <a
            href="mailto:partnerships@psychedbox.com"
            style={{ backgroundColor: "#FF6B6B" }}
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg text-white font-bold hover:opacity-90 transition-opacity"
          >
            Contact Partnerships
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}