import { createFileRoute } from '@tanstack/react-router'
import { Copy, ExternalLink, Phone } from 'lucide-react'
import { useEffect } from 'react'

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
import { ScrollArea } from '@/components/ui/scroll-area'

// Extracted Modular Components
import { MobileMockup } from '@/components/builder/mobile-mockup'
import { ProfileHeaderCard } from '@/components/builder/profile-header-card'
import { CustomLinksCard } from '@/components/builder/custom-links-card'

// Validation Schema & Storage Imports
import { profileStorage } from '@/lib/storage'
import type { ProfilePageData } from '@/lib/schemas/profile'
import { useBuilderStore } from '@/store/use-builder-store'

export const Route = createFileRoute('/builder-new')({
  component: BuilderPage,
})

function BuilderPage() {
  // Retrieve Zustand states
  const profileName = useBuilderStore((state) => state.profileName)
  const profileBio = useBuilderStore((state) => state.profileBio)
  const profileAvatar = useBuilderStore((state) => state.profileAvatar)
  const socials = useBuilderStore((state) => state.socials)
  const socialsPosition = useBuilderStore((state) => state.socialsPosition)
  const links = useBuilderStore((state) => state.links)
  const theme = useBuilderStore((state) => state.theme)

  // Debounced auto-save effect
  useEffect(() => {
    const dataToSave: ProfilePageData = {
      version: 3,
      profileName,
      profileBio,
      profileAvatar,
      socials,
      socialsPosition,
      links,
      theme,
    }

    const timer = setTimeout(() => {
      profileStorage.save(dataToSave)
    }, 800) // 800ms debounce

    // Save immediately if the user closes the page or reloads
    const handleUnload = () => {
      profileStorage.save(dataToSave)
    }
    window.addEventListener('beforeunload', handleUnload)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [profileName, profileBio, profileAvatar, socials, socialsPosition, links, theme])


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
                    <MobileMockup />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </header>

          {/* Main workspace layout */}
          <div className="flex flex-1 flex-row overflow-hidden">
            {/* Scrollable Editor Container */}
            <ScrollArea className="flex-1 w-full">
              <div className="max-w-4xl mx-auto px-4 py-8 md:px-8 flex flex-col gap-6">
                
                {/* Page Title */}
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-bold font-display text-zinc-900 tracking-tight">Builder Workspace</h1>
                  <p className="text-sm text-muted-foreground">Design your public page, add custom links, and check your performance.</p>
                </div>

                {/* Card 1: Profile Header & Socials (Read-only + Slide Edit) */}
                <ProfileHeaderCard />

                {/* Card 3: Manage Links */}
                <CustomLinksCard />
              </div>
            </ScrollArea>

            {/* Desktop Right Preview Panel (Sticky) */}
            <div className="hidden xl:flex w-[380px] border-l bg-zinc-50/50 flex-col items-center justify-center p-6 shrink-0 h-[calc(100vh-4rem)] sticky top-16">
              <div className="w-full flex justify-between items-center border-b pb-3 mb-6">
                <h3 className="font-bold text-sm text-zinc-800">Live Preview</h3>
                <span className="text-[10px] font-bold bg-white shadow-sm border px-2 py-1 rounded text-zinc-500">Mockup</span>
              </div>
              <MobileMockup />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  </TooltipProvider>
  )
}
