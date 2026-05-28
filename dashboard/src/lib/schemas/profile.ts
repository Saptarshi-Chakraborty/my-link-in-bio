import { z } from 'zod'

// 1. Element Types & Base Schema
export const ElementTypeSchema = z.enum(['button', 'carousel', 'youtube', 'whatsapp'])

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

// 4.5. WhatsApp Element Schema
export const WhatsAppElementSchema = BaseElementSchema.extend({
  type: z.literal('whatsapp'),
  title: z.string().default('Chat on WhatsApp'),
  phone: z.string().default(''),
  message: z.string().default(''),
  style: z.object({
    useBrandColor: z.boolean().optional(),
  }).optional(),
})

// 5. Page Element Union Schema
export const PageElementSchema = z.discriminatedUnion('type', [
  ButtonElementSchema,
  CarouselElementSchema,
  YoutubeElementSchema,
  WhatsAppElementSchema,
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

// All devices are on v4+. Only the v4→v5 migration is needed.
// Future migrations (v5→v6, etc.) can be appended to this array.
const MIGRATIONS: Migration[] = [
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
  },
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
