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
        email: identifier.includes('@') ? identifier : `${identifier}@nutriscan.local`,
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
            <div className="inline-flex items-center gap-2 self-start bg-[#ecfccb] px-3.5 py-1.5 rounded-full shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#84cc16] animate-pulse"></span>
              <span className="font-mono-tech text-xs text-[#65a30d] font-bold uppercase tracking-wider">
                v2.4 Live • FDA FALCPA &amp; EU FIC Verified
              </span>
            </div>

            {/* Main Impact Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0f172a] tracking-tight leading-tight">
                Know what you eat <br />
                <span className="text-[#65a30d]">before you take a bite.</span>
              </h1>
              <p className="text-base text-[#565e74] max-w-xl leading-relaxed">
                Decode deceptive food labels, spot hidden allergens instantly, and personalize dietary guardrails with
                medical-grade clarity right in your browser or phone.
              </p>
            </div>

            {/* Micro Visual Strip: Live Ingredient Clarifier Pill Ribbon */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 bg-[#fff1f2] text-[#e11d48] font-mono-tech text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                <span className="material-symbols-outlined text-sm">warning</span>
                <span>Casein &amp; Whey Detected</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-[#ecfccb] text-[#65a30d] font-mono-tech text-xs font-bold px-3 py-1 rounded-full shadow-xs">
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
              <div className="bg-white hover:bg-[#f7fee7] p-4 rounded-2xl border border-slate-100 shadow-sm transition-all flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#ecfccb] text-[#65a30d] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">barcode_scanner</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#0f172a]">Instant Barcode &amp; Photo Scan</h3>
                    <span className="font-mono-tech text-[10px] text-[#65a30d] font-bold uppercase bg-[#ecfccb]/80 px-2 py-0.5 rounded-full">
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
              <div className="bg-white hover:bg-[#f7fee7] p-4 rounded-2xl border border-slate-100 shadow-sm transition-all flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#ecfccb] text-[#65a30d] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">radar</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#0f172a]">Personal Allergen Shield</h3>
                    <span className="font-mono-tech text-[10px] text-[#65a30d] font-bold uppercase bg-[#ecfccb]/80 px-2 py-0.5 rounded-full">
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
              <div className="bg-white hover:bg-[#f7fee7] p-4 rounded-2xl border border-slate-100 shadow-sm transition-all flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#ecfccb] text-[#65a30d] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">translate</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#0f172a]">Jargon-Free Simplified Breakdown</h3>
                    <span className="font-mono-tech text-[10px] text-[#65a30d] font-bold uppercase bg-[#ecfccb]/80 px-2 py-0.5 rounded-full">
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
                <span className="material-symbols-outlined text-[#65a30d] text-2xl">inventory_2</span>
                <div>
                  <p className="font-bold text-base text-[#0f172a] leading-none">14,800+</p>
                  <p className="text-xs text-[#64748b] mt-0.5">Verified Products</p>
                </div>
              </div>
              <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#65a30d] text-2xl">group</span>
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

          {/* Right Column: Authentication Card & Clinical Portal */}
          <div className="lg:col-span-5 flex flex-col items-center w-full">
            <div className="w-full bg-white rounded-3xl shadow-xl border border-[#e2e8f0] p-6 sm:p-8 relative">
              {/* Radiant Chartreuse Accent Bar */}
              <div className="absolute -top-1 left-8 right-8 h-1.5 bg-gradient-to-r from-[#a3e635] via-[#84cc16] to-[#65a30d] rounded-t-3xl"></div>

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#0f172a]">Access NutriScan</h2>
                  <p className="text-xs text-[#64748b]">Synchronize your allergen shield profile</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#ecfccb] flex items-center justify-center text-[#65a30d]">
                  <span className="material-symbols-outlined text-xl">shield_with_heart</span>
                </div>
              </div>

              {/* Segmented Pill Tabs */}
              <div className="flex bg-[#f0f3ff] p-1 rounded-full mb-6">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2 rounded-full font-mono-tech text-xs font-bold transition-all ${
                    authMode === 'login'
                      ? 'bg-white text-[#0f172a] shadow-sm'
                      : 'text-[#64748b] hover:text-[#0f172a]'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('create')}
                  className={`flex-1 py-2 rounded-full font-mono-tech text-xs font-bold transition-all ${
                    authMode === 'create'
                      ? 'bg-white text-[#0f172a] shadow-sm'
                      : 'text-[#64748b] hover:text-[#0f172a]'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {authMode === 'create' && (
                  <div className="space-y-1">
                    <label className="block font-mono-tech text-xs text-[#1e293b] font-semibold">
                      Full Clinical or Display Name
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-[#94a3b8] text-lg pointer-events-none">
                        badge
                      </span>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Dr. Sarah Jenkins"
                        className="w-full h-11 pl-10 pr-4 rounded-full bg-[#f8fafc] border border-[#e2e8f0] text-sm text-[#0f172a] outline-none focus:bg-white focus:ring-2 focus:ring-[#84cc16]/20 focus:border-[#84cc16] transition-all"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block font-mono-tech text-xs text-[#1e293b] font-semibold">
                    Email or Mobile Phone Number
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-[#94a3b8] text-lg pointer-events-none">
                      account_circle
                    </span>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="name@nutrition-lab.com or +1 (555)"
                      className="w-full h-11 pl-10 pr-4 rounded-full bg-[#f8fafc] border border-[#e2e8f0] text-sm text-[#0f172a] outline-none focus:bg-white focus:ring-2 focus:ring-[#84cc16]/20 focus:border-[#84cc16] transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block font-mono-tech text-xs text-[#1e293b] font-semibold">Password</label>
                    <button
                      type="button"
                      onClick={() => alert('Password reset link simulated to registered email.')}
                      className="font-mono-tech text-[11px] text-[#65a30d] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-[#94a3b8] text-lg pointer-events-none">
                      lock
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full h-11 pl-10 pr-10 rounded-full bg-[#f8fafc] border border-[#e2e8f0] text-sm text-[#0f172a] outline-none focus:bg-white focus:ring-2 focus:ring-[#84cc16]/20 focus:border-[#84cc16] transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-[#94a3b8] hover:text-[#0f172a]"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded text-[#84cc16] border-slate-300 accent-[#84cc16]"
                    />
                    <span className="text-xs text-[#64748b]">Remember session for 30 days</span>
                  </label>
                </div>

                {/* Primary Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-full bg-[#84cc16] hover:bg-[#65a30d] text-[#0f172a] hover:text-white font-mono-tech text-sm font-bold transition-all shadow-[0_4px_16px_rgba(132,204,22,0.35)] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <span className="material-symbols-outlined text-lg animate-spin">refresh</span>
                  ) : (
                    <>
                      <span>{authMode === 'login' ? 'Log In to NutriScan' : 'Create Free Allergen Shield'}</span>
                      <span className="material-symbols-outlined text-xl">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>

              {/* Fast Track Divider */}
              <div className="relative flex items-center justify-center my-6">
                <div className="w-full h-px bg-slate-200"></div>
                <span className="absolute bg-white px-3 font-mono-tech text-[10px] text-[#64748b] uppercase tracking-wider">
                  OR FAST-TRACK WITH
                </span>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="h-11 rounded-full bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] text-xs font-semibold text-[#0f172a] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={enterGuestMode}
                  className="h-11 rounded-full bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] text-xs font-semibold text-[#0f172a] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-base text-[#0f172a]">fingerprint</span>
                  <span>Passkey</span>
                </button>
              </div>

              {/* Guest Scan Link */}
              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={enterGuestMode}
                  className="font-mono-tech text-xs text-[#65a30d] hover:text-[#0f172a] inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full hover:bg-[#ecfccb]/50 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
                  <span>Try Scanning as Guest without an Account</span>
                </button>
              </div>
            </div>

            {/* Medical Guardrail Notice */}
            <div className="w-full mt-4 bg-[#f8fafc] border border-slate-200/70 p-3.5 rounded-2xl flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#be0037] text-lg shrink-0 mt-0.5">
                health_and_safety
              </span>
              <p className="text-xs text-[#64748b] leading-tight">
                <strong className="text-[#0f172a]">NutriScan Medical Guardrail:</strong> This platform assists in
                detecting harmful allergens and additives. Always consult your primary allergist or physician for
                life-threatening anaphylactic conditions.
              </p>
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
