import { createFileRoute } from '@tanstack/react-router'
import { GalleryVerticalEnd } from "lucide-react"

import { SignupForm } from "@/components/signup-form"
import "../styles/auth-page.css"

export const Route = createFileRoute('/signup')({
  component: SignupPage,
})

function SignupPage() {
  return (
    <div className="auth-shell flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="auth-shell__content flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-lg shadow-black/10">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
        <SignupForm />
      </div>
    </div>
  )
}
