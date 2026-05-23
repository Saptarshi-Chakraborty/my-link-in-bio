import { ProfilePageDataSchema, migrateProfileData } from '@/lib/schemas/profile'
import type { ProfilePageData } from '@/lib/schemas/profile'

const STORAGE_KEY = 'vibelink_profile_builder_data'

export const profileStorage = {
  /**
   * Loads the profile data from storage, validates it, and runs any necessary schema migrations.
   * Returns valid ProfilePageData or null if storage is empty/invalid.
   */
  load(): ProfilePageData | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) {
        return null
      }

      const parsed = JSON.parse(raw)

      // 1. Run migrations first to bring legacy data structure up-to-date
      const migrated = migrateProfileData(parsed)

      // 2. Perform runtime validation against our schema
      const result = ProfilePageDataSchema.safeParse(migrated)
      if (!result.success) {
        console.error('Validation error while loading profile builder data:', result.error.format())
        return null
      }

      return result.data
    } catch (err) {
      console.error('Failed to load or parse profile builder data:', err)
      return null
    }
  },

  /**
   * Validates and saves the profile data to storage.
   * Returns true if successfully saved, false otherwise.
   */
  save(data: ProfilePageData): boolean {
    try {
      // Validate schema before writing to ensure we never corrupt storage
      const result = ProfilePageDataSchema.safeParse(data)
      if (!result.success) {
        console.error('Validation error while saving profile builder data:', result.error.format())
        return false
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(result.data))
      return true
    } catch (err) {
      console.error('Failed to save profile builder data:', err)
      return false
    }
  },

  /**
   * Clears the profile data from storage.
   */
  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (err) {
      console.error('Failed to clear profile builder data:', err)
    }
  },
}
