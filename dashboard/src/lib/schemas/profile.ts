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
    aspectRatio: z.enum(['1:1', '16:9']).optional(),
    shape: z.enum(['rectangle', 'rounded']).optional(),
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
  platform: z.enum(['github', 'linkedin', 'facebook', 'instagram']),
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

// 8. Unified Root Profile Page Schema (Version 2)
export const ProfilePageDataSchema = z.object({
  version: z.literal(2).default(2),
  profileName: z.string().default(''),
  profileBio: z.string().default(''),
  profileAvatar: z.string().default('neon'),
  socials: SocialsStateSchema,
  links: z.array(PageElementSchema).default([]),
  theme: z.string().default('minimalist'),
})

// Export type inferred from Schema
export type ProfilePageData = z.infer<typeof ProfilePageDataSchema>

// 9. Schema Migration Engine
interface Migration {
  version: number
  migrate: (data: any) => any
}

// In the future, append migration steps here.
// e.g. { version: 2, migrate: (data) => ({ ...data, newField: 'default' }) }
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
