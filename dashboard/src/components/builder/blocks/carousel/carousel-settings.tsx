import type { CarouselElement } from '../../types'

interface CarouselSettingsProps {
  item: CarouselElement
  onUpdate: (id: string, key: string, value: any) => void
}

export function CarouselSettings({ item, onUpdate }: CarouselSettingsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
      {/* Shape */}
      <div className="space-y-1.5">
        <label className="font-bold text-muted-foreground uppercase tracking-wider text-xs block">Card Corner Shape</label>
        <div className="flex border border-border rounded-lg p-0.5 bg-muted w-fit">
          {(['rectangle', 'rounded'] as const).map((shape) => (
            <button
              key={shape}
              type="button"
              className={`px-3 py-1 text-xs font-bold rounded-md transition capitalize ${
                (item.style?.shape || 'rounded') === shape
                  ? 'bg-background shadow-xs text-[var(--brand)] font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => onUpdate(item.id, 'style.shape', shape)}
            >
              {shape === 'rectangle' ? 'Sharp' : 'Rounded'}
            </button>
          ))}
        </div>
      </div>

      {/* Aspect Ratio */}
      <div className="space-y-1.5">
        <label className="font-bold text-muted-foreground uppercase tracking-wider text-xs block">Aspect Ratio</label>
        <div className="flex border border-border rounded-lg p-0.5 bg-muted w-fit flex-wrap gap-0.5">
          {(['1:1', '16:9', '3:4', '4:3'] as const).map((ratio) => (
            <button
              key={ratio}
              type="button"
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
                (item.style?.aspectRatio || '4:3') === ratio
                  ? 'bg-background shadow-xs text-[var(--brand)] font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => onUpdate(item.id, 'style.aspectRatio', ratio)}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>

      {/* Card Style */}
      <div className="space-y-1.5">
        <label className="font-bold text-muted-foreground uppercase tracking-wider text-xs block">Card Style Layout</label>
        <div className="flex border border-border rounded-lg p-0.5 bg-muted w-fit">
          {(['overlay', 'classic', 'minimal'] as const).map((cardS) => (
            <button
              key={cardS}
              type="button"
              className={`px-3 py-1 text-xs font-bold rounded-md transition capitalize ${
                (item.style?.cardStyle || 'overlay') === cardS
                  ? 'bg-background shadow-xs text-[var(--brand)] font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => onUpdate(item.id, 'style.cardStyle', cardS)}
            >
              {cardS}
            </button>
          ))}
        </div>
      </div>

      {/* Indicator Pagination */}
      <div className="space-y-1.5">
        <label className="font-bold text-muted-foreground uppercase tracking-wider text-xs block">Slide Indicators</label>
        <div className="flex border border-border rounded-lg p-0.5 bg-muted w-fit">
          {(['dots', 'bars', 'badge', 'none'] as const).map((indS) => (
            <button
              key={indS}
              type="button"
              className={`px-3 py-1 text-xs font-bold rounded-md transition capitalize ${
                (item.style?.indicatorStyle || 'dots') === indS
                  ? 'bg-background shadow-xs text-[var(--brand)] font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => onUpdate(item.id, 'style.indicatorStyle', indS)}
            >
              {indS}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
