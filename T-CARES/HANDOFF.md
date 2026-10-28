# CityAction (T-CARES) - Project Handoff & Hackathon Demo Guide

See [../HANDOFF.md](../HANDOFF.md) for full context, pitch breakdown, and architecture documentation.

---

## Quick Start Commands

```bash
# Start Vite development server
npm run dev

# Run TypeScript typecheck (0 errors)
npm run typecheck

# Run ESLint (0 errors, 0 warnings)
npm run lint

# Format code with Prettier
npm run format

# Production build + PWA service worker generation
npm run build

# Preview production build locally
npm run preview
```

## Routes
- `/` - Citizen Report intake (Photo, Category chips, Leaflet GPS pin, Duplicate Sheet check)
- `/my` - Citizen My Reports (Timeline, follower update badges, offline pending sync chips)
- `/t/:id` - Public Ticket Record (Status timeline, days open, report count, zero PII)
- `/city` - LGU Staff Command Center (KPIs, Hotspot Leaflet map, Category & Barangay charts, Master ticket register & detail drawer)
- `/transparency` - Public Transparency & Planning Dashboard (Turnaround metrics, ranked barangay allocation view)

## 3-5 Minute Demo Script Outline
1. **Intake (`/`)**: Report a streetlight at default pin (Centro 1) -> Duplicate sheet detects T-0001 -> Click "Same issue, follow it" -> count becomes 6.
2. **Staff (`/city`)**: Open T-0001 (overdue 12 days) -> Assign dept "General Services", status "Assigned", note "Dispatched repair crew" -> Update.
3. **Citizen (`/my`)**: Receive update toast & "Updated" badge on T-0001 card -> Click to expand timeline.
4. **Public (`/transparency`)**: Review updated aggregate metrics & ranked barangay complaints.
5. **Offline Test**: Toggle DevTools offline -> Submit -> see "Pending sync" -> Toggle online -> see auto-sync.
6. **Reset**: Click "Reset demo data" in top navigation to reset to seed state at any time.
