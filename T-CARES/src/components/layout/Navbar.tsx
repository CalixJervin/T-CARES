import { Link, NavLink } from "react-router-dom"
import { useTheme } from "@/components/theme-provider"
import { useApp } from "@/context/AppContext"
import {
  BarChart3,
  Building2,
  FileText,
  Moon,
  PlusCircle,
  RotateCcw,
  Sun,
} from "lucide-react"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const { resetDemo, unreadNotificationsCount, queuedCount } = useApp()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="group flex items-center gap-2 font-semibold tracking-tight text-foreground"
          >
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground shadow-xs">
              CA
            </div>
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1.5 text-sm font-bold">
                CityAction
                <span className="rounded bg-primary/10 px-1 py-0.5 text-[10px] font-medium text-primary">
                  Tuguegarao
                </span>
              </div>
              <span className="hidden text-[10px] text-muted-foreground sm:inline">
                Complaints & Action Tracker
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Switcher */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* Citizen: Report */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`
            }
          >
            <PlusCircle className="size-3.5" />
            <span className="hidden sm:inline">Report Issue</span>
            <span className="sm:hidden">Report</span>
          </NavLink>

          {/* Citizen: My Reports */}
          <NavLink
            to="/my"
            className={({ isActive }) =>
              `relative flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`
            }
          >
            <FileText className="size-3.5" />
            <span className="hidden sm:inline">My Reports</span>
            <span className="sm:hidden">My</span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white shadow-xs">
                {unreadNotificationsCount}
              </span>
            )}
            {queuedCount > 0 && unreadNotificationsCount === 0 && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-amber-500" />
            )}
          </NavLink>

          <div className="mx-1 h-4 w-px bg-border" />

          {/* City Staff */}
          <NavLink
            to="/city"
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`
            }
          >
            <Building2 className="size-3.5" />
            <span className="hidden md:inline">City Staff</span>
            <span className="md:hidden">Staff</span>
          </NavLink>

          {/* Transparency */}
          <NavLink
            to="/transparency"
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`
            }
          >
            <BarChart3 className="size-3.5" />
            <span className="hidden sm:inline">Transparency</span>
            <span className="sm:hidden">Public</span>
          </NavLink>
        </nav>

        {/* Demo Controls: Reset + Theme */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={resetDemo}
            title="Reset demo data to original 8 tickets"
            className="flex cursor-pointer items-center gap-1 rounded-lg border border-border bg-background px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <RotateCcw className="size-3.2" />
            <span className="hidden lg:inline">Reset demo data</span>
          </button>

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
