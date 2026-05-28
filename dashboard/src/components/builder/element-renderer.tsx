import type { PageElement } from './types'
import { ButtonRenderer } from './blocks/button/button-renderer'
import { CarouselRenderer } from './blocks/carousel/carousel-renderer'
import { YoutubeRenderer } from './blocks/youtube/youtube-renderer'
import { WhatsAppRenderer } from './blocks/whatsapp/whatsapp-renderer'

interface ElementRendererProps {
  element: PageElement
}

export function ElementRenderer({ element }: ElementRendererProps) {
  if (!element.active) return null

  switch (element.type) {
    case 'button':
      return <ButtonRenderer button={element} />
    case 'carousel':
      return <CarouselRenderer carousel={element} />
    case 'youtube':
      return <YoutubeRenderer youtube={element} />
    case 'whatsapp':
      return <WhatsAppRenderer whatsapp={element} />
    default:
      return null
  }
}
