import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const ClaimPage = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        sessionStorage.setItem('redirectAfterLogin', '/claim');
        navigate('/login', { 
          state: { message: "Please log in to claim products" },
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
            state: { message: "Please log in to claim products" },
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

  if (submitted) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-28 pb-16 container flex items-center justify-center min-h-[80vh]">
          <div className="animate-fade-up glass-card-elevated rounded-3xl p-10 text-center max-w-md w-full">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h1 className="text-2xl font-serif font-bold mb-2">Product Successfully Claimed</h1>
            <p className="text-muted-foreground text-sm mb-4">Ownership Verified</p>
            <p className="text-xs text-muted-foreground">Claimed on: 20 Feb 2026</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-28 pb-16 container flex items-center justify-center min-h-[80vh]">
        <div className="animate-fade-up glass-card-elevated rounded-3xl p-8 md:p-10 max-w-md w-full text-center">
          <h1 className="text-2xl font-serif font-bold mb-6">Claim Ownership</h1>
          
          <p className="text-muted-foreground mb-8">
            Click the button below to claim this product and verify your ownership.
          </p>

          <Button 
            variant="gold" 
            size="xl" 
            className="w-full"
            onClick={() => setSubmitted(true)}
          >
            Claim My Product
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClaimPage;