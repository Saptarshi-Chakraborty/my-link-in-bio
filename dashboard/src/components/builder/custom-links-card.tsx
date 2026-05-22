import { Plus, Info } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LinkEditorItem } from './link-editor-item'
import type { LinkItem } from './types'

interface CustomLinksCardProps {
  links: LinkItem[]
  activeLinks: LinkItem[]
  handleAddLink: () => void
  handleDeleteLink: (id: string) => void
  handleUpdateLink: (id: string, key: 'title' | 'url', value: string) => void
  toggleLink: (id: string) => void
}

export function CustomLinksCard({
  links,
  activeLinks,
  handleAddLink,
  handleDeleteLink,
  handleUpdateLink,
  toggleLink
}: CustomLinksCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Custom Links</CardTitle>
        <CardDescription>Add, edit, and configure your visual shortcut cards</CardDescription>
        <CardAction>
          <Button
            onClick={handleAddLink}
            size="sm"
            className="h-9 px-4 text-xs gap-1 font-bold shadow-sm bg-[var(--brand)] text-white hover:bg-[var(--brand-light)] transition-colors"
          >
            <Plus size={14} />
            Add Link
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {activeLinks.length === 0 && (
          <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs leading-relaxed">
            <Info size={16} className="text-amber-600 flex-shrink-0" />
            <p>All links are currently hidden or inactive. Toggles must be switched ON to display them in the live preview.</p>
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
