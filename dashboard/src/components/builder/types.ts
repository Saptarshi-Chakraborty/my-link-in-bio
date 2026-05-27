import { z } from 'zod'
import {
  ElementTypeSchema,
  BaseElementSchema,
  ButtonElementSchema,
  CarouselItemSchema,
  CarouselElementSchema,
  YoutubeElementSchema,
  PageElementSchema,
  PageThemeSchema,
  SocialsStateSchema,
  SocialsActiveStateSchema,
  SocialInstanceSchema,
} from '@/lib/schemas/profile'

export type ElementType = z.infer<typeof ElementTypeSchema>
export type BaseElement = z.infer<typeof BaseElementSchema>
export type ButtonElement = z.infer<typeof ButtonElementSchema>

// Deprecated: keeping alias for backward compatibility during refactoring
export type LinkItem = ButtonElement

export type CarouselItem = z.infer<typeof CarouselItemSchema>
export type CarouselElement = z.infer<typeof CarouselElementSchema>
export type YoutubeElement = z.infer<typeof YoutubeElementSchema>
export type PageElement = z.infer<typeof PageElementSchema>
export type PageTheme = z.infer<typeof PageThemeSchema>

export type SocialInstance = z.infer<typeof SocialInstanceSchema>
export type SocialsState = z.infer<typeof SocialsStateSchema>
export type SocialsActiveState = z.infer<typeof SocialsActiveStateSchema>

export type AvatarPreset = {
  id: string
  name: string
  css: string
}
