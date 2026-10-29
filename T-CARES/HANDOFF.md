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

### Citizen / User Routes (Users Only)
- `/user/report` (or `/user`) - Citizen Report intake (Photo, Category chips, Leaflet GPS pin, Duplicate Sheet check)
- `/user/my` - Citizen My Reports (Timeline, follower update badges, offline pending sync chips)
- `/user/transparency` - Public Transparency & Planning Dashboard (Turnaround metrics, ranked barangay allocation view)
- `/user/t/:id` - Public Ticket Record (Status timeline, days open, report count, zero PII)

### City Staff Route (Authorized Personnel Only)
- `/staff` - LGU Staff Command Center & Dashboard (KPIs, Hotspot Leaflet map, Category & Barangay charts, Master ticket register & detail drawer, Department dispatch)

### Backward-Compatible Redirects
- `/` -> `/user/report`
- `/my` -> `/user/my`
- `/transparency` -> `/user/transparency`
- `/city` -> `/staff`
- `/city-staff` -> `/staff`
- `/t/:id` -> `/user/t/:id`

## 3-5 Minute Demo Script Outline
1. **Intake (`/user/report`)**: Report a streetlight at default pin (Centro 1) -> Duplicate sheet detects T-0001 -> Click "Same issue, follow it" -> count becomes 6.
2. **Staff (`/staff`)**: Switch to City Staff portal via top header button -> Authenticate as staff (e.g. General Services) -> Open T-0001 (overdue 12 days) -> Assign dept "General Services", status "Assigned", note "Dispatched repair crew" -> Update.
3. **Citizen (`/user/my`)**: Return to Citizen portal -> Receive update toast & "Updated" badge on T-0001 card -> Click to expand timeline.
4. **Public (`/user/transparency`)**: Review updated aggregate metrics & ranked barangay complaints.
5. **Offline Test**: Toggle DevTools offline -> Submit -> see "Pending sync" -> Toggle online -> see auto-sync.
