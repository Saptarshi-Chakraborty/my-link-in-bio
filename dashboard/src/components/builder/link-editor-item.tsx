import {
  GripVertical,
  Image as ImageIcon,
  ChartColumn,
  Copy,
  Trash2
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
import type { LinkItem } from './types'

interface LinkEditorItemProps {
  item: LinkItem
  handleDeleteLink: (id: string) => void
  handleUpdateLink: (id: string, key: 'title' | 'url', value: string) => void
  toggleLink: (id: string) => void
}

export function LinkEditorItem({
  item,
  handleDeleteLink,
  handleUpdateLink,
  toggleLink
}: LinkEditorItemProps) {
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
        
        <div className="flex-1 min-w-0 space-y-1">
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
            className="w-full h-7 bg-transparent border-0 border-b border-transparent hover:border-zinc-200 focus-visible:border-[var(--brand)] px-0 text-xs text-muted-foreground focus-visible:ring-0 shadow-none rounded-none focus-visible:border-b"
            placeholder="https://example.com"
          />
        </div>

        <div className="flex items-center gap-2 h-8">
          <Switch
            checked={item.active}
            onCheckedChange={() => toggleLink(item.id)}
            aria-label={`Toggle ${item.title}`}
            className="data-[state=checked]:bg-emerald-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-xs">
        <div className="flex items-center gap-1 text-zinc-400">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100">
                  <ImageIcon size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Image</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100">
                  <ChartColumn size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View Stats</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100" onClick={() => navigator.clipboard.writeText(item.url)}>
                  <Copy size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy URL</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteLink(item.id)}>
                  <Trash2 size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete Link</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded text-[10px]">
          {item.clicks} clicks
        </div>
      </div>
    </div>
  )
}
