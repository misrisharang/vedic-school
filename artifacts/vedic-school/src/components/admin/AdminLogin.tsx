// ==============================================================================
// THE VEDIC SCHOOL — ADMIN LOGIN VIEW
// ==============================================================================

import React, { useState } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'wouter';

export function AdminLogin() {
  const { signIn, isConfigured } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const { error: authError } = await signIn(email.trim(), password);
      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please verify your credentials.');
        } else {
          setError(authError.message || 'Unable to sign in. Please try again.');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[hsl(var(--primary))] text-white shadow-md mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[hsl(var(--foreground))] tracking-tight">
            The Vedic School
          </h1>
          <p className="text-sm text-[hsl(var(--foreground))]/70 mt-1 font-medium">
            Blog CMS Administration
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-[hsl(var(--border))] shadow-sm p-6 sm:p-8">
          {!isConfigured && (
            <div className="mb-6 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Supabase credentials missing:</span> Please set
                VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment to log in.
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-email" className="text-xs font-semibold text-[hsl(var(--foreground))]/80">
                Admin Email
              </Label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@thevedicschool.com"
                  autoComplete="email"
                  required
                  className="pl-9 bg-stone-50/50 border-stone-200 focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="admin-password" className="text-xs font-semibold text-[hsl(var(--foreground))]/80">
                Password
              </Label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  required
                  className="pl-9 bg-stone-50/50 border-stone-200 focus:bg-white"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !isConfigured}
              className="w-full mt-2 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white font-medium py-2.5 rounded-xl shadow-sm transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In to Blog CMS'
              )}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-stone-100 text-center text-xs text-stone-400">
            Authorized administrator access only. Accounts are managed via the Supabase Dashboard.
          </div>
        </div>

        {/* Back to Website */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center text-xs text-[hsl(var(--foreground))]/70 hover:text-[hsl(var(--primary))] transition-colors gap-1.5 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to The Vedic School website
          </Link>
        </div>
      </div>
    </div>
  );
}
