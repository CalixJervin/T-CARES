import { Link } from "react-router-dom"
import { useTheme } from "@/components/theme-provider"
import { useApp } from "@/context/AppContext"
import { ArrowLeft, Building2, LogOut, Moon, Sun } from "lucide-react"

export function StaffNavbar() {
  const { theme, setTheme } = useTheme()
  const { isStaffAuthenticated, staffDepartment, logoutStaff } = useApp()

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
                <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                  Staff Command Center
                </span>
              </div>
              <span className="hidden text-[10px] text-muted-foreground sm:inline">
                Tuguegarao City LGU Operations
              </span>
            </div>
          </Link>
        </div>

        {/* Staff Session Indicator (if logged in) */}
        {isStaffAuthenticated && (
          <div className="hidden items-center gap-2 md:flex">
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
              <span>
                Department:{" "}
                <strong className="font-semibold">{staffDepartment}</strong>
              </span>
            </span>
          </div>
        )}

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

          {/* Logout if authenticated */}
          {isStaffAuthenticated && (
            <button
              onClick={logoutStaff}
              title="Sign out of Staff Portal"
              className="flex cursor-pointer items-center gap-1 rounded-lg border border-destructive/30 bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20"
            >
              <LogOut className="size-3.2" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
