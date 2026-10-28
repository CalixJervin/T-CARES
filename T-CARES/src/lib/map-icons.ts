import L from "leaflet"
import { STATUS_META } from "./constants"
import type { Status } from "./types"

export function createLocationPinIcon() {
  return L.divIcon({
    className: "custom-map-pin",
    html: `
      <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background-color: rgba(37, 99, 235, 0.25); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 22px; height: 22px; border-radius: 50%; background-color: #2563eb; border: 2.5px solid white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3); display: flex; align-items: center; justify-content: center;">
          <div style="width: 6px; height: 6px; border-radius: 50%; background-color: white;"></div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

export function createTicketMarkerIcon(status: Status, reportCount: number) {
  const meta = STATUS_META[status] || STATUS_META.received
  const baseSize = 26
  // Sized by report count: 1 report is 26px, 5 reports is 34px, max 40px
  const size = Math.min(42, baseSize + Math.min(reportCount - 1, 6) * 3)

  return L.divIcon({
    className: "ticket-marker-pin",
    html: `
      <div style="
        position: relative;
        width: ${size}px;
        height: ${size}px;
        background-color: ${meta.markerColor};
        border-radius: 50%;
        border: 2.5px solid #ffffff;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-weight: 700;
        font-size: ${size > 30 ? "13px" : "11px"};
        font-family: system-ui, sans-serif;
      ">
        ${reportCount}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })
}
