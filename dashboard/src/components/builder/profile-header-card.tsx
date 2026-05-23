import { useState, useMemo } from 'react'
import { Settings2, User, Share2, Plus } from 'lucide-react'
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
  SheetClose,
  SheetFooter,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

import { SocialInputField } from './social-input-field'
import { GithubIcon, LinkedinIcon, FacebookIcon, InstagramIcon } from './icons'
import { useBuilderStore } from '@/store/use-builder-store'
import type { SocialsState, SocialsActiveState } from './types'

export const avatarPresets = [
  { id: 'neon', name: 'Neon Tokyo', css: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500' },
  { id: 'warm', name: 'Warm Clay', css: 'bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500' },
  { id: 'vivid', name: 'Vivid Pink', css: 'bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600' },
  { id: 'minimalist', name: 'Minimalist Zinc', css: 'bg-zinc-800' },
]

export function ProfileHeaderCard() {
  const profileName = useBuilderStore((state) => state.profileName)
  const setProfileName = useBuilderStore((state) => state.setProfileName)
  const profileBio = useBuilderStore((state) => state.profileBio)
  const setProfileBio = useBuilderStore((state) => state.setProfileBio)
  const profileAvatar = useBuilderStore((state) => state.profileAvatar)
  const setProfileAvatar = useBuilderStore((state) => state.setProfileAvatar)
  const socials = useBuilderStore((state) => state.socials)
  const socialsActive = useBuilderStore((state) => state.socialsActive)
  const handleUpdateSocial = useBuilderStore((state) => state.updateSocial)
  const handleToggleSocial = useBuilderStore((state) => state.toggleSocial)

  const activeAvatarCss = useMemo(() => {
    const preset = avatarPresets.find(p => p.id === profileAvatar)
    return preset ? preset.css : 'bg-zinc-800'
  }, [profileAvatar])
  const [isOpen, setIsOpen] = useState(false)

  // Determine active socials list to render quick icon badges
  const activeSocialList = useMemo(() => {
    const list = []
    if (socialsActive.github && socials.github) {
      list.push({
        id: 'github',
        icon: <GithubIcon className="w-4 h-4" />,
        url: `https://github.com/${socials.github}`,
        label: 'GitHub',
      })
    }
    if (socialsActive.linkedin && socials.linkedin) {
      list.push({
        id: 'linkedin',
        icon: <LinkedinIcon className="w-4 h-4" />,
        url: `https://linkedin.com/in/${socials.linkedin}`,
        label: 'LinkedIn',
      })
    }
    if (socialsActive.facebook && socials.facebook) {
      list.push({
        id: 'facebook',
        icon: <FacebookIcon className="w-4 h-4" />,
        url: `https://facebook.com/${socials.facebook}`,
        label: 'Facebook',
      })
    }
    if (socialsActive.instagram && socials.instagram) {
      list.push({
        id: 'instagram',
        icon: <InstagramIcon className="w-4 h-4" />,
        url: `https://instagram.com/${socials.instagram}`,
        label: 'Instagram',
      })
    }
    return list
  }, [socials, socialsActive])

  // Get list of inactive platforms that can be added
  const inactivePlatforms = useMemo(() => {
    const list = []
    if (!socialsActive.github) {
      list.push({ id: 'github', label: 'GitHub', icon: <GithubIcon className="w-4 h-4" /> })
    }
    if (!socialsActive.linkedin) {
      list.push({ id: 'linkedin', label: 'LinkedIn', icon: <LinkedinIcon className="w-4 h-4" /> })
    }
    if (!socialsActive.facebook) {
      list.push({ id: 'facebook', label: 'Facebook', icon: <FacebookIcon className="w-4 h-4" /> })
    }
    if (!socialsActive.instagram) {
      list.push({ id: 'instagram', label: 'Instagram', icon: <InstagramIcon className="w-4 h-4" /> })
    }
    return list
  }, [socialsActive])

  // Get list of active platforms
  const activePlatforms = useMemo(() => {
    const list = []
    if (socialsActive.github) {
      list.push({ id: 'github' as const, label: 'GitHub', icon: <GithubIcon className="w-4 h-4" />, value: socials.github })
    }
    if (socialsActive.linkedin) {
      list.push({ id: 'linkedin' as const, label: 'LinkedIn', icon: <LinkedinIcon className="w-4 h-4" />, value: socials.linkedin })
    }
    if (socialsActive.facebook) {
      list.push({ id: 'facebook' as const, label: 'Facebook', icon: <FacebookIcon className="w-4 h-4" />, value: socials.facebook })
    }
    if (socialsActive.instagram) {
      list.push({ id: 'instagram' as const, label: 'Instagram', icon: <InstagramIcon className="w-4 h-4" />, value: socials.instagram })
    }
    return list
  }, [socials, socialsActive])

  const handleRemoveSocial = (platform: keyof SocialsState) => {
    handleUpdateSocial(platform, '')
    if (socialsActive[platform]) {
      handleToggleSocial(platform)
    }
  }

  const handleAddSocial = (platform: keyof SocialsActiveState) => {
    if (!socialsActive[platform]) {
      handleToggleSocial(platform)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border border-zinc-200/80 shadow-sm bg-white overflow-hidden relative group/header transition-all duration-200 hover:shadow-md py-2">
        <CardContent className="p-6 py-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            
            {/* Left: Avatar & Text details */}
            <div className="flex flex-row items-center gap-5 flex-1 min-w-0">
              
              {/* Avatar Circle */}
              <div className="shrink-0 relative">
                <div className={`h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold ${activeAvatarCss} shadow-md border-2 border-white ring-4 ring-zinc-50`}>
                  {profileName ? profileName.charAt(0).toUpperCase() : '?'}
                </div>
              </div>
              
              {/* Profile Meta details */}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 truncate">
                  {profileName || 'Untitled Profile'}
                </h2>
                
                <p className="text-xs sm:text-sm text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
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
                        className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-150 text-zinc-500 hover:text-[var(--brand)] hover:bg-zinc-100 hover:border-zinc-300 transition-all duration-150 active:scale-95"
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-zinc-400 mt-3 flex items-center gap-1 font-medium">
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
                  className="h-9 px-4 font-semibold text-xs border-zinc-200/80 hover:border-zinc-300 shadow-sm bg-zinc-50 hover:bg-zinc-100 active:scale-95 transition-transform duration-100 text-zinc-700 flex items-center gap-2"
                >
                  <Settings2 className="w-3.5 h-3.5 text-zinc-500" />
                  Edit Profile & Socials
                </Button>
              </SheetTrigger>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editing Sidebar Panel */}
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col bg-white border-l border-zinc-200 shadow-2xl">
        <SheetHeader className="p-6 pb-4 border-b border-zinc-100 shrink-0">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <SheetTitle className="text-base font-bold text-zinc-950 flex items-center gap-2">
                <User className="w-4 h-4 text-[var(--brand)]" />
                Edit Profile Settings
              </SheetTitle>
              <SheetDescription className="text-xs text-zinc-500 leading-normal">
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
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-zinc-50/50 p-4 rounded-xl border border-zinc-100">
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <div className={`h-16 w-16 rounded-full flex items-center justify-center text-white text-2xl font-bold ${activeAvatarCss} shadow-md border border-white ring-2 ring-zinc-200/50`}>
                    {profileName ? profileName.charAt(0).toUpperCase() : '?'}
                  </div>
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Preview</span>
                </div>

                <div className="flex-1 w-full space-y-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="profile-title" className="text-xs font-semibold text-zinc-700">Profile Name</Label>
                    <Input
                      id="profile-title"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="Display Name"
                      className="bg-white border-zinc-200/80 focus-visible:border-[var(--brand)] focus-visible:ring-1 focus-visible:ring-[var(--brand)]/20 text-xs h-9"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="profile-bio" className="text-xs font-semibold text-zinc-700">Biography</Label>
                <Textarea
                  id="profile-bio"
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  placeholder="Tell your audience a little bit about yourself..."
                  rows={3}
                  className="bg-white border-zinc-200/80 focus-visible:border-[var(--brand)] focus-visible:ring-1 focus-visible:ring-[var(--brand)]/20 text-xs resize-none"
                />
              </div>

              {/* Avatar Preset Selectors */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-zinc-700">Avatar Design Preset</Label>
                <div className="grid grid-cols-2 gap-2">
                  {avatarPresets.map((preset) => (
                    <Button
                      key={preset.id}
                      variant="outline"
                      size="sm"
                      onClick={() => setProfileAvatar(preset.id)}
                      className={`h-9 px-3 text-xs justify-start gap-2 font-medium border-zinc-200/80 transition-all ${
                        profileAvatar === preset.id
                          ? 'border-[var(--brand)] bg-[var(--brand)]/5 text-[var(--brand)] font-semibold shadow-sm'
                          : 'hover:bg-zinc-50'
                      }`}
                    >
                      <div className={`h-3 w-3 rounded-full shrink-0 ${preset.css}`} />
                      <span className="truncate">{preset.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Separator className="bg-zinc-100" />

            {/* Section 2: Social Links */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Social Accounts</span>
                </div>

                {/* Add Social Account Dropdown Trigger */}
                {inactivePlatforms.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-[10px] font-bold text-[var(--brand)] hover:text-[var(--brand)] hover:bg-[var(--brand)]/5 rounded-lg border border-zinc-200 border-dashed flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Add Account
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-white border border-zinc-150">
                      {inactivePlatforms.map((platform) => (
                        <DropdownMenuItem
                          key={platform.id}
                          onClick={() => handleAddSocial(platform.id as keyof SocialsActiveState)}
                          className="flex items-center gap-2 text-xs cursor-pointer hover:bg-zinc-50 py-1.5 px-2.5 rounded-lg"
                        >
                          {platform.icon}
                          {platform.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {activePlatforms.length > 0 ? (
                <div className="space-y-3">
                  {activePlatforms.map((platform) => (
                    <SocialInputField
                      key={platform.id}
                      label={platform.label}
                      icon={platform.icon}
                      value={platform.value}
                      onChange={(val) => handleUpdateSocial(platform.id, val)}
                      onRemove={() => handleRemoveSocial(platform.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed rounded-xl bg-zinc-50/30 border-zinc-200">
                  <p className="text-xs text-zinc-400 italic">No social accounts added yet.</p>
                  {inactivePlatforms.length > 0 ? (
                    <p className="text-[10px] text-zinc-400 mt-1">Click the button above to link your accounts.</p>
                  ) : (
                    <p className="text-[10px] text-zinc-400 mt-1">All available platforms have been added.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Footer Area with Done button */}
        <SheetFooter className="p-4 border-t border-zinc-100 shrink-0 bg-zinc-50/50">
          <SheetClose asChild>
            <Button
              className="w-full bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white font-semibold text-xs h-10 shadow-sm active:scale-[0.98] transition-transform duration-100"
            >
              Done
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
