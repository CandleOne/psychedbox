import { HeartHandshake, Sprout, ShieldCheck, BookOpen } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteNavbar from "@/components/SiteNavbar";

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
    name: "Community Healing Collective",
    focus: "Peer support and integration circles",
    contribution: "Ongoing monthly donation",
  },
  {
    name: "Safe Journey Project",
    focus: "Harm reduction resources and volunteer training",
    contribution: "Partner campaign contributions",
  },
  {
    name: "Roots of Equity Initiative",
    focus: "Scholarships and community access programming",
    contribution: "Seasonal fundraising support",
  },
  {
    name: "Artists for Wellness Network",
    focus: "Creative wellness workshops and storytelling",
    contribution: "Featured box giveback allocation",
  },
];

export default function Movement() {
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
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <HeartHandshake style={{ color: "#FF6B6B" }} size={22} />
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Partners we donate to</h2>
          </div>
          <p className="text-gray-600 text-lg max-w-4xl mb-10">
            We regularly contribute to partner organizations advancing education, harm reduction, and equitable community wellness.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {donationPartners.map((partner) => (
              <article key={partner.name} className="rounded-xl bg-white border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{partner.name}</h3>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Focus:</span> {partner.focus}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">How we donate:</span> {partner.contribution}
                </p>
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