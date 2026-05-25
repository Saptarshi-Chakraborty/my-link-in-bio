import { useState } from 'react'
import {
  GripVertical,
  Image as ImageIcon,
  ChartColumn,
  Copy,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
  Play,
  Sparkles,
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  Pencil,
  Check,
  X
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useSortable } from '@dnd-kit/react/sortable'
import type { PageElement } from './types'
import { useBuilderStore } from '@/store/use-builder-store'

const PRESET_IMAGES = [
  { name: 'Gradient', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400' },
  { name: 'Desk', url: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=400' },
  { name: 'Abstract', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400' },
  { name: 'Tech', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400' },
  { name: 'Nature', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400' }
]

interface LinkEditorItemProps {
  item: PageElement
  index: number
  isOverlay?: boolean
}

export function LinkEditorItem({
  item,
  index,
  isOverlay = false
}: LinkEditorItemProps) {
  const handleDeleteLink = useBuilderStore((state) => state.deleteLink)
  const handleUpdateLink = useBuilderStore((state) => state.updateLink)
  const toggleLink = useBuilderStore((state) => state.toggleLink)

  const [isFetching, setIsFetching] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null)
  const [slideBackup, setSlideBackup] = useState<{ title: string; imageUrl: string; url: string } | null>(null)

  const handleSaveEdit = () => {
    setEditingSlideId(null)
    setSlideBackup(null)
  }

  const handleCancelEdit = (slideId: string) => {
    if (slideBackup && item.type === 'carousel') {
      const updated = (item.items || []).map(s => s.id === slideId ? { ...s, ...slideBackup } : s)
      handleUpdateLink(item.id, 'items', updated)
    }
    setEditingSlideId(null)
    setSlideBackup(null)
  }

  const moveSlide = (slideId: string, direction: 'up' | 'down') => {
    if (item.type !== 'carousel') return
    const currentItems = [...(item.items || [])]
    const slideIdx = currentItems.findIndex(s => s.id === slideId)
    if (slideIdx === -1) return
    const targetIdx = direction === 'up' ? slideIdx - 1 : slideIdx + 1
    if (targetIdx < 0 || targetIdx >= currentItems.length) return
    
    const temp = currentItems[slideIdx]
    currentItems[slideIdx] = currentItems[targetIdx]
    currentItems[targetIdx] = temp
    
    handleUpdateLink(item.id, 'items', currentItems)
  }

  const triggerFetch = async (url: string) => {
    if (!url) return
    setIsFetching(true)
    try {
      const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`)
      const data = await res.json()
      if (data && data.title) {
        handleUpdateLink(item.id, 'videoTitle', data.title)
        if (data.author_name) {
          handleUpdateLink(item.id, 'videoDescription', data.author_name)
        }
        // Generate a realistic stat
        const randomViews = Math.floor(Math.random() * 850 + 50)
        const randomMonths = Math.floor(Math.random() * 11 + 1)
        handleUpdateLink(item.id, 'videoStats', `${randomViews}K views • ${randomMonths} months ago`)
      }
    } catch (err) {
      console.error('Error fetching youtube details:', err)
    } finally {
      setIsFetching(false)
    }
  }

  const { ref, handleRef, isDragging } = useSortable({
    id: item.id,
    index,
    disabled: isOverlay,
  })
  
  // Extract YouTube ID helper for preview thumbnail
  const getYoutubeId = (url: string) => {
    if (!url) return null
    
    // Check for shorts format first
    const shortsMatch = url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/)
    if (shortsMatch) return shortsMatch[1]
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const videoId = item.type === 'youtube' ? getYoutubeId(item.videoUrl) : null
  const youtubeThumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null

  return (
    <div
      ref={ref}
      className={`group rounded-xl border border-border p-4 transition-all duration-200 bg-card ${
        isOverlay
          ? 'shadow-2xl scale-[1.02] pointer-events-none ring-4 ring-[var(--brand)]/10'
          : isDragging
          ? 'opacity-40 border-dashed bg-muted/40'
          : item.active
          ? 'shadow-sm'
          : 'bg-muted/30 opacity-80'
      }`}
    >
      <div className="mb-3 flex items-start gap-3">
        <div
          ref={handleRef}
          className="inline-flex h-8 items-center text-muted-foreground cursor-grab active:cursor-grabbing hover:text-foreground p-1 -m-1 rounded transition-colors"
        >
          <GripVertical size={16} />
        </div>
        
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header Info (Element Type Badge) */}
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
              item.type === 'carousel' 
                ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                : item.type === 'youtube'
                ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                : 'bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]/20'
            }`}>
              {item.type}
            </span>
          </div>

          {/* Render inputs based on Element Type */}
          {item.type === 'button' && (
            <div className="space-y-1.5">
              <Input
                type="text"
                value={item.title}
                onChange={(e) => handleUpdateLink(item.id, 'title', e.target.value)}
                className="w-full h-8 bg-transparent border-0 border-b border-transparent hover:border-border focus-visible:border-[var(--brand)] px-0 font-bold text-sm focus-visible:ring-0 shadow-none rounded-none focus-visible:border-b"
                placeholder="Link Title"
              />
              <Input
                type="text"
                value={item.url}
                onChange={(e) => handleUpdateLink(item.id, 'url', e.target.value)}
                className="w-full h-7 bg-transparent border-0 border-b border-transparent hover:border-border focus-visible:border-[var(--brand)] px-0 text-xs text-foreground font-medium focus-visible:ring-0 shadow-none rounded-none focus-visible:border-b animate-none"
                placeholder="https://example.com"
              />
            </div>
          )}

          {item.type === 'youtube' && (
            <div className="space-y-3">
              <Input
                type="text"
                value={item.videoUrl}
                onChange={(e) => handleUpdateLink(item.id, 'videoUrl', e.target.value)}
                onBlur={(e) => {
                  const val = e.target.value
                  const vidId = getYoutubeId(val)
                  if (vidId) {
                    triggerFetch(val)
                  }
                }}
                className="w-full h-8 bg-transparent border-0 border-b border-transparent hover:border-border focus-visible:border-[var(--brand)] px-0 text-xs focus-visible:ring-0 shadow-none rounded-none focus-visible:border-b"
                placeholder="Paste YouTube Video URL (e.g. https://www.youtube.com/watch?v=...)"
              />
              {youtubeThumbnail && (
                <div className="flex gap-3 items-center p-2 rounded-lg bg-muted/40 border border-border/60">
                  <div className={`relative ${item.type === 'youtube' && item.style?.aspectRatio === '9:16' ? 'w-10 aspect-[9/16]' : 'w-20 aspect-video'} rounded overflow-hidden bg-black shrink-0 border border-border shadow-sm transition-all duration-300`}>
                    <img src={youtubeThumbnail} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <Play size={10} className="text-white fill-current" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    {isFetching ? (
                      <p className="text-xs text-[var(--brand)] font-bold animate-pulse flex items-center gap-1">
                        <Sparkles size={8} className="animate-spin" /> Fetching details...
                      </p>
                    ) : (
                      <>
                        {item.videoTitle ? (
                          <p className="text-sm font-bold text-foreground line-clamp-2 leading-tight">{item.videoTitle}</p>
                        ) : (
                          <p className="text-sm font-semibold text-foreground truncate">Connected YouTube Video</p>
                        )}
                        {(item.videoDescription || item.videoStats) && (
                          <p className="text-xs text-muted-foreground line-clamp-1 leading-normal">
                            {item.videoDescription} {item.videoDescription && item.videoStats ? '•' : ''} {item.videoStats}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {item.type === 'carousel' && (
            <div className="space-y-3">
              {/* Carousel Title for Editor Reference */}
              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Slide Configuration</span>
                <Button 
                  type="button"
                  variant="outline" 
                  className="h-6 px-2 text-xs gap-1 font-bold text-foreground hover:text-foreground border-border bg-background"
                  onClick={() => {
                    const currentItems = item.items || []
                    const newSlide = { 
                      id: `slide-${Date.now()}`, 
                      imageUrl: '', 
                      title: '', 
                      url: '' 
                    }
                    handleUpdateLink(item.id, 'items', [...currentItems, newSlide])
                    setSlideBackup({ title: '', imageUrl: '', url: '' })
                    setEditingSlideId(newSlide.id)
                  }}
                >
                  <Plus size={10} /> Add Slide
                </Button>
              </div>

              {/* List of carousel slides */}
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                {(!item.items || item.items.length === 0) && (
                  <p className="text-xs text-zinc-500 font-medium italic py-2 text-center">No slides added. Click "Add Slide" to begin.</p>
                )}
                {item.items?.map((slide, slideIndex) => {
                  const isEditing = editingSlideId === slide.id;
                  return (
                    <div 
                      key={slide.id} 
                      className={`rounded-lg border transition-all ${
                        isEditing 
                          ? 'p-3 border-border bg-card shadow-xs'
                          : 'py-1.5 px-3 border-border bg-muted/30 hover:bg-muted/50'
                      }`}
                    >
                      <div className={`grid grid-cols-[50px_1fr_auto] gap-3 ${isEditing ? 'items-start' : 'items-center'}`}>
                        {/* Image Thumbnail with Slide Number Badge */}
                        <div 
                          className={`w-[50px] h-[50px] rounded-lg border border-zinc-200 bg-zinc-100 overflow-hidden shrink-0 relative shadow-sm self-start mt-0.5 select-none ${
                            isEditing ? 'cursor-pointer hover:border-zinc-300' : ''
                          }`}
                          onClick={() => {
                            if (isEditing) {
                              handleSaveEdit();
                            } else {
                              setSlideBackup({ title: slide.title || '', imageUrl: slide.imageUrl || '', url: slide.url || '' })
                              setEditingSlideId(slide.id);
                            }
                          }}
                          title={isEditing ? "Click to close" : "Click to edit"}
                        >
                          {slide.imageUrl ? (
                            <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400 font-bold">No Image</div>
                          )}
                          {/* Slide Index Badge */}
                          <div className="absolute top-1 left-1 bg-black/65 backdrop-blur-xs text-[10px] font-black text-white h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center shadow-xs border border-white/10 select-none">
                            {slideIndex + 1}
                          </div>
                        </div>
                        
                        {/* Slide Details (View or Edit Mode) */}
                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <div className="space-y-2">
                              <Input
                                type="text"
                                value={slide.title || ''}
                                placeholder="Slide Title"
                                className="w-full h-8 bg-transparent border-0 border-b border-transparent hover:border-zinc-200 focus-visible:border-[var(--brand)] px-0 font-bold text-sm focus-visible:ring-0 shadow-none rounded-none focus-visible:border-b"
                                onChange={(e) => {
                                  const updated = item.items.map(s => s.id === slide.id ? { ...s, title: e.target.value } : s)
                                  handleUpdateLink(item.id, 'items', updated)
                                }}
                                autoFocus
                              />
                              <div className="space-y-1">
                                <Input
                                  type="text"
                                  value={slide.imageUrl || ''}
                                  placeholder="https://example.com/image.jpg"
                                  className="w-full h-7 bg-transparent border-0 border-b border-transparent hover:border-zinc-200 focus-visible:border-[var(--brand)] px-0 text-xs text-zinc-700 font-medium focus-visible:ring-0 shadow-none rounded-none focus-visible:border-b animate-none"
                                  onChange={(e) => {
                                    const updated = item.items.map(s => s.id === slide.id ? { ...s, imageUrl: e.target.value } : s)
                                    handleUpdateLink(item.id, 'items', updated)
                                  }}
                                />
                                {/* Image Presets Pills */}
                                {(!slide.imageUrl || slide.imageUrl.trim() === '') && (
                                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-550 px-0.5 mt-1.5">
                                    <span className="font-bold text-zinc-600">Curated:</span>
                                    {PRESET_IMAGES.map((preset) => (
                                      <button
                                        key={preset.name}
                                        type="button"
                                        onClick={() => {
                                          const updated = item.items.map(s => s.id === slide.id ? { ...s, imageUrl: preset.url } : s)
                                          handleUpdateLink(item.id, 'items', updated)
                                        }}
                                        className="px-2 py-0.5 rounded border border-zinc-200/80 bg-white hover:bg-zinc-100 hover:text-zinc-950 hover:border-zinc-300 transition font-bold text-xs shadow-xs text-zinc-700"
                                      >
                                        {preset.name}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <Input
                                type="text"
                                value={slide.url || ''}
                                placeholder="https://example.com"
                                className="w-full h-7 bg-transparent border-0 border-b border-transparent hover:border-zinc-200 focus-visible:border-[var(--brand)] px-0 text-xs text-zinc-700 font-medium focus-visible:ring-0 shadow-none rounded-none focus-visible:border-b animate-none"
                                onChange={(e) => {
                                  const updated = item.items.map(s => s.id === slide.id ? { ...s, url: e.target.value } : s)
                                  handleUpdateLink(item.id, 'items', updated)
                                }}
                              />
                              <div className="flex items-center gap-2 mt-2.5">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSaveEdit();
                                  }}
                                  className="text-[10.5px] font-bold text-[var(--brand)] hover:opacity-85 uppercase tracking-wider flex items-center gap-1 transition-all w-fit"
                                >
                                  <Check size={11} className="stroke-[2.5]" /> Save & Close
                                </button>
                                <span className="text-zinc-300 text-xs">|</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelEdit(slide.id);
                                  }}
                                  className="text-[10.5px] font-bold text-muted-foreground hover:text-foreground uppercase tracking-wider flex items-center gap-1 transition-all w-fit"
                                >
                                  <X size={11} className="stroke-[2.5]" /> Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div 
                              className="cursor-pointer group/details py-0.5 px-1.5 -mx-1.5 rounded-md hover:bg-muted/60 transition-colors"
                              onClick={() => {
                                setSlideBackup({ title: slide.title || '', imageUrl: slide.imageUrl || '', url: slide.url || '' })
                                setEditingSlideId(slide.id)
                              }}
                              title="Click to edit slide details"
                            >
                              <div className="font-bold text-foreground text-sm truncate">
                                {slide.title || <span className="italic font-medium text-muted-foreground">Untitled Slide</span>}
                              </div>
                              <div className="text-muted-foreground text-xs truncate mt-0.5">
                                {slide.url || <span className="text-muted-foreground">No redirect URL</span>}
                              </div>
                              <button
                                type="button"
                                className="text-[10.5px] font-bold text-muted-foreground group-hover/details:text-foreground uppercase tracking-wider flex items-center gap-1.5 mt-1 transition-all"
                              >
                                <Pencil size={11} className="text-muted-foreground group-hover/details:text-foreground" /> Edit Details
                              </button>
                            </div>
                          )}
                        </div>

                      {/* Action Toolbar (Horizontal layout, divider on left) */}
                      <div className={`flex flex-row items-center gap-1.5 border-l border-border pl-2.5 shrink-0 ${isEditing ? 'self-start mt-1' : 'self-center'}`}>
                        <button
                          type="button"
                          className="size-7 flex items-center justify-center rounded-md border border-border bg-background hover:bg-muted hover:text-foreground text-foreground shadow-xs transition disabled:opacity-30 disabled:pointer-events-none active:scale-95"
                          onClick={() => moveSlide(slide.id, 'up')}
                          disabled={slideIndex === 0}
                          title="Move Slide Up"
                        >
                          <ChevronUp size={14} className="stroke-[2.5]" />
                        </button>
                        <button
                          type="button"
                          className="size-7 flex items-center justify-center rounded-md border border-border bg-background hover:bg-muted hover:text-foreground text-foreground shadow-xs transition disabled:opacity-30 disabled:pointer-events-none active:scale-95"
                          onClick={() => moveSlide(slide.id, 'down')}
                          disabled={slideIndex === (item.items || []).length - 1}
                          title="Move Slide Down"
                        >
                          <ChevronDown size={14} className="stroke-[2.5]" />
                        </button>
                        <button
                          type="button"
                          className="size-7 flex items-center justify-center rounded-md border border-red-500/20 bg-red-500/10 hover:bg-red-500/15 hover:text-red-600 hover:border-red-500/30 text-red-500 shadow-xs transition active:scale-95"
                          onClick={() => {
                            const currentItems = item.items || []
                            handleUpdateLink(item.id, 'items', currentItems.filter(s => s.id !== slide.id))
                          }}
                          title="Delete Slide"
                        >
                          <Trash2 size={14} className="stroke-[2]" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
              </div>
            </div>
          )}
        </div>

        {/* Switch Toggle (Active / Inactive) */}
        <div className="flex items-center gap-2 h-8 ml-2">
          <Switch
            checked={item.active}
            onCheckedChange={() => toggleLink(item.id)}
            aria-label={`Toggle ${item.type}`}
            className="data-[state=checked]:bg-emerald-500"
          />
        </div>
      </div>

      {/* CUSTOM STYLE SETTINGS DROPDOWN / TOGGLES FOR PREMIUM DESIGN */}
      <div className="border-t border-zinc-100 pt-3 mt-1 space-y-2.5">
        {/* Footer toolbar buttons (dx: view stats, copy link, settings, delete block etc) */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-zinc-400">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted">
                    <ImageIcon size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add Thumbnail Image</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted">
                    <ChartColumn size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View Analytics</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted"
                    onClick={() => {
                      const urlToCopy = item.type === 'youtube' ? item.videoUrl : item.type === 'carousel' ? '' : item.url
                      if (urlToCopy) navigator.clipboard.writeText(urlToCopy)
                    }}
                  >
                    <Copy size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy URL</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon" 
                    className={`h-7 w-7 transition-colors ${
                      showSettings ? 'text-[var(--brand)] bg-muted' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    <SlidersHorizontal size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    onClick={() => handleDeleteLink(item.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete block</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {item.type === 'button' && (
            <div className="font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded text-[10px]">
              {item.clicks} clicks
            </div>
          )}
        </div>

        {/* Dynamic block settings toggled by settings button */}
        {showSettings && (
          <div className="border-t border-zinc-100 pt-3 mt-1.5 space-y-3.5 animate-in fade-in slide-in-from-top-1 duration-200">
            {/* Buttons: Alignments, Shapes, Style Variants */}
            {item.type === 'button' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Alignment segment */}
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-650 uppercase tracking-wider text-xs block">Alignment</label>
                  <div className="flex border border-zinc-200/80 rounded-lg p-0.5 bg-zinc-100/60 w-fit">
                    {(['left', 'center', 'right'] as const).map((align) => (
                      <button
                        key={align}
                        type="button"
                        className={`p-1.5 rounded-md transition ${
                          (item.style?.align || 'left') === align
                            ? 'bg-white shadow-xs text-[var(--brand)] font-bold'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                        onClick={() => handleUpdateLink(item.id, 'style.align', align)}
                        title={`Align ${align}`}
                      >
                        {align === 'left' && <AlignLeft size={13} />}
                        {align === 'center' && <AlignCenter size={13} />}
                        {align === 'right' && <AlignRight size={13} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Shape segment */}
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-650 uppercase tracking-wider text-xs block">Shape</label>
                  <div className="flex border border-zinc-200/80 rounded-lg p-0.5 bg-zinc-100/60 w-fit">
                    {(['rectangle', 'rounded', 'pill'] as const).map((shape) => (
                      <button
                        key={shape}
                        type="button"
                        className={`px-3 py-1 text-xs font-bold rounded-md transition capitalize ${
                          (item.style?.shape || 'rounded') === shape
                            ? 'bg-white shadow-xs text-[var(--brand)] font-bold'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                        onClick={() => handleUpdateLink(item.id, 'style.shape', shape)}
                      >
                        {shape === 'rectangle' ? 'Rect' : shape === 'rounded' ? 'Round' : 'Pill'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Variant Style segment */}
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-650 uppercase tracking-wider text-xs block">Style Theme</label>
                  <div className="flex border border-zinc-200/80 rounded-lg p-0.5 bg-zinc-100/60 w-fit">
                    {(['fill', 'outline', 'soft', 'glass'] as const).map((variant) => (
                      <button
                        key={variant}
                        type="button"
                        className={`px-2.5 py-1 text-xs font-bold rounded-md transition capitalize ${
                          (item.style?.variant || 'fill') === variant
                            ? 'bg-white shadow-xs text-[var(--brand)] font-bold'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                        onClick={() => handleUpdateLink(item.id, 'style.variant', variant)}
                      >
                        {variant === 'fill' ? 'Fill' : variant === 'outline' ? 'Out' : variant === 'soft' ? 'Soft' : 'Glas'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Carousel: Shape & Aspect Ratio & Custom Layouts */}
            {item.type === 'carousel' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Shape */}
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-650 uppercase tracking-wider text-xs block">Card Corner Shape</label>
                  <div className="flex border border-zinc-200/80 rounded-lg p-0.5 bg-zinc-100/60 w-fit">
                    {(['rectangle', 'rounded'] as const).map((shape) => (
                      <button
                        key={shape}
                        type="button"
                        className={`px-3 py-1 text-xs font-bold rounded-md transition capitalize ${
                          (item.style?.shape || 'rounded') === shape
                            ? 'bg-white shadow-xs text-[var(--brand)] font-bold'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                        onClick={() => handleUpdateLink(item.id, 'style.shape', shape)}
                      >
                        {shape === 'rectangle' ? 'Sharp' : 'Rounded'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aspect Ratio */}
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-650 uppercase tracking-wider text-xs block">Aspect Ratio</label>
                  <div className="flex border border-zinc-200/80 rounded-lg p-0.5 bg-zinc-100/60 w-fit flex-wrap gap-0.5">
                    {(['1:1', '16:9', '3:4', '4:3'] as const).map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
                          (item.style?.aspectRatio || '4:3') === ratio
                            ? 'bg-white shadow-xs text-[var(--brand)] font-bold'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                        onClick={() => handleUpdateLink(item.id, 'style.aspectRatio', ratio)}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card Style */}
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-650 uppercase tracking-wider text-xs block">Card Style Layout</label>
                  <div className="flex border border-zinc-200/80 rounded-lg p-0.5 bg-zinc-100/60 w-fit">
                    {(['overlay', 'classic', 'minimal'] as const).map((cardS) => (
                      <button
                        key={cardS}
                        type="button"
                        className={`px-3 py-1 text-xs font-bold rounded-md transition capitalize ${
                          (item.style?.cardStyle || 'overlay') === cardS
                            ? 'bg-white shadow-xs text-[var(--brand)] font-bold'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                        onClick={() => handleUpdateLink(item.id, 'style.cardStyle', cardS)}
                      >
                        {cardS}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Indicator Pagination */}
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-650 uppercase tracking-wider text-xs block">Slide Indicators</label>
                  <div className="flex border border-zinc-200/80 rounded-lg p-0.5 bg-zinc-100/60 w-fit">
                    {(['dots', 'bars', 'badge', 'none'] as const).map((indS) => (
                      <button
                        key={indS}
                        type="button"
                        className={`px-3 py-1 text-xs font-bold rounded-md transition capitalize ${
                          (item.style?.indicatorStyle || 'dots') === indS
                            ? 'bg-white shadow-xs text-[var(--brand)] font-bold'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                        onClick={() => handleUpdateLink(item.id, 'style.indicatorStyle', indS)}
                      >
                        {indS}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* YouTube: Shape & Aspect Ratio & Layout Customizations */}
            {item.type === 'youtube' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Shape & Aspect Ratio */}
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="font-bold text-zinc-650 uppercase tracking-wider text-xs block">Video Player Corners</label>
                    <div className="flex border border-zinc-200/80 rounded-lg p-0.5 bg-zinc-100/60 w-fit">
                      {(['rectangle', 'rounded'] as const).map((shape) => (
                        <button
                          key={shape}
                          type="button"
                          className={`px-3 py-1 text-xs font-bold rounded-md transition capitalize ${
                            (item.style?.shape || 'rounded') === shape
                              ? 'bg-white shadow-xs text-[var(--brand)] font-bold'
                              : 'text-zinc-600 hover:text-zinc-900'
                          }`}
                          onClick={() => handleUpdateLink(item.id, 'style.shape', shape)}
                        >
                          {shape === 'rectangle' ? 'Square' : 'Rounded'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-zinc-650 uppercase tracking-wider text-xs block">Aspect Ratio</label>
                    <div className="flex border border-zinc-200/80 rounded-lg p-0.5 bg-zinc-100/60 w-fit">
                      {(['16:9', '9:16'] as const).map((ratio) => (
                        <button
                          key={ratio}
                          type="button"
                          className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
                            (item.style?.aspectRatio || '16:9') === ratio
                              ? 'bg-white shadow-xs text-[var(--brand)] font-bold'
                              : 'text-zinc-600 hover:text-zinc-900'
                          }`}
                          onClick={() => handleUpdateLink(item.id, 'style.aspectRatio', ratio)}
                        >
                          {ratio === '16:9' ? '16:9 Std' : '9:16 Shorts'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Layout type & Switch Toggles */}
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="font-bold text-zinc-650 uppercase tracking-wider text-xs block">Layout Style</label>
                    <div className="flex border border-zinc-200/80 rounded-lg p-0.5 bg-zinc-100/60 w-fit">
                      {(['feed', 'card', 'inline'] as const).map((layout) => (
                        <button
                          key={layout}
                          type="button"
                          className={`px-3 py-1 text-xs font-bold rounded-md transition capitalize ${
                            (item.style?.layout || 'feed') === layout
                              ? 'bg-white shadow-xs text-[var(--brand)] font-bold'
                              : 'text-zinc-600 hover:text-zinc-900'
                          }`}
                          onClick={() => handleUpdateLink(item.id, 'style.layout', layout)}
                        >
                          {layout}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`show-stats-${item.id}`}
                        checked={item.style?.showStats !== false}
                        onCheckedChange={(checked) => handleUpdateLink(item.id, 'style.showStats', checked)}
                        className="scale-90 data-[state=checked]:bg-[var(--brand)]"
                      />
                      <label htmlFor={`show-stats-${item.id}`} className="text-xs font-bold text-zinc-700 cursor-pointer">Show Stats</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`show-desc-${item.id}`}
                        checked={item.style?.showDescription !== false}
                        onCheckedChange={(checked) => handleUpdateLink(item.id, 'style.showDescription', checked)}
                        className="scale-90 data-[state=checked]:bg-[var(--brand)]"
                      />
                      <label htmlFor={`show-desc-${item.id}`} className="text-xs font-bold text-zinc-700 cursor-pointer">Show Subtitle</label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
