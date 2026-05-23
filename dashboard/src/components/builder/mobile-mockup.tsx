import { useMemo } from 'react'
import { Share2 } from 'lucide-react'
import { GithubIcon, LinkedinIcon, FacebookIcon, InstagramIcon } from './icons'
import { ElementRenderer } from './element-renderer'
import { useBuilderStore } from '@/store/use-builder-store'
import { avatarPresets } from './profile-header-card'

export function MobileMockup() {
  const profileName = useBuilderStore((state) => state.profileName)
  const profileBio = useBuilderStore((state) => state.profileBio)
  const profileAvatar = useBuilderStore((state) => state.profileAvatar)
  const socials = useBuilderStore((state) => state.socials)
  const links = useBuilderStore((state) => state.links)
  const selectedTheme = useBuilderStore((state) => state.theme)

  const activeLinks = useMemo(
    () => links.filter((item) => item.active),
    [links],
  )

  const activeAvatarCss = useMemo(() => {
    const preset = avatarPresets.find(p => p.id === profileAvatar)
    return preset ? preset.css : 'bg-zinc-800'
  }, [profileAvatar])
  return (
    <div className="w-[230px] h-[480px] shrink-0 rounded-[2.2rem] border-[5px] border-zinc-900 bg-zinc-950 p-1.5 shadow-2xl relative overflow-hidden flex flex-col">
      {/* Phone Notch/Speaker */}
      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 h-[18px] w-24 rounded-full bg-zinc-900 z-30 flex items-center justify-center">
        <div className="h-1.5 w-8 bg-zinc-800 rounded-full" />
      </div>

      {/* Inner Device Screen */}
      <div
        className={`flex-1 min-h-0 rounded-[1.8rem] p-3 pt-6 flex flex-col items-center relative overflow-y-auto overflow-x-hidden phone-scrollbar theme-preview-${selectedTheme} transition-all duration-300`}
        style={{ background: 'var(--phone-bg)', color: 'var(--phone-text)' }}
      >
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
            {socials.map((s) => {
              if (!s.value || s.value.trim() === '') return null
              
              let href = ''
              let icon = null
              
              if (s.platform === 'github') {
                href = `https://github.com/${s.value}`
                icon = <GithubIcon className="w-3 h-3" />
              } else if (s.platform === 'linkedin') {
                href = `https://linkedin.com/in/${s.value}`
                icon = <LinkedinIcon className="w-3 h-3" />
              } else if (s.platform === 'facebook') {
                href = `https://facebook.com/${s.value}`
                icon = <FacebookIcon className="w-3 h-3" />
              } else if (s.platform === 'instagram') {
                href = `https://instagram.com/${s.value}`
                icon = <InstagramIcon className="w-3 h-3" />
              }
              
              if (!icon) return null

              return (
                <a
                  key={s.platform}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--phone-text)' }}
                  className="opacity-80 hover:opacity-100 hover:scale-110 transition-transform"
                >
                  {icon}
                </a>
              )
            })}
          </div>
        </div>

        {/* Active custom link list buttons inside mockup */}
        <div className="w-full space-y-2.5 flex-1">
          {activeLinks.map((item) => (
            <ElementRenderer key={item.id} element={item} />
          ))}
          {activeLinks.length === 0 && (
            <div className="py-6 text-center text-[9px] opacity-40 font-semibold italic">
              No elements to display
            </div>
          )}
        </div>
        
        {/* Phone Footer brand logo */}
        <div className="mt-4 pt-2 border-t border-white/5 w-full flex justify-center opacity-60">
          <span className="text-[8px] font-bold tracking-wider font-display">VibeLink</span>
        </div>
      </div>
    </div>
  )
}
