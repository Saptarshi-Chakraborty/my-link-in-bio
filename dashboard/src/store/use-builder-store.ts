import { create } from 'zustand'
import type { PageElement, SocialsState } from '@/components/builder/types'
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
    version: 2,
    profileName: 'Saptarshi Chakraborty',
    profileBio: 'Designer & Developer',
    profileAvatar: 'neon',
    socials: [
      { platform: 'github', value: 'Saptarshi-Chakraborty' },
      { platform: 'linkedin', value: 'saptarshi-chakraborty-sc' },
      { platform: 'facebook', value: 'saptarshi.facebook' },
      { platform: 'instagram', value: 'saptarshichakraborty_tm' },
    ],
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
  links: PageElement[]
  theme: string

  setProfileName: (name: string) => void
  setProfileBio: (bio: string) => void
  setProfileAvatar: (avatar: string) => void
  updateSocial: (platform: string, value: string) => void
  addSocial: (platform: 'github' | 'linkedin' | 'facebook' | 'instagram') => void
  removeSocial: (platform: string) => void
  reorderSocials: (fromIndex: number, toIndex: number) => void
  cleanEmptySocials: () => void
  updateProfileHeader: (data: {
    profileName: string
    profileBio: string
    profileAvatar: string
    socials: SocialsState
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
  links: initialData.links,
  theme: initialData.theme,

  setProfileName: (name) => set({ profileName: name }),
  setProfileBio: (bio) => set({ profileBio: bio }),
  setProfileAvatar: (avatar) => set({ profileAvatar: avatar }),
  updateSocial: (platform, value) =>
    set((state) => ({
      socials: state.socials.map((s) =>
        s.platform === platform ? { ...s, value } : s
      ),
    })),
  addSocial: (platform) =>
    set((state) => {
      if (state.socials.some((s) => s.platform === platform)) return {}
      return {
        socials: [...state.socials, { platform, value: '' }],
      }
    }),
  removeSocial: (platform) =>
    set((state) => ({
      socials: state.socials.filter((s) => s.platform !== platform),
    })),
  reorderSocials: (fromIndex, toIndex) =>
    set((state) => {
      const updated = [...state.socials]
      const [moved] = updated.splice(fromIndex, 1)
      updated.splice(toIndex, 0, moved)
      return { socials: updated }
    }),
  cleanEmptySocials: () =>
    set((state) => {
      const nextSocials = state.socials.filter(
        (s) => s.value && s.value.trim() !== ''
      )
      if (nextSocials.length !== state.socials.length) {
        return { socials: nextSocials }
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
