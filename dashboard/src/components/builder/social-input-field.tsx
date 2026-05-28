import type { ReactNode } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface SocialInputFieldProps {
  id?: string
  label: string
  icon: ReactNode
  value: string
  onChange: (val: string) => void
  onRemove: () => void
}

export function SocialInputField({ id, label, icon, value, onChange, onRemove }: SocialInputFieldProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/30 p-2.5 text-xs">
      <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-semibold shrink-0">
        {icon}
        <span className="hidden sm:inline">{label}</span>
      </div>
      <Input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Username / Handle"
        className="flex-1 bg-transparent text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 border-0 border-b border-transparent focus-visible:border-[var(--brand)] px-1 leading-none text-xs min-w-0 h-6 shadow-none rounded-none focus-visible:ring-0"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg active:scale-95 transition-all"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}
