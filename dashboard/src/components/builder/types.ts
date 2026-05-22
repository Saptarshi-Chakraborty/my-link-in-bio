export type LinkItem = {
  id: string
  title: string
  url: string
  clicks: number
  active: boolean
}

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
