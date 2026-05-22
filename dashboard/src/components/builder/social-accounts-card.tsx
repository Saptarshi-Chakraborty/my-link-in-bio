import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { SocialInputField } from './social-input-field'
import { GithubIcon, LinkedinIcon, FacebookIcon, InstagramIcon } from './icons'
import type { SocialsState, SocialsActiveState } from './types'

interface SocialAccountsCardProps {
  socials: SocialsState
  socialsActive: SocialsActiveState
  handleUpdateSocial: (platform: keyof SocialsState, value: string) => void
  handleToggleSocial: (platform: keyof SocialsActiveState) => void
}

export function SocialAccountsCard({
  socials,
  socialsActive,
  handleUpdateSocial,
  handleToggleSocial
}: SocialAccountsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Accounts</CardTitle>
        <CardDescription>Add buttons that link to your social media profiles</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <SocialInputField
          label="GitHub"
          icon={<GithubIcon className="w-4 h-4" />}
          value={socials.github}
          active={socialsActive.github}
          onChange={(val) => handleUpdateSocial('github', val)}
          onToggle={() => handleToggleSocial('github')}
        />
        <SocialInputField
          label="LinkedIn"
          icon={<LinkedinIcon className="w-4 h-4" />}
          value={socials.linkedin}
          active={socialsActive.linkedin}
          onChange={(val) => handleUpdateSocial('linkedin', val)}
          onToggle={() => handleToggleSocial('linkedin')}
        />
        <SocialInputField
          label="Facebook"
          icon={<FacebookIcon className="w-4 h-4" />}
          value={socials.facebook}
          active={socialsActive.facebook}
          onChange={(val) => handleUpdateSocial('facebook', val)}
          onToggle={() => handleToggleSocial('facebook')}
        />
        <SocialInputField
          label="Instagram"
          icon={<InstagramIcon className="w-4 h-4" />}
          value={socials.instagram}
          active={socialsActive.instagram}
          onChange={(val) => handleUpdateSocial('instagram', val)}
          onToggle={() => handleToggleSocial('instagram')}
        />
      </CardContent>
    </Card>
  )
}
