import { Input } from '@/components/ui/input'
import { sanitizePhoneNumber } from '@/lib/utils'
import type { WhatsAppElement } from '../../types'

interface WhatsAppEditorFieldsProps {
  item: WhatsAppElement
  onUpdate: (id: string, key: string, value: any) => void
}

export function WhatsAppEditorFields({ item, onUpdate }: WhatsAppEditorFieldsProps) {
  return (
    <div className="space-y-1.5">
      <Input
        type="text"
        value={item.title}
        onChange={(e) => onUpdate(item.id, 'title', e.target.value)}
        className="w-full h-8 bg-transparent border-0 border-b border-transparent hover:border-border focus-visible:border-[var(--brand)] px-0 font-bold text-sm focus-visible:ring-0 shadow-none rounded-none focus-visible:border-b"
        placeholder="Button Label (e.g. Chat on WhatsApp)"
      />
      <Input
        type="text"
        value={item.phone || ''}
        onChange={(e) => onUpdate(item.id, 'phone', e.target.value)}
        className="w-full h-7 bg-transparent border-0 border-b border-transparent hover:border-border focus-visible:border-[var(--brand)] px-0 text-xs text-foreground font-medium focus-visible:ring-0 shadow-none rounded-none focus-visible:border-b animate-none"
        placeholder="Phone Number (e.g. +1 555 123 4567)"
      />

      <div className="mt-2.5 p-3 rounded-xl bg-muted/30 border border-border/60 space-y-2.5">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Pre-filled Chat Message</span>
          <Input
            type="text"
            value={item.message || ''}
            onChange={(e) => onUpdate(item.id, 'message', e.target.value)}
            className="w-full h-7 bg-transparent border-0 border-b border-transparent hover:border-border focus-visible:border-[var(--brand)] px-0 text-xs text-foreground focus-visible:ring-0 shadow-none rounded-none focus-visible:border-b animate-none"
            placeholder="Hi! I'd like to get in touch."
          />
        </div>
        
        <div className="text-[10px] text-muted-foreground pt-1 flex items-center justify-between border-t border-border/40">
          <span>Sanitized for WhatsApp:</span>
          {item.phone ? (
            <code className="bg-background px-1.5 py-0.5 rounded border border-border/50 font-mono text-[9px] text-[var(--brand)] font-bold">
              +{sanitizePhoneNumber(item.phone)}
            </code>
          ) : (
            <span className="text-amber-500 font-semibold">Missing phone number</span>
          )}
        </div>
        {item.phone && sanitizePhoneNumber(item.phone).length < 10 && (
          <p className="text-[9px] text-amber-500 font-semibold leading-normal mt-0.5">
            ⚠️ Include country code (e.g. 1 for US, 91 for India) without leading + or 0.
          </p>
        )}
      </div>
    </div>
  )
}
