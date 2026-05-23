import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export interface PasswordInputProps
  extends Omit<React.ComponentProps<"input">, "type"> {}

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false)

  const toggle = React.useCallback(() => {
    setVisible((prev) => !prev)
  }, [])

  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className={cn("pr-10", className)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-e-md"
      >
        {visible ? (
          <EyeOff className="size-4 shrink-0" aria-hidden="true" />
        ) : (
          <Eye className="size-4 shrink-0" aria-hidden="true" />
        )}
      </button>
    </div>
  )
}
