import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShieldCheck, Eye, Leaf } from "lucide-react";
import heroSerum from "@/assets/hero-serum.png";

const features = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-success" />,
    title: "100% Authentic Guarantee",
    description: "Every product is verified through our transparent supply chain tracking system.",
  },
  {
    icon: <Eye className="w-8 h-8 text-primary" />,
    title: "Transparent Supply Chain",
    description: "Trace your product's journey from origin to your hands, every step of the way.",
  },
  {
    icon: <Leaf className="w-8 h-8 text-success" />,
    title: "Ethically Sourced",
    description: "All ingredients are responsibly sourced with full traceability and certifications.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 text-center md:text-left">
              <p className="animate-fade-up text-sm font-sans font-medium tracking-[0.2em] uppercase text-primary mb-4">
                LUMERA SKIN
              </p>
              <h1 className="animate-fade-up-delay-1 text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight text-balance">
                Authenticity You Can Trust
              </h1>
              <p className="animate-fade-up-delay-2 mt-6 text-lg text-muted-foreground leading-relaxed max-w-md mx-auto md:mx-0">
                Every LUMERA product carries a transparent, verifiable journey.
              </p>
              <div className="animate-fade-up-delay-3 mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button variant="gold" size="xl" asChild>
                  <Link to="/scan">Verify Your Product</Link>
                </Button>
              </div>
            </div>

            <div className="order-1 md:order-2 flex justify-center animate-fade-up">
              <div className="relative w-64 md:w-80">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />
                <img
                  src={heroSerum}
                  alt="LUMERA Radiance Elixir Vitamin C Face Serum"
                  className="relative w-full h-auto drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          <h2 className="text-center text-3xl md:text-4xl font-serif font-bold mb-4">
            Why LUMERA?
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
            Pure. Transparent. Authentic.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className={`glass-card-elevated rounded-2xl p-8 text-center animate-fade-up-delay-${Math.min(i + 1, 3)}`}
              >
                <div className="flex justify-center mb-5">{f.icon}</div>
                <h3 className="font-serif text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
