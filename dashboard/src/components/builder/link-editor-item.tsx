import { useState } from 'react'
import {
  GripVertical,
  Image as ImageIcon,
  ChartColumn,
  Copy,
  Trash2,
  SlidersHorizontal
} from 'lucide-react'
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
import { sanitizePhoneNumber } from '@/lib/utils'

// Subcomponents per block type
import { ButtonEditorFields } from './blocks/button/button-editor-fields'
import { ButtonSettings } from './blocks/button/button-settings'
import { WhatsAppEditorFields } from './blocks/whatsapp/whatsapp-editor-fields'
import { WhatsAppSettings } from './blocks/whatsapp/whatsapp-settings'
import { YoutubeEditorFields } from './blocks/youtube/youtube-editor-fields'
import { YoutubeSettings } from './blocks/youtube/youtube-settings'
import { CarouselEditorFields } from './blocks/carousel/carousel-editor-fields'
import { CarouselSettings } from './blocks/carousel/carousel-settings'

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

  const [showSettings, setShowSettings] = useState(false)

  const { ref, handleRef, isDragging } = useSortable({
    id: item.id,
    index,
    disabled: isOverlay,
  })

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
        {/* Grab Handle */}
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
                : item.type === 'whatsapp'
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                : 'bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]/20'
            }`}>
              {item.type}
            </span>
          </div>

          {/* Render editor fields based on Element Type */}
          {item.type === 'button' && (
            <ButtonEditorFields item={item} onUpdate={handleUpdateLink} />
          )}

          {item.type === 'whatsapp' && (
            <WhatsAppEditorFields item={item} onUpdate={handleUpdateLink} />
          )}

          {item.type === 'youtube' && (
            <YoutubeEditorFields item={item} onUpdate={handleUpdateLink} />
          )}

          {item.type === 'carousel' && (
            <CarouselEditorFields item={item} onUpdate={handleUpdateLink} />
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

      {/* FOOTER TOOLBAR & SETTINGS FOR PREMIUM DESIGN */}
      <div className="border-t border-border pt-3 mt-1 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
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
                      const urlToCopy = item.type === 'youtube' 
                        ? item.videoUrl 
                        : item.type === 'carousel' 
                        ? '' 
                        : item.type === 'whatsapp'
                        ? `https://wa.me/${sanitizePhoneNumber(item.phone)}?text=${encodeURIComponent(item.message)}`
                        : item.url
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
          <div className="border-t border-border pt-3 mt-1.5 space-y-3.5 animate-in fade-in slide-in-from-top-1 duration-200">
            {item.type === 'button' && (
              <ButtonSettings item={item} onUpdate={handleUpdateLink} />
            )}

            {item.type === 'whatsapp' && (
              <WhatsAppSettings item={item} onUpdate={handleUpdateLink} />
            )}

            {item.type === 'carousel' && (
              <CarouselSettings item={item} onUpdate={handleUpdateLink} />
            )}

            {item.type === 'youtube' && (
              <YoutubeSettings item={item} onUpdate={handleUpdateLink} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
