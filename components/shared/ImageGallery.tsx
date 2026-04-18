'use client'

import { useState, useEffect, useCallback } from 'react'
import Image                                 from 'next/image'
import { motion, AnimatePresence }           from 'framer-motion'
import {
  ChevronLeft, ChevronRight, X, ZoomIn, Images,
} from 'lucide-react'
import { getPlaceGradient, getTypeEmoji } from '@/lib/imageUtils'

interface ImageGalleryProps {
  images:    string[]       // array of image URLs or /public paths
  name:      string         // alt text base
  type?:     string         // for gradient fallback
  className?: string
}

export default function ImageGallery({
  images: rawImages,
  name,
  type = 'temple',
  className = '',
}: ImageGalleryProps) {
  // Filter out empty strings
  const images = rawImages.filter(Boolean)

  const [current,    setCurrent]    = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [loaded,     setLoaded]     = useState<Record<number, boolean>>({})
  const [errored,    setErrored]    = useState<Record<number, boolean>>({})

  const total = images.length

  const prev = useCallback(() => setCurrent((i) => (i - 1 + total) % total), [total])
  const next = useCallback(() => setCurrent((i) => (i + 1) % total), [total])

  // Keyboard navigation
  useEffect(() => {
    if (!fullscreen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape')     setFullscreen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [fullscreen, prev, next])

  // Lock body scroll when fullscreen
  useEffect(() => {
    document.body.style.overflow = fullscreen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [fullscreen])

  const gradient = getPlaceGradient(type)
  const emoji    = getTypeEmoji(type)

  // No images — just show gradient
  if (total === 0) {
    return (
      <div className={`relative overflow-hidden rounded-2xl ${className}`}
        style={{ background: gradient, minHeight: '280px' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-8xl opacity-60">{emoji}</span>
        </div>
      </div>
    )
  }

  const GalleryImage = ({ index, fill = true }: { index: number; fill?: boolean }) => {
    if (errored[index]) {
      return (
        <div className="absolute inset-0 flex items-center justify-center"
          style={{ background: gradient }}>
          <span className="text-6xl opacity-50">{emoji}</span>
        </div>
      )
    }
    return (
      <>
        {/* Gradient placeholder while loading */}
        <div className={`absolute inset-0 transition-opacity duration-300 flex items-center justify-center ${loaded[index] ? 'opacity-0' : 'opacity-100'}`}
          style={{ background: gradient }}>
          <span className="text-6xl opacity-40">{emoji}</span>
        </div>
        {fill ? (
          <Image
            src={images[index]}
            alt={`${name} — photo ${index + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 800px"
            className={`object-cover transition-opacity duration-500 ${loaded[index] ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setLoaded((p) => ({ ...p, [index]: true }))}
            onError={() => setErrored((p) => ({ ...p, [index]: true }))}
            priority={index === 0}
          />
        ) : (
          <Image
            src={images[index]}
            alt={`${name} — thumbnail ${index + 1}`}
            fill
            sizes="80px"
            className="object-cover"
            onError={() => setErrored((p) => ({ ...p, [index]: true }))}
          />
        )}
      </>
    )
  }

  return (
    <>
      {/* ── Main gallery ── */}
      <div className={`relative ${className}`}>
        {/* Main image */}
        <div className="relative overflow-hidden rounded-2xl"
          style={{ paddingBottom: '62%' /* 16:10 ratio */ }}>
          <div className="absolute inset-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={current}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1,  scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="absolute inset-0">
                <GalleryImage index={current} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dark overlay for controls */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.4) 100%)' }} />

          {/* Arrows — only show if > 1 image */}
          {total > 1 && (
            <>
              <button type="button" onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}>
                <ChevronLeft size={20} />
              </button>
              <button type="button" onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}>
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Counter + fullscreen */}
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
            {total > 1 && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(0,0,0,0.55)', color: '#fff' }}>
                {current + 1} / {total}
              </span>
            )}
            <button type="button" onClick={() => setFullscreen(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{ background: 'rgba(0,0,0,0.55)', color: '#fff' }}>
              <ZoomIn size={14} />
            </button>
          </div>

          {/* Photo count badge */}
          {total > 1 && (
            <div className="absolute bottom-3 left-3 z-10">
              <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(0,0,0,0.55)', color: '#fff' }}>
                <Images size={12} />{total} photos
              </span>
            </div>
          )}

          {/* Dot indicators for small galleries */}
          {total > 1 && total <= 8 && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
              {Array.from({ length: total }).map((_, i) => (
                <button key={i} type="button" onClick={() => setCurrent(i)}
                  className="transition-all duration-200"
                  style={{
                    width:         i === current ? '20px' : '6px',
                    height:        '6px',
                    borderRadius:  '99px',
                    background:    i === current ? '#ff7d0f' : 'rgba(255,255,255,0.5)',
                  }} />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail strip — shown when 2+ images */}
        {total > 1 && (
          <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
            {images.map((_, i) => (
              <button key={i} type="button" onClick={() => setCurrent(i)}
                className="relative flex-shrink-0 rounded-xl overflow-hidden transition-all duration-200"
                style={{
                  width:  '72px',
                  height: '48px',
                  outline: i === current ? '2.5px solid #ff7d0f' : '2px solid transparent',
                  opacity: i === current ? 1 : 0.6,
                }}>
                <GalleryImage index={i} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Fullscreen lightbox ── */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.96)' }}
            onClick={() => setFullscreen(false)}
          >
            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-4 z-10"
              style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)' }}
              onClick={(e) => e.stopPropagation()}>
              <p className="text-sm font-semibold text-white">{name}</p>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">{current + 1} of {total}</span>
                <button type="button" onClick={() => setFullscreen(false)}
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <X size={18} className="text-white" />
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="relative w-full h-full max-w-5xl px-16"
              onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={current}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 flex items-center justify-center p-4">
                  {!errored[current] ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={images[current]}
                        alt={`${name} — photo ${current + 1}`}
                        fill
                        sizes="100vw"
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-gray-500">
                      <span className="text-7xl">{emoji}</span>
                      <p className="text-sm">Image unavailable</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Prev / Next */}
              {total > 1 && (
                <>
                  <button type="button" onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-105"
                    style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                    <ChevronLeft size={24} />
                  </button>
                  <button type="button" onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-105"
                    style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Bottom thumbnail strip */}
            {total > 1 && (
              <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 px-4 py-4"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}
                onClick={(e) => e.stopPropagation()}>
                {images.map((_, i) => (
                  <button key={i} type="button" onClick={() => setCurrent(i)}
                    className="relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200"
                    style={{
                      width: '60px', height: '40px',
                      outline: i === current ? '2px solid #ff7d0f' : '2px solid transparent',
                      opacity: i === current ? 1 : 0.5,
                    }}>
                    <GalleryImage index={i} />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}