export type ElementType = 'button' | 'carousel' | 'youtube'

export interface BaseElement {
  id: string
  type: ElementType
  active: boolean
}

export interface ButtonElement extends BaseElement {
  type: 'button'
  title: string
  url: string
  clicks: number
  style?: {
    variant?: 'fill' | 'outline' | 'soft' | 'glass'
    shape?: 'rectangle' | 'rounded' | 'pill'
    align?: 'left' | 'center' | 'right'
    animation?: 'none' | 'bounce' | 'wobble' | 'pulse'
  }
}

// Deprecated: keeping alias for backward compatibility during refactoring
export type LinkItem = ButtonElement

export interface CarouselItem {
  id: string
  imageUrl: string
  title?: string
  url?: string
}

export interface CarouselElement extends BaseElement {
  type: 'carousel'
  items: CarouselItem[]
  style?: {
    aspectRatio?: '1:1' | '16:9'
    shape?: 'rectangle' | 'rounded'
  }
}

export interface YoutubeElement extends BaseElement {
  type: 'youtube'
  videoUrl: string
  style?: {
    shape?: 'rectangle' | 'rounded'
    aspectRatio?: '16:9' | '9:16'
  }
}

export type PageElement = ButtonElement | CarouselElement | YoutubeElement

export type SocialsState = {
  github: string
  linkedin: string
  facebook: string
  instagram: string
}

export type SocialsActiveState = {
  github: boolean
  linkedin: boolean
  facebook: boolean
  instagram: boolean
}

export type AvatarPreset = {
  id: string
  name: string
  css: string
}
