import { create } from 'zustand'
import type { PageElement, SocialsState, SocialsActiveState } from '@/components/builder/types'
import type { ProfilePageData } from '@/lib/schemas/profile'
import { profileStorage } from '@/lib/storage'

const defaultLinks: PageElement[] = [
  {
    id: 'github',
    type: 'button',
    title: 'GitHub',
    url: 'https://github.com/Saptarshi-Chakraborty',
    clicks: 33,
    active: true,
    style: {
      align: 'center',
      shape: 'pill',
      variant: 'fill'
    }
  },
  {
    id: 'linkedin',
    type: 'button',
    title: 'LinkedIn',
    url: 'https://www.linkedin.com/in/saptarshi-chakraborty-sc/',
    clicks: 16,
    active: true,
    style: {
      align: 'center',
      shape: 'rounded',
      variant: 'outline'
    }
  },
  {
    id: 'youtube-intro',
    type: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoTitle: 'Rick Astley - Never Gonna Give You Up (Official Music Video)',
    videoDescription: 'Rick Astley',
    videoStats: '1.2B views • 14 years ago',
    active: true,
    style: {
      shape: 'rounded',
      aspectRatio: '16:9',
      layout: 'card',
      showStats: true,
      showDescription: true
    }
  },
  {
    id: 'carousel-gallery',
    type: 'carousel',
    active: true,
    style: {
      aspectRatio: '16:9',
      shape: 'rounded'
    },
    items: [
      {
        id: 'slide-1',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
        title: 'Project Alpha',
        url: 'https://github.com'
      },
      {
        id: 'slide-2',
        imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400',
        title: 'Design Showcase',
        url: 'https://saptarshi.design'
      }
    ]
  }
]

const getInitialData = (): ProfilePageData => {
  return profileStorage.load() || {
    version: 1,
    profileName: 'Saptarshi Chakraborty',
    profileBio: 'Designer & Developer',
    profileAvatar: 'neon',
    socials: {
      github: 'Saptarshi-Chakraborty',
      linkedin: 'saptarshi-chakraborty-sc',
      facebook: 'saptarshi.facebook',
      instagram: 'saptarshichakraborty_tm',
    },
    socialsActive: {
      github: true,
      linkedin: true,
      facebook: true,
      instagram: true,
    },
    links: defaultLinks,
    theme: 'minimalist'
  }
}

const initialData = getInitialData()

interface BuilderState {
  profileName: string
  profileBio: string
  profileAvatar: string
  socials: SocialsState
  socialsActive: SocialsActiveState
  links: PageElement[]
  theme: string

  setProfileName: (name: string) => void
  setProfileBio: (bio: string) => void
  setProfileAvatar: (avatar: string) => void
  updateSocial: (platform: keyof SocialsState, value: string) => void
  toggleSocial: (platform: keyof SocialsActiveState) => void
  cleanEmptySocials: () => void
  updateProfileHeader: (data: {
    profileName: string
    profileBio: string
    profileAvatar: string
    socials: SocialsState
    socialsActive: SocialsActiveState
  }) => void
  addElement: (type: 'button' | 'carousel' | 'youtube') => void
  deleteLink: (id: string) => void
  updateLink: (id: string, key: string, value: any) => void
  toggleLink: (id: string) => void
  reorderLinks: (fromIndex: number, toIndex: number) => void
  setTheme: (theme: string) => void
}

export const useBuilderStore = create<BuilderState>((set) => ({
  profileName: initialData.profileName,
  profileBio: initialData.profileBio,
  profileAvatar: initialData.profileAvatar,
  socials: initialData.socials,
  socialsActive: initialData.socialsActive,
  links: initialData.links,
  theme: initialData.theme,

  setProfileName: (name) => set({ profileName: name }),
  setProfileBio: (bio) => set({ profileBio: bio }),
  setProfileAvatar: (avatar) => set({ profileAvatar: avatar }),
  updateSocial: (platform, value) =>
    set((state) => ({
      socials: { ...state.socials, [platform]: value },
    })),
  toggleSocial: (platform) =>
    set((state) => ({
      socialsActive: { ...state.socialsActive, [platform]: !state.socialsActive[platform] },
    })),
  cleanEmptySocials: () =>
    set((state) => {
      const nextSocials = { ...state.socials }
      const nextSocialsActive = { ...state.socialsActive }
      let changed = false

      ;(Object.keys(state.socials) as Array<keyof SocialsState>).forEach((platform) => {
        const val = state.socials[platform]
        const isActive = state.socialsActive[platform]
        if (isActive && (!val || val.trim() === '')) {
          nextSocials[platform] = ''
          nextSocialsActive[platform] = false
          changed = true
        }
      })

      if (changed) {
        return { socials: nextSocials, socialsActive: nextSocialsActive }
      }
      return {}
    }),
  updateProfileHeader: (data) => set((state) => ({ ...state, ...data })),
  addElement: (type) =>
    set((state) => {
      const newId = `${type}-${Date.now()}`
      let newElement: PageElement

      if (type === 'button') {
        newElement = {
          id: newId,
          type: 'button',
          title: 'My New Link',
          url: 'https://example.com',
          clicks: 0,
          active: true,
          style: {
            align: 'center',
            shape: 'rounded',
            variant: 'fill',
          },
        }
      } else if (type === 'youtube') {
        newElement = {
          id: newId,
          type: 'youtube',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoTitle: 'Rick Astley - Never Gonna Give You Up (Official Music Video)',
          videoDescription: 'Rick Astley',
          videoStats: '1.2B views • 14 years ago',
          active: true,
          style: {
            shape: 'rounded',
            aspectRatio: '16:9',
            layout: 'card',
            showStats: true,
            showDescription: true
          },
        }
      } else {
        newElement = {
          id: newId,
          type: 'carousel',
          active: true,
          style: {
            aspectRatio: '1:1',
            shape: 'rounded',
          },
          items: [
            {
              id: `slide-${Date.now()}`,
              imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
              title: 'New Slide',
              url: '',
            },
          ],
        }
      }

      return { links: [newElement, ...state.links] }
    }),
  deleteLink: (id) =>
    set((state) => ({
      links: state.links.filter((item) => item.id !== id),
    })),
  updateLink: (id, key, value) =>
    set((state) => ({
      links: state.links.map((item) => {
        if (item.id !== id) return item

        if (key.startsWith('style.')) {
          const styleKey = key.split('.')[1]
          return {
            ...item,
            style: {
              ...(item.style || {}),
              [styleKey]: value,
            },
          } as PageElement
        }

        return { ...item, [key]: value } as PageElement
      }),
    })),
  toggleLink: (id) =>
    set((state) => ({
      links: state.links.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      ),
    })),
  reorderLinks: (fromIndex, toIndex) =>
    set((state) => {
      const updated = [...state.links]
      const [moved] = updated.splice(fromIndex, 1)
      updated.splice(toIndex, 0, moved)
      return { links: updated }
    }),
  setTheme: (theme) => set({ theme }),
}))
