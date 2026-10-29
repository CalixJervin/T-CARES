import { Link } from "react-router-dom"
import { useTheme } from "@/components/theme-provider"
import { ArrowLeft, Building2, Moon, Sun } from "lucide-react"

export function StaffNavbar() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link
            to="/staff"
            className="group flex items-center gap-2 font-semibold tracking-tight text-foreground"
          >
            <div className="flex size-7 items-center justify-center rounded-lg bg-amber-600 font-bold text-white shadow-xs">
              <Building2 className="size-4" />
            </div>
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1.5 text-sm font-bold">
                CityAction
                
              </div>
              <span className="hidden text-[10px] text-muted-foreground sm:inline">
                Tuguegarao City LGU Operations
              </span>
            </div>
          </Link>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Switch to Citizen Portal */}
          <Link
            to="/user/report"
            className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <ArrowLeft className="size-3.5 text-primary" />
            <span className="hidden sm:inline">Citizen Portal</span>
            <span className="sm:hidden">Citizen View</span>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="flex size-7 cursor-pointer items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {theme === "dark" ? (
              <Sun className="size-3.5" />
            ) : (
              <Moon className="size-3.5" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
