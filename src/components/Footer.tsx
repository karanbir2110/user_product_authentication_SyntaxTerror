import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-secondary/50 border-t border-border mt-20">
    <div className="container py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold tracking-widest mb-2">LUMERA SKIN</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Pure. Transparent. Authentic.
          </p>
        </div>
        <div className="space-y-2">
          <h4 className="font-sans text-sm font-semibold tracking-wide uppercase text-muted-foreground">Company</h4>
          <Link to="/" className="block text-sm text-foreground/70 hover:text-primary transition-colors">About</Link>
          <Link to="/" className="block text-sm text-foreground/70 hover:text-primary transition-colors">Privacy Policy</Link>
        </div>
        <div className="space-y-2">
          <h4 className="font-sans text-sm font-semibold tracking-wide uppercase text-muted-foreground">Support</h4>
          <Link to="/" className="block text-sm text-foreground/70 hover:text-primary transition-colors">Contact</Link>
          <Link to="/scan" className="block text-sm text-foreground/70 hover:text-primary transition-colors">Verify Product</Link>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © 2026 LUMERA SKIN. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
