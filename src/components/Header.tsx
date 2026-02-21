import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    const getInitialUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    
    getInitialUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      await supabase.auth.signOut();
      
      // Add a subtle fade-out animation
      document.body.style.transition = 'opacity 0.3s ease-in-out';
      document.body.style.opacity = '0.5';
      
      // Small delay for visual feedback
      setTimeout(() => {
        navigate('/');
        // Reset opacity after navigation
        document.body.style.opacity = '1';
        // Remove the transition after it's done
        setTimeout(() => {
          document.body.style.transition = '';
        }, 300);
      }, 300);
      
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
      document.body.style.opacity = '1';
      document.body.style.transition = '';
    }
    
    setOpen(false); // Close mobile menu if open
  };

  // Conditionally set links based on auth status
  const getLinks = () => {
    const baseLinks = [
      { to: "/", label: "Home" },
      { to: "/scan", label: "Verify" }, 
    ];

    if (!loading && !user) {
      // Only show login if user is not authenticated
      return [...baseLinks, { to: "/login", label: "Login" }];
    }
    
    return baseLinks;
  };

  const links = getLinks();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="font-serif text-xl font-semibold tracking-widest">
          LUMERA
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                location.pathname === l.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          
          {/* Show user info and logout button when logged in */}
          {!loading && user && (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-border">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <User className="w-4 h-4" />
                {user.email}
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`flex items-center gap-2 transition-all duration-300 ${
                  isLoggingOut ? 'opacity-50 scale-95' : 'hover:scale-105'
                }`}
              >
                <LogOut className={`w-4 h-4 transition-transform duration-300 ${
                  isLoggingOut ? 'rotate-12' : ''
                }`} />
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden glass-card border-t border-border px-6 pb-6 pt-2 space-y-4">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium tracking-wide text-muted-foreground hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
          
          {/* Mobile user info and logout */}
          {!loading && user && (
            <div className="pt-4 mt-4 border-t border-border space-y-3">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="truncate">{user.email}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`w-full justify-start transition-all duration-300 ${
                  isLoggingOut ? 'opacity-50 scale-95' : ''
                }`}
              >
                <LogOut className={`w-4 h-4 mr-2 transition-transform duration-300 ${
                  isLoggingOut ? 'rotate-12' : ''
                }`} />
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;