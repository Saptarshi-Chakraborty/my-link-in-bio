import { createFileRoute } from '@tanstack/react-router'

import { ProfileHeaderCard } from '@/components/builder/profile-header-card'
import { CustomLinksCard } from '@/components/builder/custom-links-card'

export const Route = createFileRoute('/builder-new/')({
  component: LinksView,
})

function LinksView() {
  return (
    <>
      {/* Card 1: Profile Header & Socials (Read-only + Slide Edit) */}
      <ProfileHeaderCard />

      {/* Card 2: Manage Links */}
      <CustomLinksCard />
    </>
  )
}
