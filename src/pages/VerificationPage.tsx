import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Timeline from "@/components/Timeline";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { productData } from "@/data/mockData";
import { BadgeCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const VerificationPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        sessionStorage.setItem('redirectAfterLogin', '/verification');
        navigate('/login', { 
          state: { message: "Please log in to verify products" },
          replace: true 
        });
      } else {
        if (isMounted) setIsAuthenticated(true);
      }
      if (isMounted) setLoading(false);
    };

    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        if (!session?.user) {
          navigate('/login', { 
            state: { message: "Please log in to verify products" },
            replace: true 
          });
        } else {
          setIsAuthenticated(true);
        }
        setLoading(false);
      }
    });

    return () => { 
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (!isAuthenticated) return null;
  
  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-28 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-28 pb-16 container max-w-2xl">
        {/* Product info card */}
        <div className="animate-fade-up glass-card-elevated rounded-3xl p-8 md:p-10 mb-10">
          <h1 className="text-2xl md:text-3xl font-serif font-bold mb-6">{productData.name}</h1>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Batch Number</span>
              <span className="font-medium">{productData.batch}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Manufactured</span>
              <span className="font-medium">{productData.manufactured} – {productData.manufacturingLocation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expiry</span>
              <span className="font-medium">{productData.expiry}</span>
            </div>
          </div>

          {/* Authenticity badge */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-2 bg-success/10 text-success px-6 py-3 rounded-full font-medium animate-glow-pulse">
              <BadgeCheck className="w-5 h-5" />
              {productData.status}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="animate-fade-up-delay-1">
          <h2 className="text-xl font-serif font-bold mb-6">Product Journey</h2>
          <Timeline />
        </div>

        {/* Claim CTA */}
        <div className="mt-12 text-center animate-fade-up-delay-2">
          <Button variant="gold" size="xl" asChild>
            <Link to="/claim">Claim My Product</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VerificationPage;