import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const AuthScreen: React.FC = () => {
  const { enterGuestMode, handleGoogleLogin, updateUserProfile, setActiveTab } = useApp();
  const [authMode, setAuthMode] = useState<'login' | 'create'>('login');
  const [identifier, setIdentifier] = useState('sarah.chen@nutrition-lab.com');
  const [fullName, setFullName] = useState('Sarah Chen');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      updateUserProfile({
        displayName: authMode === 'create' ? fullName || 'Allergy Warrior' : 'Sarah Chen',
        email: identifier.includes('@') ? identifier : `${identifier}@ingreguide.local`,
      });
      setActiveTab('dashboard');
    }, 600);
  };

  return (
    <div className="w-full min-h-screen bg-[#f9f9ff] text-[#111c2d] pb-24 lg:pb-16 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Hero 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Value Proposition & Clinical Trust */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            {/* Regulatory Pill Tag */}
            <div className="inline-flex items-center gap-2 self-start bg-[#e0e7ff] px-3.5 py-1.5 rounded-full shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5379EE] animate-pulse"></span>
              <span className="font-mono-tech text-xs text-[#4338ca] font-bold uppercase tracking-wider">
                v2.4 Live • FDA FALCPA &amp; EU FIC Verified
              </span>
            </div>

            {/* Main Impact Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0f172a] tracking-tight leading-tight">
                Know what you eat <br />
                <span className="text-[#5379EE]">before you take a bite.</span>
              </h1>
              <p className="text-base text-[#565e74] max-w-xl leading-relaxed">
                Decode deceptive food labels, spot hidden allergens instantly, and personalize dietary guardrails with
                scientific clarity right in your browser or phone.
              </p>
            </div>

            {/* Micro Visual Strip: Live Ingredient Clarifier Pill Ribbon */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 bg-[#fff1f2] text-[#e11d48] font-mono-tech text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                <span className="material-symbols-outlined text-sm">warning</span>
                <span>Casein &amp; Whey Detected</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-[#e0e7ff] text-[#4338ca] font-mono-tech text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                <span>Gluten-Safe Matrix</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-[#fffbeb] text-[#d97706] font-mono-tech text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                <span className="material-symbols-outlined text-sm">science</span>
                <span>E621 (MSG) Explained</span>
              </div>
            </div>

            {/* Interactive Feature Highlights */}
            <div className="space-y-3 pt-2">
              {/* Feature 1 */}
              <div className="bg-white hover:bg-[#eef2ff] p-4 rounded-2xl border border-slate-100 shadow-sm transition-all flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#e0e7ff] text-[#5379EE] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">barcode_scanner</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#0f172a]">Instant Barcode &amp; Photo Scan</h3>
                    <span className="font-mono-tech text-[10px] text-[#5379EE] font-bold uppercase bg-[#e0e7ff]/80 px-2 py-0.5 rounded-full">
                      0.3s Latency
                    </span>
                  </div>
                  <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                    Sub-second identification across 2.4M verified global products, grocery inventory, and packaging
                    formats.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white hover:bg-[#eef2ff] p-4 rounded-2xl border border-slate-100 shadow-sm transition-all flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#e0e7ff] text-[#5379EE] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">eco</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#0f172a]">Personal Allergen Shield</h3>
                    <span className="font-mono-tech text-[10px] text-[#5379EE] font-bold uppercase bg-[#e0e7ff]/80 px-2 py-0.5 rounded-full">
                      Proactive Alert
                    </span>
                  </div>
                  <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                    Instant triggers for celiac, nut, dairy, histamine, sulfites, and customizable cross-contamination
                    sensitivities.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white hover:bg-[#eef2ff] p-4 rounded-2xl border border-slate-100 shadow-sm transition-all flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#e0e7ff] text-[#5379EE] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">translate</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#0f172a]">Jargon-Free Simplified Breakdown</h3>
                    <span className="font-mono-tech text-[10px] text-[#5379EE] font-bold uppercase bg-[#e0e7ff]/80 px-2 py-0.5 rounded-full">
                      Human-Readable
                    </span>
                  </div>
                  <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                    Cryptic chemical codes, industrial binders, and international E-numbers converted into transparent
                    nutritional context.
                  </p>
                </div>
              </div>
            </div>

            {/* Social Proof Counter Bar */}
            <div className="bg-[#f0f3ff] p-4 rounded-2xl border border-[#dae2fd]/50 flex flex-wrap items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#5379EE] text-2xl">inventory_2</span>
                <div>
                  <p className="font-bold text-base text-[#0f172a] leading-none">14,800+</p>
                  <p className="text-xs text-[#64748b] mt-0.5">Verified Products</p>
                </div>
              </div>
              <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#5379EE] text-2xl">group</span>
                <div>
                  <p className="font-bold text-base text-[#0f172a] leading-none">890+</p>
                  <p className="text-xs text-[#64748b] mt-0.5">Active Profiles</p>
                </div>
              </div>
              <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#65a30d] text-2xl">task_alt</span>
                <div>
                  <p className="font-bold text-base text-[#0f172a] leading-none">99.8%</p>
                  <p className="text-xs text-[#64748b] mt-0.5">Allergen Accuracy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Card mirroring Figure 2 "LOGIN SYSTEM" */}
          <div className="lg:col-span-5 flex flex-col items-center w-full">
            <div className="w-full bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative">
              {/* Figure 2 Top Header Banner with IngreGuide branding */}
              <div className="bg-gradient-to-r from-[#4F72EC] via-[#5379EE] to-[#6C90FA] p-5 text-white relative overflow-hidden">
                {/* Decorative background circle & dots from Figure 2 */}
                <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
                <div className="absolute top-2 right-4 w-3 h-3 rounded-full border-2 border-white/40"></div>
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-9 h-9 rounded-xl bg-white/20 border border-white/40 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-xl">qr_code_scanner</span>
                    </div>
                    <div>
                      <h3 className="font-sans font-black text-lg tracking-tight uppercase leading-none">
                        INGREGUIDE
                      </h3>
                      <p className="text-[10px] text-white/90 font-medium mt-0.5">
                        Read with Sight, Choose What's Right.
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-mono-tech text-[10px] font-bold border border-white/30">
                    RS-IV
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {/* Figure 2 "LOGIN SYSTEM" Title */}
                <div className="mb-6 text-center sm:text-left">
                  <h2 className="text-2xl sm:text-3xl font-black text-[#5379EE] tracking-tight uppercase">
                    LOGIN SYSTEM
                  </h2>
                  <p className="text-xs text-[#64748b] mt-1">
                    {authMode === 'login'
                      ? 'Sign in to access personalized ingredient filters and scan history.'
                      : 'Create your personalized nutritional profile and allergen shield.'}
                  </p>
                </div>

                {/* Segmented Mode Selector */}
                <div className="flex bg-[#eef2ff] p-1 rounded-full mb-5">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className={`flex-1 py-1.5 rounded-full font-mono-tech text-xs font-bold transition-all ${
                      authMode === 'login'
                        ? 'bg-[#5379EE] text-white shadow-xs'
                        : 'text-[#64748b] hover:text-[#0f172a]'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('create')}
                    className={`flex-1 py-1.5 rounded-full font-mono-tech text-xs font-bold transition-all ${
                      authMode === 'create'
                        ? 'bg-[#5379EE] text-white shadow-xs'
                        : 'text-[#64748b] hover:text-[#0f172a]'
                    }`}
                  >
                    Register
                  </button>
                </div>

                {/* Figure 2 Form: Email Address & Password */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {authMode === 'create' && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#1e293b]">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full h-11 px-4 rounded-full bg-white border border-[#cbd5e1] text-sm text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-[#5379EE] focus:ring-2 focus:ring-[#5379EE]/20 transition-all"
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#1e293b]">
                      Email Address
                    </label>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full h-11 px-4 rounded-full bg-white border border-[#cbd5e1] text-sm text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-[#5379EE] focus:ring-2 focus:ring-[#5379EE]/20 transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-[#1e293b]">Password</label>
                      <button
                        type="button"
                        onClick={() => alert('Password reset instructions simulated to your email.')}
                        className="text-[11px] font-medium text-[#5379EE] hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full h-11 pl-4 pr-11 rounded-full bg-white border border-[#cbd5e1] text-sm text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-[#5379EE] focus:ring-2 focus:ring-[#5379EE]/20 transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 text-[#5379EE] hover:text-[#4368dd] flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-xl">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Figure 2: Remember me circular selector */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 rounded-full text-[#5379EE] border-slate-300 accent-[#5379EE]"
                      />
                      <span className="text-xs text-[#64748b]">Remember me</span>
                    </label>
                  </div>

                  {/* Figure 2: Primary Solid Blue "Login" Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-full bg-[#5379EE] hover:bg-[#4368DD] text-white font-bold text-sm transition-all shadow-[0_4px_16px_rgba(83,121,238,0.35)] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <span className="material-symbols-outlined text-lg animate-spin">refresh</span>
                    ) : (
                      <span>{authMode === 'login' ? 'Login' : 'Create Account'}</span>
                    )}
                  </button>
                </form>

                {/* Figure 2 Divider: "or continue with" */}
                <div className="relative flex items-center justify-center my-6">
                  <div className="w-full h-px bg-slate-200"></div>
                  <span className="absolute bg-white px-3 text-xs text-[#64748b] font-medium">
                    or continue with
                  </span>
                </div>

                {/* Figure 2 Circular Social Login Buttons: [ G ] [ f ] [ 👤 ] */}
                <div className="flex items-center justify-center gap-4">
                  {/* Google "G" circular button */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    title="Sign in with Google"
                    className="w-12 h-12 rounded-full border border-slate-300 hover:border-[#5379EE] hover:bg-[#eef2ff] flex items-center justify-center transition-all shadow-xs cursor-pointer group"
                  >
                    <span className="font-bold text-[#5379EE] group-hover:scale-110 transition-transform text-lg">
                      G
                    </span>
                  </button>

                  {/* Facebook "f" circular button */}
                  <button
                    type="button"
                    onClick={() => {
                      updateUserProfile({ displayName: 'Facebook User', email: 'user@facebook.com' });
                      setActiveTab('dashboard');
                    }}
                    title="Sign in with Facebook"
                    className="w-12 h-12 rounded-full border border-slate-300 hover:border-[#5379EE] hover:bg-[#eef2ff] flex items-center justify-center transition-all shadow-xs cursor-pointer group"
                  >
                    <span className="font-bold text-[#5379EE] group-hover:scale-110 transition-transform text-lg">
                      f
                    </span>
                  </button>

                  {/* Guest / Profile circular button */}
                  <button
                    type="button"
                    onClick={enterGuestMode}
                    title="Continue as Guest"
                    className="w-12 h-12 rounded-full border border-slate-300 hover:border-[#5379EE] hover:bg-[#eef2ff] flex items-center justify-center transition-all shadow-xs cursor-pointer group"
                  >
                    <span className="material-symbols-outlined text-[#5379EE] text-xl group-hover:scale-110 transition-transform">
                      person
                    </span>
                  </button>
                </div>

                {/* Guest Scan Link */}
                <div className="mt-5 text-center">
                  <button
                    type="button"
                    onClick={enterGuestMode}
                    className="text-xs text-[#5379EE] hover:underline inline-flex items-center gap-1 font-semibold"
                  >
                    <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
                    <span>Continue to Scanner as Guest</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Medical Guardrail & RA 10173 Data Privacy Notice */}
            <div className="w-full mt-4 bg-[#f8fafc] border border-slate-200/70 p-3.5 rounded-2xl flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#65a30d] text-lg shrink-0 mt-0.5">
                verified_user
              </span>
              <div className="text-xs text-[#64748b] leading-tight space-y-1">
                <p>
                  <strong className="text-[#0f172a]">RA 10173 Data Privacy Compliance:</strong> IngreGuide strictly protects personal health profiles in accordance with the Philippine Data Privacy Act of 2012. User allergen logs remain private and encrypted.
                </p>
                <p className="text-[10px] text-[#94a3b8]">
                  Research Study 2026–2027 • Proponents: Micharre Ayonei P. Virgo, Charlize P. Cataag, Precious Abby H. Pacleb.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Bento Grid: Real-time Scanning Architecture & Database Insight */}
        <div className="mt-16 pt-8 border-t border-slate-200/60">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="font-mono-tech text-xs text-[#65a30d] font-bold uppercase tracking-wider">
                Engine Architecture
              </span>
              <h2 className="text-2xl font-bold text-[#0f172a] mt-1">Medical Clarity at the Point of Consumption</h2>
            </div>
            <p className="text-xs text-[#64748b] max-w-md">
              Built on continuous botanical cross-checks, regulatory compliance indexing, and zero algorithmic delay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Cell 1: Visual Sample Scanner Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono-tech text-[10px] text-[#64748b] uppercase tracking-wider">
                    Sample Product Verdict
                  </span>
                  <span className="bg-[#ecfccb] text-[#65a30d] font-mono-tech text-xs px-2.5 py-0.5 rounded-full font-bold">
                    Grade A (94/100)
                  </span>
                </div>
                <div className="h-44 rounded-2xl overflow-hidden relative bg-slate-100 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80"
                    alt="Oat Milk Packaging"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-transparent to-transparent flex items-end p-4">
                    <div className="text-white">
                      <p className="font-bold text-sm">Cold-Pressed Golden Oat Milk</p>
                      <p className="text-[11px] text-slate-300">Barcode: 8 934201 002914</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-[#64748b] leading-relaxed">
                  100% Free of gluten cross-contact, synthetic gums, and carrageenan thickeners.
                </p>
              </div>
              <div
                onClick={() => setActiveTab('product-analysis')}
                className="mt-4 flex items-center gap-1 font-mono-tech text-xs font-bold text-[#65a30d] hover:underline cursor-pointer"
              >
                <span>View Full Clinical Report</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>

            {/* Bento Cell 2: Real-time Allergen Matrix SVG Chart */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono-tech text-[10px] text-[#64748b] uppercase tracking-wider">
                    Allergen Shield Sensitivity
                  </span>
                  <span className="material-symbols-outlined text-[#65a30d] text-lg">donut_large</span>
                </div>
                <h3 className="text-base font-bold text-[#0f172a]">FALCPA 9 &amp; EU 14 Profiles</h3>
                {/* SVG Sensitivity Ring */}
                <div className="flex items-center justify-center py-2">
                  <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" fill="transparent" r="40" stroke="#f0f3ff" strokeWidth="12" />
                    <circle
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r="40"
                      stroke="#84cc16"
                      strokeDasharray="251.2"
                      strokeDashoffset="70.3"
                      strokeLinecap="round"
                      strokeWidth="12"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r="40"
                      stroke="#d97706"
                      strokeDasharray="251.2"
                      strokeDashoffset="205.9"
                      strokeLinecap="round"
                      strokeWidth="12"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r="40"
                      stroke="#e11d48"
                      strokeDasharray="251.2"
                      strokeDashoffset="226"
                      strokeLinecap="round"
                      strokeWidth="12"
                    />
                  </svg>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-[#ecfccb] p-2 rounded-xl">
                    <p className="font-mono-tech text-[10px] text-[#65a30d] font-bold">Safe</p>
                    <p className="font-extrabold text-sm text-[#0f172a]">88%</p>
                  </div>
                  <div className="bg-[#fffbeb] p-2 rounded-xl">
                    <p className="font-mono-tech text-[10px] text-[#d97706] font-bold">Trace</p>
                    <p className="font-extrabold text-sm text-[#0f172a]">9%</p>
                  </div>
                  <div className="bg-[#fff1f2] p-2 rounded-xl">
                    <p className="font-mono-tech text-[10px] text-[#e11d48] font-bold">Flagged</p>
                    <p className="font-extrabold text-sm text-[#0f172a]">3%</p>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-[#64748b] mt-3">Calculated against your personalized intolerance taxonomy.</p>
            </div>

            {/* Bento Cell 3: Food Transparency & E-Code Index */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono-tech text-[10px] text-[#64748b] uppercase tracking-wider">
                    E-Code Additive Lexicon
                  </span>
                  <span className="bg-[#f0f3ff] text-[#565e74] font-mono-tech text-[10px] px-2 py-0.5 rounded-full font-bold">
                    Live Synced
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#0f172a]">Chemical Clarity In Real Time</h3>
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#f8fafc]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#84cc16]"></span>
                      <span className="font-mono-tech text-xs text-[#0f172a]">E300 (Ascorbic Acid)</span>
                    </div>
                    <span className="font-mono-tech text-[10px] text-[#65a30d] font-bold">Natural C</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#f8fafc]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#d97706]"></span>
                      <span className="font-mono-tech text-xs text-[#0f172a]">E250 (Sodium Nitrite)</span>
                    </div>
                    <span className="font-mono-tech text-[10px] text-[#d97706] font-bold">Moderate Caut.</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#f8fafc]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#e11d48]"></span>
                      <span className="font-mono-tech text-xs text-[#0f172a]">E102 (Tartrazine)</span>
                    </div>
                    <span className="font-mono-tech text-[10px] text-[#e11d48] font-bold">Histamine Flag</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between pt-2">
                <span className="text-[11px] text-[#64748b]">740+ Additives Indexed</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('ingredient-clarity')}
                  className="font-mono-tech text-xs font-bold text-[#65a30d] hover:underline"
                >
                  Explore Index
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
