/**
 * Login Modal Component
 * Provides Google OAuth and Email/Password authentication
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Loader2, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { SocialButton } from './SocialButton'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showResendButton, setShowResendButton] = useState(false)

  const supabase = createClient()

  const handleResendConfirmation = async () => {
    if (!email) {
      setError('Please enter your email address first')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      })

      if (error) throw error

      setSuccess('Confirmation email sent! Check your inbox (and spam folder, just in case).')
      setShowResendButton(false)
    } catch (err) {
      console.error('[Login] Resend confirmation error:', err)
      setError(err instanceof Error ? err.message : 'Couldn\'t send the confirmation email. Let\'s try again in a moment.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (err) {
      console.error('[Login] Google OAuth error:', err)
      setError(err instanceof Error ? err.message : 'Google sign-in hit a snag. Let\'s try again!')
      setLoading(false)
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (mode === 'signup') {
        // Sign up new user
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (error) throw error

        // Success - show message then close
        setSuccess('Account created! You are now signed in.')
        setTimeout(() => {
          handleClose()
        }, 1500)
      } else {
        // Sign in existing user
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        // Success - show message then close
        setSuccess('Welcome back! Signed in successfully.')
        setTimeout(() => {
          handleClose()
        }, 1500)
      }
    } catch (err) {
      console.error('[Login] Email auth error:', err)

      // Handle specific error cases with compassionate, user-friendly messages
      let errorMessage = mode === 'signup'
        ? 'We couldn\'t create your account right now. Let\'s try again.'
        : 'We couldn\'t sign you in. Let\'s double-check your details.'

      if (err instanceof Error) {
        if (err.message.includes('Email not confirmed')) {
          errorMessage = 'Almost there! Please check your inbox for a confirmation link to complete your journey.'
          setShowResendButton(true)
        } else if (err.message.includes('Invalid login credentials')) {
          errorMessage = 'Those credentials didn\'t quite match. Double-check your email and password?'
        } else if (err.message.includes('User already registered')) {
          errorMessage = 'Looks like you\'ve been here before! This email is already registered—try signing in instead.'
        } else if (err.message.includes('Password')) {
          errorMessage = 'Your password needs to be at least 6 characters. A bit longer for safety!'
        } else if (err.message.includes('rate limit')) {
          errorMessage = 'Too many attempts. Take a breath and try again in a moment.'
        } else {
          errorMessage = err.message
        }
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setEmail('')
      setPassword('')
      setShowPassword(false)
      setError(null)
      setSuccess(null)
      setShowResendButton(false)
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed left-4 right-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto glass-panel-solid !rounded-2xl border border-white/10 shadow-2xl z-[101] p-6 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onKeyDown={(e) => e.stopPropagation()}
            onKeyUp={(e) => e.stopPropagation()}
            onKeyPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-purple-600 font-serif">
                Sign In
              </h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close modal"
                disabled={loading}
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              {/* Success Message */}
              {success && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                  {success}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                  {showResendButton && (
                    <button
                      onClick={handleResendConfirmation}
                      disabled={loading}
                      className="w-full px-4 py-2 text-sm bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Resend Confirmation Email
                    </button>
                  )}
                </div>
              )}

              {/* Social Login Providers Grid */}
              <div className="grid grid-cols-2 gap-3">
                <SocialButton
                  provider="discord"
                  disabled
                  onClick={() => setError('Discord is on the platform map—coming soon!')}
                />
                <SocialButton
                  provider="github"
                  disabled
                  onClick={() => setError('GitHub integration arriving soon!')}
                />
                <SocialButton
                  provider="linkedin"
                  disabled
                  onClick={() => setError('LinkedIn connection coming soon!')}
                />
                <SocialButton
                  provider="twitch"
                  disabled
                  onClick={() => setError('Twitch connection arriving soon!')}
                />
              </div>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#0a0c10] px-2 text-slate-400">Or continue with</span>
                </div>
              </div>

              {/* Google OAuth Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-100 text-gray-900 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>

              {/* Email/Password Form */}
              <form onSubmit={handleEmailAuth} className="space-y-3">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      disabled={loading}
                      className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {mode === 'signup' && (
                    <p className="text-xs text-slate-500 mt-1">
                      Minimum 6 characters
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {mode === 'signup' ? 'Creating account...' : 'Signing in...'}
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      {mode === 'signup' ? 'Create Account' : 'Sign In'}
                    </>
                  )}
                </button>
              </form>

              {/* Toggle Sign In / Sign Up */}
              <div className="text-center">
                <button
                  onClick={() => {
                    setMode(mode === 'signin' ? 'signup' : 'signin')
                    setError(null)
                    setShowResendButton(false)
                  }}
                  disabled={loading}
                  className="text-sm text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                >
                  {mode === 'signin' ? (
                    <>
                      Don't have an account? <span className="text-amber-400 font-medium">Sign up</span>
                    </>
                  ) : (
                    <>
                      Already have an account? <span className="text-amber-400 font-medium">Sign in</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-center text-slate-500 mt-4">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
