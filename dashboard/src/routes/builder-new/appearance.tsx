import { createFileRoute } from '@tanstack/react-router'

import { DesignCustomizerCard } from '@/components/builder/design-customizer-card'

export const Route = createFileRoute('/builder-new/appearance')({
  component: AppearanceView,
})

function AppearanceView() {
  return (
    <>
      <DesignCustomizerCard />
    </>
  )
}
