import React from 'react';
import Hero from './Hero';
import Ecosystem from './Ecosystem';
import Pricing from '../../subscription/pages/PricingPage';
import ContactUs from './ContactUs';
import Footer from '../../../components/common/Footer';
import { FlaskConical, ShieldCheck, Zap, Activity } from 'lucide-react';

const LabPage = () => {
  return (
    <div className="bg-white">
      {/* Custom Lab Hero */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-slate-900">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-purple-600/10 blur-3xl rounded-full -mr-64 -mt-64" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-2 rounded-full bg-purple-500/20 text-purple-400 text-xs font-black uppercase tracking-widest mb-6">
              Diagnostic Excellence
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8">
              Precision Diagnostics <br />
              <span className="text-purple-500">Accelerating Health.</span>
            </h1>
            <p className="text-lg text-slate-400 mb-10 max-w-2xl">
              Connect your laboratory to the Wellwigen Health Engine. Real-time sample tracking, marker analysis, and instant report delivery to patients.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all shadow-xl shadow-purple-900/20">
                Partner with Us
              </button>
              <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold border border-white/10 transition-all">
                View Lab Solutions
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Lab Features */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<FlaskConical className="text-purple-600" />}
              title="Automated Logistics"
              desc="Seamless home sample collection scheduling and real-time tracking for your field agents."
            />
            <FeatureCard
              icon={<ShieldCheck className="text-emerald-600" />}
              title="NABL Integration"
              desc="Full compliance with international laboratory standards. Digital signatures and secure report storage."
            />
            <FeatureCard
              icon={<Zap className="text-amber-600" />}
              title="Instant Delivery"
              desc="Reports are delivered directly to the patient's AI Health Dashboard within seconds of approval."
            />
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Lab Partnership Plans</h2>
            <p className="text-slate-500 mt-2">Scale your diagnostic operations with Wellwigen.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold mb-4">Basic Lab</h3>
              <p className="text-3xl font-black mb-6">₹4,999<span className="text-sm font-normal text-slate-500">/mo</span></p>
              <ul className="space-y-3 text-sm text-slate-600 mb-8">
                <li>• Up to 100 tests/month</li>
                <li>• Basic Digital Reports</li>
                <li>• Email Support</li>
              </ul>
              <button className="w-full py-3 border border-purple-600 text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-all">Get Started</button>
            </div>
            <div className="bg-white p-8 rounded-3xl border-2 border-purple-600 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-purple-600 text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest">Most Popular</div>
              <h3 className="text-xl font-bold mb-4">Standard Lab</h3>
              <p className="text-3xl font-black mb-6">₹9,999<span className="text-sm font-normal text-slate-500">/mo</span></p>
              <ul className="space-y-3 text-sm text-slate-600 mb-8">
                <li>• Unlimited Test Requests</li>
                <li>• AI Marker Analysis</li>
                <li>• 24/7 Priority Support</li>
                <li>• Custom Lab Branding</li>
              </ul>
              <button className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all">Select Plan</button>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold mb-4">Diagnostic Hub</h3>
              <p className="text-3xl font-black mb-6">Custom</p>
              <ul className="space-y-3 text-sm text-slate-600 mb-8">
                <li>• Multi-location Support</li>
                <li>• API Integration</li>
                <li>• Advanced Data Insights</li>
              </ul>
              <button className="w-full py-3 border border-slate-900 text-slate-900 rounded-xl font-bold hover:bg-slate-50 transition-all">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      <ContactUs />
      <Footer />
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-8 rounded-3xl border border-slate-100 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-50 transition-all group">
    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-black text-slate-900 mb-4">{title}</h3>
    <p className="text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default LabPage;
