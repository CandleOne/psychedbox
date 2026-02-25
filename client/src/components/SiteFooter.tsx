export default function SiteFooter() {
  return (
    <footer style={{ backgroundColor: "#1a1a1a" }} className="w-full py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-semibold">Company</p>
            <a href="/movement" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Movement</a>
            <a href="/blog" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Blog</a>
            <a href="/about-us" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">About Us</a>
            <a href="/contact" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Contact</a>
            <a href="/careers" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Careers</a>
          </div>
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-semibold">Support</p>
            <a href="/faq" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">FAQ</a>
            <a href="/shipping-info" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Shipping Info</a>
            <a href="/returns" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Returns</a>
          </div>
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-semibold">Legal</p>
            <a href="/privacy-policy" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Privacy Policy</a>
            <a href="/terms-of-service" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Terms of Service</a>
          </div>
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-semibold">Follow</p>
            <a href="https://www.instagram.com/psychedbox" target="_blank" rel="noreferrer" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Instagram</a>
            <a href="https://x.com" target="_blank" rel="noreferrer" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Twitter</a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="block text-white text-sm py-1 hover:text-white/70 transition-colors">Facebook</a>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-white/60 text-sm">© 2026 PsychedBox. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}