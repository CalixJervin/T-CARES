# CityAction (T-CARES) - Project Handoff & Hackathon Demo Guide

> **Civic Complaint Tracker & Transparency Platform for Tuguegarao City**  
> *"The app does not fix streetlights. It makes every complaint visible and measurable so the city can respond faster and plan budgets with real data."*

---

## 1. Executive Summary & Pitch

In Tuguegarao City, civic complaints are traditionally submitted through uncoordinated Google Forms or social media comments. Citizens have no tracking numbers, locations are free-text strings, and city personnel spend hours manually sorting duplicates while identical potholes or broken streetlights get multiple dispatch crews.

**CityAction** solves this by:
1. **Intake with Precision**: Citizen uploads an auto-compressed photo (&lt;100 KB) and places a pinpoint GPS marker on OpenStreetMap.
2. **Duplicate Detection & Follow**: If a report is within 50 meters of an active ticket in the same category, CityAction suggests: *"Looks like this is already reported — Same issue, follow it"*. This consolidates complaints into **one master ticket** with incremented priority (`reportCount`).
3. **Staff Resolution Command**: City engineers manage single master tickets, assign responsible departments (City Engineering, General Services, CDRRMO, City Health, Traffic Management), and post status notes.
4. **Instant Follower Notifications**: Every citizen who reported or followed that master ticket automatically receives simulated alert toasts and an "Updated" badge on their timeline.
5. **Radical Public Transparency**: Real-time aggregate dashboards without PII reveal city turnaround speed and rank barangays by complaint density for fiscal budget allocation.
6. **100% Offline Resilience**: PWA shell caching and an offline report queue allow citizens to file reports even without network connectivity; tickets auto-sync upon reconnection.

---

## 2. Tech Stack & Architecture

- **Core**: React 19, TypeScript, Vite 8
- **Styling**: Tailwind CSS v4, shadcn (`base-nova`, `base-ui`), `tw-animate-css`, Inter Variable font
- **Icons**: `lucide-react`
- **Mapping**: `leaflet` + `react-leaflet` with custom status-colored SVG marker pins sized by complaint density
- **Charts**: `recharts` wrapped via shadcn `ChartContainer`
- **PWA**: `vite-plugin-pwa` with service worker app-shell caching
- **Storage Layer**: 100% front-end persistence in `localStorage` wrapped in `try/catch`, with cross-tab and reactive in-memory event dispatching (`ca_data_changed`).
- **No external runtime assets**: No external fonts or third-party images (OpenStreetMap tile server is the only remote runtime network source; all report photos use local data URLs or self-contained SVG gradients).

---

## 3. Repository Structure

```
T-CARES/
├── T-CARES/                     # Vite + React project directory
│   ├── public/                  # Manifest and static PWA assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── citizen/
│   │   │   │   ├── DuplicateSheet.tsx      # Suggests following existing nearby ticket
│   │   │   │   └── LocationPickerMap.tsx   # Draggable leaflet pin & GPS detector
│   │   │   ├── city/
│   │   │   │   ├── BarangayChart.tsx       # Open vs Resolved stacked bar chart
│   │   │   │   ├── CategoryChart.tsx       # Tickets by category chart
│   │   │   │   ├── HotspotMap.tsx          # Leaflet map with density-scaled pins
│   │   │   │   └── TicketDetailDrawer.tsx  # Master ticket drawer, dept & status assign
│   │   │   ├── common/
│   │   │   │   ├── CategoryBadge.tsx       # Tagalog + English badges
│   │   │   │   ├── StatusBadge.tsx         # Received/Assigned/In Progress/Resolved
│   │   │   │   └── ToastContainer.tsx      # Follower update alerts & sync feedback
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx              # Role switcher, Demo Reset, Theme toggle
│   │   │   │   └── OfflineBanner.tsx       # Offline status & sync counter
│   │   │   ├── ui/                         # shadcn button, card, chart components
│   │   │   └── theme-provider.tsx          # Dark/light mode provider
│   │   ├── context/
│   │   │   └── AppContext.tsx              # Online/offline, notifications, ticket state
│   │   ├── lib/
│   │   │   ├── constants.ts                # Tuguegarao barangays, depts, map coords
│   │   │   ├── image.ts                    # Canvas downscaling (max 800px, 0.7 JPEG)
│   │   │   ├── map-icons.ts                # DivIcon pin generators (density sized)
│   │   │   ├── seed.ts                     # Exactly 8 relative-dated seed tickets
│   │   │   ├── storage.ts                  # LocalStorage CRUD, Haversine 50m check
│   │   │   └── types.ts                    # Category, Status, Report, Ticket models
│   │   ├── pages/
│   │   │   ├── CityStaffPage.tsx           # /city LGU dashboard & ticket register
│   │   │   ├── MyReportsPage.tsx           # /my Citizen followed tickets & timeline
│   │   │   ├── PublicTicketPage.tsx        # /t/:id Public audit record (No PII)
│   │   │   ├── ReportPage.tsx              # / Citizen photo & GPS intake flow
│   │   │   └── TransparencyPage.tsx        # /transparency Public aggregate KPIs
│   │   ├── App.tsx                         # Router and root layout
│   │   ├── index.css                       # Tailwind 4 & Leaflet CSS
│   │   └── main.tsx                        # Entrypoint
│   ├── package.json
│   └── vite.config.ts                      # Vite + PWA configuration
└── HANDOFF.md                               # This handoff documentation
```

---

## 4. Seed Data Reference

All 8 tickets are dynamically dated relative to today and labeled **"Sample data"**:

| Ticket ID | Category | Barangay | Reports | Status | Days Open | Notes / Location |
| :--- | :--- | :--- | :---: | :--- | :---: | :--- |
| **T-0001** | `streetlights_facilities` | Centro 1 | **5** | Received | **12d (Overdue)** | Near Tuguegarao West Central School. **Duplicate target** (Lat: 17.6131, Lng: 121.7270). |
| **T-0002** | `drainage_flooding` | Carig | 3 | In Progress | 6d | Dept: City Engineering. Regional Government Center junction. |
| **T-0003** | `roads_sidewalks` | Centro 2 | 2 | Received | 3d | "Vendor stalls blocking sidewalk", Bonifacio St. |
| **T-0004** | `sanitation` | Ugac Norte | 1 | Assigned | 4d | Dept: General Services. Uncollected garbage near barangay hall. |
| **T-0005** | `streetlights_facilities` | Atulayan Norte | 1 | Resolved | 9d (res 4d ago) | Dept: General Services. New LED bulb fixture installed. |
| **T-0006** | `roads_sidewalks` | Caritan Norte | 2 | Resolved | 15d (res 10d ago) | Dept: City Engineering. Pothole filled and sealed on highway. |
| **T-0007** | `drainage_flooding` | Centro 1 | 1 | Received | 1d | "Clogged canal". ~190m from T-0001 (proves category matching). |
| **T-0008** | `public_safety` | Ugac Sur | 1 | In Progress | 8d | Dept: Traffic Management. Damaged traffic sign approaching diversion road. |

---

## 5. Hackathon Video Demo Script (3 to 5 Minutes)

This exact demo sequence hits every rubric requirement cleanly:

### Part 1: The Problem & Citizen Intake (`/`) — [0:00 - 1:15]
1. Open the app at `/`. Mention: *"Tuguegarao citizens currently use a static Google Form with zero tracking and manual duplicate merging."*
2. Demonstrate the mobile-first intake:
   - Click/tap **1. Photo**: Select or take an image (explain that client-side canvas compresses it under 100 KB for low-bandwidth networks).
   - Category is set to **"Ilaw at Pasilidad / Streetlights & Facilities"**.
   - Location is centered at Centro 1 (`17.6131, 121.7270`). Drag the pin slightly or leave at default.
   - Barangay is **Centro 1**.
   - Enter contact details: `09171234567` (Mobile Phone) and check the consent box.
   - Click **Submit Complaint**.

### Part 2: Smart Duplicate Detection & One Master Ticket — [1:15 - 2:00]
3. The bottom sheet triggers: **"Looks like this is already reported"**.
   - Point out that CityAction performed a 50-meter Haversine search against active tickets in the same category.
   - Highlight that **T-0001** already has **5 reports** and is **12 days overdue**.
   - Explain the design decision: *"We suggest rather than auto-merge, giving citizens agency."*
4. Click **"Same issue, follow it (+1 report)"**.
5. The Success Screen confirms:
   - Added to master ticket **T-0001**.
   - Total complaints bundled: **6**.
   - Links to "View in My Reports" and "View Public Ticket Page".

### Part 3: City Staff Dashboard (`/city`) — [2:00 - 3:00]
6. Use the top navigation to switch to **City Staff** (`/city`).
7. Point out the command center features:
   - **KPI Row**: Total tickets, open tickets, resolution rate %, average turnaround days, and **overdue tickets (>7 days) highlighted in red**.
   - **Hotspot Map**: Notice marker pin sizes. Point to T-0001 in Centro 1 — it has the largest pin because 6 citizens reported it.
   - **Charts**: Complaints by category and open vs. resolved workload across barangays.
   - **Master Ticket Register**: Click the "Reports" column header to sort; T-0001 sits right at the top with 6 merged reports.
8. Click on **T-0001** to open the **Ticket Detail Drawer**:
   - Inspect the **Merged Citizen Reports** list showing descriptions, photos, and timestamps.
   - Assign Department: select **"General Services"** (or City Engineering).
   - Change Status to **"Assigned"**.
   - Enter note: *"Dispatched electrical maintenance crew with replacement LED fixture."*
   - Click **Update Master Ticket & Notify Followers**.

### Part 4: Citizen Follower Alert (`/my`) — [3:00 - 3:45]
9. Switch back to **Citizen > My Reports** (`/my`).
10. Notice the immediate feedback:
    - A toast alert pops up: *"Ticket T-0001 Updated: Status changed to Assigned"*.
    - The T-0001 card displays an active green **"Updated"** badge.
    - Click the card: The status timeline expands showing the complete chronological audit trail, the department assignment, and the staff's dispatch note.
11. Click **"Public link"** to open `/t/T-0001`:
    - Point out that the public view shows audit progress and days open, but **strictly scrubs all citizen names and phone numbers** for privacy.

### Part 5: Public Transparency & Planning (`/transparency`) — [3:45 - 4:30]
12. Click **Transparency** (`/transparency`) in the top navigation.
13. Highlight the pitch angle:
    - *"The city doesn't just fix problems; it plans with data."*
    - **Headline Numbers**: Total citizen inputs received vs master tickets resolved.
    - **Turnaround Speed**: Average days to resolve broken down by category.
    - **Resource Allocation Hotspot View**: Ranked list of barangays by open complaints, showing where public works funds and maintenance trucks should be deployed next month.

### Bonus / Edge Case: Offline Support & Reset Demo — [4:30 - 5:00]
14. Open DevTools > Network tab > set to **Offline** (or disconnect Wi-Fi):
    - A slim amber banner appears: *"You are currently offline"*.
    - Go to `/` and file a quick report.
    - Click Submit: report is saved to device with **"Pending sync"** chip.
    - Toggle Network back to **Online**:
    - The queue instantly processes, runs duplicate detection, syncs to localStorage, and displays: *"Synced 1 pending report(s) automatically"*.
15. Click **"Reset demo data"** in the top navigation at any time to return the prototype to its original 8-ticket demo state.

---

## 6. How to Run & Verify

From the project root:

```bash
# Navigate to the project directory
cd T-CARES

# Install dependencies (already installed)
npm install

# Start local Vite development server
npm run dev

# Run TypeScript typecheck
npm run typecheck

# Run ESLint check
npm run lint

# Format code with Prettier
npm run format

# Build production bundle with PWA service worker
npm run build

# Preview production build locally
npm run preview
```

---

## 7. Compliance Checklist

- [x] **Front-end only**: Zero backend servers, auth, or remote databases.
- [x] **Strict Dependencies**: Only `react-router-dom`, `leaflet`, `react-leaflet`, `recharts`, and `vite-plugin-pwa`.
- [x] **Client-Side Storage**: All state in `localStorage` wrapped in `try/catch` with a prominent "Reset demo data" button.
- [x] **Offline Support**: PWA service worker precaching + offline queue with auto-sync on reconnect.
- [x] **Duplicate Detection**: 50m Haversine distance + category match + unresolved status check with bottom sheet suggestion.
- [x] **Staff Master Ticket Drawer**: Department selector, status updater, resolution notes, and simulated follower notifications.
- [x] **Public Transparency**: Aggregate statistics with zero PII exposure.
- [x] **Tuguegarao Localization**: 10 real barangays, 5 real departments, centered at `17.6131, 121.7270`.
- [x] **Code Quality**: 0 errors on `typecheck`, 0 errors and 0 warnings on `lint`.
