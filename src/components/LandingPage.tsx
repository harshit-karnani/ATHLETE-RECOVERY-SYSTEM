import { useState } from "react";
import { Header } from "./header";
import { HeroSection } from "./sections/hero-section";
import { PhilosophySection } from "./sections/philosophy-section";
import { FeaturedProductsSection } from "./sections/featured-products-section";
import { TechnologySection } from "./sections/technology-section";
import { GallerySection } from "./sections/gallery-section";
import { CollectionSection } from "./sections/collection-section";
import { EditorialSection } from "./sections/editorial-section";
import { TestimonialsSection } from "./sections/testimonials-section";
import { FooterSection } from "./sections/footer-section";
import { Loader2, ArrowRight } from "lucide-react";

interface LandingPageProps {
  onLoginSuccess: (role: 'athlete' | 'coach', athleteId?: string) => void;
}

export function LandingPage({ onLoginSuccess }: LandingPageProps) {
  const [role, setRole] = useState<'athlete' | 'coach'>('athlete');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAthleteId, setSelectedAthleteId] = useState("marcus-vance");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      if (role === 'coach' && email.trim().toLowerCase() !== "example@gmail.com") {
        setError("Access restricted. Please log in with example@gmail.com to enter the portal.");
      } else {
        onLoginSuccess(role, role === 'athlete' ? selectedAthleteId : undefined);
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body-main selection:bg-foreground selection:text-background">
      <Header onPortalClick={() => setShowLoginModal(true)} />
      <HeroSection />
      <PhilosophySection />
      <FeaturedProductsSection />
      <TechnologySection />
      <GallerySection />
      <CollectionSection />
      <EditorialSection />
      <TestimonialsSection />
      <FooterSection />

      {/* Login Portal Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center backdrop-blur-[6px] p-4">
          <div className="bg-[#FFFFFF] border border-[#E5E5E5] max-w-sm w-full p-8 rounded-none shadow-2xl space-y-6 animate-scale-in">
            <div className="text-center space-y-2">
              <div className="font-display-lg text-2xl font-black text-[#0A0A0A] italic tracking-tighter">PUNARVA PORTAL</div>
              <p className="font-mono-label text-[10px] text-muted-foreground uppercase tracking-widest">Biometric Database Authentication</p>
            </div>

            {/* Role Selection Toggle */}
            <div className="flex border border-[#E5E5E5] p-1 bg-[#F5F5F5]">
              <button
                type="button"
                className={`flex-1 text-center py-2 font-mono text-[9px] tracking-widest uppercase transition-all ${
                  role === 'athlete' ? 'bg-[#0A0A0A] text-white font-bold' : 'text-neutral-500 hover:text-black'
                }`}
                onClick={() => setRole('athlete')}
              >
                ATHLETE SIGN IN
              </button>
              <button
                type="button"
                className={`flex-1 text-center py-2 font-mono text-[9px] tracking-widest uppercase transition-all ${
                  role === 'coach' ? 'bg-[#0A0A0A] text-white font-bold' : 'text-neutral-500 hover:text-black'
                }`}
                onClick={() => setRole('coach')}
              >
                COACH SIGN IN
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {role === 'athlete' ? (
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] tracking-wider text-muted-foreground uppercase block">SELECT YOUR PROFILE</label>
                  <select
                    className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded-none p-2.5 font-mono text-xs text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
                    value={selectedAthleteId}
                    onChange={e => setSelectedAthleteId(e.target.value)}
                  >
                    <option value="marcus-vance">MARCUS VANCE (Sprinter - Hamstring Strain)</option>
                    <option value="elena-rostova">ELENA ROSTOVA (Marathon - Achilles Tenditis)</option>
                    <option value="kofi-mensah">KOFI MENSAH (Basketball - Patellar Tendonitis)</option>
                    <option value="maya-lin">MAYA LIN (Weightlifter - Active Strain Flag)</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] tracking-wider text-muted-foreground uppercase block">COACH EMAIL ADDRESS</label>
                  <input
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded-none p-2.5 font-mono text-xs text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="font-mono text-[9px] tracking-wider text-[#737373] uppercase block">ACCESS PASSWORD</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F5F5F5] border border-[#E5E5E5] rounded-none p-2.5 font-mono text-xs text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
                />
              </div>

              {error && (
                <div className="text-[10px] font-mono text-[#ba1a1a] border border-[#ba1a1a]/20 bg-[#ba1a1a]/10 p-2.5 rounded-none">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0A0A0A] text-white text-xs font-bold py-3 rounded-none hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    CONNECTING PROTOCOL...
                  </>
                ) : (
                  <>
                    SECURE_SIGN_IN <ArrowRight size={12} />
                  </>
                )}
              </button>
            </form>

            <div className="flex justify-between items-center text-[9px] font-mono text-[#737373] pt-2 border-t border-[#E5E5E5]">
              <span className="hover:text-black cursor-pointer">Security Ledger</span>
              <span className="hover:text-black cursor-pointer" onClick={() => setShowLoginModal(false)}>Close Portal</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
