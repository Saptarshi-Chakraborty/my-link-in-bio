import { useState, useMemo, useRef } from 'react'
import { Settings2, User, Share2, Plus, GripVertical, SlidersHorizontal, MoreHorizontal, Info } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DragDropProvider, DragOverlay } from '@dnd-kit/react'
import { isSortable, useSortable } from '@dnd-kit/react/sortable'

import { SocialInputField } from './social-input-field'
import { ButtonGroup } from '@/components/ui/button-group'
import { GithubIcon, LinkedinIcon, FacebookIcon, InstagramIcon, XIcon, SnapchatIcon, ThreadsIcon, MastodonIcon } from './icons'
import { useBuilderStore } from '@/store/use-builder-store'
import type { SocialsState } from './types'

export const avatarPresets = [
  { id: 'neon', name: 'Neon Tokyo', css: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500' },
  { id: 'warm', name: 'Warm Clay', css: 'bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500' },
  { id: 'vivid', name: 'Vivid Pink', css: 'bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600' },
  { id: 'minimalist', name: 'Minimalist Zinc', css: 'bg-zinc-800' },
]

interface SortableSocialItemProps {
  platformId: string
  label: string
  icon: React.ReactNode
  index: number
  isOverlay?: boolean
}

function SortableSocialItem({ platformId, label, icon, index, isOverlay = false }: SortableSocialItemProps) {
  const { ref, handleRef, isDragging } = useSortable({
    id: platformId,
    index,
    disabled: isOverlay,
  })

  return (
    <div
      ref={ref}
      style={{
        transform: isDragging ? 'scale(1.02)' : undefined,
        opacity: isDragging ? 0.6 : 1,
      }}
      className={`flex flex-row items-center gap-3 border rounded-xl shadow-xs w-full select-none transition-all ${
        isOverlay 
          ? 'shadow-xl ring-2 ring-[var(--brand)]/20 scale-[1.02] pointer-events-none bg-zinc-50 dark:bg-zinc-900/90 border-[var(--brand)]/50'
          : isDragging
          ? 'opacity-40 border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/10'
          : 'bg-white dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700/80'
      } p-3`}
    >
      {/* Grab Handle */}
      <div
        ref={handleRef}
        className="cursor-grab active:cursor-grabbing text-zinc-400 dark:text-zinc-500 hover:text-zinc-850 dark:hover:text-zinc-200 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors shrink-0"
      >
        <GripVertical size={16} />
      </div>
      
      <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800/80 text-zinc-650 dark:text-zinc-400 shrink-0">
        {icon}
      </div>
      
      {/* Label */}
      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-250 flex-1">{label}</span>
    </div>
  )
}

const getMastodonUrl = (val: string) => {
  if (!val) return ''
  if (val.startsWith('http://') || val.startsWith('https://')) return val
  if (val.startsWith('@')) {
    const parts = val.slice(1).split('@')
    if (parts.length === 2) {
      return `https://${parts[1]}/@${parts[0]}`
    }
  } else {
    const parts = val.split('@')
    if (parts.length === 2) {
      return `https://${parts[1]}/@${parts[0]}`
    }
  }
  return val
}

export function ProfileHeaderCard() {
  const profileName = useBuilderStore((state) => state.profileName)
  const setProfileName = useBuilderStore((state) => state.setProfileName)
  const profileBio = useBuilderStore((state) => state.profileBio)
  const setProfileBio = useBuilderStore((state) => state.setProfileBio)
  const profileAvatar = useBuilderStore((state) => state.profileAvatar)
  const setProfileAvatar = useBuilderStore((state) => state.setProfileAvatar)
  const socials = useBuilderStore((state) => state.socials)
  const socialsPosition = useBuilderStore((state) => state.socialsPosition)
  const setSocialsPosition = useBuilderStore((state) => state.setSocialsPosition)
  const handleUpdateSocial = useBuilderStore((state) => state.updateSocial)
  const addSocial = useBuilderStore((state) => state.addSocial)
  const handleAddSocial = (platform: 'github' | 'linkedin' | 'facebook' | 'instagram' | 'x' | 'snapchat' | 'threads' | 'mastodon') => {
    addSocial(platform)
    setTimeout(() => {
      const inputElement = document.getElementById(`social-input-${platform}`)
      if (inputElement) {
        inputElement.focus()
        inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 80)
  }
  const handleRemoveSocial = useBuilderStore((state) => state.removeSocial)
  const handleReorderSocials = useBuilderStore((state) => state.reorderSocials)
  const cleanEmptySocials = useBuilderStore((state) => state.cleanEmptySocials)
  const updateProfileHeader = useBuilderStore((state) => state.updateProfileHeader)

  const activeAvatarCss = useMemo(() => {
    const preset = avatarPresets.find(p => p.id === profileAvatar)
    return preset ? preset.css : 'bg-zinc-800'
  }, [profileAvatar])

  const [isOpen, setIsOpen] = useState(false)
  const [isRearrangeOpen, setIsRearrangeOpen] = useState(false)
  const [activeDragId, setActiveDragId] = useState<string | null>(null)

  const backupRef = useRef<{
    profileName: string
    profileBio: string
    profileAvatar: string
    socials: SocialsState
    socialsPosition: 'top' | 'bottom'
  } | null>(null)
  const isSavingRef = useRef(false)

  const handleOpenChange = (open: boolean) => {
    if (open) {
      backupRef.current = {
        profileName,
        profileBio,
        profileAvatar,
        socials: socials.map(s => ({ ...s })),
        socialsPosition,
      }
      setIsOpen(true)
    } else {
      if (!isSavingRef.current) {
        if (backupRef.current) {
          updateProfileHeader(backupRef.current)
        }
      }
      isSavingRef.current = false
      setIsOpen(false)
    }
  }

  const handleSave = () => {
    isSavingRef.current = true
    cleanEmptySocials()
    setIsOpen(false)
  }

  // Determine active socials list to render quick icon badges
  const activeSocialList = useMemo(() => {
    return socials
      .filter((s) => s.value && s.value.trim() !== '')
      .map((s) => {
        let url = ''
        let icon = null
        let label = ''

        if (s.platform === 'github') {
          url = `https://github.com/${s.value}`
          icon = <GithubIcon className="w-4 h-4" />
          label = 'GitHub'
        } else if (s.platform === 'linkedin') {
          url = `https://linkedin.com/in/${s.value}`
          icon = <LinkedinIcon className="w-4 h-4" />
          label = 'LinkedIn'
        } else if (s.platform === 'facebook') {
          url = `https://facebook.com/${s.value}`
          icon = <FacebookIcon className="w-4 h-4" />
          label = 'Facebook'
        } else if (s.platform === 'instagram') {
          url = `https://instagram.com/${s.value}`
          icon = <InstagramIcon className="w-4 h-4" />
          label = 'Instagram'
        } else if (s.platform === 'x') {
          url = `https://x.com/${s.value}`
          icon = <XIcon className="w-4 h-4" />
          label = 'X (Twitter)'
        } else if (s.platform === 'snapchat') {
          url = `https://snapchat.com/add/${s.value}`
          icon = <SnapchatIcon className="w-4 h-4" />
          label = 'Snapchat'
        } else if (s.platform === 'threads') {
          url = `https://threads.net/@${s.value}`
          icon = <ThreadsIcon className="w-4 h-4" />
          label = 'Threads'
        } else if (s.platform === 'mastodon') {
          url = getMastodonUrl(s.value)
          icon = <MastodonIcon className="w-4 h-4" />
          label = 'Mastodon'
        }

        return {
          id: s.platform,
          icon,
          url,
          label,
        }
      })
  }, [socials])

  // Get list of inactive platforms that can be added
  const inactivePlatforms = useMemo(() => {
    const activeSet = new Set(socials.map((s) => s.platform))
    const list = []
    if (!activeSet.has('github')) {
      list.push({ id: 'github' as const, label: 'GitHub', icon: <GithubIcon className="w-4 h-4" /> })
    }
    if (!activeSet.has('linkedin')) {
      list.push({ id: 'linkedin' as const, label: 'LinkedIn', icon: <LinkedinIcon className="w-4 h-4" /> })
    }
    if (!activeSet.has('facebook')) {
      list.push({ id: 'facebook' as const, label: 'Facebook', icon: <FacebookIcon className="w-4 h-4" /> })
    }
    if (!activeSet.has('instagram')) {
      list.push({ id: 'instagram' as const, label: 'Instagram', icon: <InstagramIcon className="w-4 h-4" /> })
    }
    if (!activeSet.has('x')) {
      list.push({ id: 'x' as const, label: 'X (Twitter)', icon: <XIcon className="w-4 h-4" /> })
    }
    if (!activeSet.has('snapchat')) {
      list.push({ id: 'snapchat' as const, label: 'Snapchat', icon: <SnapchatIcon className="w-4 h-4" /> })
    }
    if (!activeSet.has('threads')) {
      list.push({ id: 'threads' as const, label: 'Threads', icon: <ThreadsIcon className="w-4 h-4" /> })
    }
    if (!activeSet.has('mastodon')) {
      list.push({ id: 'mastodon' as const, label: 'Mastodon', icon: <MastodonIcon className="w-4 h-4" /> })
    }
    return list
  }, [socials])

  // Get list of active platforms
  const activePlatforms = useMemo(() => {
    return socials.map((s) => {
      let label = ''
      let icon = null
      if (s.platform === 'github') {
        label = 'GitHub'
        icon = <GithubIcon className="w-4 h-4" />
      } else if (s.platform === 'linkedin') {
        label = 'LinkedIn'
        icon = <LinkedinIcon className="w-4 h-4" />
      } else if (s.platform === 'facebook') {
        label = 'Facebook'
        icon = <FacebookIcon className="w-4 h-4" />
      } else if (s.platform === 'instagram') {
        label = 'Instagram'
        icon = <InstagramIcon className="w-4 h-4" />
      } else if (s.platform === 'x') {
        label = 'X (Twitter)'
        icon = <XIcon className="w-4 h-4" />
      } else if (s.platform === 'snapchat') {
        label = 'Snapchat'
        icon = <SnapchatIcon className="w-4 h-4" />
      } else if (s.platform === 'threads') {
        label = 'Threads'
        icon = <ThreadsIcon className="w-4 h-4" />
      } else if (s.platform === 'mastodon') {
        label = 'Mastodon'
        icon = <MastodonIcon className="w-4 h-4" />
      }
      return {
        id: s.platform,
        label,
        icon,
        value: s.value,
      }
    })
  }, [socials])

  const activeDragItem = useMemo(() => {
    if (!activeDragId) return null
    return activePlatforms.find((p) => p.id === activeDragId)
  }, [activePlatforms, activeDragId])

  return (
    <>
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <Card className="border border-border shadow-xs bg-card overflow-hidden relative group/header transition-all duration-200 hover:shadow-md py-2">
          <CardContent className="p-6 py-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              
              {/* Left: Avatar & Text details */}
              <div className="flex flex-row items-center gap-5 flex-1 min-w-0">
                
                {/* Avatar Circle */}
                <div className="shrink-0 relative">
                  <div className={`h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold ${activeAvatarCss} shadow-md border-2 border-background ring-4 ring-muted`}>
                    {profileName ? profileName.charAt(0).toUpperCase() : '?'}
                  </div>
                </div>
                
                {/* Profile Meta details */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground truncate">
                    {profileName || 'Untitled Profile'}
                  </h2>
                  
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {profileBio || 'No biography added yet.'}
                  </p>

                  {/* Social icons connection */}
                  {activeSocialList.length > 0 ? (
                    <div className="flex items-center gap-2 mt-3.5 flex-wrap">
                      {activeSocialList.map((social) => (
                        <a
                          key={social.id}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`Open ${social.label}`}
                          className="p-1.5 rounded-lg bg-muted/50 border border-border text-muted-foreground hover:text-[var(--brand)] hover:bg-muted hover:border-border transition-all duration-150 active:scale-95"
                        >
                          {social.icon}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-muted-foreground mt-3 flex items-center gap-1 font-medium">
                      <Share2 className="w-3 h-3" /> No socials linked
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Actions (Edit profile & socials trigger) */}
              <div className="shrink-0 flex items-center sm:self-center">
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-4 font-semibold text-xs shadow-xs active:scale-95 transition-transform duration-100 flex items-center gap-2"
                  >
                    <Settings2 className="w-3.5 h-3.5 text-muted-foreground" />
                    Edit Profile & Socials
                  </Button>
                </SheetTrigger>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Editing Sidebar Panel */}
        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col bg-background border-l border-border shadow-2xl">
          <SheetHeader className="p-6 pb-4 border-b border-border shrink-0">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <SheetTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-[var(--brand)]" />
                  Edit Profile Settings
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground leading-normal">
                  Customize your page identity, layout presets, and active social media accounts.
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {/* Scrollable inputs wrapper */}
          <ScrollArea className="flex-1 w-full min-h-0">
            <div className="p-6 space-y-6">
              
              {/* Section 1: Profile Info */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-muted/50 p-4 rounded-xl border border-border">
                  <div className="flex flex-col items-center gap-1.5 shrink-0">
                    <div className={`h-16 w-16 rounded-full flex items-center justify-center text-white text-2xl font-bold ${activeAvatarCss} shadow-md border border-background ring-2 ring-border`}>
                      {profileName ? profileName.charAt(0).toUpperCase() : '?'}
                    </div>
                    <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Preview</span>
                  </div>

                  <div className="flex-1 w-full space-y-3">
                    <div className="grid gap-1.5">
                      <Label htmlFor="profile-title" className="text-xs font-semibold text-foreground">Profile Name</Label>
                      <Input
                        id="profile-title"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        placeholder="Display Name"
                        className="bg-background border-border focus-visible:border-[var(--brand)] focus-visible:ring-1 focus-visible:ring-[var(--brand)]/20 text-xs h-9"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="profile-bio" className="text-xs font-semibold text-foreground">Biography</Label>
                  <Textarea
                    id="profile-bio"
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    placeholder="Tell your audience a little bit about yourself..."
                    rows={3}
                    className="bg-background border-border focus-visible:border-[var(--brand)] focus-visible:ring-1 focus-visible:ring-[var(--brand)]/20 text-xs resize-none"
                  />
                </div>

                {/* Avatar Preset Selectors */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-foreground">Avatar Design Preset</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {avatarPresets.map((preset) => (
                      <Button
                        key={preset.id}
                        variant="outline"
                        size="sm"
                        onClick={() => setProfileAvatar(preset.id)}
                        className={`h-9 px-3 text-xs justify-start gap-2 font-medium border-border transition-all ${
                          profileAvatar === preset.id
                            ? 'border-[var(--brand)] bg-[var(--brand)]/5 text-[var(--brand)] font-semibold shadow-xs'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <div className={`h-3 w-3 rounded-full shrink-0 ${preset.css}`} />
                        <span className="truncate">{preset.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Separator className="bg-border" />

              {/* Section 2: Social Links */}
              <div className="space-y-4">
                <div className="flex flex-row items-center justify-between gap-3 bg-zinc-50 dark:bg-zinc-900/30 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800/80">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Share2 className="w-3.5 h-3.5 text-[var(--brand)]" />
                    <span className="text-[11px] font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
                      Social Accounts
                    </span>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="text-zinc-400 hover:text-zinc-650 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors p-0.5 rounded cursor-pointer"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-zinc-900 dark:bg-zinc-950 text-white dark:text-zinc-200 border border-zinc-800 p-2 text-[10px] rounded-lg max-w-xs shadow-xl">
                          Manage, customize, and drag-and-drop to reorder your profiles.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {/* Dual Action Buttons Row */}
                  {(activePlatforms.length > 1 || inactivePlatforms.length > 0) && (
                    <div className="shrink-0">
                      {inactivePlatforms.length > 0 ? (
                        <ButtonGroup className="flex">
                          {/* Main Button: Add Account Dropdown */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 text-[11px] font-bold text-[var(--brand)] hover:bg-[var(--brand)]/5 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all"
                              >
                                <Plus className="w-3 h-3" /> Add
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                              {inactivePlatforms.map((platform) => (
                                <DropdownMenuItem
                                  key={platform.id}
                                  onClick={() => handleAddSocial(platform.id)}
                                  className="flex items-center gap-2 text-xs cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 py-2 px-3 rounded-lg"
                                >
                                  {platform.icon}
                                  {platform.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
 
                          {/* Three-dots menu for Rearrange */}
                          {activePlatforms.length > 1 && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-7 px-2 shadow-sm border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95 text-zinc-700 dark:text-zinc-350 bg-background shrink-0"
                                >
                                  <MoreHorizontal className="w-3.5 h-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                                <DropdownMenuItem
                                  onClick={() => setIsRearrangeOpen(true)}
                                  className="flex items-center gap-2 text-xs cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 py-2 px-3 rounded-lg"
                                >
                                  <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
                                  <span>Rearrange Order</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </ButtonGroup>
                      ) : (
                        /* If no inactive platforms, just show Rearrange as a full button since there is no Add Account button to save space */
                        activePlatforms.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsRearrangeOpen(true)}
                            className="h-7 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" /> Rearrange
                          </Button>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* Display Position Settings Card */}
                <div className="flex items-center justify-between bg-muted/50 p-3 rounded-xl border border-border">
                  <div className="flex flex-col gap-0.5">
                    <Label className="text-xs font-bold text-foreground">Display Position</Label>
                    <span className="text-[10px] text-muted-foreground">Place social icons at top or bottom.</span>
                  </div>
                  <div className="flex border border-border bg-muted rounded-lg p-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSocialsPosition('top')}
                      className={`text-[10px] font-bold px-3 py-1 rounded-md transition-all ${
                        socialsPosition === 'top'
                          ? 'bg-background text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Top
                    </button>
                    <button
                      type="button"
                      onClick={() => setSocialsPosition('bottom')}
                      className={`text-[10px] font-bold px-3 py-1 rounded-md transition-all ${
                        socialsPosition === 'bottom'
                          ? 'bg-background text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Bottom
                    </button>
                  </div>
                </div>

                {activePlatforms.length > 0 ? (
                  <div className="space-y-3">
                    {activePlatforms.map((platform) => (
                      <SocialInputField
                        key={platform.id}
                        id={`social-input-${platform.id}`}
                        label={platform.label}
                        icon={platform.icon}
                        value={platform.value}
                        onChange={(val) => handleUpdateSocial(platform.id, val)}
                        onRemove={() => handleRemoveSocial(platform.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed rounded-xl bg-muted/30 border-border">
                    <p className="text-xs text-muted-foreground italic">No social accounts added yet.</p>
                    {inactivePlatforms.length > 0 ? (
                      <p className="text-[10px] text-muted-foreground mt-1">Click the button above to link your accounts.</p>
                    ) : (
                      <p className="text-[10px] text-muted-foreground mt-1">All available platforms have been added.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          {/* Footer Area with Save button */}
          <SheetFooter className="p-4 border-t border-border shrink-0 bg-muted/50">
            <Button
              onClick={handleSave}
              className="w-full bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white font-semibold text-xs h-10 shadow-xs active:scale-[0.98] transition-transform duration-100"
            >
              Save
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Rearrange Socials Dialog Modal */}
      <Dialog open={isRearrangeOpen} onOpenChange={setIsRearrangeOpen}>
        <DialogContent className="sm:max-w-md bg-background border border-border rounded-2xl shadow-2xl p-6">
          <DialogHeader className="pb-4 border-b border-border flex flex-col gap-1 text-left">
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[var(--brand)]" />
              Rearrange Social Icons
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-normal">
              Drag and drop your active social profiles vertically (up or down) to rearrange their sequence.
            </DialogDescription>
          </DialogHeader>
 
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900/10 rounded-xl border border-zinc-200 dark:border-zinc-800/80 my-4 w-full">
            <DragDropProvider
              onDragStart={(event) => {
                setActiveDragId(event.operation.source?.id as string)
              }}
              onDragEnd={(event) => {
                setActiveDragId(null)
                if (event.canceled) return
 
                const { source } = event.operation
                if (isSortable(source)) {
                  const { initialIndex, index } = source
                  if (initialIndex !== index) {
                    handleReorderSocials(initialIndex, index)
                  }
                }
              }}
            >
              <div className="flex flex-col gap-2 w-full max-h-[300px] overflow-y-auto pr-1">
                {activePlatforms.map((platform, index) => (
                  <SortableSocialItem
                    key={platform.id}
                    platformId={platform.id}
                    label={platform.label}
                    icon={platform.icon}
                    index={index}
                  />
                ))}
              </div>
 
              <DragOverlay>
                {activeDragId && activeDragItem ? (
                  <SortableSocialItem
                    platformId={activeDragItem.id}
                    label={activeDragItem.label}
                    icon={activeDragItem.icon}
                    isOverlay
                    index={-1}
                  />
                ) : null}
              </DragOverlay>
            </DragDropProvider>
          </div>

          <DialogFooter className="pt-4 border-t border-border flex justify-end">
            <Button
              onClick={() => setIsRearrangeOpen(false)}
              className="w-full sm:w-auto px-6 bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white font-semibold text-xs h-9 shadow-xs active:scale-[0.98] transition-transform duration-100"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
