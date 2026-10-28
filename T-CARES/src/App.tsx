import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { ToastContainer } from "@/components/common/ToastContainer"
import { Navbar } from "@/components/layout/Navbar"
import { OfflineBanner } from "@/components/layout/OfflineBanner"
import { AppProvider } from "@/context/AppContext"
import { CityStaffPage } from "@/pages/CityStaffPage"
import { MyReportsPage } from "@/pages/MyReportsPage"
import { PublicTicketPage } from "@/pages/PublicTicketPage"
import { ReportPage } from "@/pages/ReportPage"
import { TransparencyPage } from "@/pages/TransparencyPage"

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
          <OfflineBanner />
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<ReportPage />} />
              <Route path="/my" element={<MyReportsPage />} />
              <Route path="/t/:id" element={<PublicTicketPage />} />
              <Route path="/city" element={<CityStaffPage />} />
              <Route path="/transparency" element={<TransparencyPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <ToastContainer />
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
