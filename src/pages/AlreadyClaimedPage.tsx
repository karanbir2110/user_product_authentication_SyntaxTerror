import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { claimedData } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const AlreadyClaimedPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        sessionStorage.setItem('redirectAfterLogin', '/already-claimed');
        navigate('/login', { 
          state: { message: "Please log in to view product details" },
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
            state: { message: "Please log in to view product details" },
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
      <div className="pt-28 pb-16 container flex items-center justify-center min-h-[80vh]">
        <div className="animate-fade-up glass-card-elevated rounded-3xl p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-serif font-bold mb-2">
            ⚠ This product has already been claimed.
          </h1>

          <div className="mt-6 space-y-3 text-sm text-left">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Claimed on</span>
              <span className="font-medium">{claimedData.claimedOn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Scan Count</span>
              <span className="font-medium">{claimedData.scanCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Scan Location</span>
              <span className="font-medium">{claimedData.lastScanLocation}</span>
            </div>
          </div>

          <Button variant="gold-outline" size="xl" className="w-full mt-8">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlreadyClaimedPage;