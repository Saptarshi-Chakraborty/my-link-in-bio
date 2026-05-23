import { createFileRoute } from '@tanstack/react-router'
import {
  ChartColumn,
  Copy,
  GripVertical,
  Image,
  Link2,
  Palette,
  Plus,
  Search,
  Settings,
  Share2,
  Sparkles,
  Store,
  Trash2,
  ChevronDown,
  Info,
  ExternalLink
} from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'

// Custom SVG Icons to avoid package export issues
function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" rx="1" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

type LinkItem = {
  id: string
  title: string
  url: string
  clicks: number
  active: boolean
}

type SocialsState = {
  github: string
  linkedin: string
  facebook: string
  instagram: string
}

type SocialsActiveState = {
  github: boolean
  linkedin: boolean
  facebook: boolean
  instagram: boolean
}

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

const avatarPresets = [
  { id: 'neon', name: 'Neon Tokyo', css: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500' },
  { id: 'warm', name: 'Warm Clay', css: 'bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500' },
  { id: 'vivid', name: 'Vivid Pink', css: 'bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600' },
  { id: 'minimalist', name: 'Minimalist Zinc', css: 'bg-zinc-800' },
]

export const Route = createFileRoute('/builder')({
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
    <div className="relative min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden flex flex-col text-[var(--ink-1)]">
      {/* Animated background gradients (subtle, non-intrusive) */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl animate-float" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl animate-float-delayed" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 border-b border-[var(--line)] bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-[var(--brand)] flex items-center justify-center text-white font-bold font-display">
            V
          </div>
          <div>
            <h1 className="font-display font-bold text-sm text-[var(--ink-1)] leading-none">VibeLink</h1>
            <span className="text-[10px] text-[var(--ink-3)]">Builder Dashboard</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--ink-3)] bg-[var(--line-soft)] px-3 py-1.5 rounded-lg border border-[var(--glass-border)]">
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
          <button
            type="button"
            className="btn-secondary h-8 px-3 text-xs flex items-center gap-1.5 font-bold cursor-pointer"
            onClick={() => navigator.clipboard.writeText("https://vibelink.co/saptarshi")}
          >
            <Copy size={13} />
            Share
          </button>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-[1600px] w-full px-4 pb-6 pt-5 sm:px-6 lg:px-8 flex-1 min-h-0 lg:overflow-hidden flex flex-col">
        
        {/* Main Grid Layout */}
        <div className="grid gap-6 lg:grid-cols-[260px_1fr_360px] lg:items-stretch lg:flex-1 lg:min-h-0 lg:overflow-hidden">
          
          {/* Left Sidebar (Navigation & Checklist) */}
          <aside className="island rounded-2xl p-5 flex flex-col gap-6 lg:h-full lg:max-h-full lg:overflow-y-auto">
            {/* User Profile Switcher */}
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
              <div className="flex items-center gap-2 min-w-0">
                <div className={`h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold ${activeAvatarCss}`}>
                  {profileName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-display text-xs font-bold leading-tight truncate text-[var(--ink-1)]">
                    {profileName}
                  </p>
                  <p className="text-[10px] text-[var(--ink-3)] truncate">
                    @saptarshi_chakraborty
                  </p>
                </div>
              </div>
              <button type="button" className="h-6 w-6 rounded-md hover:bg-[var(--line-soft)] flex items-center justify-center text-[var(--ink-3)] cursor-pointer">
                <ChevronDown size={14} />
              </button>
            </div>

            {/* Main Navigation Menu */}
            <nav className="space-y-1">
              <p className="text-[10px] font-semibold text-[var(--ink-3)] uppercase tracking-[0.08em] px-2 mb-2">
                My Linktree
              </p>
              <PanelButton icon={<Link2 size={16} />} active>
                Links
              </PanelButton>
              <PanelButton icon={<Store size={16} />}>Shop</PanelButton>
              <PanelButton icon={<Palette size={16} />}>Design</PanelButton>
            </nav>

            {/* Tools Menu */}
            <nav className="space-y-1">
              <p className="text-[10px] font-semibold text-[var(--ink-3)] uppercase tracking-[0.08em] px-2 mb-2">
                Tools
              </p>
              <PanelButton icon={<Search size={16} />}>Social planner</PanelButton>
              <PanelButton icon={<Settings size={16} />}>Instagram auto-reply</PanelButton>
              <PanelButton icon={<Link2 size={16} />}>Link shortener</PanelButton>
            </nav>

            {/* Checklist Card */}
            <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--line-soft)] p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                {/* Circular Gauge */}
                <div className="relative h-10 w-10 flex-shrink-0">
                  <svg className="h-full w-full" viewBox="0 0 36 36">
                    <path
                      className="text-zinc-200"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[var(--brand)]"
                      strokeDasharray="67, 100"
                      strokeWidth="3"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[var(--brand)]">
                    67%
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--ink-1)]">Setup checklist</p>
                  <p className="text-[10px] text-[var(--ink-3)]">4 of 6 tasks complete</p>
                </div>
              </div>
              <button type="button" className="w-full text-center py-2 bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-bold text-[var(--ink-1)] rounded-lg shadow-sm transition duration-150 active:scale-[0.98]">
                Finish setup
              </button>
            </div>

          </aside>

          {/* Center Section (Builder Dashboard) */}
          <section className="flex flex-col gap-5 lg:h-full lg:max-h-full lg:overflow-y-auto pr-1">

            {/* Profile Customization Section */}
            <div className="island rounded-2xl p-5 sm:p-6 flex flex-col gap-5">
              <div className="flex items-start justify-between border-b border-[var(--line)] pb-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-[var(--ink-1)]">Profile Details</h2>
                  <p className="text-xs text-[var(--ink-3)]">Customize your link-in-bio page identity</p>
                </div>
                <div className="glow-badge">
                  <Sparkles size={12} />
                  Live Sync
                </div>
              </div>

              {/* Avatar, Name, and Bio editing */}
              <div className="grid gap-4 sm:grid-cols-[80px_1fr] items-center">
                <div className="flex flex-col items-center gap-2">
                  <div className={`h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-bold ${activeAvatarCss} shadow-sm`}>
                    {profileName.charAt(0)}
                  </div>
                  <span className="text-[10px] text-[var(--ink-3)] font-semibold uppercase">Avatar</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--ink-3)] uppercase tracking-wider mb-1">
                      Profile Title
                    </label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="Display Name"
                      className="w-full h-9 rounded-lg border border-[var(--glass-border)] px-3 text-sm text-[var(--ink-1)] outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/15 transition bg-zinc-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--ink-3)] uppercase tracking-wider mb-1">
                      Bio Description
                    </label>
                    <textarea
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                      placeholder="Short bio details..."
                      rows={2}
                      className="w-full rounded-lg border border-[var(--glass-border)] p-3 text-sm text-[var(--ink-1)] outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/15 transition bg-zinc-50 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Avatar Preset Selection */}
              <div>
                <label className="block text-[10px] font-semibold text-[var(--ink-3)] uppercase tracking-wider mb-2">
                  Choose Avatar Design
                </label>
                <div className="flex flex-wrap gap-2">
                  {avatarPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setProfileAvatar(preset.id)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2 cursor-pointer transition ${
                        profileAvatar === preset.id
                          ? 'border-[var(--brand)] bg-[var(--brand-tint)] text-[var(--brand)]'
                          : 'border-[var(--glass-border)] bg-white text-[var(--ink-2)] hover:bg-zinc-50'
                      }`}
                    >
                      <div className={`h-3 w-3 rounded-full ${preset.css}`} />
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Social Icons Customization */}
              <div className="border-t border-[var(--line)] pt-4">
                <label className="block text-[10px] font-semibold text-[var(--ink-3)] uppercase tracking-wider mb-3">
                  Social Accounts (Handles)
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <SocialInput
                    label="GitHub"
                    icon={<GithubIcon className="w-3.5 h-3.5" />}
                    value={socials.github}
                    active={socialsActive.github}
                    onChange={(val) => handleUpdateSocial('github', val)}
                    onToggle={() => handleToggleSocial('github')}
                  />
                  <SocialInput
                    label="LinkedIn"
                    icon={<LinkedinIcon className="w-3.5 h-3.5" />}
                    value={socials.linkedin}
                    active={socialsActive.linkedin}
                    onChange={(val) => handleUpdateSocial('linkedin', val)}
                    onToggle={() => handleToggleSocial('linkedin')}
                  />
                  <SocialInput
                    label="Facebook"
                    icon={<FacebookIcon className="w-3.5 h-3.5" />}
                    value={socials.facebook}
                    active={socialsActive.facebook}
                    onChange={(val) => handleUpdateSocial('facebook', val)}
                    onToggle={() => handleToggleSocial('facebook')}
                  />
                  <SocialInput
                    label="Instagram"
                    icon={<InstagramIcon className="w-3.5 h-3.5" />}
                    value={socials.instagram}
                    active={socialsActive.instagram}
                    onChange={(val) => handleUpdateSocial('instagram', val)}
                    onToggle={() => handleToggleSocial('instagram')}
                  />
                </div>
              </div>
            </div>

            {/* Build your page list of links */}
            <div className="island rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-lg font-bold leading-tight text-[var(--ink-1)]">
                    Manage Custom Links
                  </h1>
                  <p className="text-xs text-[var(--ink-3)] mt-0.5">
                    Add, edit, drag, and configure your visual shortcut cards.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="btn-primary h-9 px-4 text-xs gap-1 cursor-pointer font-bold shrink-0"
                >
                  <Plus size={14} />
                  Add Link
                </button>
              </div>

              {/* Warning/Error Banner when no links are active */}
              {activeLinks.length === 0 && (
                <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs leading-relaxed">
                  <Info size={16} className="text-amber-600 flex-shrink-0" />
                  <p>
                    All links are currently hidden or inactive. Toggles must be switched ON to display them in the live preview.
                  </p>
                </div>
              )}

              {/* Links List */}
              <div className="space-y-3">
                {links.map((item) => (
                  <article
                    key={item.id}
                    className={`group rounded-xl border p-4 transition-all duration-200 bg-white ${
                      item.active ? 'border-zinc-200 shadow-sm' : 'border-zinc-200/50 bg-zinc-50/50 opacity-80'
                    }`}
                  >
                    <div className="mb-3 flex items-start gap-2">
                      <div className="inline-flex h-8 items-center text-[var(--ink-4)] cursor-grab">
                        <GripVertical size={16} />
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-1">
                        {/* Title Input field */}
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateLink(item.id, 'title', e.target.value)}
                          className="w-full bg-transparent font-display text-sm font-bold text-[var(--ink-1)] outline-none border-b border-transparent focus:border-[var(--brand)] py-0.5"
                          placeholder="Link Title"
                        />
                        {/* URL Input field */}
                        <input
                          type="text"
                          value={item.url}
                          onChange={(e) => handleUpdateLink(item.id, 'url', e.target.value)}
                          className="w-full bg-transparent text-xs text-[var(--ink-3)] outline-none border-b border-transparent focus:border-[var(--brand)] py-0.5"
                          placeholder="https://example.com"
                        />
                      </div>

                      {/* Active/Inactive Toggle Switch */}
                      <button
                        type="button"
                        onClick={() => toggleLink(item.id)}
                        className={`relative h-6 w-11 flex-shrink-0 rounded-full border p-0.5 transition duration-200 ease-out cursor-pointer ${
                          item.active
                            ? 'border-emerald-500 bg-emerald-500'
                            : 'border-zinc-300 bg-zinc-200'
                        }`}
                        aria-label={`Toggle ${item.title}`}
                      >
                        <span
                          className={`block h-[18px] w-[18px] rounded-full bg-white shadow transition-transform duration-200 ease-out ${
                            item.active ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-xs">
                      <div className="flex items-center gap-1.5 text-[var(--ink-3)]">
                        <IconAction icon={<Image size={14} />} />
                        <IconAction icon={<ChartColumn size={14} />} />
                        <IconAction icon={<Copy size={14} />} onClick={() => navigator.clipboard.writeText(item.url)} />
                        <IconAction icon={<Trash2 size={14} />} onClick={() => handleDeleteLink(item.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50" />
                      </div>
                      <p className="font-semibold text-[var(--ink-3)] bg-zinc-100 px-2 py-0.5 rounded text-[10px]">
                        {item.clicks} clicks
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Right Sidebar - Sticky Phone Preview & Theme Picker */}
          <aside className="island rounded-2xl p-5 flex flex-col gap-6 lg:h-full lg:max-h-full lg:overflow-y-auto">
            {/* Live Preview Header */}
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
              <h2 className="font-display text-sm font-bold text-[var(--ink-1)]">Live Preview</h2>
              <span className="text-[10px] font-bold bg-zinc-100 px-2 py-1 rounded text-zinc-600">Mockup</span>
            </div>

            {/* Beautiful, High-Fidelity Phone Frame */}
            <div className="flex justify-center">
              <div className="w-[230px] h-[480px] shrink-0 rounded-[2.2rem] border-[5px] border-zinc-900 bg-zinc-950 p-1.5 shadow-2xl relative overflow-hidden flex flex-col">
                {/* Phone Notch/Speaker */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 h-[18px] w-24 rounded-full bg-zinc-900 z-30 flex items-center justify-center">
                  <div className="h-1.5 w-8 bg-zinc-800 rounded-full" />
                </div>

                {/* Inner Device Screen */}
                <div className={`flex-1 min-h-0 rounded-[1.8rem] p-3 pt-6 flex flex-col items-center relative overflow-y-auto overflow-x-hidden phone-scrollbar theme-preview-${selectedTheme} transition-all duration-300`} style={{ background: 'var(--phone-bg)', color: 'var(--phone-text)' }}>
                  
                  {/* Phone Address Header */}
                  <div className="w-full bg-black/10 backdrop-blur-md rounded-lg py-1 px-2 mb-4 flex items-center justify-between text-[8px] text-[var(--phone-text)] font-semibold border border-white/5">
                    <span className="truncate max-w-[120px]">linktr.ee/saptarshi</span>
                    <Share2 size={8} className="opacity-80" />
                  </div>

                  {/* Profile Info inside mockup */}
                  <div className="flex flex-col items-center text-center mt-2 w-full">
                    {/* Dynamic Avatar */}
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white text-base font-bold shadow-md border-2 border-white/20 mb-2 ${activeAvatarCss}`}>
                      {profileName.charAt(0)}
                    </div>
                    {/* Profile Title */}
                    <h3 className="text-xs font-bold leading-tight truncate w-full px-2" style={{ color: 'var(--phone-text)' }}>
                      {profileName || 'Your Name'}
                    </h3>
                    {/* Bio Description */}
                    <p className="text-[9px] mt-1 line-clamp-2 w-full px-3 leading-snug opacity-75" style={{ color: 'var(--phone-text-muted)' }}>
                      {profileBio || 'Write something...'}
                    </p>

                    {/* Social handles row inside mockup */}
                    <div className="flex flex-wrap justify-center gap-2 mt-3 mb-4">
                      {socialsActive.github && socials.github && (
                        <a href={`https://github.com/${socials.github}`} target="_blank" rel="noreferrer" style={{ color: 'var(--phone-text)' }} className="opacity-80 hover:opacity-100 hover:scale-110 transition-transform">
                          <GithubIcon className="w-3 h-3" />
                        </a>
                      )}
                      {socialsActive.linkedin && socials.linkedin && (
                        <a href={`https://linkedin.com/in/${socials.linkedin}`} target="_blank" rel="noreferrer" style={{ color: 'var(--phone-text)' }} className="opacity-80 hover:opacity-100 hover:scale-110 transition-transform">
                          <LinkedinIcon className="w-3 h-3" />
                        </a>
                      )}
                      {socialsActive.facebook && socials.facebook && (
                        <a href={`https://facebook.com/${socials.facebook}`} target="_blank" rel="noreferrer" style={{ color: 'var(--phone-text)' }} className="opacity-80 hover:opacity-100 hover:scale-110 transition-transform">
                          <FacebookIcon className="w-3 h-3" />
                        </a>
                      )}
                      {socialsActive.instagram && socials.instagram && (
                        <a href={`https://instagram.com/${socials.instagram}`} target="_blank" rel="noreferrer" style={{ color: 'var(--phone-text)' }} className="opacity-80 hover:opacity-100 hover:scale-110 transition-transform">
                          <InstagramIcon className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Active custom link list buttons inside mockup */}
                  <div className="w-full space-y-2 flex-1">
                    {activeLinks.map((item) => (
                      <a
                        key={item.id}
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-[10px] font-bold tracking-wide transition duration-150 select-none shadow-sm active:scale-[0.98]"
                        style={{
                          backgroundColor: 'var(--phone-btn-bg)',
                          borderColor: 'var(--phone-btn-border)',
                          color: 'var(--phone-btn-text)',
                          backdropFilter: 'var(--phone-backdrop-blur)',
                          WebkitBackdropFilter: 'var(--phone-backdrop-blur)'
                        }}
                      >
                        <span className="truncate flex-1 pr-2">{item.title}</span>
                        <ExternalLink size={10} className="opacity-60 shrink-0" />
                      </a>
                    ))}
                    {activeLinks.length === 0 && (
                      <div className="py-6 text-center text-[9px] opacity-40 font-semibold italic">
                        No links to display
                      </div>
                    )}
                  </div>
                  
                  {/* Phone Footer brand logo */}
                  <div className="mt-4 pt-2 border-t border-white/5 w-full flex justify-center opacity-60">
                    <span className="text-[8px] font-bold tracking-wider font-display">VibeLink</span>
                  </div>
                </div>
              </div>
            </div>



          </aside>

        </div>
      </div>
    </div>
  )
}

// Subcomponents


function PanelButton({
  icon,
  active = false,
  children,
}: {
  icon: ReactNode
  active?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      className={`panel-btn flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-bold transition duration-200 ease-out cursor-pointer ${
        active
          ? 'bg-[var(--brand)] text-white shadow-sm'
          : 'text-[var(--ink-2)] hover:bg-[var(--line-soft)]'
      }`}
    >
      <span className={active ? 'text-white' : 'text-[var(--ink-3)]'}>{icon}</span>
      {children}
    </button>
  )
}

function IconAction({
  icon,
  onClick,
  className = '',
}: {
  icon: ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--glass-border)] text-[var(--ink-3)] transition duration-200 ease-out hover:bg-zinc-100 hover:text-[var(--ink-1)] cursor-pointer active:scale-95 ${className}`}
    >
      {icon}
    </button>
  )
}

interface SocialInputProps {
  label: string
  icon: ReactNode
  value: string
  active: boolean
  onChange: (val: string) => void
  onToggle: () => void
}

function SocialInput({ label, icon, value, active, onChange, onToggle }: SocialInputProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-[var(--glass-border)] bg-zinc-50 p-2 text-xs">
      <div className="flex items-center gap-1.5 text-[var(--ink-2)] font-semibold shrink-0">
        {icon}
        <span className="hidden sm:inline">{label}</span>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Handle"
        className="flex-1 bg-transparent text-[var(--ink-1)] outline-none border-b border-transparent focus:border-[var(--brand)] px-1 leading-none text-xs min-w-0"
      />
      <button
        type="button"
        onClick={onToggle}
        className={`relative h-4 w-8 rounded-full border transition duration-200 ease-out cursor-pointer shrink-0 ${
          active
            ? 'border-emerald-500 bg-emerald-500'
            : 'border-zinc-300 bg-zinc-200'
        }`}
        aria-label={`Toggle ${label}`}
      >
        <span
          className={`block h-3 w-3 rounded-full bg-white shadow transition-transform duration-200 ease-out ${
            active ? 'translate-x-3.5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}
