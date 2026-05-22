import type { ReactNode } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface SocialInputFieldProps {
  label: string
  icon: ReactNode
  value: string
  onChange: (val: string) => void
  onRemove: () => void
}

export function SocialInputField({ label, icon, value, onChange, onRemove }: SocialInputFieldProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-zinc-50 p-2.5 text-xs">
      <div className="flex items-center gap-2 text-zinc-700 font-semibold shrink-0">
        {icon}
        <span className="hidden sm:inline">{label}</span>
      </div>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Username / Handle"
        className="flex-1 bg-transparent text-zinc-800 border-0 border-b border-transparent focus-visible:border-[var(--brand)] px-1 leading-none text-xs min-w-0 h-6 shadow-none rounded-none focus-visible:ring-0"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg active:scale-95 transition-all"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}
