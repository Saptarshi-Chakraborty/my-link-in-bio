import { Sparkles } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export const avatarPresets = [
  { id: 'neon', name: 'Neon Tokyo', css: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500' },
  { id: 'warm', name: 'Warm Clay', css: 'bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500' },
  { id: 'vivid', name: 'Vivid Pink', css: 'bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600' },
  { id: 'minimalist', name: 'Minimalist Zinc', css: 'bg-zinc-800' },
]

interface ProfileDetailsCardProps {
  profileName: string
  setProfileName: (val: string) => void
  profileBio: string
  setProfileBio: (val: string) => void
  profileAvatar: string
  setProfileAvatar: (val: string) => void
  activeAvatarCss: string
}

export function ProfileDetailsCard({
  profileName,
  setProfileName,
  profileBio,
  setProfileBio,
  profileAvatar,
  setProfileAvatar,
  activeAvatarCss
}: ProfileDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Details</CardTitle>
        <CardDescription>Customize your link-in-bio page identity</CardDescription>
        <CardAction>
          <div className="glow-badge">
            <Sparkles size={12} />
            Live Sync
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className={`h-20 w-20 rounded-full flex items-center justify-center text-white text-3xl font-bold ${activeAvatarCss} shadow-md border-2 border-white`}>
              {profileName.charAt(0)}
            </div>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Avatar Preview</span>
          </div>

          <div className="flex-1 w-full flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="profile-title" className="text-xs font-semibold text-zinc-700">Profile Title</Label>
              <Input
                id="profile-title"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Display Name"
                className="bg-zinc-50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profile-bio" className="text-xs font-semibold text-zinc-700">Bio Description</Label>
              <Textarea
                id="profile-bio"
                value={profileBio}
                onChange={(e) => setProfileBio(e.target.value)}
                placeholder="Short bio details..."
                rows={2}
                className="bg-zinc-50 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-xs font-semibold text-zinc-700">Choose Avatar Design</Label>
          <div className="flex flex-wrap gap-2">
            {avatarPresets.map((preset) => (
              <Button
                key={preset.id}
                variant={profileAvatar === preset.id ? "default" : "outline"}
                size="sm"
                onClick={() => setProfileAvatar(preset.id)}
                className={`h-9 px-3 text-xs gap-2 font-medium transition-all ${
                  profileAvatar === preset.id ? "bg-[var(--brand)] text-white hover:bg-[var(--brand)]" : ""
                }`}
              >
                <div className={`h-3 w-3 rounded-full ${preset.css}`} />
                {preset.name}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
