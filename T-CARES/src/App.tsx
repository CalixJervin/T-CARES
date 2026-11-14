import { useEffect } from "react"
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom"
import { ToastContainer } from "@/components/common/ToastContainer"
import { OfflineBanner } from "@/components/layout/OfflineBanner"
import { StaffLayout } from "@/components/layout/StaffLayout"
import { UserLayout } from "@/components/layout/UserLayout"
import { AppProvider } from "@/context/AppContext"
import { CityStaffPage } from "@/pages/CityStaffPage"
import { MyReportsPage } from "@/pages/MyReportsPage"
import { PublicTicketPage } from "@/pages/PublicTicketPage"
import { ReportPage } from "@/pages/ReportPage"
import { TransparencyPage } from "@/pages/TransparencyPage"

function LegacyTicketRedirect() {
  const { id } = useParams<{ id: string }>()
  return <Navigate to={`/user/t/${id}`} replace />
}

function PortalKeyboardSwitcher() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is focused inside an input, textarea, select, or contenteditable element
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return
      }

      if (e.key === "q" || e.key === "Q") {
        if (e.ctrlKey || e.altKey || e.metaKey) return
        e.preventDefault()

        const isStaff =
          location.pathname.startsWith("/staff") ||
          location.pathname.startsWith("/city")

        if (isStaff) {
          navigate("/user/report")
        } else {
          navigate("/staff")
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [navigate, location.pathname])

  return null
}

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
          <PortalKeyboardSwitcher />
          <OfflineBanner />
          <Routes>
            {/* User Routes (Available for Citizens/Users Only) */}
            <Route path="/user" element={<UserLayout />}>
              <Route index element={<Navigate to="/user/report" replace />} />
              <Route path="report" element={<ReportPage />} />
              <Route
                path="report-issue"
                element={<Navigate to="/user/report" replace />}
              />
              <Route path="my" element={<MyReportsPage />} />
              <Route
                path="my-reports"
                element={<Navigate to="/user/my" replace />}
              />
              <Route path="transparency" element={<TransparencyPage />} />
              <Route path="t/:id" element={<PublicTicketPage />} />
            </Route>

            {/* City Staff Route (Dedicated Staff Command Center) */}
            <Route path="/staff" element={<StaffLayout />}>
              <Route index element={<CityStaffPage />} />
            </Route>

            {/* Root & Backward-Compatible Redirects */}
            <Route path="/" element={<Navigate to="/user/report" replace />} />
            <Route path="/my" element={<Navigate to="/user/my" replace />} />
            <Route
              path="/transparency"
              element={<Navigate to="/user/transparency" replace />}
            />
            <Route path="/city" element={<Navigate to="/staff" replace />} />
            <Route
              path="/city-staff"
              element={<Navigate to="/staff" replace />}
            />
            <Route
              path="/citizen"
              element={<Navigate to="/user/report" replace />}
            />
            <Route path="/t/:id" element={<LegacyTicketRedirect />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/user/report" replace />} />
          </Routes>
          <ToastContainer />
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
