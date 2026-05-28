import { Switch } from '@/components/ui/switch'
import type { YoutubeElement } from '../../types'

interface YoutubeSettingsProps {
  item: YoutubeElement
  onUpdate: (id: string, key: string, value: any) => void
}

export function YoutubeSettings({ item, onUpdate }: YoutubeSettingsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
      {/* Shape & Aspect Ratio */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="font-bold text-muted-foreground uppercase tracking-wider text-xs block">Video Player Corners</label>
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
                {shape === 'rectangle' ? 'Square' : 'Rounded'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-muted-foreground uppercase tracking-wider text-xs block">Aspect Ratio</label>
          <div className="flex border border-border rounded-lg p-0.5 bg-muted w-fit">
            {(['16:9', '9:16'] as const).map((ratio) => (
              <button
                key={ratio}
                type="button"
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
                  (item.style?.aspectRatio || '16:9') === ratio
                    ? 'bg-background shadow-xs text-[var(--brand)] font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => onUpdate(item.id, 'style.aspectRatio', ratio)}
              >
                {ratio === '16:9' ? '16:9 Std' : '9:16 Shorts'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Layout type & Switch Toggles */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="font-bold text-muted-foreground uppercase tracking-wider text-xs block">Layout Style</label>
          <div className="flex border border-border rounded-lg p-0.5 bg-muted w-fit">
            {(['feed', 'card', 'inline'] as const).map((layout) => (
              <button
                key={layout}
                type="button"
                className={`px-3 py-1 text-xs font-bold rounded-md transition capitalize ${
                  (item.style?.layout || 'feed') === layout
                    ? 'bg-background shadow-xs text-[var(--brand)] font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => onUpdate(item.id, 'style.layout', layout)}
              >
                {layout}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-center gap-2">
            <Switch
              id={`show-stats-${item.id}`}
              checked={item.style?.showStats !== false}
              onCheckedChange={(checked) => onUpdate(item.id, 'style.showStats', checked)}
              className="scale-90 data-[state=checked]:bg-[var(--brand)]"
            />
            <label htmlFor={`show-stats-${item.id}`} className="text-xs font-bold text-foreground cursor-pointer">Show Stats</label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id={`show-desc-${item.id}`}
              checked={item.style?.showDescription !== false}
              onCheckedChange={(checked) => onUpdate(item.id, 'style.showDescription', checked)}
              className="scale-90 data-[state=checked]:bg-[var(--brand)]"
            />
            <label htmlFor={`show-desc-${item.id}`} className="text-xs font-bold text-foreground cursor-pointer">Show Subtitle</label>
          </div>
        </div>
      </div>
    </div>
  )
}
