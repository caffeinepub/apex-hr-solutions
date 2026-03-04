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
  FileText,
  Heart,
  IndianRupee,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  Shield,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
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
            <button
              type="button"
              data-ocid="nav.home_link"
              onClick={() => scrollTo("home")}
              className={`text-sm font-medium transition-colors hover:text-primary ${scrolled ? "text-foreground" : "text-white"}`}
            >
              Home
            </button>
            <button
              type="button"
              data-ocid="nav.about_link"
              onClick={() => scrollTo("about")}
              className={`text-sm font-medium transition-colors hover:text-primary ${scrolled ? "text-foreground" : "text-white"}`}
            >
              About
            </button>
            <button
              type="button"
              data-ocid="nav.services_link"
              onClick={() => scrollTo("services")}
              className={`text-sm font-medium transition-colors hover:text-primary ${scrolled ? "text-foreground" : "text-white"}`}
            >
              Services
            </button>
            <button
              type="button"
              data-ocid="nav.careers_link"
              onClick={() => scrollTo("careers")}
              className={`text-sm font-medium transition-colors hover:text-primary ${scrolled ? "text-foreground" : "text-white"}`}
            >
              Careers
            </button>
            <button
              type="button"
              data-ocid="nav.contact_link"
              onClick={() => scrollTo("contact")}
              className={`text-sm font-medium transition-colors hover:text-primary ${scrolled ? "text-foreground" : "text-white"}`}
            >
              Contact
            </button>
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
            className="md:hidden p-2 rounded-md"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X
                className={`w-5 h-5 ${scrolled ? "text-foreground" : "text-white"}`}
              />
            ) : (
              <Menu
                className={`w-5 h-5 ${scrolled ? "text-foreground" : "text-white"}`}
              />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-border py-4 px-4 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => scrollTo("home")}
              className="text-sm font-medium text-foreground py-2 text-left"
              data-ocid="nav.home_link"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => scrollTo("about")}
              className="text-sm font-medium text-foreground py-2 text-left"
              data-ocid="nav.about_link"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => scrollTo("services")}
              className="text-sm font-medium text-foreground py-2 text-left"
              data-ocid="nav.services_link"
            >
              Services
            </button>
            <button
              type="button"
              onClick={() => scrollTo("careers")}
              className="text-sm font-medium text-foreground py-2 text-left"
              data-ocid="nav.careers_link"
            >
              Careers
            </button>
            <button
              type="button"
              onClick={() => scrollTo("contact")}
              className="text-sm font-medium text-foreground py-2 text-left"
              data-ocid="nav.contact_link"
            >
              Contact
            </button>
            <Button
              variant="outline"
              onClick={() => navigate("/portal/employee")}
              className="w-full mt-2 border-primary/40 text-primary hover:bg-primary/5"
              data-ocid="nav.employee_portal_button"
            >
              Employee Portal
            </Button>
            <Button
              onClick={() => navigate("/portal/hr")}
              className="w-full"
              data-ocid="nav.hr_portal_button"
            >
              HR Portal
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
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
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8">
          <Award className="w-4 h-4 text-white/80" />
          <span className="text-white/90 text-xs font-medium tracking-wide uppercase">
            India's Trusted HR Partner
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight text-balance">
          Elevating Human Capital
          <br />
          <span className="text-blue-300">Across India</span>
        </h1>

        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          Strategic HR consulting, payroll management, and compliance solutions
          for startups, SMEs, and enterprises across India.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            data-ocid="hero.primary_button"
            size="lg"
            className="bg-white text-primary hover:bg-white/90 shadow-xl font-semibold px-8 text-base h-12"
            onClick={() => scrollTo("contact")}
          >
            Book Consultation
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button
            data-ocid="hero.secondary_button"
            size="lg"
            variant="outline"
            className="border-white/50 text-white hover:bg-white/10 hover:border-white px-8 text-base h-12"
            onClick={() => scrollTo("services")}
          >
            Explore Services
            <ChevronDown className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
          {[
            { value: "500+", label: "Clients Served" },
            { value: "15+", label: "Years Experience" },
            { value: "98%", label: "Client Satisfaction" },
            { value: "₹50Cr+", label: "Payroll Managed" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white font-display">
                {stat.value}
              </div>
              <div className="text-white/60 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
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

function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge
            variant="secondary"
            className="mb-4 text-primary border-primary/20 bg-primary/8"
          >
            About Us
          </Badge>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Redefining HR Excellence in India
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Apex HR Solutions is a full-service HR consulting and management
            firm committed to transforming how organizations manage their most
            valuable asset — their people.
          </p>
        </div>

        {/* Mission / Vision / Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
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
          ].map((item) => (
            <Card
              key={item.title}
              className="card-hover border border-border bg-card shadow-sm"
            >
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
          ))}
        </div>

        {/* Leadership */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/15 rounded-2xl p-8 md:p-12">
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
        </div>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────

function ServicesSection() {
  const services = [
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

  return (
    <section id="services" className="py-20 md:py-28 bg-muted/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge
            variant="secondary"
            className="mb-4 text-primary border-primary/20 bg-primary/8"
          >
            Our Services
          </Badge>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Comprehensive HR Solutions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            From strategy to execution, we provide the full spectrum of HR
            services to keep your organization compliant, efficient, and
            people-driven.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Card
              key={service.title}
              className="card-hover bg-card border border-border group overflow-hidden"
            >
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
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Careers ──────────────────────────────────────────────────────────────────

function CareersSection() {
  const jobs = [
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

  return (
    <section id="careers" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge
            variant="secondary"
            className="mb-4 text-primary border-primary/20 bg-primary/8"
          >
            Careers
          </Badge>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Join Our Growing Team
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Build a meaningful career in HR consulting. We're always looking for
            passionate professionals to join our mission.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {jobs.map((job) => (
            <Card
              key={job.title}
              className="card-hover border border-border bg-card group"
            >
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
        <div className="text-center mb-16">
          <Badge
            variant="secondary"
            className="mb-4 text-primary border-primary/20 bg-primary/8"
          >
            Contact Us
          </Badge>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Let's Start a Conversation
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Ready to transform your HR operations? Our experts are here to help.
          </p>
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
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
