import SiteFooter from "@/components/SiteFooter";
import SiteNavbar from "@/components/SiteNavbar";

type GenericPageProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export default function GenericPage({
  eyebrow = "PsychedBox",
  title,
  description,
}: GenericPageProps) {
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
        <div className="max-w-4xl mx-auto rounded-xl border border-gray-200 p-8 bg-white">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
          <p className="text-gray-600 leading-relaxed">
            We&apos;re currently building this page. Check back soon for full details, or return to the movement page to learn more about our current initiatives and partner organizations.
          </p>
          <a
            href="/movement"
            style={{ backgroundColor: "#1a1a1a" }}
            className="inline-flex items-center justify-center mt-6 px-6 py-3 rounded-lg text-white font-bold hover:opacity-90 transition-opacity"
          >
            View Movement Page
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}