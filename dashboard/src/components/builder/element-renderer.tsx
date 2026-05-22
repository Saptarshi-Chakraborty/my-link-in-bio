import { ExternalLink, Play } from 'lucide-react'
import type { PageElement, ButtonElement, CarouselElement, YoutubeElement } from './types'
import {
  BUTTON_ALIGNMENTS,
  BUTTON_SHAPES,
  BUTTON_VARIANTS,
  BUTTON_ANIMATIONS,
  CAROUSEL_ASPECT_RATIOS,
} from '@/config/element-presets'

interface ElementRendererProps {
  element: PageElement
}

export function ElementRenderer({ element }: ElementRendererProps) {
  if (!element.active) return null

  switch (element.type) {
    case 'button':
      return <ButtonRenderer button={element} />
    case 'carousel':
      return <CarouselRenderer carousel={element} />
    case 'youtube':
      return <YoutubeRenderer youtube={element} />
    default:
      return null
  }
}

function ButtonRenderer({ button }: { button: ButtonElement }) {
  const { title, url, style } = button

  // Resolve config options, falling back to defaults
  const alignment = style?.align || 'left'
  const shape = style?.shape || 'rounded'
  const variant = style?.variant || 'fill'
  const animation = style?.animation || 'none'

  const alignmentClass = BUTTON_ALIGNMENTS[alignment]?.class || BUTTON_ALIGNMENTS.left.class
  const shapeClass = BUTTON_SHAPES[shape]?.class || BUTTON_SHAPES.rounded.class
  const animationClass = BUTTON_ANIMATIONS[animation]?.class || BUTTON_ANIMATIONS.none.class
  const variantStyles = BUTTON_VARIANTS[variant]?.style || BUTTON_VARIANTS.fill.style

  // Apply backdrop blur for glass variant
  const backdropBlurStyle = variant === 'glass' 
    ? { backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' } 
    : {}

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={`relative flex w-full items-center border px-3 py-2.5 text-[10px] font-bold tracking-wide transition-all duration-200 select-none shadow-sm active:scale-[0.98] ${shapeClass} ${alignmentClass} ${animationClass}`}
      style={{
        ...variantStyles,
        ...backdropBlurStyle,
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

function CarouselRenderer({ carousel }: { carousel: CarouselElement }) {
  const { items, style } = carousel
  const aspectRatioClass = CAROUSEL_ASPECT_RATIOS[style?.aspectRatio || '1:1']?.class || CAROUSEL_ASPECT_RATIOS['1:1'].class
  const shapeClass = style?.shape === 'rectangle' ? 'rounded-none' : 'rounded-md'

  if (!items || items.length === 0) {
    return (
      <div className="w-full py-4 text-center text-[9px] opacity-40 italic border border-dashed border-white/20 rounded-md">
        Empty Carousel
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-1.5">
      {/* Horizontal snapping scroll container */}
      <div className="w-full flex gap-2 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-1">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.url || '#'}
            target={item.url ? '_blank' : undefined}
            rel="noreferrer"
            className={`flex-shrink-0 w-[80%] snap-center block relative group overflow-hidden bg-zinc-900 border border-white/5 active:scale-[0.98] transition-transform ${shapeClass}`}
          >
            {/* Aspect ratio box */}
            <div className={`w-full relative ${aspectRatioClass} overflow-hidden`}>
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title || 'Carousel slide'}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-[9px] text-zinc-500 font-bold">
                  No Image
                </div>
              )}
              {/* Overlay title if present */}
              {item.title && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 pt-6">
                  <p className="text-[9px] font-bold text-white truncate">{item.title}</p>
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

function YoutubeRenderer({ youtube }: { youtube: YoutubeElement }) {
  const { videoUrl, style } = youtube
  const shapeClass = style?.shape === 'rectangle' ? 'rounded-none' : 'rounded-md'
  const aspectRatio = style?.aspectRatio || '16:9'
  const aspectRatioClass = aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'

  // Extract Youtube Video ID
  const getYoutubeId = (url: string) => {
    if (!url) return null
    
    // Check for shorts format first
    const shortsMatch = url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/)
    if (shortsMatch) return shortsMatch[1]
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const videoId = getYoutubeId(videoUrl)
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    : null

  if (!videoId) {
    return (
      <div className="w-full py-4 text-center text-[9px] opacity-40 italic border border-dashed border-white/20 rounded-md">
        Invalid YouTube URL
      </div>
    )
  }

  return (
    <a
      href={videoUrl}
      target="_blank"
      rel="noreferrer"
      className={`w-full block relative ${aspectRatioClass} overflow-hidden bg-black border border-white/10 group cursor-pointer shadow-md ${shapeClass} active:scale-[0.98] transition-transform`}
    >
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt="YouTube Preview"
          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full bg-zinc-900" />
      )}
      
      {/* Simulated play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-9 h-9 rounded-full bg-red-600 group-hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition-colors scale-90 group-hover:scale-100 duration-200">
          <Play size={14} className="fill-current ml-0.5" />
        </div>
      </div>

      {/* YouTube badge branding */}
      <div className="absolute bottom-1.5 right-1.5 bg-black/60 px-1 py-0.5 rounded text-[8px] font-bold text-white tracking-wider uppercase">
        {aspectRatio === '9:16' ? 'Shorts' : 'YouTube'}
      </div>
    </a>
  )
}
