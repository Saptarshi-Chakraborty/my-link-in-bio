import type { WhatsAppElement } from '../../types'
import { WhatsappIcon } from '../../icons'
import { sanitizePhoneNumber } from '@/lib/utils'

interface WhatsAppRendererProps {
  whatsapp: WhatsAppElement
}

export function WhatsAppRenderer({ whatsapp }: WhatsAppRendererProps) {
  const { title, phone, message, style } = whatsapp

  const useBrandColor = style?.useBrandColor !== false
  const sanitizedPhone = sanitizePhoneNumber(phone)
  const whatsappUrl = `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(message)}`

  const buttonStyle = useBrandColor
    ? {
        backgroundColor: '#25D366',
        borderColor: '#25D366',
        color: '#111B21',
        borderRadius: 'var(--phone-btn-radius, 8px)',
      }
    : {
        backgroundColor: 'var(--phone-btn-bg)',
        borderColor: 'var(--phone-btn-border)',
        color: 'var(--phone-btn-text)',
        borderRadius: 'var(--phone-btn-radius, 8px)',
      }

  const iconColor = useBrandColor ? '#111B21' : '#25D366'

  return (
    <a
      href={phone ? whatsappUrl : '#'}
      target="_blank"
      rel="noreferrer"
      className="relative flex w-full items-center justify-center gap-2 border px-3 py-2.5 text-[10px] font-bold tracking-wide transition-all duration-200 select-none shadow-sm active:scale-[0.98]"
      style={buttonStyle}
    >
      <WhatsappIcon 
        className="size-3.5 shrink-0" 
        style={{ color: iconColor }}
      />
      <span className="truncate max-w-[85%]">{title || 'Chat on WhatsApp'}</span>
    </a>
  )
}
