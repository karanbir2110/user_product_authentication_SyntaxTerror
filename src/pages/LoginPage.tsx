import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Lock, Loader2, LogIn } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useNavigate, useLocation } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Get message from navigation state
  const redirectMessage = location.state?.message;

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Check if there's a redirect URL stored
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
          sessionStorage.removeItem('redirectAfterLogin');
          navigate(redirectUrl, { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
      setCheckingAuth(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
          sessionStorage.removeItem('redirectAfterLogin');
          navigate(redirectUrl, { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = () => {
    let isValid = true;
    
    if (!email.includes("@") || !email.includes(".")) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }
    
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: undefined,
            data: {
              email_confirmed: true
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          console.log("Sign up successful, user auto-logged in:", data);
          // Check for redirect after signup
          const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
          if (redirectUrl) {
            sessionStorage.removeItem('redirectAfterLogin');
            navigate(redirectUrl);
          } else {
            navigate("/");
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.session) {
          // Check for redirect after login
          const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
          if (redirectUrl) {
            sessionStorage.removeItem('redirectAfterLogin');
            navigate(redirectUrl);
          } else {
            navigate("/");
          }
        }
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      
      if (error.message.includes("Invalid login credentials")) {
        setGeneralError("Invalid email or password");
      } else if (error.message.includes("Email not confirmed")) {
        setGeneralError("Please confirm your email address");
      } else if (error.message.includes("User already registered")) {
        setGeneralError("This email is already registered");
      } else {
        setGeneralError(error.message || "An error occurred during authentication");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setEmailError("Please enter your email first");
      return;
    }
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      alert("Password reset email sent! Check your inbox.");
    } catch (error: any) {
      setGeneralError(error.message);
    }
  };

  // Show loading while checking auth status
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-28 pb-16 container flex items-center justify-center min-h-[80vh]">
        <div className="animate-fade-up glass-card-elevated rounded-3xl p-8 md:p-10 max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl font-bold tracking-widest">LUMERA</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isSignUp ? "Create Your Account" : "Secure Access to Your Product"}
            </p>
          </div>

          {/* Redirect message */}
          {redirectMessage && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg animate-fade-in">
              <p className="text-sm text-amber-600 dark:text-amber-400 text-center flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" />
                {redirectMessage}
              </p>
            </div>
          )}

          {generalError && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive text-center">{generalError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className={emailError ? "border-destructive" : ""}
              />
              {emailError && (
                <p className="text-xs text-destructive">{emailError}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className={passwordError ? "border-destructive" : ""}
              />
              {passwordError && (
                <p className="text-xs text-destructive">{passwordError}</p>
              )}
            </div>

            {/* Fixed height container for forgot password section */}
            <div className="min-h-[2.5rem]">
              {!isSignUp && (
                <div className="flex items-center justify-end">
                  <button 
                    type="button" 
                    className="text-xs text-primary hover:underline disabled:opacity-50"
                    onClick={handleForgotPassword}
                    disabled={isLoading}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            <Button 
              variant="gold" 
              size="xl" 
              className="w-full" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSignUp ? "Creating Account..." : "Logging in..."}
                </>
              ) : (
                isSignUp ? "Sign Up" : "Login"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              <button 
                type="button" 
                className="text-primary hover:underline font-medium disabled:opacity-50"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setGeneralError("");
                  setEmailError("");
                  setPasswordError("");
                }}
                disabled={isLoading}
              >
                {isSignUp ? "Already have an account? Login" : "Create Account"}
              </button>
            </p>
          </form>

          <div className="mt-8 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="w-3 h-3" />
            Your data is securely protected.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;