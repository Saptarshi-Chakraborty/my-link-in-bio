import { createFileRoute } from '@tanstack/react-router'
import { Copy, ExternalLink, Phone } from 'lucide-react'
import { useMemo, useState } from 'react'

import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { TooltipProvider } from '@/components/ui/tooltip'

// Extracted Modular Components & Types
import type { LinkItem, SocialsState, SocialsActiveState } from '@/components/builder/types'
import { MobileMockup } from '@/components/builder/mobile-mockup'
import { ProfileDetailsCard, avatarPresets } from '@/components/builder/profile-details-card'
import { SocialAccountsCard } from '@/components/builder/social-accounts-card'
import { CustomLinksCard } from '@/components/builder/custom-links-card'

const defaultLinks: LinkItem[] = [
  {
    id: 'github',
    title: 'GitHub',
    url: 'https://github.com/Saptarshi-Chakraborty',
    clicks: 33,
    active: true,
  },
  {
    id: 'linkedin',
    title: 'LinkedIn',
    url: 'https://www.linkedin.com/in/saptarshi-chakraborty-sc/',
    clicks: 16,
    active: true,
  },
  {
    id: 'portfolio',
    title: 'Portfolio Website',
    url: 'https://saptarshi.design',
    clicks: 9,
    active: false,
  },
]

export const Route = createFileRoute('/builder-new')({
  component: BuilderPage,
})

function BuilderPage() {
  // Links State
  const [links, setLinks] = useState<LinkItem[]>(defaultLinks)
  
  // Profile State
  const [profileName, setProfileName] = useState('Saptarshi Chakraborty')
  const [profileBio, setProfileBio] = useState('Designer & Developer')
  const [profileAvatar, setProfileAvatar] = useState('neon')
  
  // Socials State
  const [socials, setSocials] = useState<SocialsState>({
    github: 'Saptarshi-Chakraborty',
    linkedin: 'saptarshi-chakraborty-sc',
    facebook: 'saptarshi.facebook',
    instagram: 'saptarshichakraborty_tm',
  })
  
  const [socialsActive, setSocialsActive] = useState<SocialsActiveState>({
    github: true,
    linkedin: true,
    facebook: true,
    instagram: true,
  })
  
  // Theme State
  const selectedTheme = 'minimalist'

  const activeLinks = useMemo(
    () => links.filter((item) => item.active),
    [links],
  )

  // Handlers
  const handleAddLink = () => {
    const newId = `link-${Date.now()}`
    setLinks((prev) => [
      {
        id: newId,
        title: 'My New Link',
        url: 'https://example.com',
        clicks: 0,
        active: true,
      },
      ...prev,
    ])
  }

  const handleDeleteLink = (id: string) => {
    setLinks((prev) => prev.filter((item) => item.id !== id))
  }

  const handleUpdateLink = (id: string, key: 'title' | 'url', value: string) => {
    setLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)),
    )
  }

  const toggleLink = (id: string) => {
    setLinks((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item,
      ),
    )
  }

  const handleUpdateSocial = (platform: keyof SocialsState, value: string) => {
    setSocials((prev) => ({ ...prev, [platform]: value }))
  }

  const handleToggleSocial = (platform: keyof SocialsActiveState) => {
    setSocialsActive((prev) => ({ ...prev, [platform]: !prev[platform] }))
  }

  // Get active avatar CSS class
  const activeAvatarCss = useMemo(() => {
    const preset = avatarPresets.find(p => p.id === profileAvatar)
    return preset ? preset.css : 'bg-zinc-800'
  }, [profileAvatar])

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-[var(--page-bg)]">
        {/* Animated background gradients (subtle, non-intrusive) */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl animate-float" />
          <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl animate-float-delayed" />
        </div>

        <AppSidebar />
        
        <SidebarInset className="relative z-10 flex flex-col flex-1 overflow-hidden bg-transparent">
          {/* Header Bar */}
          <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-white/70 backdrop-blur-md px-6 sticky top-0 z-20">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Platform</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Builder</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-zinc-100/80 px-3 py-1.5 rounded-lg border border-zinc-200/50">
                <span>My Linktree:</span>
                <a
                  href="https://vibelink.co/saptarshi"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[var(--brand)] hover:underline flex items-center gap-1"
                >
                  vibelink.co/saptarshi
                  <ExternalLink size={12} />
                </a>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-bold gap-1.5"
                onClick={() => navigator.clipboard.writeText("https://vibelink.co/saptarshi")}
              >
                <Copy size={13} />
                Copy URL
              </Button>

              {/* Mobile Preview Trigger Button - only visible on small screens */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="xl:hidden h-8 w-8">
                    <Phone size={14} />
                    <span className="sr-only">Toggle Mobile Preview</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[380px] p-0 flex flex-col justify-center items-center bg-zinc-950 border-l border-zinc-800">
                  <div className="sr-only">
                    <SheetTitle>Mobile Preview</SheetTitle>
                  </div>
                  <div className="scale-90 sm:scale-100">
                    <MobileMockup
                      profileName={profileName}
                      profileBio={profileBio}
                      activeAvatarCss={activeAvatarCss}
                      socials={socials}
                      socialsActive={socialsActive}
                      activeLinks={activeLinks}
                      selectedTheme={selectedTheme}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </header>

          {/* Main workspace layout */}
          <div className="flex flex-1 flex-row overflow-hidden">
            {/* Scrollable Editor Container */}
            <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8 max-w-4xl mx-auto w-full flex flex-col gap-6 custom-scrollbar">
              
              {/* Page Title */}
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold font-display text-zinc-900 tracking-tight">Builder Workspace</h1>
                <p className="text-sm text-muted-foreground">Design your public page, add custom links, and check your performance.</p>
              </div>

              {/* Card 1: Profile Details */}
              <ProfileDetailsCard
                profileName={profileName}
                setProfileName={setProfileName}
                profileBio={profileBio}
                setProfileBio={setProfileBio}
                profileAvatar={profileAvatar}
                setProfileAvatar={setProfileAvatar}
                activeAvatarCss={activeAvatarCss}
              />

              {/* Card 2: Social Accounts */}
              <SocialAccountsCard
                socials={socials}
                socialsActive={socialsActive}
                handleUpdateSocial={handleUpdateSocial}
                handleToggleSocial={handleToggleSocial}
              />

              {/* Card 3: Manage Links */}
              <CustomLinksCard
                links={links}
                activeLinks={activeLinks}
                handleAddLink={handleAddLink}
                handleDeleteLink={handleDeleteLink}
                handleUpdateLink={handleUpdateLink}
                toggleLink={toggleLink}
              />
            </div>

            {/* Desktop Right Preview Panel (Sticky) */}
            <div className="hidden xl:flex w-[380px] border-l bg-zinc-50/50 flex-col items-center justify-center p-6 shrink-0 h-[calc(100vh-4rem)] sticky top-16">
              <div className="w-full flex justify-between items-center border-b pb-3 mb-6">
                <h3 className="font-bold text-sm text-zinc-800">Live Preview</h3>
                <span className="text-[10px] font-bold bg-white shadow-sm border px-2 py-1 rounded text-zinc-500">Mockup</span>
              </div>
              <MobileMockup
                profileName={profileName}
                profileBio={profileBio}
                activeAvatarCss={activeAvatarCss}
                socials={socials}
                socialsActive={socialsActive}
                activeLinks={activeLinks}
                selectedTheme={selectedTheme}
              />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  </TooltipProvider>
  )
}
