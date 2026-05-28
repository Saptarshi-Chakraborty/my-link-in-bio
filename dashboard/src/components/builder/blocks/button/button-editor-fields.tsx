import { Input } from '@/components/ui/input'
import type { ButtonElement } from '../../types'

interface ButtonEditorFieldsProps {
  item: ButtonElement
  onUpdate: (id: string, key: string, value: any) => void
}

export function ButtonEditorFields({ item, onUpdate }: ButtonEditorFieldsProps) {
  return (
    <div className="space-y-1.5">
      <Input
        type="text"
        value={item.title}
        onChange={(e) => onUpdate(item.id, 'title', e.target.value)}
        className="w-full h-8 bg-transparent border-0 border-b border-transparent hover:border-border focus-visible:border-[var(--brand)] px-0 font-bold text-sm focus-visible:ring-0 shadow-none rounded-none focus-visible:border-b"
        placeholder="Link Title"
      />
      <Input
        type="text"
        value={item.url}
        onChange={(e) => onUpdate(item.id, 'url', e.target.value)}
        className="w-full h-7 bg-transparent border-0 border-b border-transparent hover:border-border focus-visible:border-[var(--brand)] px-0 text-xs text-foreground font-medium focus-visible:ring-0 shadow-none rounded-none focus-visible:border-b animate-none"
        placeholder="https://example.com"
      />
    </div>
  )
}
