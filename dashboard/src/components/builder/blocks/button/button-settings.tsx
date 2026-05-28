import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import type { ButtonElement } from '../../types'

interface ButtonSettingsProps {
  item: ButtonElement
  onUpdate: (id: string, key: string, value: any) => void
}

export function ButtonSettings({ item, onUpdate }: ButtonSettingsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
      {/* Alignment segment */}
      <div className="space-y-1.5">
        <label className="font-bold text-muted-foreground uppercase tracking-wider text-xs block">Alignment</label>
        <div className="flex border border-border rounded-lg p-0.5 bg-muted w-fit">
          {(['left', 'center', 'right'] as const).map((align) => (
            <button
              key={align}
              type="button"
              className={`p-1.5 rounded-md transition ${
                (item.style?.align || 'left') === align
                  ? 'bg-background shadow-xs text-[var(--brand)] font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => onUpdate(item.id, 'style.align', align)}
              title={`Align ${align}`}
            >
              {align === 'left' && <AlignLeft size={13} />}
              {align === 'center' && <AlignCenter size={13} />}
              {align === 'right' && <AlignRight size={13} />}
            </button>
          ))}
        </div>
      </div>

      {/* Shape segment */}
      <div className="space-y-1.5">
        <label className="font-bold text-muted-foreground uppercase tracking-wider text-xs block">Shape</label>
        <div className="flex border border-border rounded-lg p-0.5 bg-muted w-fit">
          {(['theme', 'rectangle', 'rounded', 'pill'] as const).map((shape) => {
            const isSelected = shape === 'theme'
              ? !item.style?.shape
              : item.style?.shape === shape

            return (
              <button
                key={shape}
                type="button"
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition capitalize ${
                  isSelected
                    ? 'bg-background shadow-xs text-[var(--brand)] font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => {
                  if (shape === 'theme') {
                    onUpdate(item.id, 'style.shape', undefined)
                  } else {
                    onUpdate(item.id, 'style.shape', shape)
                  }
                }}
              >
                {shape === 'theme' ? 'Theme' : shape === 'rectangle' ? 'Rect' : shape === 'rounded' ? 'Round' : 'Pill'}
              </button>
            )
          })}
        </div>
      </div>

      {/* Variant Style segment */}
      <div className="space-y-1.5">
        <label className="font-bold text-muted-foreground uppercase tracking-wider text-xs block">Style Theme</label>
        <div className="flex border border-border rounded-lg p-0.5 bg-muted w-fit">
          {(['fill', 'outline', 'soft', 'glass'] as const).map((variant) => (
            <button
              key={variant}
              type="button"
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition capitalize ${
                (item.style?.variant || 'fill') === variant
                  ? 'bg-background shadow-xs text-[var(--brand)] font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => onUpdate(item.id, 'style.variant', variant)}
            >
              {variant === 'fill' ? 'Fill' : variant === 'outline' ? 'Out' : variant === 'soft' ? 'Soft' : 'Glas'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
