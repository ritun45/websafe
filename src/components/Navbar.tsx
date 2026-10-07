import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Shield } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'check-medicine', label: 'Check Medicine' },
    { id: 'interaction-checker', label: 'Interactions' },
    { id: 'knowledge-graph', label: 'Intelligence Graph' },
    { id: 'patient-mode', label: 'Patient Mode' },
    { id: 'clinical-review', label: 'Clinical Review' },
    { id: 'safety', label: 'Safety' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 border-b ${
        isScrolled
          ? 'bg-[#F7F5EF]/95 backdrop-blur-md shadow-[0_2px_12px_rgba(23,53,47,0.06)] border-[#D9E0DC] py-3'
          : 'bg-[#F7F5EF] border-[#D9E0DC]/80 py-4'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <button
          onClick={() => handleLinkClick('hero')}
          className="flex items-center gap-3 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#285C50] rounded-lg"
          aria-label="WebSafe Homepage"
        >
          {/* Custom Shield + Molecular Motif SVG */}
          <div className="w-10 h-10 rounded-[10px] bg-[#17352F] text-[#F7F5EF] flex items-center justify-center relative overflow-hidden transition-transform duration-200 group-hover:scale-105">
            <svg
              className="w-6 h-6 text-[#F7F5EF]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Outer Shield contour */}
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#285C50" fill="#17352F" strokeWidth="1.5" />
              {/* Central node */}
              <circle cx="12" cy="11" r="2" fill="#D89A28" stroke="#F7F5EF" strokeWidth="1.2" />
              {/* Connected molecular satellites */}
              <circle cx="7.5" cy="8" r="1.3" fill="#F7F5EF" />
              <circle cx="16.5" cy="8" r="1.3" fill="#F7F5EF" />
              <circle cx="12" cy="16.5" r="1.3" fill="#F7F5EF" />
              {/* Bonding lines */}
              <line x1="12" y1="11" x2="7.5" y2="8" stroke="#F7F5EF" strokeWidth="1.2" strokeOpacity="0.8" />
              <line x1="12" y1="11" x2="16.5" y2="8" stroke="#F7F5EF" strokeWidth="1.2" strokeOpacity="0.8" />
              <line x1="12" y1="11" x2="12" y2="16.5" stroke="#F7F5EF" strokeWidth="1.2" strokeOpacity="0.8" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-xl tracking-tight text-[#17352F]">
                WebSafe
              </span>
              <span className="text-[10px] uppercase tracking-wider font-bold bg-[#285C50]/10 text-[#285C50] px-1.5 py-0.5 rounded-[4px]">
                Rx Intel
              </span>
            </div>
            <p className="text-[11px] text-[#5E6863] hidden sm:block tracking-normal font-normal">
              Medication Safety & Interaction Intelligence
            </p>
          </div>
        </button>

        {/* Center Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`px-3 py-2 text-sm font-medium transition-colors relative rounded-md ${
                  isActive
                    ? 'text-[#17352F] font-semibold bg-[#EEF3EF]'
                    : 'text-[#5E6863] hover:text-[#17352F] hover:bg-[#EEF3EF]/60'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#285C50] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => handleLinkClick('check-medicine')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#D89A28] hover:bg-[#c48920] active:bg-[#b07b1d] text-[#17201D] font-semibold text-sm rounded-[8px] transition-all shadow-[0_2px_8px_rgba(23,53,47,0.06)] hover:shadow-[0_4px_12px_rgba(23,53,47,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D89A28] focus-visible:ring-offset-2"
          >
            <span>Check Medicine</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => handleLinkClick('check-medicine')}
            className="sm:hidden px-3 py-1.5 bg-[#D89A28] text-[#17201D] font-semibold text-xs rounded-[6px]"
          >
            Check
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#17352F] hover:bg-[#EEF3EF] rounded-md transition-colors"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-[#F7F5EF] border-b border-[#D9E0DC] shadow-lg p-6 space-y-3 z-50">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-[#EEF3EF] text-[#17352F] font-bold'
                      : 'text-[#5E6863] hover:text-[#17352F] hover:bg-[#EEF3EF]/50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#D9E0DC] flex flex-col gap-2">
            <button
              onClick={() => handleLinkClick('check-medicine')}
              className="w-full py-3 bg-[#D89A28] hover:bg-[#c48920] text-[#17201D] font-bold text-center rounded-[8px] shadow-sm flex items-center justify-center gap-2"
            >
              <span>Check My Medicine</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <p className="text-[12px] text-center text-[#5E6863] pt-1">
              Supports Rx upload, manual search & drug-food screening
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
