"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  onPortalClick?: (role: 'athlete' | 'coach') => void;
}

export function Header({ onPortalClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-md rounded-full" : "bg-transparent"}`}
      style={{
        boxShadow: isScrolled ? "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px" : "none"
      }}
    >
      <div className="flex items-center justify-between transition-all duration-300 px-2 pl-5 py-2">
        {/* Logo */}
        <a href="#hero" className="font-serif text-2xl font-black tracking-tighter transition-colors duration-300 text-foreground">
          PUNARVA
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex pr-2">
          <button
            onClick={() => onPortalClick?.('athlete')}
            className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
          >
            Athlete Portal
          </button>
          <button
            onClick={() => onPortalClick?.('coach')}
            className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
          >
            Coach Portal
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="transition-colors md:hidden text-foreground pr-2"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-border bg-background px-6 py-8 md:hidden rounded-b-2xl">
          <nav className="flex flex-col gap-6">
            <button
              className="text-left text-lg text-foreground"
              onClick={() => {
                setIsMenuOpen(false);
                onPortalClick?.('athlete');
              }}
            >
              Athlete Portal
            </button>
            <button
              className="text-left text-lg text-foreground"
              onClick={() => {
                setIsMenuOpen(false);
                onPortalClick?.('coach');
              }}
            >
              Coach Portal
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
