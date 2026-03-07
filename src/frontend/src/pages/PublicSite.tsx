import { useRouter } from "@/App";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitContact } from "@/hooks/useQueries";
import { generateId } from "@/utils/format";
import {
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock,
  Eye,
  Heart,
  IndianRupee,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Phone,
  Quote,
  Search,
  Shield,
  ShieldCheck,
  Star,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Scroll-triggered animation primitives ───────────────────────────────────

function useInViewAnimation(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

type AnimatedTag = "div" | "h1" | "h2" | "h3" | "p" | "section" | "span";

interface AnimatedTextProps {
  children: React.ReactNode;
  inView: boolean;
  delay?: number;
  className?: string;
  as?: AnimatedTag;
}

function AnimatedText({
  children,
  inView,
  delay = 0,
  className,
  as: Tag = "div",
}: AnimatedTextProps) {
  const style: CSSProperties = {
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(24px)",
    transition: "opacity 600ms ease-out, transform 600ms ease-out",
    transitionDelay: `${delay}ms`,
  };

  return (
    <Tag className={className} style={style}>
      {children}
    </Tag>
  );
}

// ─── Animated Stats ───────────────────────────────────────────────────────────

function useCountUp(target: number, duration: number, started: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return count;
}

const STATS = [
  { target: 500, prefix: "", suffix: "+", label: "Clients Served" },
  { target: 15, prefix: "", suffix: "+", label: "Years Experience" },
  { target: 98, prefix: "", suffix: "%", label: "Client Satisfaction" },
  { target: 50, prefix: "₹", suffix: "Cr+", label: "Payroll Managed" },
];

function StatItem({
  stat,
  started,
  delay,
}: {
  stat: (typeof STATS)[number];
  started: boolean;
  delay: number;
}) {
  const [localStarted, setLocalStarted] = useState(false);
  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => setLocalStarted(true), delay);
    return () => clearTimeout(t);
  }, [started, delay]);

  const count = useCountUp(stat.target, 1800, localStarted);

  return (
    <div
      className="text-center transition-all duration-700"
      style={{
        opacity: localStarted ? 1 : 0,
        transform: localStarted ? "translateY(0)" : "translateY(16px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="text-2xl md:text-3xl font-bold text-white font-display tabular-nums">
        {stat.prefix}
        {count}
        {stat.suffix}
      </div>
      <div className="text-white/60 text-sm mt-1">{stat.label}</div>
    </div>
  );
}

function AnimatedStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
    >
      {STATS.map((stat, i) => (
        <StatItem
          key={stat.label}
          stat={stat}
          started={started}
          delay={i * 150}
        />
      ))}
    </div>
  );
}

// ─── Mobile Menu Overlay ─────────────────────────────────────────────────────

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "careers", label: "Careers" },
  { id: "reviews", label: "Reviews" },
  { id: "contact", label: "Contact" },
];

type NavRoute =
  | "/"
  | "/login"
  | "/portal/hr"
  | "/portal/employee"
  | "/dashboard/hr"
  | "/dashboard/employee";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onScrollTo: (id: string) => void;
  onNavigate: (path: NavRoute) => void;
}

function MobileMenu({
  isOpen,
  onClose,
  onScrollTo,
  onNavigate,
}: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close menu"
        className="fixed inset-0 z-40 md:hidden cursor-default bg-black/40"
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 200ms ease",
          border: "none",
          outline: "none",
        }}
        onClick={onClose}
        tabIndex={isOpen ? 0 : -1}
      />

      {/* Slide-down panel */}
      <div
        id="mobile-menu"
        aria-label="Navigation menu"
        className="fixed top-16 left-0 right-0 z-50 md:hidden bg-white border-b border-border shadow-lg"
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateY(0)" : "translateY(-8px)",
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 200ms ease, transform 200ms ease",
        }}
      >
        {/* Nav links */}
        <nav className="px-4 py-3 flex flex-col">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              data-ocid={`nav.${link.id}_link`}
              onClick={() => onScrollTo(link.id)}
              className="w-full px-3 py-3 text-left text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <Separator />

        {/* Portal buttons */}
        <div className="px-4 py-3 flex flex-col gap-2">
          <Button
            variant="outline"
            data-ocid="nav.employee_portal_button"
            onClick={() => {
              onNavigate("/portal/employee");
              onClose();
            }}
            className="w-full justify-center gap-2"
          >
            <Users className="w-4 h-4" />
            Employee Portal
          </Button>
          <Button
            data-ocid="nav.hr_portal_button"
            onClick={() => {
              onNavigate("/portal/hr");
              onClose();
            }}
            className="w-full justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Shield className="w-4 h-4" />
            HR Portal
          </Button>
        </div>
      </div>
    </>
  );
}

// ─── Hamburger Icon ───────────────────────────────────────────────────────────

function HamburgerIcon({
  isOpen,
  scrolled,
}: { isOpen: boolean; scrolled: boolean }) {
  const color = scrolled ? "text-foreground" : "text-white";
  return isOpen ? (
    <X className={`w-5 h-5 ${color}`} />
  ) : (
    <Menu className={`w-5 h-5 ${color}`} />
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Navbar() {
  const { navigate } = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="/assets/uploads/Apex-HR-Solutions-logo-design-1.png"
                alt="Apex HR Solutions"
                className={`h-10 md:h-12 w-auto object-contain transition-all ${!scrolled ? "brightness-0 invert" : ""}`}
              />
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  data-ocid={`nav.${link.id}_link`}
                  onClick={() => scrollTo(link.id)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${scrolled ? "text-foreground" : "text-white"}`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Portal Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                data-ocid="nav.employee_portal_button"
                variant="outline"
                onClick={() => navigate("/portal/employee")}
                className={`px-4 text-sm font-medium transition-all ${
                  scrolled
                    ? "border-primary/40 text-primary hover:bg-primary/5"
                    : "border-white/50 text-white hover:bg-white/10 hover:border-white"
                }`}
              >
                Employee Portal
              </Button>
              <Button
                data-ocid="nav.hr_portal_button"
                onClick={() => navigate("/portal/hr")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md px-4 text-sm"
              >
                HR Portal
              </Button>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className={`md:hidden relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                scrolled ? "hover:bg-muted" : "hover:bg-white/10"
              }`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              data-ocid="nav.toggle"
            >
              <HamburgerIcon isOpen={menuOpen} scrolled={scrolled} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer (rendered outside header for correct stacking) */}
      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onScrollTo={scrollTo}
        onNavigate={navigate}
      />
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Small delay so the initial paint settles before animations begin
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center gradient-hero overflow-hidden"
    >
      {/* Background image overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('/assets/generated/hero-bg.dim_1920x1080.jpg')",
        }}
      />
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
        {/* Trust badge */}
        <AnimatedText
          inView={mounted}
          delay={0}
          className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8"
        >
          <Award className="w-4 h-4 text-white/80" />
          <span className="text-white/90 text-xs font-medium tracking-wide uppercase">
            India's Trusted HR Partner
          </span>
        </AnimatedText>

        {/* Headline */}
        <AnimatedText
          inView={mounted}
          delay={100}
          as="h1"
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight text-balance"
        >
          Elevating Human Capital
          <br />
          <span className="text-blue-300">Across India</span>
        </AnimatedText>

        <AnimatedText
          inView={mounted}
          delay={220}
          as="p"
          className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Strategic HR consulting, payroll management, and compliance solutions
          for startups, SMEs, and enterprises across India.
        </AnimatedText>

        {/* CTA Buttons */}
        <AnimatedText
          inView={mounted}
          delay={360}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            data-ocid="hero.primary_button"
            size="lg"
            className="bg-[oklch(0.55_0.22_255)] text-white hover:bg-[oklch(0.62_0.22_255)] shadow-[0_4px_24px_oklch(0.55_0.22_255/0.45)] font-semibold px-8 text-base h-12 border-0 transition-all duration-200"
            onClick={() => scrollTo("contact")}
          >
            Book Consultation
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button
            data-ocid="hero.secondary_button"
            size="lg"
            variant="outline"
            className="bg-[oklch(0.55_0.22_255/0.15)] border-[oklch(0.55_0.22_255)] border-2 text-white hover:bg-[oklch(0.55_0.22_255/0.3)] hover:border-[oklch(0.62_0.22_255)] px-8 text-base h-12 transition-all duration-200"
            onClick={() => scrollTo("services")}
          >
            Explore Services
            <ChevronDown className="ml-2 w-4 h-4" />
          </Button>
        </AnimatedText>

        {/* Stats */}
        <AnimatedStats />
      </div>

      {/* Scroll indicator */}
      <button
        type="button"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors animate-bounce"
        onClick={() => scrollTo("about")}
        aria-label="Scroll down"
      >
        <ChevronDown className="w-6 h-6" />
      </button>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

const aboutMVV = [
  {
    icon: Target,
    title: "Our Mission",
    desc: "To deliver world-class HR consulting services that drive organizational performance, foster compliance, and empower employees across India.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Eye,
    title: "Our Vision",
    desc: "To be India's most trusted HR partner — recognized for integrity, innovation, and measurable impact in human capital management.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: Heart,
    title: "Our Values",
    desc: "Integrity, Client-centricity, Compliance, Innovation, and People-first approach guide every decision we make.",
    color: "bg-purple-50 text-purple-600",
  },
];

function AboutSection() {
  const { ref: headerRef, inView: headerInView } = useInViewAnimation(0.15);
  const { ref: cardsRef, inView: cardsInView } = useInViewAnimation(0.1);
  const { ref: leaderRef, inView: leaderInView } = useInViewAnimation(0.1);

  return (
    <section id="about" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <AnimatedText
            inView={headerInView}
            delay={0}
            className="inline-block mb-4"
          >
            <Badge
              variant="secondary"
              className="text-primary border-primary/20 bg-primary/8"
            >
              About Us
            </Badge>
          </AnimatedText>
          <AnimatedText
            inView={headerInView}
            delay={100}
            as="h2"
            className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4"
          >
            Redefining HR Excellence in India
          </AnimatedText>
          <AnimatedText
            inView={headerInView}
            delay={200}
            as="p"
            className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed"
          >
            Apex HR Solutions is a full-service HR consulting and management
            firm committed to transforming how organizations manage their most
            valuable asset — their people.
          </AnimatedText>
        </div>

        {/* Mission / Vision / Values */}
        <div ref={cardsRef} className="grid md:grid-cols-3 gap-8 mb-20">
          {aboutMVV.map((item, i) => (
            <AnimatedText key={item.title} inView={cardsInView} delay={i * 120}>
              <Card className="card-hover border border-border bg-card shadow-sm h-full">
                <CardContent className="p-8">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color}`}
                  >
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3 text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            </AnimatedText>
          ))}
        </div>

        {/* Leadership */}
        <div ref={leaderRef}>
          <AnimatedText
            inView={leaderInView}
            delay={0}
            className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/15 rounded-2xl p-8 md:p-12"
          >
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-shrink-0">
                <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-lg ring-4 ring-primary/20">
                  <img
                    src="/assets/generated/vishwesh-profile.dim_200x200.png"
                    alt="Vishwesh Shivankar - HR Director"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                  Leadership
                </Badge>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Vishwesh Shivankar
                </h3>
                <p className="text-primary font-semibold mb-4 text-sm uppercase tracking-wide">
                  HR Director — Apex HR Solutions
                </p>
                <p className="text-muted-foreground leading-relaxed max-w-2xl">
                  With over 15 years of experience in human resources management
                  across India's leading corporations, Vishwesh brings strategic
                  acumen and deep expertise in labor compliance, organizational
                  development, and talent management. His vision drives Apex HR
                  Solutions toward delivering measurable business impact through
                  people-first practices.
                </p>
                <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                  {[
                    "15+ Years Experience",
                    "Labor Law Expert",
                    "HR Strategy",
                    "Talent Management",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 bg-white border border-border rounded-full px-3 py-1 text-xs font-medium text-foreground"
                    >
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedText>
        </div>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────

const servicesList = [
  {
    icon: TrendingUp,
    title: "HR Consulting",
    desc: "End-to-end HR strategy, workforce planning, and policy development tailored to your organization's goals.",
    features: [
      "Workforce Planning",
      "HR Strategy",
      "Policy Development",
      "Org Design",
    ],
    color: "from-blue-600 to-blue-700",
  },
  {
    icon: IndianRupee,
    title: "Payroll Management",
    desc: "Accurate, timely salary processing with full Indian statutory compliance including PF, ESI, and TDS.",
    features: [
      "Salary Processing",
      "PF/ESI Compliance",
      "Tax Deductions",
      "Pay Slips",
    ],
    color: "from-indigo-600 to-indigo-700",
  },
  {
    icon: Shield,
    title: "Compliance & Legal",
    desc: "Navigate complex Indian labor laws with confidence. We handle documentation, audits, and legal compliance.",
    features: [
      "Labor Law Compliance",
      "Legal Documentation",
      "HR Audits",
      "Statutory Filings",
    ],
    color: "from-violet-600 to-violet-700",
  },
  {
    icon: Search,
    title: "Recruitment Services",
    desc: "Strategic talent acquisition from sourcing to onboarding, with LinkedIn-integrated hiring workflows.",
    features: [
      "Talent Acquisition",
      "LinkedIn Integration",
      "Candidate Screening",
      "Onboarding",
    ],
    color: "from-blue-700 to-indigo-800",
  },
];

function ServicesSection() {
  const { ref: headerRef, inView: headerInView } = useInViewAnimation(0.15);
  const { ref: cardsRef, inView: cardsInView } = useInViewAnimation(0.1);

  return (
    <section id="services" className="py-20 md:py-28 bg-muted/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-16">
          <AnimatedText
            inView={headerInView}
            delay={0}
            className="inline-block mb-4"
          >
            <Badge
              variant="secondary"
              className="text-primary border-primary/20 bg-primary/8"
            >
              Our Services
            </Badge>
          </AnimatedText>
          <AnimatedText
            inView={headerInView}
            delay={100}
            as="h2"
            className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4"
          >
            Comprehensive HR Solutions
          </AnimatedText>
          <AnimatedText
            inView={headerInView}
            delay={200}
            as="p"
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            From strategy to execution, we provide the full spectrum of HR
            services to keep your organization compliant, efficient, and
            people-driven.
          </AnimatedText>
        </div>

        <div
          ref={cardsRef}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {servicesList.map((service, i) => (
            <AnimatedText
              key={service.title}
              inView={cardsInView}
              delay={i * 100}
            >
              <Card className="card-hover bg-card border border-border group overflow-hidden h-full">
                <div
                  className={`h-1.5 bg-gradient-to-r ${service.color} w-full`}
                />
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 shadow-md`}
                  >
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-display text-lg font-bold mb-2 text-foreground">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                    {service.desc}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-sm text-foreground"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </AnimatedText>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Careers ──────────────────────────────────────────────────────────────────

const jobsList = [
  {
    title: "Senior HR Business Partner",
    department: "Human Resources",
    location: "Mumbai, Maharashtra",
    type: "Full-time",
    exp: "5-8 years",
  },
  {
    title: "Payroll Specialist",
    department: "Payroll & Finance",
    location: "Pune, Maharashtra",
    type: "Full-time",
    exp: "3-5 years",
  },
  {
    title: "Talent Acquisition Lead",
    department: "Recruitment",
    location: "Bengaluru, Karnataka",
    type: "Full-time",
    exp: "4-7 years",
  },
];

function CareersSection() {
  const { ref: headerRef, inView: headerInView } = useInViewAnimation(0.15);
  const { ref: cardsRef, inView: cardsInView } = useInViewAnimation(0.1);

  return (
    <section id="careers" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-16">
          <AnimatedText
            inView={headerInView}
            delay={0}
            className="inline-block mb-4"
          >
            <Badge
              variant="secondary"
              className="text-primary border-primary/20 bg-primary/8"
            >
              Careers
            </Badge>
          </AnimatedText>
          <AnimatedText
            inView={headerInView}
            delay={100}
            as="h2"
            className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4"
          >
            Join Our Growing Team
          </AnimatedText>
          <AnimatedText
            inView={headerInView}
            delay={200}
            as="p"
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            Build a meaningful career in HR consulting. We're always looking for
            passionate professionals to join our mission.
          </AnimatedText>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-3 gap-6 mb-10">
          {jobsList.map((job, i) => (
            <AnimatedText key={job.title} inView={cardsInView} delay={i * 120}>
              <Card className="card-hover border border-border bg-card group h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {job.type}
                    </Badge>
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2 leading-snug">
                    {job.title}
                  </h3>
                  <p className="text-sm text-primary font-medium mb-4">
                    {job.department}
                  </p>
                  <div className="space-y-2 mb-5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {job.exp}
                    </div>
                  </div>
                  <a
                    href="https://www.linkedin.com/company/apex-hr-solutions"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      className="w-full bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white text-sm"
                      size="sm"
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      Apply via LinkedIn
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </AnimatedText>
          ))}
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4 text-sm">
            Don't see your role? Connect with us on LinkedIn to explore more
            opportunities.
          </p>
          <a
            href="https://www.linkedin.com/company/apex-hr-solutions"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/5"
            >
              <Linkedin className="w-4 h-4 mr-2" />
              View LinkedIn Profile
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ─────────────────────────────────────────────────────────────────

function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const submitContact = useSubmitContact();
  const { ref: headerRef, inView: headerInView } = useInViewAnimation(0.15);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      await submitContact.mutateAsync({
        id: generateId("contact"),
        name: form.name,
        email: form.email,
        company: form.company,
        message: form.message,
        submittedOn: new Date().toISOString(),
      });
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setForm({ name: "", email: "", company: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-muted/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-16">
          <AnimatedText
            inView={headerInView}
            delay={0}
            className="inline-block mb-4"
          >
            <Badge
              variant="secondary"
              className="text-primary border-primary/20 bg-primary/8"
            >
              Contact Us
            </Badge>
          </AnimatedText>
          <AnimatedText
            inView={headerInView}
            delay={100}
            as="h2"
            className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4"
          >
            Let's Start a Conversation
          </AnimatedText>
          <AnimatedText
            inView={headerInView}
            delay={200}
            as="p"
            className="text-muted-foreground max-w-xl mx-auto text-lg"
          >
            Ready to transform your HR operations? Our experts are here to help.
          </AnimatedText>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                Get in Touch
              </h3>
              <div className="space-y-5">
                {[
                  {
                    icon: Mail,
                    label: "Email",
                    value: "info@apexhrsolutions.in",
                    href: "mailto:info@apexhrsolutions.in",
                  },
                  {
                    icon: Phone,
                    label: "Phone",
                    value: "+91 98765 43210",
                    href: "tel:+919876543210",
                  },
                  {
                    icon: MapPin,
                    label: "Address",
                    value: "Mumbai, Maharashtra, India",
                    href: "https://maps.google.com/?q=Mumbai,Maharashtra,India",
                  },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.icon === MapPin ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {item.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium text-foreground mb-3">
                Working Hours
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Monday – Friday</span>
                  <span className="font-medium text-foreground">
                    9:00 AM – 6:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium text-foreground">
                    10:00 AM – 2:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium text-foreground">Closed</span>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/15 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-primary" />
                <span className="font-medium text-foreground text-sm">
                  Corporate Office
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Bandra Kurla Complex, Mumbai, Maharashtra 400051, India
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="shadow-lg border border-border">
            <CardHeader className="pb-4">
              <CardTitle className="font-display text-xl">
                Send us a Message
              </CardTitle>
              <CardDescription>
                We respond within 24 business hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Full Name *</Label>
                  <Input
                    id="contact-name"
                    data-ocid="contact.name_input"
                    placeholder="Rajesh Kumar"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Business Email *</Label>
                  <Input
                    id="contact-email"
                    data-ocid="contact.email_input"
                    type="email"
                    placeholder="rajesh@company.in"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-company">Company Name</Label>
                  <Input
                    id="contact-company"
                    data-ocid="contact.company_input"
                    placeholder="Acme Technologies Pvt Ltd"
                    value={form.company}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, company: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-message">Message *</Label>
                  <Textarea
                    id="contact-message"
                    data-ocid="contact.message_textarea"
                    placeholder="Tell us about your HR challenges and how we can help..."
                    rows={4}
                    value={form.message}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, message: e.target.value }))
                    }
                    required
                  />
                </div>
                <Button
                  data-ocid="contact.submit_button"
                  type="submit"
                  className="w-full"
                  disabled={submitContact.isPending}
                >
                  {submitContact.isPending ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

const reviews = [
  {
    name: "Priya Mehta",
    title: "CEO, NovaTech Solutions",
    location: "Mumbai, Maharashtra",
    rating: 5,
    text: "Apex HR Solutions completely transformed our payroll and compliance processes. Their team is highly professional, responsive, and deeply knowledgeable about Indian labor law. We've saved countless hours every month.",
  },
  {
    name: "Rahul Sharma",
    title: "Founder, GreenLeaf Ventures",
    location: "Bengaluru, Karnataka",
    rating: 5,
    text: "As a startup, navigating PF, ESI, and TDS compliance was overwhelming. Apex HR stepped in and handled everything seamlessly. Their onboarding was smooth and the dashboard is incredibly easy to use.",
  },
  {
    name: "Ananya Desai",
    title: "HR Director, Pinnacle Enterprises",
    location: "Pune, Maharashtra",
    rating: 5,
    text: "We partnered with Apex HR for end-to-end recruitment and talent management. The quality of candidates and the speed of hiring improved dramatically. Vishwesh's team truly understands what corporates need.",
  },
  {
    name: "Suresh Patil",
    title: "MD, Indus Retail Group",
    location: "Hyderabad, Telangana",
    rating: 5,
    text: "Their compliance and legal advisory services gave us the confidence to expand across states without worrying about labor law violations. Highly recommended for any SME scaling operations in India.",
  },
  {
    name: "Kavitha Nair",
    title: "VP Operations, BlueSky Tech",
    location: "Chennai, Tamil Nadu",
    rating: 5,
    text: "The HR dashboard is a game-changer. Our employees can now check payslips, apply for leaves, and track approvals all in one place. The entire HR team's workload has reduced by nearly 40%.",
  },
  {
    name: "Amit Joshi",
    title: "COO, Horizon Logistics",
    location: "Delhi NCR",
    rating: 5,
    text: "Professional, reliable, and genuinely invested in our success. Apex HR Solutions helped us build HR policies from scratch and ensured full statutory compliance. A trusted partner we rely on every day.",
  },
];

const STAR_POSITIONS = [1, 2, 3, 4, 5] as const;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {STAR_POSITIONS.map((pos) => (
        <Star
          key={pos}
          className={`w-4 h-4 ${pos <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );
}

function ReviewsSection() {
  const { ref: headerRef, inView: headerInView } = useInViewAnimation(0.15);
  const { ref: cardsRef, inView: cardsInView } = useInViewAnimation(0.08);

  return (
    <section id="reviews" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <AnimatedText
            inView={headerInView}
            delay={0}
            className="inline-block mb-4"
          >
            <Badge
              variant="secondary"
              className="text-primary border-primary/20 bg-primary/8"
            >
              Client Reviews
            </Badge>
          </AnimatedText>
          <AnimatedText
            inView={headerInView}
            delay={100}
            as="h2"
            className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4"
          >
            What Our Clients Say
          </AnimatedText>
          <AnimatedText
            inView={headerInView}
            delay={200}
            as="p"
            className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed"
          >
            Trusted by 500+ organizations across India — here's what business
            leaders say about working with Apex HR Solutions.
          </AnimatedText>
        </div>

        {/* Review Cards – auto-scrolling marquee */}
        <div ref={cardsRef} className="overflow-hidden relative">
          {/* fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />

          <div
            className="flex gap-6 w-max"
            style={{
              animation: "marquee-rtl 32s linear infinite",
            }}
          >
            {[...reviews, ...reviews].map((review, i) => (
              <Card
                key={`${review.name}-${i}`}
                data-ocid={
                  i < reviews.length ? `reviews.item.${i + 1}` : undefined
                }
                className="card-hover border border-border bg-card flex flex-col shadow-sm flex-shrink-0"
                style={{ width: "320px" }}
              >
                <CardContent className="p-6 flex flex-col h-full">
                  {/* Quote icon */}
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-4 flex-shrink-0">
                    <Quote className="w-4 h-4 text-primary" />
                  </div>

                  {/* Review text */}
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-5 italic">
                    "{review.text}"
                  </p>

                  {/* Divider */}
                  <div className="border-t border-border pt-4 mt-auto">
                    <StarRating rating={review.rating} />
                    <div className="mt-2">
                      <p className="font-semibold text-foreground text-sm">
                        {review.name}
                      </p>
                      <p className="text-xs text-primary font-medium">
                        {review.title}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {review.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Overall rating strip */}
        <AnimatedText inView={cardsInView} delay={600}>
          <div className="mt-12 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/15 rounded-2xl p-6 md:p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {STAR_POSITIONS.map((pos) => (
                <Star
                  key={pos}
                  className="w-6 h-6 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <p className="font-display text-4xl font-bold text-foreground mb-1">
              4.9 / 5
            </p>
            <p className="text-muted-foreground text-sm">
              Average rating across 500+ clients nationwide
            </p>
          </div>
        </AnimatedText>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[oklch(var(--navy))] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <img
              src="/assets/uploads/Apex-HR-Solutions-logo-design-1.png"
              alt="Apex HR Solutions"
              className="h-10 w-auto object-contain mb-4 brightness-0 invert"
            />
            <p className="text-white/60 text-sm leading-relaxed">
              India's trusted HR consulting and management partner. Empowering
              organizations through strategic people solutions.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="https://www.linkedin.com/company/apex-hr-solutions"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4 text-white">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home", id: "home" },
                { label: "About Us", id: "about" },
                { label: "Services", id: "services" },
                { label: "Careers", id: "careers" },
                { label: "Reviews", id: "reviews" },
                { label: "Contact", id: "contact" },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(link.id)}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4 text-white">
              Services
            </h4>
            <ul className="space-y-3">
              {[
                "HR Consulting",
                "Payroll Management",
                "Compliance & Legal",
                "Recruitment Services",
                "HR Dashboard",
              ].map((s) => (
                <li key={s}>
                  <span className="text-white/60 text-sm">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="bg-white/10 mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
          <p>© {currentYear} Apex HR Solutions. All rights reserved.</p>
          <p>
            Built with <span className="text-red-400">♥</span> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function PublicSite() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <CareersSection />
        <ReviewsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
