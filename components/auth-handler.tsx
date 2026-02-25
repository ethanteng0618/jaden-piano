'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

/**
 * This component handles the auth callback when Supabase redirects
 * with tokens in the URL hash fragment (e.g. /#access_token=...).
 * 
 * It detects the hash, lets the Supabase client process it,
 * then cleans up the URL and shows a success message.
 */
export function AuthHandler() {
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle')
    const router = useRouter()

    useEffect(() => {
        // Check if the URL hash contains auth tokens (from email verification)
        const hash = window.location.hash
        if (hash && hash.includes('access_token')) {
            setVerificationStatus('verifying')

            // The Supabase client automatically detects and processes hash fragments
            // when we call getSession(). It will parse the tokens from the URL hash
            // and establish the session.
            supabase.auth.getSession().then(({ data: { session }, error }) => {
                if (error) {
                    console.error('Error processing verification:', error)
                    setVerificationStatus('error')
                    return
                }

                if (session) {
                    setVerificationStatus('success')
                    // Clean the URL by removing the hash fragment
                    window.history.replaceState(null, '', window.location.pathname)

                    // Redirect to home after a brief moment so the user sees the success
                    setTimeout(() => {
                        router.refresh()
                        setVerificationStatus('idle')
                    }, 2000)
                }
            })
        }
    }, [router])

    if (verificationStatus === 'idle') return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center animate-in fade-in zoom-in-95 duration-300">
                {verificationStatus === 'verifying' && (
                    <>
                        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                        <h2 className="text-xl font-bold mb-2">Verifying your account...</h2>
                        <p className="text-muted-foreground">Please wait while we confirm your email.</p>
                    </>
                )}
                {verificationStatus === 'success' && (
                    <>
                        <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold mb-2">Email Verified!</h2>
                        <p className="text-muted-foreground">Your account has been confirmed. Redirecting...</p>
                    </>
                )}
                {verificationStatus === 'error' && (
                    <>
                        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold mb-2">Verification Failed</h2>
                        <p className="text-muted-foreground mb-4">Something went wrong. The link may have expired.</p>
                        <button
                            onClick={() => {
                                window.history.replaceState(null, '', window.location.pathname)
                                setVerificationStatus('idle')
                            }}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Dismiss
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}
