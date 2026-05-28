import { ExternalLink } from 'lucide-react'
import type { ButtonElement } from '../../types'
import {
  BUTTON_ALIGNMENTS,
  BUTTON_SHAPES,
  BUTTON_VARIANTS,
  BUTTON_ANIMATIONS,
} from '@/config/element-presets'

interface ButtonRendererProps {
  button: ButtonElement
}

export function ButtonRenderer({ button }: ButtonRendererProps) {
  const { title, url, style } = button

  // Resolve config options, falling back to defaults
  const alignment = style?.align || 'left'
  const hasIndividualShape = !!style?.shape
  const shape = style?.shape || 'rounded'
  const variant = style?.variant || 'fill'
  const animation = style?.animation || 'none'

  const alignmentClass = BUTTON_ALIGNMENTS[alignment]?.class || BUTTON_ALIGNMENTS.left.class
  // Only use Tailwind shape class if the button has an individual shape override
  const shapeClass = hasIndividualShape
    ? (BUTTON_SHAPES[shape]?.class || BUTTON_SHAPES.rounded.class)
    : '' // Will use --phone-btn-radius CSS variable instead
  const animationClass = BUTTON_ANIMATIONS[animation]?.class || BUTTON_ANIMATIONS.none.class
  const variantStyles = BUTTON_VARIANTS[variant]?.style || BUTTON_VARIANTS.fill.style

  // Apply backdrop blur for glass variant
  const backdropBlurStyle = variant === 'glass' 
    ? { backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' } 
    : {}

  // Use global theme radius if no per-element shape is set
  const shapeStyle = hasIndividualShape
    ? {}
    : { borderRadius: 'var(--phone-btn-radius, 8px)' }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={`relative flex w-full items-center border px-3 py-2.5 text-[10px] font-bold tracking-wide transition-all duration-200 select-none shadow-sm active:scale-[0.98] ${shapeClass} ${alignmentClass} ${animationClass}`}
      style={{
        ...variantStyles,
        ...backdropBlurStyle,
        ...shapeStyle,
      }}
    >
      {/* Label */}
      <span className="truncate max-w-[85%]">{title || 'Untitled Link'}</span>

      {/* External Link Icon (Absolute positioned to not throw off centered text) */}
      {alignment === 'center' ? (
        <ExternalLink size={10} className="absolute right-3 opacity-60 shrink-0" />
      ) : alignment === 'right' ? (
        <ExternalLink size={10} className="absolute left-3 opacity-60 shrink-0" />
      ) : (
        <ExternalLink size={10} className="opacity-60 shrink-0 ml-1.5" />
      )}
    </a>
  )
}
