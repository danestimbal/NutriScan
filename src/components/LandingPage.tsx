import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLandingSettings } from '../hooks/useLandingSettings';
import { FoodProduct } from '../types';
import { Heading, PILL_BTN, PRIMARY_BTN, gradeClass } from './landingUi';

type AuthMode = 'login' | 'create';

interface LandingPageProps {
  onOpenAuth: (mode: AuthMode, prefill?: { name?: string; email?: string }) => void;
}

const WHITE = '#FFFFFF';

const DECODED_CODES = [
  {
    code: 'E102',
    name: 'Tartrazine (Yellow 5)',
    plain: 'A synthetic yellow dye. Some people with asthma or histamine sensitivity react to it.',
    badge: 'High Caution',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    code: 'E250',
    name: 'Sodium Nitrite',
    plain: 'A curing salt that keeps processed meat pink. Best kept to occasional servings.',
    badge: 'Limit Intake',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    code: 'E300',
    name: 'Ascorbic Acid',
    plain: 'Vitamin C, added as an antioxidant so food keeps its colour and freshness.',
    badge: 'Safe',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    code: 'E322',
    name: 'Lecithin',
    plain: 'A plant emulsifier that keeps oil and water mixed. Often made from soy, so check the source.',
    badge: 'Verify Source',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
];

const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

/** Small curved notch that lets the next section's colour poke up into this one. */
const Notch: React.FC<{ color: string }> = ({ color }) => (
  <svg
    viewBox="0 0 80 26"
    className="absolute -bottom-px left-1/2 -translate-x-1/2 w-20 h-[26px] pointer-events-none"
    aria-hidden="true"
  >
    <path d="M0,26 C24,26 34,17 40,0 C46,17 56,26 80,26 Z" fill={color} />
  </svg>
);

const Decor: React.FC<{ icon: string; className: string }> = ({ icon, className }) => (
  <span
    aria-hidden="true"
    className={`material-symbols-outlined absolute pointer-events-none select-none max-md:hidden! ${className}`}
  >
    {icon}
  </span>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  const { products, isLoggedIn, enterGuestMode, setActiveTab, setSelectedProductId } = useApp();
  const settings = useLandingSettings();
  const { theme, hero, why, join, steps, features, decoder, testimonials, about } = settings;

  const [joinName, setJoinName] = useState('');
  const [joinEmail, setJoinEmail] = useState('');

  const tint = theme.pageTint || '#EEF2FF';

  const openProduct = (product: FoodProduct) => {
    setSelectedProductId(product.id);
    setActiveTab('product-analysis');
    window.scrollTo({ top: 0 });
  };

  const sampleProduct = useMemo(
    // Showcase a reviewed product with a real grade, never an unreviewed import
    () =>
      products.find((p) => p.isVerified && !p.dataGaps?.length && p.allergensDetected?.length > 0 && p.image) ||
      products.find((p) => p.isVerified && !p.dataGaps?.length) ||
      products[0],
    [products]
  );

  const startPrimary = () => (isLoggedIn ? setActiveTab('dashboard') : onOpenAuth('create'));
  // Signed-in users keep their own profile; only visitors get a guest session.
  const enterApp = async (tab: 'dashboard' | 'scanner') => {
    if (!isLoggedIn) await enterGuestMode();
    setActiveTab(tab);
  };

  const joinBand = (id: string, nextColor: string) =>
    join.show && (
      <section id={id} className="relative px-4 sm:px-6 lg:px-8 py-16" style={{ backgroundColor: tint }}>
        {hero.showDecor && (
          <>
            <Decor icon="eco" className="left-[4%] bottom-10 text-5xl! text-[#5379EE]/40 -rotate-12" />
            <Decor icon="nutrition" className="right-[6%] top-8 text-5xl! text-[#4F46E5]/35 rotate-12" />
          </>
        )}
        <div className="relative max-w-4xl mx-auto text-center">
          <Heading lead={join.titleLead} accent={join.titleAccent} />
          <p className="mt-4 text-sm font-medium text-[#334155]">{join.subtitle}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onOpenAuth('create', { name: joinName.trim(), email: joinEmail.trim() });
            }}
            className="mt-7 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2.5"
          >
            <input
              type="text"
              value={joinName}
              onChange={(e) => setJoinName(e.target.value)}
              placeholder="Name"
              aria-label="Name"
              className="h-11 px-5 rounded-full bg-white border border-[#CBD5E1] text-sm text-[#1E293B] placeholder:text-slate-400 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
            />
            <input
              type="email"
              value={joinEmail}
              onChange={(e) => setJoinEmail(e.target.value)}
              placeholder="Email"
              aria-label="Email"
              className="h-11 px-5 rounded-full bg-white border border-[#CBD5E1] text-sm text-[#1E293B] placeholder:text-slate-400 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
            />
            <button type="submit" className={`${PILL_BTN} ${PRIMARY_BTN} h-11 px-7`}>
              {join.buttonLabel}
            </button>
          </form>
          {join.note && (
            <p className="mt-4 text-xs text-[#475569] flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-[#2563EB]">verified_user</span>
              {join.note}
            </p>
          )}
        </div>
        <Notch color={nextColor} />
      </section>
    );

  return (
    <div className="relative w-full text-[#1E293B]" style={{ backgroundColor: tint }}>
      {/* Blob mask for the hero photo */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="lp-hero-blob" clipPathUnits="objectBoundingBox">
            <path d="M0.1,0 C0.2,0.22 0,0.46 0.16,0.7 C0.3,0.9 0.52,1 0.7,0.88 C0.84,0.79 0.94,0.84 1,1 L1,0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* White canvas holding hero + why, with the big curved bottom-left corner */}
      <div className="relative bg-white rounded-bl-[80px] lg:rounded-bl-[200px] overflow-hidden">
        {/* ============ HERO ============ */}
        <section className="relative">
          <div
            className="hidden lg:block absolute top-0 right-0 w-[58%] h-[660px] pointer-events-none"
            style={{ clipPath: 'url(#lp-hero-blob)' }}
          >
            {hero.backgroundImage && (
              <img src={hero.backgroundImage} alt="" className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1E3A8A]/60 via-[#2563EB]/25 to-[#1E3A8A]/30" />
          </div>

          {/* Header */}
          <header className="absolute top-0 left-0 right-0 z-30">
            <div className="max-w-7xl mx-auto h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-2.5 text-left cursor-pointer"
              >
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] via-[#5379EE] to-[#6366F1] flex items-center justify-center text-white shadow-[0_4px_14px_rgba(83,121,238,0.35)]">
                  <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
                </span>
                <span>
                  <span className="font-black text-xl tracking-tight leading-none block">
                    Ingre<span className="text-[#2563EB]">Guide</span>
                  </span>
                  <span className="hidden sm:block text-[9px] font-bold uppercase tracking-[0.18em] text-[#64748B] mt-0.5">
                    Read with sight
                  </span>
                </span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('catalog');
                    window.scrollTo({ top: 0 });
                  }}
                  aria-label="Product Catalog"
                  className={`${PILL_BTN} h-9 px-3 md:px-4 text-[#334155] hover:text-[#2563EB] hover:bg-[#EEF2FF] lg:text-white lg:hover:text-white lg:hover:bg-white/15 gap-1.5`}
                >
                  <span className="material-symbols-outlined text-lg md:hidden!">storefront</span>
                  <span className="max-md:hidden">Product Catalog</span>
                </button>
                <button
                  type="button"
                  onClick={() => enterApp('dashboard')}
                  className={`${PILL_BTN} max-sm:hidden h-9 px-4 bg-[#1E293B] hover:bg-[#0F172A] text-white`}
                >
                  {hero.secondaryCta}
                </button>
                <button type="button" onClick={startPrimary} className={`${PILL_BTN} ${PRIMARY_BTN} h-9 px-4`}>
                  {isLoggedIn ? 'Dashboard' : hero.primaryCta}
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className={`${PILL_BTN} h-9 px-4 border border-[#CBD5E1] text-[#334155] hover:bg-[#EEF2FF] lg:border-white/80 lg:text-white lg:hover:bg-white/15`}
                >
                  Sign In
                </button>
              </div>
            </div>
          </header>

          {hero.showDecor && (
            <>
              <Decor icon="eco" className="left-[22%] top-28 text-4xl! text-[#5379EE] -rotate-[20deg]" />
              <Decor icon="nutrition" className="left-[7%] bottom-10 text-6xl! text-[#4F46E5]/70 rotate-12" />
              <Decor icon="spa" className="right-[3%] top-36 text-5xl! text-white/90 rotate-[18deg] max-lg:hidden!" />
            </>
          )}

          {/* Section jump dots */}
          <div className="hidden lg:flex flex-col items-center gap-2.5 absolute right-5 top-[300px] z-20">
            {['why', 'join', 'how-it-works', 'about'].map((id, idx) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollToId(id)}
                aria-label={`Jump to ${id.replace(/-/g, ' ')}`}
                className={`rounded-full bg-white cursor-pointer transition-transform hover:scale-125 ${
                  idx === 0 ? 'w-3.5 h-3.5 ring-2 ring-white/50 ring-offset-2 ring-offset-transparent' : 'w-2.5 h-2.5'
                }`}
              />
            ))}
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-40 pb-14 lg:min-h-[660px] grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6">
            {/* Copy */}
            <div className="lg:col-span-5 flex flex-col items-start">
              <Heading
                as="h1"
                lead={hero.titleLead}
                accent={hero.titleAccent}
                className="text-4xl sm:text-5xl lg:text-[52px]"
              />
              <p className="mt-6 text-base text-[#334155] leading-relaxed max-w-md">{hero.subtitle}</p>

              <div className="mt-8 flex flex-wrap items-center gap-2.5">
                <button type="button" onClick={startPrimary} className={`${PILL_BTN} ${PRIMARY_BTN} h-12 px-9`}>
                  {hero.primaryCta}
                </button>
                <button
                  type="button"
                  onClick={() => enterApp('dashboard')}
                  className={`${PILL_BTN} h-12 px-7 bg-[#1E293B] hover:bg-[#0F172A] text-white shadow-[0_10px_24px_rgba(15,23,42,0.2)]`}
                >
                  {hero.secondaryCta}
                </button>
              </div>

              {/* Dashed loop arrow + rotating seal */}
              <div className="hidden sm:flex items-center gap-3 mt-8 self-end">
                <svg width="135" height="64" viewBox="0 0 135 64" fill="none" className="text-[#94A3B8]" aria-hidden="true">
                  <path
                    d="M4 12 C32 58, 72 62, 66 28 C60 2, 34 24, 58 46 C82 64, 112 52, 128 34"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeDasharray="5 5"
                    strokeLinecap="round"
                  />
                  <path d="M121 32 L130 32 L128 41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <button
                  type="button"
                  onClick={() => scrollToId('how-it-works')}
                  title="See how it works"
                  className="relative w-24 h-24 rounded-full bg-white border-2 border-[#BFDBFE] shadow-[0_12px_30px_rgba(37,99,235,0.18)] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full p-1 animate-[spin_18s_linear_infinite]">
                    <defs>
                      <path id="lp-seal-path" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                    </defs>
                    <text className="text-[9.5px] font-bold uppercase fill-[#2563EB] tracking-[0.19em]">
                      <textPath href="#lp-seal-path">{hero.sealText}</textPath>
                    </text>
                  </svg>
                  <span className="absolute w-11 h-11 rounded-full bg-gradient-to-br from-[#2563EB] to-[#4F46E5] text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">eco</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Photo side: overlay image or live scan card + promo bubble */}
            <div className="lg:col-span-7 relative min-h-[340px] lg:min-h-[440px] flex items-center justify-center">
              <div className="lg:hidden absolute inset-0 rounded-[36px] overflow-hidden">
                {hero.backgroundImage && (
                  <img src={hero.backgroundImage} alt="" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#1E3A8A]/60 via-[#2563EB]/25 to-[#1E3A8A]/30" />
              </div>

              {(hero.badgeLine1 || hero.badgeLine2) && (
                <div className="absolute top-0 right-16 z-20 rotate-12 w-28 h-24 rounded-[50%] border-2 border-white hidden lg:flex flex-col items-center justify-center text-white text-sm font-extrabold leading-tight uppercase tracking-wide text-center">
                  <span>{hero.badgeLine1}</span>
                  <span>{hero.badgeLine2}</span>
                </div>
              )}

              {hero.overlayImage ? (
                <img
                  src={hero.overlayImage}
                  alt=""
                  className="relative z-10 max-h-[300px] lg:max-h-[440px] max-w-[85%] object-contain drop-shadow-[0_24px_40px_rgba(15,23,42,0.35)]"
                />
              ) : (
                sampleProduct && (
                  <button
                    type="button"
                    onClick={() => openProduct(sampleProduct)}
                    className="relative z-10 w-64 sm:w-72 text-left bg-white rounded-3xl p-4 shadow-[0_30px_60px_rgba(15,23,42,0.35)] -rotate-3 hover:rotate-0 transition-transform cursor-pointer lg:-translate-x-10"
                  >
                    <span className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-[#2563EB]">
                        <span className="material-symbols-outlined text-base">barcode_scanner</span>
                        Scan result
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${gradeClass(sampleProduct.nutriScore)}`}>
                        Grade {sampleProduct.nutriScore}
                      </span>
                    </span>
                    <img
                      src={sampleProduct.image}
                      alt={sampleProduct.name}
                      className="mt-3 w-full h-32 object-cover rounded-2xl bg-slate-100"
                    />
                    <span className="mt-3 block text-sm font-extrabold leading-snug line-clamp-2">{sampleProduct.name}</span>
                    <span className="block text-[11px] text-[#64748B] truncate">{sampleProduct.brand}</span>
                    <span className="mt-2.5 flex flex-wrap gap-1">
                      {sampleProduct.allergensDetected.length > 0 ? (
                        sampleProduct.allergensDetected.slice(0, 3).map((a) => (
                          <span key={a} className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                            {a}
                          </span>
                        ))
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                          No major allergens declared
                        </span>
                      )}
                    </span>
                    <span className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#2563EB]">
                      See full analysis
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </span>
                  </button>
                )
              )}
            </div>
          </div>
        </section>

        {/* ============ WHY ============ */}
        {why.show && (
          <section id="why" className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 lg:pb-28 scroll-mt-6">
            {hero.showDecor && (
              <>
                <Decor icon="egg_alt" className="-left-10 bottom-24 text-8xl! text-slate-200" />
                <Decor icon="local_florist" className="-left-6 top-10 text-8xl! text-slate-200" />
              </>
            )}
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="flex items-start justify-center gap-5 sm:gap-7">
                {[why.imageOne, why.imageTwo].map((src, idx) => (
                  <div
                    key={idx}
                    className={`w-40 sm:w-52 aspect-[3/5] rounded-full p-1.5 border border-slate-200 bg-white shadow-xs ${
                      idx === 1 ? 'mt-16' : ''
                    }`}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#EEF2FF]">
                      {src && <img src={src} alt="" className="w-full h-full object-cover" />}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <Heading lead={why.titleLead} accent={why.titleAccent} />
                <p className="mt-5 text-sm font-semibold text-[#1E293B] leading-relaxed">{why.lead}</p>
                <p className="mt-3 text-sm text-[#475569] leading-loose whitespace-pre-line">{why.body}</p>
                {why.tagline && <p className="mt-3 text-sm text-[#475569]">{why.tagline}</p>}
                <button
                  type="button"
                  onClick={() => scrollToId('how-it-works')}
                  className={`${PILL_BTN} ${PRIMARY_BTN} mt-7 h-11 px-9`}
                >
                  {why.buttonLabel}
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ============ JOIN ============ */}
      {joinBand('join', WHITE)}

      {/* ============ HOW IT WORKS ============ */}
      {steps.show && (
        <section id="how-it-works" className="relative bg-white px-4 sm:px-6 lg:px-8 py-20 scroll-mt-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center">
              <Heading lead={steps.titleLead} accent={steps.titleAccent} />
              <p className="mt-4 text-sm font-medium text-[#334155]">{steps.subtitle}</p>
            </div>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {steps.items.map((item, idx) => (
                <div
                  key={idx}
                  className={`relative overflow-hidden rounded-xl px-5 pt-8 pb-9 text-center ${
                    idx % 2 === 0 ? 'bg-[#EEF2FF]' : 'bg-[#F1F5F9]'
                  }`}
                >
                  <span className="absolute -top-5 -left-5 w-20 h-20 rounded-full bg-white/80 flex items-end justify-end pr-5 pb-3 text-3xl font-extrabold text-[#93A8E8]">
                    {idx + 1}
                  </span>
                  <span className="material-symbols-outlined text-[52px]! text-[#3B5BDB]">{item.icon}</span>
                  <h3 className="mt-3 text-lg font-bold leading-snug">{item.title}</h3>
                  <p className="mt-3 text-[13px] text-[#475569] leading-loose">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <Notch color={tint} />
        </section>
      )}

      {/* ============ FEATURES ============ */}
      {features.show && (
        <section className="relative px-4 sm:px-6 lg:px-8 py-20 overflow-hidden" style={{ backgroundColor: tint }}>
          {features.sideImage && (
            <img
              src={features.sideImage}
              alt=""
              className="hidden xl:block absolute right-14 top-16 w-36 h-36 rounded-full object-cover border-2 border-[#1E293B]/70 p-1 bg-white"
            />
          )}
          <div className="max-w-5xl mx-auto">
            <div className="text-center">
              <Heading lead={features.titleLead} accent={features.titleAccent} />
              <p className="mt-4 text-sm font-medium text-[#334155]">{features.subtitle}</p>
            </div>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
              {features.items.map((item, idx) => (
                <div key={idx} className="text-center">
                  <span className="mx-auto w-[72px] h-[72px] rounded-full bg-white border border-[#C7D2FE] shadow-[0_6px_18px_rgba(83,121,238,0.15)] flex items-center justify-center text-[#2563EB]">
                    <span className="material-symbols-outlined text-[34px]!">{item.icon}</span>
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-[13px] text-[#475569] leading-loose max-w-[260px] mx-auto">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <Notch color="#E6ECFB" />
        </section>
      )}

      {/* ============ DECODER CARDS (+ TESTIMONIALS WHEN PROVIDED) ============ */}
      {(decoder.show || (testimonials.show && testimonials.items.length > 0)) && (
        <section className="relative bg-gradient-to-br from-[#E6ECFB] via-[#EEF2FF] to-[#E0E7FF] px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
          <span
            aria-hidden="true"
            className="absolute -left-24 top-10 w-[420px] h-[420px] rounded-[90px] border-[40px] border-white/40 rotate-12 pointer-events-none"
          />
          <div className="relative max-w-6xl mx-auto space-y-16">
            {decoder.show && (
              <div>
                <div className="text-center">
                  <Heading lead={decoder.titleLead} accent={decoder.titleAccent} />
                  <p className="mt-4 text-sm font-medium text-[#334155]">{decoder.subtitle}</p>
                </div>
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {DECODED_CODES.map((item) => (
                    <div key={item.code} className="bg-white rounded-xl p-5 shadow-[0_10px_30px_rgba(83,121,238,0.1)]">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.color}`}>
                        {item.badge}
                      </span>
                      <p className="mt-3 text-[13px] text-[#475569] leading-loose">“{item.plain}”</p>
                      <div className="mt-4 flex items-center gap-3">
                        <span className="w-11 h-11 rounded-full bg-[#EEF2FF] text-[#2563EB] text-[11px] font-black flex items-center justify-center shrink-0">
                          {item.code}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-bold truncate">{item.name}</span>
                          <span className="block text-xs text-[#64748B]">On the label as {item.code}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {testimonials.show && testimonials.items.length > 0 && (
              <div>
                <div className="text-center">
                  <Heading lead={testimonials.titleLead} accent={testimonials.titleAccent} />
                  <p className="mt-4 text-sm font-medium text-[#334155]">{testimonials.subtitle}</p>
                </div>
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {testimonials.items.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-5 shadow-[0_10px_30px_rgba(83,121,238,0.1)]">
                      <span className="flex text-amber-400" aria-label="5 out of 5 stars">
                        {[0, 1, 2, 3, 4].map((s) => (
                          <span key={s} className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                        ))}
                      </span>
                      <p className="mt-3 text-[13px] text-[#475569] leading-loose">“{item.quote}”</p>
                      <div className="mt-4 flex items-center gap-3">
                        <span className="w-11 h-11 rounded-full bg-gradient-to-br from-[#2563EB] to-[#4F46E5] text-white font-black text-sm flex items-center justify-center uppercase shrink-0">
                          {item.name.trim().charAt(0) || '?'}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-bold truncate">{item.name}</span>
                          <span className="block text-xs text-[#64748B] truncate">{item.role}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ============ ABOUT SPLIT ============ */}
      {about.show && (
        <section id="about" className="relative grid grid-cols-1 lg:grid-cols-2 bg-white scroll-mt-6">
          <div className="min-h-[280px] lg:min-h-[480px] bg-[#EEF2FF]">
            {about.image && <img src={about.image} alt="" className="w-full h-full object-cover" />}
          </div>
          <div className="relative overflow-hidden bg-gradient-to-br from-[#1E3A8A] via-[#2F4FC4] to-[#3B5BDB] text-white px-6 sm:px-12 py-14 lg:py-20 lg:rounded-bl-[48px] flex flex-col justify-center">
            {hero.showDecor && (
              <Decor icon="nutrition" className="-right-8 top-1/2 -translate-y-1/2 text-[220px]! text-white/10 rotate-12" />
            )}
            <div className="relative max-w-md">
              <Heading lead={about.titleLead} accent={about.titleAccent} light />
              <p className="mt-6 text-sm text-blue-50 leading-loose whitespace-pre-line">{about.body}</p>
              {about.tagline && <p className="mt-3 text-sm text-blue-100">{about.tagline}</p>}
              <button
                type="button"
                onClick={startPrimary}
                className={`${PILL_BTN} mt-7 h-11 px-9 bg-white text-[#1E3A8A] hover:bg-[#EEF2FF] shadow-[0_10px_24px_rgba(15,23,42,0.25)]`}
              >
                {about.buttonLabel}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ============ JOIN (REPEAT BEFORE FOOTER) ============ */}
      {joinBand('join-footer', '#F0F3FF')}
    </div>
  );
};
