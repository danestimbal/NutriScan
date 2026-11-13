import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LandingPage } from '../components/LandingPage';

export const AuthScreen: React.FC = () => {
  const {
    enterGuestMode,
    handleGoogleLogin,
    handleFacebookLogin,
    handleEmailLogin,
    handleEmailRegister,
    handlePasswordReset,
    updateUserProfile,
    setActiveTab,
  } = useApp();

  // Modal & Auth State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'create'>('login');
  const [identifier, setIdentifier] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showFacebookDemoOption, setShowFacebookDemoOption] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        setIsAuthModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen]);

  const openAuthModal = (mode: 'login' | 'create', prefill?: { name?: string; email?: string }) => {
    setAuthMode(mode);
    if (prefill?.name) setFullName(prefill.name);
    if (prefill?.email) setIdentifier(prefill.email);
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsAuthModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (authMode === 'create') {
        if (!fullName.trim()) {
          setErrorMessage('Please enter your full name.');
          setLoading(false);
          return;
        }
        await handleEmailRegister(identifier.trim(), password, fullName.trim());
      } else {
        await handleEmailLogin(identifier.trim(), password);
      }
      setIsAuthModalOpen(false);
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = 'Authentication failed. Please verify your credentials.';
      const code = err?.code || '';
      if (code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please switch to Login.';
      } else if (code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters long.';
      } else if (
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-credential'
      ) {
        msg = 'Invalid email or password. Please verify and try again, or register a new account.';
      } else if (code === 'auth/network-request-failed') {
        msg = 'Network connection failed. Please check your internet connection.';
      } else if (err?.message) {
        msg = err.message;
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);
    try {
      await handleGoogleLogin();
      setIsAuthModalOpen(false);
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Google Sign-in was cancelled.');
      } else if (err?.code === 'auth/popup-blocked') {
        setErrorMessage('Pop-up was blocked by browser. Please enable pop-ups for this site.');
      } else {
        setErrorMessage(err?.message || 'Google Sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookAuth = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);
    try {
      await handleFacebookLogin();
      setIsAuthModalOpen(false);
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Facebook Sign-in was cancelled.');
      } else if (err?.code === 'auth/popup-blocked') {
        setErrorMessage('Pop-up was blocked by browser. Please allow pop-ups for this site.');
      } else if (
        err?.code === 'auth/operation-not-allowed' ||
        err?.code === 'auth/configuration-not-found' ||
        err?.message?.includes('operation-not-allowed')
      ) {
        setErrorMessage(
          'Facebook Login is not yet enabled in your Firebase Console (requires a Meta App ID & Secret). You can use Google Sign-in or Email/Password, or click below to simulate with a Facebook profile.'
        );
        setShowFacebookDemoOption(true);
      } else {
        setErrorMessage(err?.message || 'Facebook Sign-in could not be completed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!identifier || !identifier.includes('@')) {
      setErrorMessage('Please type a valid email in the Email Address field to receive password reset instructions.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      await handlePasswordReset(identifier.trim());
      setSuccessMessage(`Password reset link has been dispatched to ${identifier}. Check your inbox.`);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Could not send reset email. Ensure the email address is correct.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen relative overflow-x-hidden selection:bg-[#5379EE] selection:text-white">
      {/* Front page (content is editable from Admin Console → Front Page Settings) */}
      <LandingPage onOpenAuth={openAuthModal} />

      {/* SEPARATED LOGIN / REGISTER MODAL (Theme-Complementary Header instead of Black) */}
      {isAuthModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E293B]/45 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setIsAuthModalOpen(false)}
        >
          <div
            className="w-full max-w-md my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full bg-white rounded-3xl shadow-[0_25px_70px_rgba(37,99,235,0.22)] border border-[#DBEAFE] overflow-hidden relative">
              {/* Top Modal Header Banner in Theme Gradient */}
              <div className="bg-gradient-to-r from-[#2563EB] via-[#5379EE] to-[#4F46E5] p-6 text-white relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-white/15 blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/35 flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-white text-xl">qr_code_scanner</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-sans font-black text-lg tracking-tight leading-none">
                          IngreGuide
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold border border-white/30">
                          ACCOUNT
                        </span>
                      </div>
                      <p className="text-[11px] text-blue-100 mt-1">
                        {authMode === 'login'
                          ? 'Sign in to use your saved allergen profile and scan history.'
                          : 'Create an account to save your allergen profile.'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
                    aria-label="Close modal"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>
              </div>

              <div className="p-6 sm:p-7 max-h-[82vh] overflow-y-auto">
                {/* Segmented Mode Selector */}
                <div className="flex bg-[#EEF2FF] p-1 rounded-2xl mb-5 border border-[#DBEAFE]">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      authMode === 'login'
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'text-[#475569] hover:text-[#1E293B]'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('create');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      authMode === 'create'
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'text-[#475569] hover:text-[#1E293B]'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="mb-4 p-3.5 rounded-2xl bg-[#fff1f2] border border-[#fecdd3] text-[#e11d48] text-xs flex items-start gap-2.5 animate-in fade-in">
                    <span className="material-symbols-outlined text-base shrink-0 mt-0.5">error</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold leading-relaxed">{errorMessage}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setErrorMessage(null)}
                      className="text-[#e11d48] hover:text-[#9f1239]"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                )}

                {/* Success Banner */}
                {successMessage && (
                  <div className="mb-4 p-3.5 rounded-2xl bg-[#ecfdf5] border border-[#a7f3d0] text-[#059669] text-xs flex items-start gap-2.5 animate-in fade-in">
                    <span className="material-symbols-outlined text-base shrink-0 mt-0.5">check_circle</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold leading-relaxed">{successMessage}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSuccessMessage(null)}
                      className="text-[#059669] hover:text-[#065f46]"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                )}

                {/* Email & Password Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {authMode === 'create' && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-[#1E293B]">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Maria Santos"
                        className="w-full h-11 px-4 rounded-xl bg-[#F8FAFF] focus:bg-white border border-[#CBD5E1] text-sm text-[#1E293B] placeholder:text-slate-400 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
                        required
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#1E293B]">Email Address</label>
                    <input
                      type="email"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. maria.santos@gmail.com"
                      className="w-full h-11 px-4 rounded-xl bg-[#F8FAFF] focus:bg-white border border-[#CBD5E1] text-sm text-[#1E293B] placeholder:text-slate-400 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-[#1E293B]">Password</label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-[11px] font-semibold text-[#2563EB] hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password (min 6 characters)"
                        className="w-full h-11 pl-4 pr-11 rounded-xl bg-[#F8FAFF] focus:bg-white border border-[#CBD5E1] text-sm text-[#1E293B] placeholder:text-slate-400 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 text-slate-400 hover:text-[#2563EB] flex items-center justify-center cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xl">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-[#2563EB] via-[#5379EE] to-[#4F46E5] hover:from-[#1D4ED8] hover:to-[#4338CA] text-white font-bold text-sm transition-all shadow-[0_6px_20px_rgba(83,121,238,0.3)] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {loading ? (
                      <span className="material-symbols-outlined text-lg animate-spin">refresh</span>
                    ) : (
                      <span>{authMode === 'login' ? 'Sign In to IngreGuide' : 'Create Account'}</span>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-5">
                  <div className="w-full h-px bg-slate-200"></div>
                  <span className="absolute bg-white px-3 text-[11px] text-slate-400 uppercase">
                    or continue with
                  </span>
                </div>

                {/* SSO Buttons */}
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    className="h-11 rounded-xl border border-[#DBEAFE] hover:border-[#2563EB] hover:bg-[#EFF6FF] flex items-center justify-center gap-2 text-xs font-bold text-[#334155] transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span className="font-black text-[#2563EB] text-sm">G</span>
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFacebookAuth}
                    disabled={loading}
                    className="h-11 rounded-xl border border-[#DBEAFE] hover:border-[#1877F2] hover:bg-[#1877F2]/5 flex items-center justify-center gap-2 text-xs font-bold text-[#334155] transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span className="font-black text-[#1877F2] text-sm">f</span>
                    <span>Facebook</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAuthModalOpen(false);
                      enterGuestMode();
                    }}
                    disabled={loading}
                    className="h-11 rounded-xl border border-[#DBEAFE] hover:border-[#2563EB] hover:bg-[#EFF6FF] flex items-center justify-center gap-1.5 text-xs font-bold text-[#334155] transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-base text-[#2563EB]">person</span>
                    <span>Guest</span>
                  </button>
                </div>

                {showFacebookDemoOption && (
                  <div className="mt-4 p-3 rounded-2xl bg-[#eff6ff] border border-[#bfdbfe] text-center animate-in fade-in">
                    <p className="text-[11px] text-[#1e40af] mb-2 font-medium">
                      Facebook OAuth is not enabled in Firebase Console. You can continue with demo mode:
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        updateUserProfile({
                          displayName: 'Facebook Verified User',
                          email: 'verified.fb.user@ingreguide.com',
                        });
                        setIsAuthModalOpen(false);
                        setActiveTab('onboarding');
                      }}
                      className="px-4 py-1.5 rounded-full bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Continue with Simulated Facebook Account
                    </button>
                  </div>
                )}

                {/* RA 10173 Data Privacy Notice */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#2563EB] text-base shrink-0 mt-0.5">
                    verified_user
                  </span>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">
                    <strong className="text-[#1E293B]">Your data:</strong> your allergen profile and scan history are
                    visible only to you and the IngreGuide administrators, in line with the Data Privacy Act (RA 10173).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
