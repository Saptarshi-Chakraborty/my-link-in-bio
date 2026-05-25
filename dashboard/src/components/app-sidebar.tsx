"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { useTheme } from "@/components/theme-provider"
import { GalleryVerticalEndIcon, AudioLinesIcon, TerminalIcon, TerminalSquareIcon, BotIcon, BookOpenIcon, Settings2Icon, FrameIcon, PieChartIcon, MapIcon, SunMediumIcon, MoonIcon } from "lucide-react"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: (
        <GalleryVerticalEndIcon
        />
      ),
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: (
        <AudioLinesIcon
        />
      ),
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: (
        <TerminalIcon
        />
      ),
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: (
        <TerminalSquareIcon
        />
      ),
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: (
        <BotIcon
        />
      ),
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: (
        <BookOpenIcon
        />
      ),
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: (
        <Settings2Icon
        />
      ),
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: (
        <FrameIcon
        />
      ),
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: (
        <PieChartIcon
        />
      ),
    },
    {
      name: "Travel",
      url: "#",
      icon: (
        <MapIcon
        />
      ),
    },
  ],
}

function SidebarThemeToggle() {
  const { state } = useSidebar()
  const { resolvedTheme, setTheme } = useTheme()

  if (state === "collapsed") {
    return (
      <button
        type="button"
        className="size-8 mx-auto flex items-center justify-center rounded-lg border border-sidebar-border hover:bg-sidebar-accent text-sidebar-foreground transition-all duration-200 active:scale-95 cursor-pointer"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
      >
        {resolvedTheme === "dark" ? (
          <MoonIcon size={15} className="text-violet-400 fill-violet-400/10" />
        ) : (
          <SunMediumIcon size={15} className="text-amber-500 fill-amber-500/10" />
        )}
      </button>
    )
  }

  return (
    <div className="flex border border-sidebar-border rounded-lg p-0.5 bg-sidebar-accent/30 w-full select-none">
      <button
        type="button"
        className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-md text-xs font-semibold transition-all duration-200 cursor-pointer ${
          resolvedTheme === "light"
            ? "bg-background text-foreground shadow-xs font-bold scale-[1.02]"
            : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/20"
        }`}
        onClick={() => setTheme("light")}
      >
        <SunMediumIcon size={14} className={resolvedTheme === "light" ? "text-amber-500 fill-amber-500/10" : ""} />
        <span>Light</span>
      </button>
      <button
        type="button"
        className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-md text-xs font-semibold transition-all duration-200 cursor-pointer ${
          resolvedTheme === "dark"
            ? "bg-background text-foreground shadow-xs font-bold scale-[1.02]"
            : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/20"
        }`}
        onClick={() => setTheme("dark")}
      >
        <MoonIcon size={14} className={resolvedTheme === "dark" ? "text-violet-400 fill-violet-400/10" : ""} />
        <span>Dark</span>
      </button>
    </div>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarThemeToggle />
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
