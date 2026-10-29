import { Link, NavLink } from "react-router-dom"
import { useTheme } from "@/components/theme-provider"
import { useApp } from "@/context/AppContext"
import {
  BarChart3,
  Building2,
  FileText,
  Moon,
  PlusCircle,
  Sun,
} from "lucide-react"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const { unreadNotificationsCount, queuedCount } = useApp()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link
            to="/user/report"
            className="group flex items-center gap-2 font-semibold tracking-tight text-foreground"
          >
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground shadow-xs">
              CA
            </div>
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1.5 text-sm font-bold">
                CityAction
              </div>
              <span className="hidden text-[10px] text-muted-foreground sm:inline">
                Citizen Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Switcher (Users Only) */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* Citizen: Report */}
          <NavLink
            to="/user/report"
            end
            className={({ isActive }) =>
              `flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors sm:px-4.5 ${
                isActive
                  ? "bg-primary font-semibold text-primary-foreground shadow-xs"
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
            to="/user/my"
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

          {/* Citizen: Transparency */}
          <NavLink
            to="/user/transparency"
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

        {/* Action Controls: Staff Portal Switcher + Demo Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Separate City Staff Route Switcher */}
          <Link
            to="/staff"
            title="Switch to City Staff Portal"
            className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/70 px-2.5 py-1 text-xs font-semibold text-foreground transition-colors hover:bg-muted hover:text-primary"
          >
            <Building2 className="size-3.5 text-primary" />
            <span className="hidden sm:inline">City Staff</span>
            <span className="sm:hidden">Staff</span>
          </Link>

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
