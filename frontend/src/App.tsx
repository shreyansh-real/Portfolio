import { useState, useEffect } from 'react';
import resumePdf from './Shreyansh Patel - Full Stack Developer.pdf';
import Hero from './components/Hero';
// import About from './components/About';
import Journey from './components/Journey';
import Skills from './components/Skills';
import Contact from './components/Contact';
import CardStack from './components/Cardstack';

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Back to top component (used below)
  const BackToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const toggleVisibility = () => setIsVisible(window.scrollY > 300);
      window.addEventListener('scroll', toggleVisibility);
      return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    if (!isVisible) return null;

    return (
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-teal-600 text-white border-0 cursor-pointer opacity-90 transition-all hover:opacity-100 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400 z-50 md:bottom-4 md:right-4"
        aria-label="Back to top"
      >
        ↑
      </button>
    );
  };

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Ambient Background Motion Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Background base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950"></div>
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full ambient-orb glow-pulse blur-3xl"></div>
        <div className="absolute top-1/3 right-20 w-96 h-96 bg-cyan-600/15 rounded-full ambient-orb-2 glow-pulse blur-3xl"></div>
        <div className="absolute bottom-32 left-1/4 w-80 h-80 bg-cyan-400/10 rounded-full ambient-orb-3 glow-pulse blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/15 rounded-full ambient-drift glow-pulse blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600/10 rounded-full ambient-orb glow-pulse blur-3xl"></div>

        {/* Mesh gradient background - subtle animated grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="ambient-grid" x="50" y="50" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="1" fill="rgb(34, 211, 238)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ambient-grid)" />
          </svg>
        </div>

        {/* Floating Particles (decorative) */}
        <div className="particle particle-1 w-1 h-1 bg-cyan-400 left-1/4" style={{ animationDelay: '0s' }}></div>
        <div className="particle particle-2 w-2 h-2 bg-cyan-300 left-1/3" style={{ animationDelay: '1s' }}></div>
        <div className="particle particle-3 w-1.5 h-1.5 bg-cyan-500 left-1/5" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative z-10">
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-gray-900/95 backdrop-blur-sm shadow-lg shadow-cyan-500/10' : 'bg-transparent'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <a href="#home" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                Portfolio
              </a>

              {/* Desktop links */}
              <div className="hidden md:flex items-center space-x-6">
                <div className="flex space-x-8">
                  <a href="#home" onClick={(e) => { e.preventDefault(); scrollToId('home'); }} className="hover:text-cyan-400 transition-colors">Home</a>
                  <a href="#about" onClick={(e) => { e.preventDefault(); scrollToId('cardstack'); }} className="hover:text-cyan-400 transition-colors">About</a>
                  <a href="#journey" onClick={(e) => { e.preventDefault(); scrollToId('journey'); }} className="hover:text-cyan-400 transition-colors">Journey</a>
                  <a href="#skills" onClick={(e) => { e.preventDefault(); scrollToId('skills'); }} className="hover:text-cyan-400 transition-colors">Skills</a>
                  <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToId('contact'); }} className="hover:text-cyan-400 transition-colors">Contact</a>
                </div>

                {/* Resume download button */}
                <a
                  href={resumePdf}
                  download
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-black rounded-full font-semibold transition-colors shadow-md"
                >
                  Resume
                </a>
              </div>

              {/* Mobile: hamburger */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setMobileOpen((s) => !s)}
                  aria-label="Toggle menu"
                  className="p-2 rounded-md hover:bg-gray-800/50 transition-colors"
                >
                  <svg className="w-6 h-6 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu panel */}
          <div className={`md:hidden bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 origin-top transition-all duration-300 overflow-hidden ${
            mobileOpen ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 pointer-events-none'
          }`}>
              <div className="px-4 pt-4 pb-6 space-y-3">
                <a href="#home" onClick={(e) => { e.preventDefault(); setMobileOpen(false); scrollToId('home'); }} className="block px-3 py-2 rounded-md hover:bg-gray-800/40">Home</a>
                <a href="#about" onClick={(e) => { e.preventDefault(); setMobileOpen(false); scrollToId('cardstack'); }} className="block px-3 py-2 rounded-md hover:bg-gray-800/40">About</a>
                <a href="#journey" onClick={(e) => { e.preventDefault(); setMobileOpen(false); scrollToId('journey'); }} className="block px-3 py-2 rounded-md hover:bg-gray-800/40">Journey</a>
                <a href="#skills" onClick={(e) => { e.preventDefault(); setMobileOpen(false); scrollToId('skills'); }} className="block px-3 py-2 rounded-md hover:bg-gray-800/40">Skills</a>
                <a href="#contact" onClick={(e) => { e.preventDefault(); setMobileOpen(false); scrollToId('contact'); }} className="block px-3 py-2 rounded-md hover:bg-gray-800/40">Contact</a>
                <a
                  href={resumePdf}
                  download
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 inline-block w-full text-center px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-black rounded-full font-semibold transition-colors"
                >
                  Download Resume
                </a>
              </div>
            </div>
        </nav>

        <main>
          <Hero />
          <CardStack />
          <Journey />
          <Skills />
          <Contact />
        </main>

        <footer className="bg-gray-950 py-8 border-t border-cyan-500/20">
          <div className="max-w-7xl mx-auto px-4 text-gray-400 flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm">Copyrights © 2026 Shreyansh Patel</p>
            </div>

            <div className="text-center md:text-right">
              <h4 className="text-sm text-gray-300 mb-2">Quick Navigation</h4>
              <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 md:gap-4">
                <a href="#home" onClick={(e) => { e.preventDefault(); scrollToId('home'); }} className="text-sm hover:text-cyan-400 transition-colors">Home</a>
                <a href="#about" onClick={(e) => { e.preventDefault(); scrollToId('cardstack'); }} className="text-sm hover:text-cyan-400 transition-colors">About</a>
                <a href="#journey" onClick={(e) => { e.preventDefault(); scrollToId('journey'); }} className="text-sm hover:text-cyan-400 transition-colors">Journey</a>
                <a href="#skills" onClick={(e) => { e.preventDefault(); scrollToId('skills'); }} className="text-sm hover:text-cyan-400 transition-colors">Skills</a>
                <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToId('contact'); }} className="text-sm hover:text-cyan-400 transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </footer>

        <BackToTop />
      </div>
    </div>
  );
}

export default App;
