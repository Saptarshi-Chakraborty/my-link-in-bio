import { Plus, Info } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LinkEditorItem } from './link-editor-item'
import type { PageElement } from './types'

interface CustomLinksCardProps {
  links: PageElement[]
  activeLinks: PageElement[]
  handleAddElement: (type: 'button' | 'carousel' | 'youtube') => void
  handleDeleteLink: (id: string) => void
  handleUpdateLink: (id: string, key: string, value: any) => void
  toggleLink: (id: string) => void
}

export function CustomLinksCard({
  links,
  activeLinks,
  handleAddElement,
  handleDeleteLink,
  handleUpdateLink,
  toggleLink
}: CustomLinksCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
        <div>
          <CardTitle>Manage Custom Blocks</CardTitle>
          <CardDescription>Add, edit, and style your links, carousels, and embeds</CardDescription>
        </div>
        <CardAction className="flex flex-wrap gap-2 self-start sm:self-auto">
          <Button
            type="button"
            onClick={() => handleAddElement('button')}
            size="sm"
            className="h-8 px-3 text-[10px] gap-1 font-bold shadow-sm bg-[var(--brand)] text-white hover:bg-[var(--brand-light)] transition-all active:scale-95 shrink-0"
          >
            <Plus size={11} />
            Add Link
          </Button>
          <Button
            type="button"
            onClick={() => handleAddElement('carousel')}
            variant="outline"
            size="sm"
            className="h-8 px-3 text-[10px] gap-1 font-bold shadow-sm border-zinc-200 hover:bg-zinc-50 active:scale-95 text-zinc-700 bg-white shrink-0"
          >
            <Plus size={11} />
            Add Carousel
          </Button>
          <Button
            type="button"
            onClick={() => handleAddElement('youtube')}
            variant="outline"
            size="sm"
            className="h-8 px-3 text-[10px] gap-1 font-bold shadow-sm border-zinc-200 hover:bg-zinc-50 active:scale-95 text-zinc-700 bg-white shrink-0"
          >
            <Plus size={11} />
            Add YouTube
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {activeLinks.length === 0 && (
          <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs leading-relaxed">
            <Info size={16} className="text-amber-600 flex-shrink-0" />
            <p>All elements are currently hidden or inactive. Toggles must be switched ON to display them in the live preview.</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {links.map((item) => (
            <LinkEditorItem
              key={item.id}
              item={item}
              handleDeleteLink={handleDeleteLink}
              handleUpdateLink={handleUpdateLink}
              toggleLink={toggleLink}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
