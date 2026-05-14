import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, MapPin, EyeOff, Bell, ArrowRight, ExternalLink, Info, Users, MessageSquare } from 'lucide-react';
import logoImg from '/src/assets/images/Logo.svg';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={logoImg} alt="SafeMap PH" className="h-10 w-auto" />
            <span className="text-xl font-bold tracking-tight text-primary">SafeMap <span className="text-slate-500">PH</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate('/about')} className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">About Us</button>
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How it Works</a>
            <button 
              onClick={() => navigate('/map')}
              className="px-6 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95"
            >
              Launch Map
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Protecting Communities Together
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] text-slate-900">
              Real-time Safety <br />
              <span className="text-primary">In Your Hands.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-lg leading-relaxed">
              SafeMap PH empowers citizens to report incidents anonymously and connects you directly with local authorities for rapid response.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/map')}
                className="px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 hover:shadow-2xl hover:shadow-primary/40 transition-all active:scale-95 group"
              >
                Get Started 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                Learn More
              </button>
            </div>
            
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                    User
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500 font-medium">
                Joined by <span className="text-primary font-bold">1,000+</span> citizens
              </p>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square bg-slate-100 rounded-3xl border border-slate-200 flex items-center justify-center text-slate-400 font-medium overflow-hidden shadow-2xl">
              <img 
                src="https://placehold.co/800x800?text=Hero+Image" 
                alt="Hero Section" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 animate-bounce-slow max-w-[200px]">
              <div className="flex items-center gap-3 mb-2 text-primary font-bold text-sm">
                <Bell className="w-4 h-4" />
                Alert
              </div>
              <p className="text-xs text-slate-500 leading-tight">New incident reported in your area. Authorities notified.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center text-white">
          <div className="space-y-2">
            <h3 className="text-4xl font-bold">100%</h3>
            <p className="text-primary-foreground/70 text-sm">Anonymous Reporting</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-bold">5m</h3>
            <p className="text-primary-foreground/70 text-sm">Avg. Response Time</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-bold">50+</h3>
            <p className="text-primary-foreground/70 text-sm">Partner Units</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-bold">10k+</h3>
            <p className="text-primary-foreground/70 text-sm">Reports Resolved</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
               <div className="aspect-[4/3] bg-slate-50 rounded-3xl border border-slate-200 flex items-center justify-center text-slate-400 overflow-hidden shadow-lg">
                  <img 
                    src="https://placehold.co/800x600?text=About+Us+Image" 
                    alt="About Us Illustration" 
                    className="w-full h-full object-cover"
                  />
               </div>
            </div>
            <div className="order-1 md:order-2 space-y-8">
              <h2 className="text-4xl font-bold text-slate-900">About SafeMap PH</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                SafeMap PH was born from a simple idea: every citizen deserves to feel safe in their community. We bridge the gap between people and public safety services through technology.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Our Mission</h4>
                    <p className="text-slate-600 text-sm">To provide a secure platform for incident reporting that prioritizes user safety and swift action.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Community Driven</h4>
                    <p className="text-slate-600 text-sm">Built with input from local barangays and emergency responders to ensure real-world effectiveness.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (Features) */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl font-bold text-slate-900">Simple 3-Step Process</h2>
            <p className="text-slate-600">Our system is designed to be intuitive and fast, even in high-stress situations.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-3xl border border-slate-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-8">
                <EyeOff className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-bold mb-4">1. Anonymous Report</h4>
              <p className="text-slate-600 leading-relaxed">Submit your report with photos and location details. No registration or personal data required.</p>
            </div>
            
            <div className="bg-white p-10 rounded-3xl border border-slate-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-8">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-bold mb-4">2. Immediate Verification</h4>
              <p className="text-slate-600 leading-relaxed">Our AI and human moderators verify the incident to prevent false alarms and prioritize urgency.</p>
            </div>
            
            <div className="bg-white p-10 rounded-3xl border border-slate-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-8">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-bold mb-4">3. Authority Dispatch</h4>
              <p className="text-slate-600 leading-relaxed">The nearest responder unit (Police, BFP, or Rescue) is dispatched to the precise coordinates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="bg-primary rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold">Be a Hero in Your Barangay.</h2>
              <p className="text-xl text-primary-foreground/80 max-w-xl mx-auto">
                Join the network of vigilant citizens making the Philippines safer, one report at a time.
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => navigate('/map')}
                  className="w-full md:w-auto px-10 py-5 bg-white text-primary rounded-2xl font-bold text-lg hover:shadow-2xl transition-all active:scale-95"
                >
                  Open the Map Now
                </button>
                <button className="w-full md:w-auto px-10 py-5 bg-primary border border-white/20 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <img src={logoImg} alt="SafeMap PH" className="h-8 w-auto" />
                <span className="text-lg font-bold tracking-tight text-primary">SafeMap PH</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Advanced incident reporting and emergency response coordination for the Philippines.
              </p>
            </div>
            
            <div>
              <h5 className="font-bold mb-6">Product</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><button onClick={() => navigate('/map')} className="hover:text-primary transition-colors">Safety Map</button></li>
                <li><button onClick={() => navigate('/report')} className="hover:text-primary transition-colors">Report Incident</button></li>
                <li><button onClick={() => navigate('/track')} className="hover:text-primary transition-colors">Track Report</button></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-bold mb-6">Resources</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><button onClick={() => navigate('/help')} className="hover:text-primary transition-colors">Help Center</button></li>
                <li><button onClick={() => navigate('/emergency')} className="hover:text-primary transition-colors">Emergency Contacts</button></li>
                <li><button onClick={() => navigate('/privacy')} className="hover:text-primary transition-colors">Privacy Policy</button></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-bold mb-6">Connect</h5>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary/5 hover:text-primary transition-all cursor-pointer">
                  <ExternalLink className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary/5 hover:text-primary transition-all cursor-pointer">
                  <Info className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-20 pt-8 border-t border-slate-50 text-center text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} SafeMap PH. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
