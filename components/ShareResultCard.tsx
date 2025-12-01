'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Share2, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { generateShareCard, formatShareText, type ShareCardType, type ShareCardData } from '@/lib/share-result-generator'
import { webShare } from '@/lib/web-share'

interface ShareResultCardProps {
  achievementType: ShareCardType
  data: ShareCardData
  onShare: () => void
  onDismiss: () => void
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 }
}

export function ShareResultCard({ achievementType, data, onShare, onDismiss }: ShareResultCardProps) {
  const [copied, setCopied] = React.useState(false)
  const [includeHashtags, setIncludeHashtags] = React.useState(false)
  
  const shareText = React.useMemo(() => {
    return generateShareCard(achievementType, data)
  }, [achievementType, data])
  
  const formattedText = React.useMemo(() => {
    return formatShareText(shareText, true, includeHashtags)
  }, [shareText, includeHashtags])

  // Handle ESC key to dismiss
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onDismiss])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleShare = async () => {
    try {
      const success = await webShare.shareResultCard(
        achievementType,
        data,
        true,
        includeHashtags
      )
      
      if (success) {
        onShare()
      }
    } catch (error) {
      console.error('Share failed:', error)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedText)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        onShare()
      }, 1500)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  return (
    <AnimatePresence>
      <>
        {/* Backdrop - click to dismiss */}
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={backdropVariants}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/40 z-[80] backdrop-blur-sm"
          onClick={onDismiss}
          aria-hidden="true"
        />
        
        {/* Modal */}
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
          transition={{ type: 'spring', damping: 30, stiffness: 300, duration: 0.3 }}
          className="fixed inset-0 z-[85] flex items-end sm:items-center justify-center p-4 pointer-events-none"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full max-w-md pointer-events-auto">
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 shadow-2xl">
              <CardContent className="p-5 sm:p-6 relative">
                {/* Close button */}
                <button
                  onClick={onDismiss}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 min-w-[44px] min-h-[44px] p-2 rounded-full hover:bg-slate-200 active:bg-slate-300 transition-colors flex items-center justify-center"
                  aria-label="Close share prompt"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>

                {/* Share text preview */}
                <div className="mb-5 sm:mb-6 pr-8">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">
                    Share your progress
                  </h3>
                  <div className="bg-white rounded-xl p-4 sm:p-6 border-2 border-slate-200 shadow-sm">
                    <p className="text-sm sm:text-base leading-relaxed text-slate-800 whitespace-pre-line font-medium">
                      {shareText}
                    </p>
                  </div>
                </div>

                {/* Hashtag toggle */}
                <div className="mb-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="include-hashtags"
                    checked={includeHashtags}
                    onChange={(e) => setIncludeHashtags(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-500 focus:ring-offset-1"
                  />
                  <label htmlFor="include-hashtags" className="text-sm text-slate-600 cursor-pointer select-none">
                    Include hashtags
                  </label>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {webShare.getSupported() ? (
                    <Button
                      onClick={handleShare}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 min-h-[44px]"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  ) : (
                    <Button
                      onClick={handleCopy}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 min-h-[44px]"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy for TikTok
                        </>
                      )}
                    </Button>
                  )}
                  
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100 font-medium py-3 min-h-[44px]"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Text
                      </>
                    )}
                  </Button>
                </div>

                {/* Dismiss button */}
                <button
                  onClick={onDismiss}
                  className="mt-4 w-full text-center text-sm text-slate-500 hover:text-slate-700 transition-colors min-h-[44px] flex items-center justify-center"
                >
                  Maybe later
                </button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  )
}
