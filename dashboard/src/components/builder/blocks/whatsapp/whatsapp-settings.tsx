import type { WhatsAppElement } from '../../types'

interface WhatsAppSettingsProps {
  item: WhatsAppElement
  onUpdate: (id: string, key: string, value: any) => void
}

export function WhatsAppSettings({ item, onUpdate }: WhatsAppSettingsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
      <div className="space-y-1.5">
        <label className="font-bold text-muted-foreground uppercase tracking-wider text-xs block">Button Color Style</label>
        <div className="flex border border-border rounded-lg p-0.5 bg-muted w-fit">
          {[
            { label: 'Brand Green', value: true },
            { label: 'Theme Match', value: false }
          ].map((opt) => {
            const isSelected = !!item.style?.useBrandColor === opt.value
            return (
              <button
                key={opt.label}
                type="button"
                className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                  isSelected
                    ? 'bg-background shadow-xs text-[var(--brand)] font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => onUpdate(item.id, 'style.useBrandColor', opt.value)}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
