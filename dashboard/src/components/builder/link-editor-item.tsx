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
  Play
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
import type { PageElement } from './types'

interface LinkEditorItemProps {
  item: PageElement
  handleDeleteLink: (id: string) => void
  handleUpdateLink: (id: string, key: string, value: any) => void
  toggleLink: (id: string) => void
}

export function LinkEditorItem({
  item,
  handleDeleteLink,
  handleUpdateLink,
  toggleLink
}: LinkEditorItemProps) {
  
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
      className={`group rounded-xl border p-4 transition-all duration-200 bg-white ${
        item.active ? 'border-zinc-200 shadow-sm' : 'border-zinc-200/55 bg-zinc-50/50 opacity-80'
      }`}
    >
      <div className="mb-3 flex items-start gap-3">
        <div className="inline-flex h-8 items-center text-zinc-400 cursor-grab">
          <GripVertical size={16} />
        </div>
        
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header Info (Element Type Badge) */}
          <div className="flex items-center gap-1.5">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
              item.type === 'carousel' 
                ? 'bg-blue-50 text-blue-600 border border-blue-100'
                : item.type === 'youtube'
                ? 'bg-red-50 text-red-600 border border-red-100'
                : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
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
                className="w-full h-8 bg-transparent border-0 border-b border-transparent hover:border-zinc-200 focus-visible:border-[var(--brand)] px-0 font-bold text-sm focus-visible:ring-0 shadow-none rounded-none focus-visible:border-b"
                placeholder="Link Title"
              />
              <Input
                type="text"
                value={item.url}
                onChange={(e) => handleUpdateLink(item.id, 'url', e.target.value)}
                className="w-full h-7 bg-transparent border-0 border-b border-transparent hover:border-zinc-200 focus-visible:border-[var(--brand)] px-0 text-xs text-muted-foreground focus-visible:ring-0 shadow-none rounded-none focus-visible:border-b animate-none"
                placeholder="https://example.com"
              />
            </div>
          )}

          {item.type === 'youtube' && (
            <div className="space-y-2">
              <Input
                type="text"
                value={item.videoUrl}
                onChange={(e) => handleUpdateLink(item.id, 'videoUrl', e.target.value)}
                className="w-full h-8 bg-transparent border-0 border-b border-transparent hover:border-zinc-200 focus-visible:border-[var(--brand)] px-0 text-xs focus-visible:ring-0 shadow-none rounded-none focus-visible:border-b"
                placeholder="Paste YouTube Video URL (e.g. https://www.youtube.com/watch?v=...)"
              />
              {youtubeThumbnail && (
                <div className="flex gap-3 items-center p-2 rounded-lg bg-zinc-50 border border-zinc-150/50">
                  <div className={`relative ${item.type === 'youtube' && item.style?.aspectRatio === '9:16' ? 'w-10 aspect-[9/16]' : 'w-20 aspect-video'} rounded overflow-hidden bg-black shrink-0 border border-zinc-200 shadow-sm transition-all duration-300`}>
                    <img src={youtubeThumbnail} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <Play size={10} className="text-white fill-current" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-zinc-700 truncate">YouTube Video Connected</p>
                    <p className="text-[8px] text-zinc-400 truncate">Video ID: {videoId}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {item.type === 'carousel' && (
            <div className="space-y-3">
              {/* Carousel Title for Editor Reference */}
              <div className="flex items-center justify-between border-b pb-1.5">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Slide Configuration</span>
                <Button 
                  type="button"
                  variant="outline" 
                  className="h-6 px-2 text-[9px] gap-1 font-bold text-zinc-600 hover:text-zinc-900 border-zinc-200 bg-white"
                  onClick={() => {
                    const currentItems = item.items || []
                    const newSlide = { 
                      id: `slide-${Date.now()}`, 
                      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150', 
                      title: 'Slide Title', 
                      url: 'https://example.com' 
                    }
                    handleUpdateLink(item.id, 'items', [...currentItems, newSlide])
                  }}
                >
                  <Plus size={10} /> Add Slide
                </Button>
              </div>

              {/* List of carousel slides */}
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 scrollbar-thin">
                {(!item.items || item.items.length === 0) && (
                  <p className="text-[10px] text-zinc-400 italic py-2 text-center">No slides added. Click "Add Slide" to begin.</p>
                )}
                {item.items?.map((slide) => (
                  <div key={slide.id} className="relative group/slide p-2 rounded-lg border border-zinc-100 bg-zinc-50/50 space-y-1.5">
                    <button
                      type="button"
                      className="absolute top-1.5 right-1.5 text-zinc-400 hover:text-red-500 transition-colors p-0.5 rounded hover:bg-zinc-100"
                      onClick={() => {
                        const currentItems = item.items || []
                        handleUpdateLink(item.id, 'items', currentItems.filter(s => s.id !== slide.id))
                      }}
                      title="Delete Slide"
                    >
                      <Trash2 size={11} />
                    </button>
                    
                    <div className="grid grid-cols-[45px_1fr] gap-2 pr-4">
                      {/* Image Thumbnail */}
                      <div className="w-[45px] h-[45px] rounded border bg-zinc-100 overflow-hidden shrink-0 relative shadow-sm">
                        {slide.imageUrl ? (
                          <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[7px] text-zinc-400">No Image</div>
                        )}
                      </div>
                      
                      {/* Slide Inputs */}
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={slide.title || ''}
                          placeholder="Title"
                          className="w-full text-[9px] font-semibold bg-white border border-zinc-200 rounded px-1.5 py-0.5 focus:border-[var(--brand)] outline-none"
                          onChange={(e) => {
                            const updated = item.items.map(s => s.id === slide.id ? { ...s, title: e.target.value } : s)
                            handleUpdateLink(item.id, 'items', updated)
                          }}
                        />
                        <input
                          type="text"
                          value={slide.imageUrl || ''}
                          placeholder="Image URL"
                          className="w-full text-[9px] bg-white border border-zinc-200 rounded px-1.5 py-0.5 focus:border-[var(--brand)] outline-none"
                          onChange={(e) => {
                            const updated = item.items.map(s => s.id === slide.id ? { ...s, imageUrl: e.target.value } : s)
                            handleUpdateLink(item.id, 'items', updated)
                          }}
                        />
                        <input
                          type="text"
                          value={slide.url || ''}
                          placeholder="Redirect Link URL"
                          className="w-full text-[9px] bg-white border border-zinc-200 rounded px-1.5 py-0.5 focus:border-[var(--brand)] outline-none"
                          onChange={(e) => {
                            const updated = item.items.map(s => s.id === slide.id ? { ...s, url: e.target.value } : s)
                            handleUpdateLink(item.id, 'items', updated)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
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
        
        {/* Buttons: Alignments, Shapes, Style Variants */}
        {item.type === 'button' && (
          <div className="grid grid-cols-3 gap-3 text-[10px]">
            {/* Alignment segment */}
            <div className="space-y-1">
              <label className="font-semibold text-zinc-400 uppercase tracking-wider text-[8px] block">Alignment</label>
              <div className="flex border border-zinc-200 rounded-lg p-0.5 bg-zinc-50 w-fit">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    type="button"
                    className={`p-1.5 rounded transition ${
                      (item.style?.align || 'left') === align
                        ? 'bg-white shadow-sm text-[var(--brand)]'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                    onClick={() => handleUpdateLink(item.id, 'style.align', align)}
                    title={`Align ${align}`}
                  >
                    {align === 'left' && <AlignLeft size={12} />}
                    {align === 'center' && <AlignCenter size={12} />}
                    {align === 'right' && <AlignRight size={12} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Shape segment */}
            <div className="space-y-1">
              <label className="font-semibold text-zinc-400 uppercase tracking-wider text-[8px] block">Shape</label>
              <div className="flex border border-zinc-200 rounded-lg p-0.5 bg-zinc-50 w-fit">
                {(['rectangle', 'rounded', 'pill'] as const).map((shape) => (
                  <button
                    key={shape}
                    type="button"
                    className={`px-2 py-1 text-[9px] font-bold rounded transition capitalize ${
                      (item.style?.shape || 'rounded') === shape
                        ? 'bg-white shadow-sm text-[var(--brand)]'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                    onClick={() => handleUpdateLink(item.id, 'style.shape', shape)}
                  >
                    {shape === 'rectangle' ? 'Rect' : shape === 'rounded' ? 'Rnd' : 'Pill'}
                  </button>
                ))}
              </div>
            </div>

            {/* Variant Style segment */}
            <div className="space-y-1">
              <label className="font-semibold text-zinc-400 uppercase tracking-wider text-[8px] block">Style Theme</label>
              <div className="flex border border-zinc-200 rounded-lg p-0.5 bg-zinc-50 w-fit">
                {(['fill', 'outline', 'soft', 'glass'] as const).map((variant) => (
                  <button
                    key={variant}
                    type="button"
                    className={`px-1.5 py-1 text-[9px] font-bold rounded transition capitalize ${
                      (item.style?.variant || 'fill') === variant
                        ? 'bg-white shadow-sm text-[var(--brand)]'
                        : 'text-zinc-500 hover:text-zinc-800'
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

        {/* Carousel: Shape & Aspect Ratio */}
        {item.type === 'carousel' && (
          <div className="grid grid-cols-2 gap-3 text-[10px]">
            {/* Shape */}
            <div className="space-y-1">
              <label className="font-semibold text-zinc-400 uppercase tracking-wider text-[8px] block">Card Corner Shape</label>
              <div className="flex border border-zinc-200 rounded-lg p-0.5 bg-zinc-50 w-fit">
                {(['rectangle', 'rounded'] as const).map((shape) => (
                  <button
                    key={shape}
                    type="button"
                    className={`px-2 py-1 text-[9px] font-bold rounded transition capitalize ${
                      (item.style?.shape || 'rounded') === shape
                        ? 'bg-white shadow-sm text-[var(--brand)]'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                    onClick={() => handleUpdateLink(item.id, 'style.shape', shape)}
                  >
                    {shape === 'rectangle' ? 'Sharp' : 'Rounded'}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-1">
              <label className="font-semibold text-zinc-400 uppercase tracking-wider text-[8px] block">Aspect Ratio</label>
              <div className="flex border border-zinc-200 rounded-lg p-0.5 bg-zinc-50 w-fit">
                {(['1:1', '16:9'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    className={`px-2 py-1 text-[9px] font-bold rounded transition ${
                      (item.style?.aspectRatio || '1:1') === ratio
                        ? 'bg-white shadow-sm text-[var(--brand)]'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                    onClick={() => handleUpdateLink(item.id, 'style.aspectRatio', ratio)}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* YouTube: Shape & Aspect Ratio */}
        {item.type === 'youtube' && (
          <div className="grid grid-cols-2 gap-3 text-[10px]">
            {/* Shape */}
            <div className="space-y-1">
              <label className="font-semibold text-zinc-400 uppercase tracking-wider text-[8px] block">Video Player Corners</label>
              <div className="flex border border-zinc-200 rounded-lg p-0.5 bg-zinc-50 w-fit">
                {(['rectangle', 'rounded'] as const).map((shape) => (
                  <button
                    key={shape}
                    type="button"
                    className={`px-2.5 py-1 text-[9px] font-bold rounded transition capitalize ${
                      (item.style?.shape || 'rounded') === shape
                        ? 'bg-white shadow-sm text-[var(--brand)]'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                    onClick={() => handleUpdateLink(item.id, 'style.shape', shape)}
                  >
                    {shape === 'rectangle' ? 'Square' : 'Rounded'}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-1">
              <label className="font-semibold text-zinc-400 uppercase tracking-wider text-[8px] block">Aspect Ratio</label>
              <div className="flex border border-zinc-200 rounded-lg p-0.5 bg-zinc-50 w-fit">
                {(['16:9', '9:16'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    className={`px-2 py-1 text-[9px] font-bold rounded transition ${
                      (item.style?.aspectRatio || '16:9') === ratio
                        ? 'bg-white shadow-sm text-[var(--brand)]'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                    onClick={() => handleUpdateLink(item.id, 'style.aspectRatio', ratio)}
                  >
                    {ratio === '16:9' ? '16:9 Std' : '9:16 Shorts'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer toolbar buttons (dx: view stats, copy link, etc) */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100/70 text-xs">
          <div className="flex items-center gap-1 text-zinc-400">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100">
                    <ImageIcon size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add Thumbnail Image</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100">
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
                    className="h-7 w-7 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100" 
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
                    className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50" 
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
            <div className="font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded text-[10px]">
              {item.clicks} clicks
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
