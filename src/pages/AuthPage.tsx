import { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Mail, Phone, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

const roles: { role: AppRole; label: string; emoji: string }[] = [
  { role: 'vendor', label: 'Vendor', emoji: '🏪' },
  { role: 'buyer', label: 'Buyer', emoji: '🍽️' },
  { role: 'logistics', label: 'Logistics', emoji: '🚚' },
  { role: 'storage', label: 'Cold Storage', emoji: '🏭' },
];

type AuthMode = 'login' | 'register';
type AuthMethod = 'email' | 'phone';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [method, setMethod] = useState<AuthMethod>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [selectedRole, setSelectedRole] = useState<AppRole>('buyer');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [useOtp, setUseOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailPasswordAuth = async () => {
    setLoading(true);
    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role: selectedRole, business_name: businessName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success('Account created! Check email to verify.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Logged in!');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneOtp = async () => {
    setLoading(true);
    try {
      if (!otpSent) {
        if (mode === 'register') {
          const { error } = await supabase.auth.signUp({
            phone,
            password: password || undefined,
            options: { data: { role: selectedRole, business_name: businessName } },
          });
          if (error) throw error;
        } else {
          const { error } = await supabase.auth.signInWithOtp({ phone });
          if (error) throw error;
        }
        setOtpSent(true);
        toast.success('OTP sent to your phone!');
      } else {
        const { error } = await supabase.auth.verifyOtp({
          phone,
          token: otp,
          type: mode === 'register' ? 'sms' : 'sms',
        });
        if (error) throw error;
        toast.success('Verified!');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailOtp = async () => {
    setLoading(true);
    try {
      if (!otpSent) {
        if (mode === 'register') {
          const { error } = await supabase.auth.signUp({
            email,
            password: password || Math.random().toString(36).slice(-12),
            options: {
              data: { role: selectedRole, business_name: businessName },
              emailRedirectTo: window.location.origin,
            },
          });
          if (error) throw error;
        } else {
          const { error } = await supabase.auth.signInWithOtp({ email });
          if (error) throw error;
        }
        setOtpSent(true);
        toast.success('OTP / Magic link sent to your email!');
      } else {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token: otp,
          type: 'email',
        });
        if (error) throw error;
        toast.success('Verified!');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (method === 'phone') return handlePhoneOtp();
    if (useOtp) return handleEmailOtp();
    return handleEmailPasswordAuth();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
              <Leaf size={32} className="text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">FreshLink</h1>
          <p className="text-muted-foreground font-medium mt-1">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-xl bg-secondary p-1 mb-6">
          {(['login', 'register'] as AuthMode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setOtpSent(false); setOtp(''); }}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                mode === m ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              {m === 'login' ? 'Login' : 'Register'}
            </button>
          ))}
        </div>

        {/* Method toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setMethod('email'); setOtpSent(false); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
              method === 'email' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'
            }`}
          >
            <Mail size={18} /> Email
          </button>
          <button
            onClick={() => { setMethod('phone'); setOtpSent(false); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
              method === 'phone' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'
            }`}
          >
            <Phone size={18} /> Phone
          </button>
        </div>

        {/* Role selection (register only) */}
        {mode === 'register' && (
          <div className="mb-6">
            <label className="text-sm font-bold text-muted-foreground mb-2 block">I am a...</label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map(({ role, label, emoji }) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`py-3 px-3 rounded-xl border-2 text-sm font-bold transition-all flex items-center gap-2 ${
                    selectedRole === role
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  <span className="text-xl">{emoji}</span> {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Register business name */}
        {mode === 'register' && (
          <div className="mb-4">
            <label className="text-sm font-bold text-muted-foreground mb-2 block">Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Your business name"
              className="w-full min-h-[56px] rounded-xl border border-border bg-background px-4 text-lg font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        {/* Email / Phone input */}
        <div className="space-y-4 mb-4">
          {method === 'email' ? (
            <div>
              <label className="text-sm font-bold text-muted-foreground mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full min-h-[56px] rounded-xl border border-border bg-background px-4 text-lg font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ) : (
            <div>
              <label className="text-sm font-bold text-muted-foreground mb-2 block">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full min-h-[56px] rounded-xl border border-border bg-background px-4 text-lg font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {/* Password (email with password mode) */}
          {method === 'email' && !useOtp && (
            <div>
              <label className="text-sm font-bold text-muted-foreground mb-2 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full min-h-[56px] rounded-xl border border-border bg-background px-4 pr-12 text-lg font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          {/* OTP input */}
          {otpSent && (
            <div>
              <label className="text-sm font-bold text-muted-foreground mb-2 block">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                maxLength={6}
                className="w-full min-h-[56px] rounded-xl border border-border bg-background px-4 text-lg font-bold text-foreground text-center tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}
        </div>

        {/* OTP toggle for email */}
        {method === 'email' && (
          <button
            onClick={() => { setUseOtp(!useOtp); setOtpSent(false); setOtp(''); }}
            className="text-sm font-semibold text-primary mb-4 block"
          >
            {useOtp ? 'Use password instead' : 'Use OTP / Magic Link instead'}
          </button>
        )}

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={loading}
          className="btn-fresh w-full disabled:opacity-50"
        >
          {loading ? (
            <span className="animate-pulse">Please wait...</span>
          ) : (
            <>
              <span>{otpSent ? 'Verify OTP' : mode === 'login' ? 'Login' : 'Register'}</span>
              <ArrowRight size={24} />
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}
