import { useEffect, useMemo, useRef } from 'react'

const defaultColors = ['#ff6b1a', '#ffb08a', '#ffe1d2']

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function getPalette(colors) {
  const list = Array.isArray(colors) && colors.length > 0 ? colors : defaultColors
  return {
    '--c1': list[0] ?? defaultColors[0],
    '--c2': list[1] ?? list[0] ?? defaultColors[1],
    '--c3': list[2] ?? list[1] ?? list[0] ?? defaultColors[2]
  }
}

export default function LiquidEther({ colors = defaultColors, className = '', style = {} }) {
  const rootRef = useRef(null)
  const palette = useMemo(() => getPalette(colors), [colors])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const state = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0
    }

    let rafId = 0

    const onPointerMove = (event) => {
      const rect = root.getBoundingClientRect()
      const insideX = event.clientX >= rect.left && event.clientX <= rect.right
      const insideY = event.clientY >= rect.top && event.clientY <= rect.bottom
      if (!insideX || !insideY) {
        state.targetX = 0
        state.targetY = 0
        return
      }

      const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2
      state.targetX = clamp(nx, -1, 1)
      state.targetY = clamp(ny, -1, 1)
    }

    const onPointerLeave = () => {
      state.targetX = 0
      state.targetY = 0
    }

    const tick = () => {
      state.x += (state.targetX - state.x) * 0.06
      state.y += (state.targetY - state.y) * 0.06
      root.style.setProperty('--mx', state.x.toFixed(4))
      root.style.setProperty('--my', state.y.toFixed(4))
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave)
    tick()

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div ref={rootRef} className={`liquid-ether-container ${className}`.trim()} style={{ ...palette, ...style }}>
      <span className="liquid-blob blob-a" />
      <span className="liquid-blob blob-b" />
      <span className="liquid-blob blob-c" />
      <span className="liquid-veil" />
    </div>
  )
}
