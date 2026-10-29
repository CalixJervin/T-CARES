import { Outlet } from "react-router-dom"
import { StaffNavbar } from "./StaffNavbar"

export function StaffLayout() {
  return (
    <>
      <StaffNavbar />
      <div className="flex-1">
        <Outlet />
      </div>
    </>
  )
}
