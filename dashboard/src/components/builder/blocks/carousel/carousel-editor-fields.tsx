import { useState } from 'react'
import {
  Plus,
  ChevronUp,
  ChevronDown,
  Trash2,
  Pencil,
  Check,
  X
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { CarouselElement } from '../../types'

const PRESET_IMAGES = [
  { name: 'Gradient', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400' },
  { name: 'Desk', url: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=400' },
  { name: 'Abstract', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400' },
  { name: 'Tech', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400' },
  { name: 'Nature', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400' }
]

interface CarouselEditorFieldsProps {
  item: CarouselElement
  onUpdate: (id: string, key: string, value: any) => void
}

export function CarouselEditorFields({ item, onUpdate }: CarouselEditorFieldsProps) {
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null)
  const [slideBackup, setSlideBackup] = useState<{ title: string; imageUrl: string; url: string } | null>(null)

  const handleSaveEdit = () => {
    setEditingSlideId(null)
    setSlideBackup(null)
  }

  const handleCancelEdit = (slideId: string) => {
    if (slideBackup) {
      const updated = (item.items || []).map(s => s.id === slideId ? { ...s, ...slideBackup } : s)
      onUpdate(item.id, 'items', updated)
    }
    setEditingSlideId(null)
    setSlideBackup(null)
  }

  const moveSlide = (slideId: string, direction: 'up' | 'down') => {
    const currentItems = [...(item.items || [])]
    const slideIdx = currentItems.findIndex(s => s.id === slideId)
    if (slideIdx === -1) return
    const targetIdx = direction === 'up' ? slideIdx - 1 : slideIdx + 1
    if (targetIdx < 0 || targetIdx >= currentItems.length) return
    
    const temp = currentItems[slideIdx]
    currentItems[slideIdx] = currentItems[targetIdx]
    currentItems[targetIdx] = temp
    
    onUpdate(item.id, 'items', currentItems)
  }

  return (
    <div className="space-y-3">
      {/* Carousel Title for Editor Reference */}
      <div className="flex items-center justify-between border-b pb-1.5">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Slide Configuration</span>
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
            onUpdate(item.id, 'items', [...currentItems, newSlide])
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
          <p className="text-xs text-muted-foreground font-medium italic py-2 text-center">No slides added. Click "Add Slide" to begin.</p>
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
                  className={`w-[50px] h-[50px] rounded-lg border border-border bg-muted overflow-hidden shrink-0 relative shadow-sm self-start mt-0.5 select-none ${
                    isEditing ? 'cursor-pointer hover:border-border' : ''
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
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground font-bold">No Image</div>
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
                        className="w-full h-8 bg-transparent border-0 border-b border-transparent hover:border-border focus-visible:border-[var(--brand)] px-0 font-bold text-sm focus-visible:ring-0 shadow-none rounded-none focus-visible:border-b"
                        onChange={(e) => {
                          const updated = item.items.map(s => s.id === slide.id ? { ...s, title: e.target.value } : s)
                          onUpdate(item.id, 'items', updated)
                        }}
                        autoFocus
                      />
                      <div className="space-y-1">
                        <Input
                          type="text"
                          value={slide.imageUrl || ''}
                          placeholder="https://example.com/image.jpg"
                          className="w-full h-7 bg-transparent border-0 border-b border-transparent hover:border-border focus-visible:border-[var(--brand)] px-0 text-xs text-muted-foreground font-medium focus-visible:ring-0 shadow-none rounded-none focus-visible:border-b animate-none"
                          onChange={(e) => {
                            const updated = item.items.map(s => s.id === slide.id ? { ...s, imageUrl: e.target.value } : s)
                            onUpdate(item.id, 'items', updated)
                          }}
                        />
                        {/* Image Presets Pills */}
                        {(!slide.imageUrl || slide.imageUrl.trim() === '') && (
                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground px-0.5 mt-1.5">
                            <span className="font-bold text-muted-foreground">Curated:</span>
                            {PRESET_IMAGES.map((preset) => (
                              <button
                                key={preset.name}
                                type="button"
                                onClick={() => {
                                  const updated = item.items.map(s => s.id === slide.id ? { ...s, imageUrl: preset.url } : s)
                                  onUpdate(item.id, 'items', updated)
                                }}
                                className="px-2 py-0.5 rounded border border-border bg-background hover:bg-muted hover:text-foreground hover:border-border transition font-bold text-xs shadow-xs text-muted-foreground"
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
                        className="w-full h-7 bg-transparent border-0 border-b border-transparent hover:border-border focus-visible:border-[var(--brand)] px-0 text-xs text-muted-foreground font-medium focus-visible:ring-0 shadow-none rounded-none focus-visible:border-b animate-none"
                        onChange={(e) => {
                          const updated = item.items.map(s => s.id === slide.id ? { ...s, url: e.target.value } : s)
                          onUpdate(item.id, 'items', updated)
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
                        <span className="text-border text-xs">|</span>
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
                      onUpdate(item.id, 'items', currentItems.filter(s => s.id !== slide.id))
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
  )
}
