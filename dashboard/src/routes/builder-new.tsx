import { createFileRoute, Outlet, Link } from '@tanstack/react-router'
import { Copy, ExternalLink, Phone, Palette, LinkIcon } from 'lucide-react'
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

// Extracted Modular Components
import { MobileMockup } from '@/components/builder/mobile-mockup'

// Validation Schema & Storage Imports
import { profileStorage } from '@/lib/storage'
import type { ProfilePageData } from '@/lib/schemas/profile'
import { useBuilderStore } from '@/store/use-builder-store'

export const Route = createFileRoute('/builder-new')({
  component: BuilderLayout,
})

function BuilderLayout() {
  // Retrieve Zustand states for auto-save
  const profileName = useBuilderStore((state) => state.profileName)
  const profileBio = useBuilderStore((state) => state.profileBio)
  const profileAvatar = useBuilderStore((state) => state.profileAvatar)
  const socials = useBuilderStore((state) => state.socials)
  const socialsPosition = useBuilderStore((state) => state.socialsPosition)
  const links = useBuilderStore((state) => state.links)
  const pageTheme = useBuilderStore((state) => state.pageTheme)


  // Debounced auto-save effect
  useEffect(() => {
    const dataToSave: ProfilePageData = {
      version: 5,
      profileName,
      profileBio,
      profileAvatar,
      socials,
      socialsPosition,
      links,
      pageTheme,
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
  }, [profileName, profileBio, profileAvatar, socials, socialsPosition, links, pageTheme])


  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-[var(--page-bg)] text-foreground">
        {/* Animated background gradients (subtle, non-intrusive) */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl animate-float" />
          <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl animate-float-delayed" />
        </div>

        <AppSidebar />
        
        <SidebarInset className="relative z-10 flex flex-col flex-1 overflow-hidden bg-transparent">
          {/* Header Bar */}
          <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-background/70 backdrop-blur-md px-6 sticky top-0 z-20 text-foreground">
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
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/70 px-3 py-1.5 rounded-lg border border-border">
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
                <SheetContent side="right" className="w-[300px] sm:w-[380px] p-0 flex flex-col justify-center items-center bg-background border-l border-border">
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
            <div className="flex-1 w-full overflow-y-auto">
              <div className="max-w-4xl mx-auto px-4 py-8 md:px-8 flex flex-col gap-6">
                
                {/* Page Title */}
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-bold font-display text-foreground tracking-tight">Builder Workspace</h1>
                  <p className="text-sm text-muted-foreground">Design your public page, add custom links, and check your performance.</p>
                </div>

                {/* Sub-Navigation Tabs */}
                <nav className="flex items-center gap-1 p-1 bg-muted/60 rounded-xl border border-border w-fit">
                  <Link
                    to="/builder-new"
                    activeOptions={{ exact: true }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200"
                    activeProps={{
                      className: 'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 bg-background text-foreground shadow-sm border border-border',
                    }}
                    inactiveProps={{
                      className: 'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-background/50',
                    }}
                  >
                    <LinkIcon size={14} />
                    Links
                  </Link>
                  <Link
                    to="/builder-new/appearance"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200"
                    activeProps={{
                      className: 'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 bg-background text-foreground shadow-sm border border-border',
                    }}
                    inactiveProps={{
                      className: 'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-background/50',
                    }}
                  >
                    <Palette size={14} />
                    Appearance
                  </Link>
                </nav>

                {/* Child Route Content */}
                <Outlet />
              </div>
            </div>

            {/* Desktop Right Preview Panel (Sticky) */}
            <div className="hidden xl:flex w-[380px] border-l border-border bg-background/50 flex-col items-center justify-center p-6 shrink-0 h-[calc(100vh-4rem)] sticky top-16">
              <div className="w-full flex justify-between items-center border-b pb-3 mb-6">
                <h3 className="font-bold text-sm text-foreground">Live Preview</h3>
                <span className="text-[10px] font-bold bg-background shadow-sm border border-border px-2 py-1 rounded text-muted-foreground">Mockup</span>
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
