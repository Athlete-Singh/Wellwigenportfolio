export default function Navbar({ onOpenLeadModal }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll position for frosted-glass effect & scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const currentScroll = window.scrollY;
      
      setIsScrolled(currentScroll > 30);
      if (totalScroll > 0) {
        setScrollProgress((currentScroll / totalScroll) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for active section highlight
  useEffect(() => {
    const sectionIds = ['home', 'personal-training', 'group-classes'];
    const observers = [];

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -50% 0px',
      threshold: 0,
    };

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const obs = new IntersectionObserver(observerCallback, observerOptions);
        obs.observe(el);
        observers.push(obs);
      }
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      // Update hash without jumping
      window.history.pushState(null, '', `#${id}`);
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'personal-training', label: 'Personal Training' },
    { id: 'group-classes', label: 'Group Classes' },
  ];

  return (
    <>
      {/* Scroll Progress Bar at the top */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-100/60 z-[60] pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-teal-500 via-sky-500 to-coral bg-[length:200%_auto] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Sticky Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'py-3.5 bg-[#0E1420]/95 backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.5)] border-b border-slate-800'
            : 'py-5 bg-gradient-to-b from-[#0E1420]/85 via-[#0E1420]/40 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('home');
              }}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl gradient-teal-sky flex items-center justify-center text-white shadow-md shadow-teal-500/25 group-hover:scale-105 transition-transform duration-200">
                <span className="font-heading font-black text-lg">W</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-heading font-extrabold text-xl tracking-tight text-white leading-tight group-hover:text-teal-400 transition-colors">
                  WELLWIGEN
                </span>
                <span className="text-[8.5px] font-bold tracking-[0.2em] text-[#2DE2C8] uppercase -mt-0.5">
                  STRONGER BODY. BETTER YOU.
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2 bg-slate-900/70 p-1 rounded-full border border-slate-700/60 backdrop-blur-md shadow-inner">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => scrollTo(link.id)}
                    className={`relative px-4 py-2 rounded-full text-xs lg:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'text-white font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activePill"
                        className="absolute inset-0 bg-teal-500/25 rounded-full border border-teal-400/50 shadow-[0_0_12px_rgba(45,226,200,0.3)]"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Desktop CTA Button */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => onOpenLeadModal({ program: 'Group Classes', plan: 'Trial Class' })}
                className="btn-power-coral btn-shine px-6 py-2.5 rounded-xl text-xs lg:text-sm font-bold flex items-center gap-1.5 shadow-coral-glow cursor-pointer group"
              >
                <span>Join Now</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => onOpenLeadModal({ program: 'Group Classes', plan: 'Trial Class' })}
                className="btn-power-coral px-4 py-2 text-xs font-bold rounded-xl"
              >
                Join Now
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-center text-slate-200 hover:text-white transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>