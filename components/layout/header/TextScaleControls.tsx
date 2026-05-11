'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  readTextScale,
  setTextScale,
  TEXT_SCALE_DEFAULT,
  TEXT_SCALE_EVENT,
  TEXT_SCALE_STEPS,
  type TextScale,
} from '@/lib/text-scale'

export default function TextScaleControls() {
  const [scale, setScaleValue] = useState<TextScale>(TEXT_SCALE_DEFAULT)

  useEffect(() => {
    const syncScale = () => {
      setScaleValue(readTextScale())
    }

    syncScale()
    window.addEventListener(TEXT_SCALE_EVENT, syncScale as EventListener)
    window.addEventListener('storage', syncScale)

    return () => {
      window.removeEventListener(TEXT_SCALE_EVENT, syncScale as EventListener)
      window.removeEventListener('storage', syncScale)
    }
  }, [])

  const currentIndex = useMemo(() => {
    return Math.max(0, TEXT_SCALE_STEPS.indexOf(scale))
  }, [scale])

  const decreaseScale = () => {
    if (currentIndex <= 0) {
      return
    }

    setScaleValue(setTextScale(TEXT_SCALE_STEPS[currentIndex - 1]))
  }

  const resetScale = () => {
    setScaleValue(setTextScale(TEXT_SCALE_DEFAULT))
  }

  const increaseScale = () => {
    if (currentIndex >= TEXT_SCALE_STEPS.length - 1) {
      return
    }

    setScaleValue(setTextScale(TEXT_SCALE_STEPS[currentIndex + 1]))
  }

  const buttonClassName =
    'cursor-pointer rounded-full px-2.5 py-1 text-xs font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50'

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-xs font-semibold text-white/80 md:inline">Масштаб тексту</span>

      <div className="inline-flex items-center gap-1 rounded-full p-1 backdrop-blur-sm">
        <button
          type="button"
          onClick={decreaseScale}
          disabled={currentIndex <= 0}
          aria-label="Зменшити масштаб тексту"
          className={`${buttonClassName} hover:bg-white/10`}
        >
          A-
        </button>

        <button
          type="button"
          onClick={resetScale}
          aria-label="Скинути масштаб тексту до стандартного"
          className={`${buttonClassName} min-w-14 bg-white/15 hover:bg-white/20 !cursor-default`}
        >
          {scale}%
        </button>

        <button
          type="button"
          onClick={increaseScale}
          disabled={currentIndex >= TEXT_SCALE_STEPS.length - 1}
          aria-label="Збільшити масштаб тексту"
          className={`${buttonClassName} hover:bg-white/10`}
        >
          A+
        </button>
      </div>

      <span className="sr-only" aria-live="polite">
        Масштаб тексту {scale} відсотків
      </span>
    </div>
  )
}
