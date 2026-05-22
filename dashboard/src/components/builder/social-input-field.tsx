import type { ReactNode } from 'react'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

interface SocialInputFieldProps {
  label: string
  icon: ReactNode
  value: string
  active: boolean
  onChange: (val: string) => void
  onToggle: () => void
}

export function SocialInputField({ label, icon, value, active, onChange, onToggle }: SocialInputFieldProps) {
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
        placeholder="Handle"
        className="flex-1 bg-transparent text-zinc-800 border-0 border-b border-transparent focus-visible:border-[var(--brand)] px-1 leading-none text-xs min-w-0 h-6 shadow-none rounded-none focus-visible:ring-0"
      />
      <Switch
        checked={active}
        onCheckedChange={onToggle}
        aria-label={`Toggle ${label}`}
        className="scale-90 data-[state=checked]:bg-emerald-500"
      />
    </div>
  )
}
