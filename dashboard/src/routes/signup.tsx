import { createFileRoute } from '@tanstack/react-router'
import { SignupForm } from '@/components/signup-form'
import { Link2 } from 'lucide-react'

export const Route = createFileRoute('/signup')({
  component: SignupPage,
})

function SignupPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center bg-zinc-50 px-4 py-12">
      {/* Decorative Premium Mesh Gradients */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 blur-3xl" />
        <div className="absolute -right-20 -bottom-20 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-rose-500/10 to-orange-500/10 blur-3xl" />
        <div className="absolute left-1/3 top-1/4 h-[300px] w-[300px] rounded-full bg-sky-500/5 blur-3xl" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-[400px] flex flex-col gap-6">
        {/* Logo and Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 transition-transform duration-300 hover:scale-105">
            <Link2 className="size-6 rotate-45" />
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <span className="font-display text-2xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 via-indigo-950 to-purple-950 bg-clip-text text-transparent">
              VibeLink
            </span>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
              Admin Dashboard
            </span>
          </div>
        </div>

        {/* SignupForm Card with Premium styling wrapper */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-zinc-200/50 shadow-xl shadow-zinc-200/40 transition-all duration-300 hover:shadow-2xl hover:shadow-zinc-200/60">
          <SignupForm className="p-1" />
        </div>
      </div>
    </div>
  )
}
