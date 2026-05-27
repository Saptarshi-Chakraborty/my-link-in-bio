import { z } from 'zod'

// 1. Element Types & Base Schema
export const ElementTypeSchema = z.enum(['button', 'carousel', 'youtube'])

export const BaseElementSchema = z.object({
  id: z.string(),
  type: ElementTypeSchema,
  active: z.boolean(),
})

// 2. Button Element Schema
export const ButtonElementSchema = BaseElementSchema.extend({
  type: z.literal('button'),
  title: z.string(),
  url: z.string(),
  clicks: z.number().default(0),
  style: z.object({
    variant: z.enum(['fill', 'outline', 'soft', 'glass']).optional(),
    shape: z.enum(['rectangle', 'rounded', 'pill']).optional(),
    align: z.enum(['left', 'center', 'right']).optional(),
    animation: z.enum(['none', 'bounce', 'wobble', 'pulse']).optional(),
  }).optional(),
})

// 3. Carousel Item & Element Schema
export const CarouselItemSchema = z.object({
  id: z.string(),
  imageUrl: z.string(),
  title: z.string().optional(),
  url: z.string().optional(),
})

export const CarouselElementSchema = BaseElementSchema.extend({
  type: z.literal('carousel'),
  items: z.array(CarouselItemSchema),
  style: z.object({
    aspectRatio: z.enum(['1:1', '16:9', '3:4', '4:3']).optional(),
    shape: z.enum(['rectangle', 'rounded']).optional(),
    cardStyle: z.enum(['overlay', 'classic', 'minimal']).optional(),
    indicatorStyle: z.enum(['dots', 'bars', 'badge', 'none']).optional(),
  }).optional(),
})

// 4. YouTube Element Schema
export const YoutubeElementSchema = BaseElementSchema.extend({
  type: z.literal('youtube'),
  videoUrl: z.string(),
  videoTitle: z.string().optional(),
  videoDescription: z.string().optional(),
  videoStats: z.string().optional(),
  style: z.object({
    shape: z.enum(['rectangle', 'rounded']).optional(),
    aspectRatio: z.enum(['16:9', '9:16']).optional(),
    layout: z.enum(['card', 'inline', 'feed']).optional(),
    showStats: z.boolean().optional(),
    showDescription: z.boolean().optional(),
  }).optional(),
})

// 5. Page Element Union Schema
export const PageElementSchema = z.discriminatedUnion('type', [
  ButtonElementSchema,
  CarouselElementSchema,
  YoutubeElementSchema,
])

// 6. Socials State Schema
export const SocialInstanceSchema = z.object({
  platform: z.enum(['github', 'linkedin', 'facebook', 'instagram', 'x', 'snapchat', 'threads', 'mastodon']),
  value: z.string(),
})

export const SocialsStateSchema = z.array(SocialInstanceSchema)

// 7. Socials Active State Schema
export const SocialsActiveStateSchema = z.object({
  github: z.boolean(),
  linkedin: z.boolean(),
  facebook: z.boolean(),
  instagram: z.boolean(),
})

// 8. Page Theme Schema (v4)
export const PageThemeSchema = z.object({
  bgColor: z.string().default('#ffffff'),
  textColor: z.string().default('#18181b'),
  btnBgColor: z.string().default('#18181b'),
  btnTextColor: z.string().default('#ffffff'),
  btnShape: z.enum(['rectangle', 'rounded', 'pill']).default('rounded'),
  fontFamily: z.enum(['Inter', 'Playfair Display', 'Roboto', 'Courier']).default('Inter'),
})

// 9. Unified Root Profile Page Schema (Version 5)
export const ProfilePageDataSchema = z.object({
  version: z.literal(5).default(5),
  profileName: z.string().default(''),
  profileBio: z.string().default(''),
  profileAvatar: z.string().default('neon'),
  socials: SocialsStateSchema,
  socialsPosition: z.enum(['top', 'bottom']).default('top'),
  links: z.array(PageElementSchema).default([]),
  pageTheme: PageThemeSchema.default({
    bgColor: '#ffffff',
    textColor: '#18181b',
    btnBgColor: '#18181b',
    btnTextColor: '#ffffff',
    btnShape: 'rounded',
    fontFamily: 'Inter',
  }),
})

// Export type inferred from Schema
export type ProfilePageData = z.infer<typeof ProfilePageDataSchema>

// 10. Schema Migration Engine
interface Migration {
  version: number
  migrate: (data: any) => any
}

// Theme string → HEX preset mapping for v4 migration
const THEME_TO_HEX_MAP: Record<string, {
  bgColor: string
  textColor: string
  btnBgColor: string
  btnTextColor: string
}> = {
  minimalist: { bgColor: '#ffffff', textColor: '#18181b', btnBgColor: '#18181b', btnTextColor: '#ffffff' },
  neon:       { bgColor: '#0f0c1b', textColor: '#f4f4f5', btnBgColor: '#6366f1', btnTextColor: '#ffffff' },
  warm:       { bgColor: '#ffffff', textColor: '#18181b', btnBgColor: '#18181b', btnTextColor: '#ffffff' },
  vivid:      { bgColor: '#0f0c1b', textColor: '#f4f4f5', btnBgColor: '#6366f1', btnTextColor: '#ffffff' },
  glass:      { bgColor: '#0f0c1b', textColor: '#f4f4f5', btnBgColor: '#6366f1', btnTextColor: '#ffffff' },
}

const DEFAULT_PAGE_THEME = {
  bgColor: '#ffffff',
  textColor: '#18181b',
  btnBgColor: '#18181b',
  btnTextColor: '#ffffff',
  btnShape: 'rounded' as const,
  fontFamily: 'Inter' as const,
}

const MIGRATIONS: Migration[] = [
  {
    version: 2,
    migrate: (data) => {
      if (!data) return data
      
      const socialsArray: Array<{ platform: string; value: string }> = []
      const oldSocials = data.socials || {}
      const oldActive = data.socialsActive || {}
      
      const platforms: Array<'github' | 'linkedin' | 'facebook' | 'instagram'> = [
        'github',
        'linkedin',
        'facebook',
        'instagram',
      ]
      
      for (const platform of platforms) {
        const val = oldSocials[platform]
        const isActive = oldActive[platform]
        if (isActive && typeof val === 'string' && val.trim() !== '') {
          socialsArray.push({
            platform,
            value: val.trim(),
          })
        }
      }
      
      const migrated = {
        ...data,
        socials: socialsArray,
      }
      
      delete migrated.socialsActive
      return migrated
    }
  },
  {
    version: 3,
    migrate: (data) => {
      if (!data) return data
      return {
        ...data,
        socialsPosition: 'top',
      }
    }
  },
  {
    version: 4,
    migrate: (data) => {
      if (!data) return data

      // Map old theme string to HEX values
      const oldTheme = typeof data.theme === 'string' ? data.theme : 'minimalist'
      const hexValues = THEME_TO_HEX_MAP[oldTheme] || THEME_TO_HEX_MAP.minimalist

      const migrated = {
        ...data,
        pageTheme: {
          ...DEFAULT_PAGE_THEME,
          ...hexValues,
        },
      }

      delete migrated.theme
      return migrated
    }
  },
  {
    version: 5,
    migrate: (data) => {
      if (!data) return data
      const migratedLinks = Array.isArray(data.links)
        ? data.links.map((link: any) => {
            if (link.type === 'button' && link.style) {
              const newStyle = { ...link.style }
              delete newStyle.shape // Remove explicit shape override to inherit theme shape
              return { ...link, style: newStyle }
            }
            return link
          })
        : []
      return {
        ...data,
        links: migratedLinks,
      }
    }
  }
]

export function migrateProfileData(rawData: unknown): any {
  if (typeof rawData !== 'object' || rawData === null) {
    return rawData
  }

  // Deep clone data to avoid mutations
  let data = JSON.parse(JSON.stringify(rawData))
  let dataVersion = typeof data.version === 'number' ? data.version : 0

  const sortedMigrations = [...MIGRATIONS].sort((a, b) => a.version - b.version)

  for (const migration of sortedMigrations) {
    if (dataVersion < migration.version) {
      try {
        data = migration.migrate(data)
        data.version = migration.version
        dataVersion = migration.version
      } catch (err) {
        console.error(`Failed to migrate profile data to version ${migration.version}:`, err)
        break
      }
    }
  }

  return data
}
