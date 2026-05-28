import { Play } from 'lucide-react'
import type { YoutubeElement } from '../../types'

interface YoutubeRendererProps {
  youtube: YoutubeElement
}

export function YoutubeRenderer({ youtube }: YoutubeRendererProps) {
  const { videoUrl, videoTitle, videoDescription, videoStats, style } = youtube
  const shapeClass = style?.shape === 'rectangle' ? 'rounded-none' : 'rounded-md'
  const aspectRatio = style?.aspectRatio || '16:9'
  const aspectRatioClass = aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'
  const layout = style?.layout || 'feed'
  const showStats = style?.showStats !== false
  const showDescription = style?.showDescription !== false

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

  const playButtonColorClass = "bg-red-600 group-hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition-all duration-200"

  // 1. Feed Layout: Just the thumbnail with play overlay (Original)
  if (layout === 'feed') {
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
          <div className={`w-9 h-9 rounded-full ${playButtonColorClass} scale-90 group-hover:scale-100`}>
            <Play size={14} className="fill-current ml-0.5" />
          </div>
        </div>

        {/* YouTube badge branding */}
        <div className="absolute bottom-1.5 right-1.5 bg-black/60 px-1 py-0.5 rounded text-[10px] font-bold text-white tracking-wider uppercase">
          {aspectRatio === '9:16' ? 'Shorts' : 'YouTube'}
        </div>
      </a>
    )
  }

  // 2. Inline Layout: Horizontal card (Thumbnail on left, details on right)
  if (layout === 'inline') {
    return (
      <a
        href={videoUrl}
        target="_blank"
        rel="noreferrer"
        className={`w-full flex items-center gap-3 p-1.5 overflow-hidden bg-[var(--phone-btn-bg)] border border-[var(--phone-btn-border)]/30 hover:border-[var(--phone-btn-border)]/70 transition-all duration-200 shadow-sm group ${shapeClass} active:scale-[0.98]`}
      >
        {/* Left: Thumbnail aspect-video container */}
        <div className={`relative w-[80px] aspect-video shrink-0 bg-black overflow-hidden ${shapeClass} border border-white/5`}>
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt="YouTube Preview"
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-zinc-900" />
          )}
          {/* Small play overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/15">
            <div className={`w-5 h-5 rounded-full ${playButtonColorClass} scale-95 group-hover:scale-105`}>
              <Play size={7} className="fill-current ml-0.5 animate-none" />
            </div>
          </div>
        </div>

        {/* Right: Text stacked details */}
        <div className="flex-1 min-w-0 flex flex-col justify-center text-left gap-0.5">
          <h4 className="text-[10px] font-bold leading-snug line-clamp-2" style={{ color: 'var(--phone-btn-text)' }}>
            {videoTitle || 'YouTube Video'}
          </h4>
          <p className="text-[8.5px] opacity-75 truncate" style={{ color: 'var(--phone-btn-text)' }}>
            {showDescription && videoDescription && (
              <span className="font-semibold">{videoDescription}</span>
            )}
            {showDescription && videoDescription && showStats && videoStats && ' • '}
            {showStats && videoStats}
          </p>
        </div>
      </a>
    )
  }

  // 3. Card Layout: Vertical card (Thumbnail on top, details on bottom)
  return (
    <a
      href={videoUrl}
      target="_blank"
      rel="noreferrer"
      className={`w-full flex flex-col overflow-hidden bg-[var(--phone-btn-bg)] border border-[var(--phone-btn-border)]/30 hover:border-[var(--phone-btn-border)]/70 transition-all duration-200 shadow-md group ${shapeClass} active:scale-[0.98]`}
    >
      {/* Top: Thumbnail */}
      <div className={`relative w-full ${aspectRatioClass} overflow-hidden bg-black shrink-0 border-b border-white/5`}>
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt="YouTube Preview"
            className="w-full h-full object-cover opacity-85 group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-zinc-900" />
        )}
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-8.5 h-8.5 rounded-full ${playButtonColorClass} scale-90 group-hover:scale-100`}>
            <Play size={12} className="fill-current ml-0.5" />
          </div>
        </div>

        {/* YouTube badge branding */}
        <div className="absolute bottom-1 right-1 bg-black/60 px-1 py-0.5 rounded text-[9px] font-bold text-white tracking-wider uppercase">
          {aspectRatio === '9:16' ? 'Shorts' : 'YouTube'}
        </div>
      </div>

      {/* Bottom: Text body */}
      <div className="p-2 flex flex-col text-left gap-0.5 w-full">
        <h4 className="text-[12px] font-bold leading-tight line-clamp-2" style={{ color: 'var(--phone-btn-text)' }}>
          {videoTitle || 'YouTube Video'}
        </h4>
        {showDescription && videoDescription && (
          <p className="text-[10px] font-semibold truncate opacity-80" style={{ color: 'var(--phone-btn-text)' }}>
            {videoDescription}
          </p>
        )}
        {showStats && videoStats && (
          <p className="text-[9px] opacity-70 truncate" style={{ color: 'var(--phone-btn-text)' }}>
            {videoStats}
          </p>
        )}
      </div>
    </a>
  )
}
