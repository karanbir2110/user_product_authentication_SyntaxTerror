import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ScanLine } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const ScanPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        sessionStorage.setItem('redirectAfterLogin', '/scan');
        navigate('/login', { 
          state: { message: "Please log in to scan products" },
          replace: true 
        });
      } else {
        if (isMounted) setIsAuthenticated(true);
      }
      if (isMounted) setLoading(false);
    };

    checkAuth();
    return () => { isMounted = false; };
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
      <div className="pt-28 pb-16 container flex flex-col items-center justify-center min-h-[80vh]">
        <div className="animate-fade-up glass-card-elevated rounded-3xl p-10 md:p-16 text-center max-w-md w-full">
          <ScanLine className="w-12 h-12 text-primary mx-auto mb-6" />
          <h1 className="text-2xl md:text-3xl font-serif font-bold mb-3">Scan Your Product</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Point your camera at the QR code on your LUMERA product.
          </p>

          {/* Mock scanner area */}
          <div className="relative aspect-square max-w-[240px] mx-auto mb-8 rounded-2xl border-2 border-dashed border-primary/30 flex items-center justify-center bg-secondary/30">
            <div className="absolute inset-4 border-2 border-primary/20 rounded-xl" />
            <p className="text-xs text-muted-foreground">QR Scanner Area</p>
          </div>

          <Button
            variant="gold"
            size="xl"
            className="w-full"
            onClick={() => navigate("/verification")} 
          >
            Verify Product
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScanPage;