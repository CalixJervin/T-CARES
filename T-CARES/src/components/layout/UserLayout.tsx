import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"

export function UserLayout() {
  return (
    <>
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
    </>
  )
}
