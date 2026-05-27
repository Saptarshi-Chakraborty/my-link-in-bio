import { useCallback } from 'react'
import { Paintbrush, Type, RectangleHorizontal, Moon, Sun, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useBuilderStore } from '@/store/use-builder-store'
import type { PageTheme } from './types'

// ─── Preset Definitions ───────────────────────────────────────────────

const THEME_PRESETS: Array<{
  id: string
  name: string
  icon: React.ReactNode
  description: string
  values: PageTheme
}> = [
  {
    id: 'light',
    name: 'Light Mode',
    icon: <Sun size={16} />,
    description: 'Clean & professional',
    values: {
      bgColor: '#ffffff',
      textColor: '#18181b',
      btnBgColor: '#18181b',
      btnTextColor: '#ffffff',
      btnShape: 'rounded',
      fontFamily: 'Inter',
    },
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    icon: <Moon size={16} />,
    description: 'Sleek & modern',
    values: {
      bgColor: '#121214',
      textColor: '#f4f4f5',
      btnBgColor: '#ffffff',
      btnTextColor: '#121214',
      btnShape: 'rounded',
      fontFamily: 'Inter',
    },
  },
  {
    id: 'neon',
    name: 'Neon',
    icon: <Sparkles size={16} />,
    description: 'Bold & vibrant',
    values: {
      bgColor: '#0f0c1b',
      textColor: '#f4f4f5',
      btnBgColor: '#6366f1',
      btnTextColor: '#ffffff',
      btnShape: 'pill',
      fontFamily: 'Inter',
    },
  },
]

const FONT_OPTIONS: Array<{
  value: PageTheme['fontFamily']
  label: string
  description: string
}> = [
  { value: 'Inter', label: 'Inter', description: 'Modern' },
  { value: 'Playfair Display', label: 'Playfair Display', description: 'Elegant' },
  { value: 'Roboto', label: 'Roboto', description: 'Clean' },
  { value: 'Courier', label: 'Courier', description: 'Tech' },
]

const SHAPE_OPTIONS: Array<{
  value: PageTheme['btnShape']
  label: string
  radius: string
}> = [
  { value: 'rectangle', label: 'Sharp', radius: '0px' },
  { value: 'rounded', label: 'Rounded', radius: '8px' },
  { value: 'pill', label: 'Pill', radius: '9999px' },
]

// ─── Color Swatch Input ───────────────────────────────────────────────

function ColorSwatch({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (hex: string) => void
}) {
  const handleHexInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value
      // Allow partial input while typing
      if (!val.startsWith('#')) val = '#' + val
      // Only update store on valid 7-char hex
      if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
        onChange(val)
      }
    },
    [onChange],
  )

  return (
    <div className="flex items-center gap-3">
      {/* Native color picker hidden behind a styled circle */}
      <label className="relative shrink-0 cursor-pointer group">
        <div
          className="size-9 rounded-full border-2 border-border shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:shadow-md"
          style={{ backgroundColor: value }}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer size-full"
          aria-label={`Pick ${label} color`}
        />
      </label>

      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </Label>
        <Input
          value={value}
          onChange={handleHexInput}
          className="h-8 text-xs font-mono bg-background border-border w-28 uppercase"
          maxLength={7}
          spellCheck={false}
        />
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────

export function DesignCustomizerCard() {
  const pageTheme = useBuilderStore((state) => state.pageTheme)
  const setPageTheme = useBuilderStore((state) => state.setPageTheme)
  const updatePageTheme = useBuilderStore((state) => state.updatePageTheme)

  const activePresetId = THEME_PRESETS.find(
    (p) =>
      p.values.bgColor === pageTheme.bgColor &&
      p.values.textColor === pageTheme.textColor &&
      p.values.btnBgColor === pageTheme.btnBgColor &&
      p.values.btnTextColor === pageTheme.btnTextColor,
  )?.id

  return (
    <div className="flex flex-col gap-6">
      {/* Section: Pre-made Theme Presets */}
      <Card className="border border-border shadow-xs bg-card overflow-hidden py-2">
        <CardContent className="p-6 py-3 flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <Paintbrush size={16} className="text-[var(--brand)]" />
            <h2 className="text-sm font-bold text-foreground">Theme Presets</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {THEME_PRESETS.map((preset) => {
              const isActive = activePresetId === preset.id
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setPageTheme(preset.values)}
                  className={`group relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left ${
                    isActive
                      ? 'border-[var(--brand)] bg-[var(--brand)]/5 shadow-sm'
                      : 'border-border hover:border-[var(--brand)]/40 hover:bg-muted/40'
                  }`}
                >
                  {/* Mini color preview */}
                  <div className="flex items-center gap-1.5 w-full">
                    <div
                      className="flex-1 h-8 rounded-lg border border-border/50 flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: preset.values.bgColor }}
                    >
                      <div
                        className="w-[70%] h-4 rounded-md"
                        style={{ backgroundColor: preset.values.btnBgColor }}
                      />
                    </div>
                  </div>

                  <div className="w-full">
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground">{preset.icon}</span>
                      <span className="text-xs font-bold text-foreground">{preset.name}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{preset.description}</p>
                  </div>

                  {isActive && (
                    <div className="absolute top-2 right-2 size-2 rounded-full bg-[var(--brand)]" />
                  )}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Section: Custom Colors */}
      <Card className="border border-border shadow-xs bg-card overflow-hidden py-2">
        <CardContent className="p-6 py-3 flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <Paintbrush size={16} className="text-[var(--brand)]" />
            <h2 className="text-sm font-bold text-foreground">Custom Colors</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <ColorSwatch
              label="Page Background"
              value={pageTheme.bgColor}
              onChange={(v) => updatePageTheme('bgColor', v)}
            />
            <ColorSwatch
              label="Text Color"
              value={pageTheme.textColor}
              onChange={(v) => updatePageTheme('textColor', v)}
            />
            <ColorSwatch
              label="Button Background"
              value={pageTheme.btnBgColor}
              onChange={(v) => updatePageTheme('btnBgColor', v)}
            />
            <ColorSwatch
              label="Button Text"
              value={pageTheme.btnTextColor}
              onChange={(v) => updatePageTheme('btnTextColor', v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section: Button Shape */}
      <Card className="border border-border shadow-xs bg-card overflow-hidden py-2">
        <CardContent className="p-6 py-3 flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <RectangleHorizontal size={16} className="text-[var(--brand)]" />
            <h2 className="text-sm font-bold text-foreground">Button Shape</h2>
          </div>

          <p className="text-xs text-muted-foreground -mt-2">
            Default shape for new buttons. Individual buttons can still override this.
          </p>

          <div className="grid grid-cols-3 gap-3">
            {SHAPE_OPTIONS.map((shape) => {
              const isActive = pageTheme.btnShape === shape.value
              return (
                <button
                  key={shape.value}
                  type="button"
                  onClick={() => updatePageTheme('btnShape', shape.value)}
                  className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'border-[var(--brand)] bg-[var(--brand)]/5 shadow-sm'
                      : 'border-border hover:border-[var(--brand)]/40 hover:bg-muted/40'
                  }`}
                >
                  {/* Visual shape preview */}
                  <div
                    className="w-full h-8 border-2 transition-colors duration-200"
                    style={{
                      borderRadius: shape.radius,
                      backgroundColor: isActive ? 'var(--brand)' : 'var(--muted)',
                      borderColor: isActive ? 'var(--brand)' : 'var(--border)',
                    }}
                  />
                  <span className={`text-xs font-bold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {shape.label}
                  </span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Section: Font Picker */}
      <Card className="border border-border shadow-xs bg-card overflow-hidden py-2">
        <CardContent className="p-6 py-3 flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <Type size={16} className="text-[var(--brand)]" />
            <h2 className="text-sm font-bold text-foreground">Font Family</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FONT_OPTIONS.map((font) => {
              const isActive = pageTheme.fontFamily === font.value
              return (
                <button
                  key={font.value}
                  type="button"
                  onClick={() => updatePageTheme('fontFamily', font.value)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left ${
                    isActive
                      ? 'border-[var(--brand)] bg-[var(--brand)]/5 shadow-sm'
                      : 'border-border hover:border-[var(--brand)]/40 hover:bg-muted/40'
                  }`}
                >
                  {/* Font preview letter */}
                  <div
                    className={`size-10 rounded-lg flex items-center justify-center text-lg font-bold shrink-0 ${
                      isActive
                        ? 'bg-[var(--brand)] text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                    style={{ fontFamily: font.value }}
                  >
                    Aa
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span
                      className={`text-sm font-bold ${isActive ? 'text-foreground' : 'text-foreground'}`}
                      style={{ fontFamily: font.value }}
                    >
                      {font.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {font.description}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
