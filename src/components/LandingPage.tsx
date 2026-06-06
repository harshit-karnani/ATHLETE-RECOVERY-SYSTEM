import { useState } from "react";
import { Header } from "./header";
import { HeroSection } from "./sections/hero-section";
import { PhilosophySection } from "./sections/philosophy-section";
import { TechnologySection } from "./sections/technology-section";
import { Loader2, ArrowRight } from "lucide-react";
import { supabase } from '../supabaseClient';

interface LandingPageProps {
  onLoginSuccess: (session: any) => void;
}

export function LandingPage({ onLoginSuccess }: LandingPageProps) {
  const [role, setRole] = useState<'athlete' | 'coach'>('athlete');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Bypass Supabase Auth entirely to allow ANY email to be stored for future access
      setTimeout(() => {
        const dummySession = { 
          user: { 
            email, 
            user_metadata: { role } 
          } 
        };
        localStorage.setItem('punarva_auth', JSON.stringify(dummySession));
        onLoginSuccess(dummySession);
        setLoading(false);
      }, 500);
    } catch (err: any) {
      setError(err.message || "Authentication failed");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Google Authentication failed");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body-main selection:bg-foreground selection:text-background">
      <Header onPortalClick={(selectedRole) => {
        setRole(selectedRole);
        setShowLoginModal(true);
      }} />
      <HeroSection />
      <PhilosophySection />
      <TechnologySection />

      {/* Login Portal Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-white border border-neutral-200 max-w-sm w-full p-8 rounded-2xl shadow-2xl space-y-8 animate-scale-in">
            {/* Modal Header */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="font-serif text-3xl font-black text-black tracking-tighter">PUNARVA</div>
                <p className="text-sm text-neutral-500 font-medium">Access clinical dashboard</p>
              </div>
              <button onClick={() => setShowLoginModal(false)} className="text-neutral-400 hover:text-black transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Role Selection Toggle (Only show on Sign Up) */}
            {isSignUp && (
              <div className="flex border border-neutral-200 p-1 bg-neutral-50 rounded-xl">
                <button
                  type="button"
                  className={`flex-1 text-center py-2.5 text-sm font-medium transition-all rounded-lg ${
                    role === 'athlete' ? 'bg-white text-black shadow-sm border border-neutral-200/50' : 'text-neutral-500 hover:text-black'
                  }`}
                  onClick={() => setRole('athlete')}
                >
                  Athlete
                </button>
                <button
                  type="button"
                  className={`flex-1 text-center py-2.5 text-sm font-medium transition-all rounded-lg ${
                    role === 'coach' ? 'bg-white text-black shadow-sm border border-neutral-200/50' : 'text-neutral-500 hover:text-black'
                  }`}
                  onClick={() => setRole('coach')}
                >
                  Coach
                </button>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 block">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-lg p-3 text-base text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 block">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-lg p-3 text-base text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>

              {error && (
                <div className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white text-base font-medium py-3.5 rounded-lg hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    {isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-500">Or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white border border-neutral-300 text-black text-base font-medium py-3.5 rounded-lg hover:bg-neutral-50 transition-all flex items-center justify-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-neutral-500 hover:text-black transition-colors"
              >
                {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
