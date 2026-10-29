import React, { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { StatusBadge } from "@/components/common/StatusBadge"
import { DuplicateSheet } from "@/components/citizen/DuplicateSheet"
import { LocationPickerMap } from "@/components/citizen/LocationPickerMap"
import { Button } from "@/components/ui/button"
import { useApp } from "@/context/AppContext"
import {
  BARANGAYS,
  CATEGORIES,
  DEFAULT_MAP_CENTER,
  EMERGENCY_NUMBER,
} from "@/lib/constants"
import { downscaleImage } from "@/lib/image"
import { createSvgPlaceholder } from "@/lib/seed"
import {
  addReportToTicket,
  createNewTicket,
  enqueueReport,
  findDuplicateTicket,
} from "@/lib/storage"
import type { Category, Ticket } from "@/lib/types"
import {
  AlertCircle,
  Camera,
  Check,
  CheckCircle2,
  ExternalLink,
  FileText,
  Info,
  LocateFixed,
  MapPin,
  MessageSquare,
  Phone,
  PlusCircle,
  Trash2,
  Upload,
} from "lucide-react"

export function ReportPage() {
  const { isOnline, reporterId, addToast, refreshData } = useApp()

  // Form State
  const [photo, setPhoto] = useState<string | undefined>(undefined)
  const [category, setCategory] = useState<Category | null>(null)
  const [categoryError, setCategoryError] = useState(false)
  const [barangay, setBarangay] = useState<string>("Centro 1")
  const [lat, setLat] = useState<number>(DEFAULT_MAP_CENTER.lat)
  const [lng, setLng] = useState<number>(DEFAULT_MAP_CENTER.lng)
  const [landmark, setLandmark] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [contactType, setContactType] = useState<"phone" | "messenger">("phone")
  const [contact, setContact] = useState<string>("")
  const [consent, setConsent] = useState<boolean>(true)

  // Duplicate Check & Success State
  const [duplicateCandidate, setDuplicateCandidate] = useState<{
    ticket: Ticket
    distance: number
  } | null>(null)
  const [submittedTicket, setSubmittedTicket] = useState<{
    ticket: Ticket
    isDuplicateFollow: boolean
    isOffline: boolean
  } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const categorySectionRef = useRef<HTMLElement>(null)

  // Photo handlers
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const downscaled = await downscaleImage(file, 800, 0.7)
      setPhoto(downscaled)
    } catch {
      addToast({
        title: "Photo processing error",
        description: "Could not optimize image. Please try another photo.",
        variant: "destructive",
      })
    }
  }

  const handleRemovePhoto = () => {
    setPhoto(undefined)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // Geolocation
  const handleUseMyLocation = () => {
    if (!("geolocation" in navigator)) {
      addToast({
        title: "Geolocation unavailable",
        description: "Your browser does not support GPS location.",
        variant: "warning",
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLat = Number(pos.coords.latitude.toFixed(6))
        const newLng = Number(pos.coords.longitude.toFixed(6))
        setLat(newLat)
        setLng(newLng)
        addToast({
          title: "Location detected",
          description: `GPS coordinates updated: ${newLat}, ${newLng}`,
          variant: "success",
        })
      },
      () => {
        addToast({
          title: "GPS Permission Denied",
          description:
            "Using default Centro 1 location. Tap map to reposition.",
          variant: "warning",
        })
      },
      { timeout: 7000 }
    )
  }

  // Submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!barangay) {
      addToast({
        title: "Barangay required",
        description: "Please select your barangay in Tuguegarao.",
        variant: "destructive",
      })
      return
    }

    if (!contact.trim()) {
      addToast({
        title: "Contact required",
        description: "Please enter your phone number or Messenger name.",
        variant: "destructive",
      })
      return
    }

    if (!consent) {
      addToast({
        title: "Consent required",
        description: "Please agree to the privacy policy before submitting.",
        variant: "destructive",
      })
      return
    }

    // Category is required
    if (!category) {
      setCategoryError(true)
      categorySectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
      addToast({
        title: "Category required",
        description: "Pumili ng kategorya / Please choose a category.",
        variant: "warning",
      })
      return
    }

    // Ensure photo fallback if citizen did not take one
    const finalPhoto =
      photo ||
      createSvgPlaceholder(
        "T-TEMP",
        CATEGORIES[category].name,
        description || "Citizen Report",
        CATEGORIES[category].color
      )

    // Check Offline first
    if (!isOnline) {
      enqueueReport({
        category,
        barangay,
        lat,
        lng,
        landmark: landmark.trim() || undefined,
        description: description.trim() || undefined,
        photo: finalPhoto,
        contactType,
        contact: contact.trim(),
        reporterId,
      })

      setSubmittedTicket({
        ticket: {
          id: "PENDING-SYNC",
          category,
          barangay,
          lat,
          lng,
          status: "received",
          createdAt: new Date().toISOString(),
          followers: [reporterId],
          reports: [],
          history: [],
        },
        isDuplicateFollow: false,
        isOffline: true,
      })
      refreshData()
      return
    }

    // Duplicate Check: same category, not resolved, <= 50m
    const dup = findDuplicateTicket(category, lat, lng, 50)
    if (dup) {
      setDuplicateCandidate(dup)
      return
    }

    // No duplicate: create new ticket immediately
    proceedCreateNewTicket(finalPhoto)
  }

  const proceedCreateNewTicket = (photoUrl?: string) => {
    if (!category) return
    setIsSubmitting(true)
    try {
      const finalPhoto =
        photoUrl ||
        photo ||
        createSvgPlaceholder(
          "T-NEW",
          CATEGORIES[category].name,
          description || "Citizen Report",
          CATEGORIES[category].color
        )

      const { ticket } = createNewTicket(
        {
          category,
          barangay,
          lat,
          lng,
          landmark: landmark.trim() || undefined,
          description: description.trim() || undefined,
          photo: finalPhoto,
          contactType,
          contact: contact.trim(),
        },
        reporterId
      )

      setSubmittedTicket({
        ticket,
        isDuplicateFollow: false,
        isOffline: false,
      })
      setDuplicateCandidate(null)
      refreshData()
      addToast({
        title: `Ticket ${ticket.id} Created`,
        description: "Your report has been logged and assigned a tracking ID.",
        variant: "success",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFollowDuplicate = () => {
    if (!duplicateCandidate || !category) return
    setIsSubmitting(true)
    try {
      const target = duplicateCandidate.ticket
      const finalPhoto =
        photo ||
        createSvgPlaceholder(
          target.id,
          CATEGORIES[category].name,
          description || "Citizen Report",
          CATEGORIES[category].color
        )

      const { ticket } = addReportToTicket(
        target.id,
        {
          description: description.trim() || undefined,
          landmark: landmark.trim() || undefined,
          photo: finalPhoto,
          contactType,
          contact: contact.trim(),
        },
        reporterId
      )

      setSubmittedTicket({
        ticket,
        isDuplicateFollow: true,
        isOffline: false,
      })
      setDuplicateCandidate(null)
      refreshData()
      addToast({
        title: `Joined Ticket ${ticket.id}`,
        description: `Your report added to existing ticket (${ticket.reports.length} total reports).`,
        variant: "success",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetForm = () => {
    setPhoto(undefined)
    setCategory(null)
    setCategoryError(false)
    setDescription("")
    setLandmark("")
    setContact("")
    setSubmittedTicket(null)
    setDuplicateCandidate(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // If already submitted, show Success Screen
  if (submittedTicket) {
    const t = submittedTicket.ticket
    return (
      <main className="mx-auto max-w-md animate-in p-4 pb-20 duration-300 fade-in sm:p-6">
        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-8" />
          </div>

          <h1 className="text-xl font-bold tracking-tight text-foreground">
            {submittedTicket.isOffline
              ? "Report Queued (Offline)"
              : submittedTicket.isDuplicateFollow
                ? "Added to Master Ticket!"
                : "Report Submitted!"}
          </h1>

          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            {submittedTicket.isOffline
              ? "Your device is offline. The report will be transmitted automatically when connection is restored."
              : submittedTicket.isDuplicateFollow
                ? "Your complaint was linked to an existing ticket. City departments will handle this as a high-priority merged issue."
                : "Your report has been logged in Tuguegarao Complaints & Action Center."}
          </p>

          {/* Ticket ID Box */}
          <div className="my-5 rounded-xl border border-border/80 bg-muted/50 p-4">
            <div className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Master Ticket ID
            </div>
            <div className="mt-0.5 font-mono text-2xl font-extrabold text-primary">
              {t.id}
            </div>

            <div className="mt-3 flex items-center justify-center gap-2">
              <StatusBadge status={t.status} showTagalog />
              {submittedTicket.isOffline && (
                <span className="rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
                  Pending sync
                </span>
              )}
            </div>

            <div className="mt-3 text-xs text-muted-foreground">
              Total reports on this issue:{" "}
              <strong className="text-foreground">
                {t.reports.length || 1}
              </strong>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-2.5 pt-2">
            <Link to="/user/my" className="block">
              <Button className="h-10 w-full cursor-pointer gap-2 bg-primary font-semibold text-primary-foreground shadow-xs">
                <FileText className="size-4" />
                View in My Reports
              </Button>
            </Link>

            {!submittedTicket.isOffline && (
              <Link to={`/user/t/${t.id}`} className="block">
                <Button
                  variant="outline"
                  className="h-10 w-full cursor-pointer gap-2 border-border text-foreground hover:bg-muted"
                >
                  <ExternalLink className="size-4" />
                  View Public Ticket Page
                </Button>
              </Link>
            )}

            <button
              onClick={handleResetForm}
              className="mt-3 inline-flex cursor-pointer items-center gap-1.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <PlusCircle className="size-3.5" />
              File another report
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-md p-4 pb-24 sm:p-6">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wider text-primary uppercase">
            Citizen Intake
          </span>
        </div>
        <h1 className="mt-0.5 text-xl font-bold tracking-tight text-foreground">
          Report a Civic Issue
        </h1>
        <p className="text-xs text-muted-foreground">
          Take a photo and drop a pin.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 1. PHOTO FIRST */}
        <section className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <label className="mb-2 flex items-center justify-between text-xs font-semibold text-foreground">
            <span className="flex items-center gap-1.5">
              <Camera className="size-3.5 text-primary" />
              1. Photo of Issue
            </span>
          </label>

          {photo ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
              <img
                src={photo}
                alt="Selected complaint preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute top-2 right-2 rounded-full bg-black/75 p-1.5 text-white transition-colors hover:bg-black"
                title="Remove photo"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ) : (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoSelect}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border/80 bg-muted/30 p-5 text-center transition-colors hover:border-primary/50 hover:bg-muted/50"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Upload className="size-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">
                    Take photo or choose from gallery
                  </div>
                </div>
              </label>
            </div>
          )}
        </section>

        {/* EMERGENCY NOTICE */}
        <div className="flex items-start gap-2.5 rounded-xl border border-blue-500/25 bg-blue-500/10 p-3 text-xs text-blue-950 dark:border-blue-400/20 dark:bg-blue-950/40 dark:text-blue-100">
          <Info
            className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400"
            aria-hidden="true"
          />
          <p className="leading-relaxed">
            Hindi ito para sa emergency. Para sa emergency, tumawag sa{" "}
            <strong className="font-semibold text-foreground underline decoration-blue-500/40">
              {EMERGENCY_NUMBER}
            </strong>
            .
          </p>
        </div>

        {/* 2. CATEGORY CHIPS */}
        <section
          ref={categorySectionRef}
          className={`rounded-xl border p-3.5 shadow-xs transition-colors ${
            categoryError
              ? "border-destructive bg-destructive/5 ring-1 ring-destructive"
              : "border-border bg-card"
          }`}
        >
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-xs font-semibold text-foreground">
              2. Category (Kategorya){" "}
              <span className="text-destructive">*</span>
            </label>
            <span className="text-[10px] text-muted-foreground">
              Pumili ng isa / Select one
            </span>
          </div>

          {categoryError && (
            <div
              role="alert"
              className="mb-2.5 flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 px-2.5 py-1.5 text-xs font-semibold text-destructive"
            >
              <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
              <span>Pumili ng kategorya / Please choose a category</span>
            </div>
          )}

          <div
            role="radiogroup"
            aria-label="Category of issue"
            className="grid grid-cols-2 gap-2"
          >
            {(Object.keys(CATEGORIES) as Category[]).map((catKey) => {
              const meta = CATEGORIES[catKey]
              const Icon = meta.icon
              const isSelected = category === catKey
              return (
                <button
                  type="button"
                  key={catKey}
                  role="radio"
                  aria-checked={isSelected}
                  aria-pressed={isSelected}
                  onClick={() => {
                    setCategory(catKey)
                    setCategoryError(false)
                  }}
                  className={`group relative flex min-h-[58px] cursor-pointer items-center justify-between rounded-xl border p-2.5 text-left transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none ${
                    isSelected
                      ? "border-primary bg-primary/10 text-foreground shadow-xs ring-1 ring-primary"
                      : "border-border bg-card text-foreground hover:border-border/80 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2.5 pr-4">
                    <div
                      className={`flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "bg-muted text-foreground group-hover:bg-muted/80"
                      }`}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-xs leading-tight font-bold text-foreground">
                        {meta.tagalog}
                      </span>
                      <span
                        className={`truncate text-[11px] leading-tight ${
                          isSelected
                            ? "font-semibold text-foreground/90"
                            : "font-medium text-muted-foreground"
                        }`}
                      >
                        {meta.name}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs">
                      <Check
                        className="size-2.5 stroke-[3]"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        {/* 3. LOCATION & BARANGAY */}
        <section className="space-y-3 rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <MapPin className="size-3.5 text-primary" />
              3. Location & Barangay
            </label>
            <button
              type="button"
              onClick={handleUseMyLocation}
              className="flex cursor-pointer items-center gap-1 rounded bg-secondary px-2 py-1 text-[11px] font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              <LocateFixed className="size-3 text-primary" />
              Use my location
            </button>
          </div>

          <LocationPickerMap
            lat={lat}
            lng={lng}
            onChange={(newLat, newLng) => {
              setLat(newLat)
              setLng(newLng)
            }}
          />

          <div className="flex items-center justify-between px-1 font-mono text-[11px] text-muted-foreground">
            <span>
              GPS: {lat.toFixed(5)}, {lng.toFixed(5)}
            </span>
            <span className="text-[10px] text-primary">Pin placed</span>
          </div>

          <div>
            <label
              htmlFor="barangay-select"
              className="mb-1 block text-xs font-medium text-foreground"
            >
              Barangay in Tuguegarao <span className="text-destructive">*</span>
            </label>
            <select
              id="barangay-select"
              value={barangay}
              onChange={(e) => setBarangay(e.target.value)}
              required
              className="w-full cursor-pointer rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            >
              <option value="">Select Barangay</option>
              {BARANGAYS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="landmark-input"
              className="mb-1 block text-xs font-medium text-foreground"
            >
              Landmark or Street (Optional)
            </label>
            <input
              id="landmark-input"
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Near Tuguegarao West Central School gate"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
        </section>

        {/* 4. OPTIONAL SHORT DESCRIPTION */}
        <section className="rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <div className="mb-1 flex items-center justify-between">
            <label
              htmlFor="description-textarea"
              className="flex items-center gap-1.5 text-xs font-semibold text-foreground"
            >
              <FileText className="size-3.5 text-primary" />
              4. Short Description (Optional)
            </label>
            <span className="font-mono text-[10px] text-muted-foreground">
              {description.length}/280
            </span>
          </div>
          <textarea
            id="description-textarea"
            maxLength={280}
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you observed (max 280 characters)..."
            className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </section>

        {/* 5. CONTACT & CONSENT */}
        <section className="space-y-3 rounded-xl border border-border bg-card p-3.5 shadow-xs">
          <label className="block text-xs font-semibold text-foreground">
            5. Contact for Status Updates{" "}
            <span className="text-destructive">*</span>
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setContactType("phone")}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border py-1.5 text-xs font-medium transition-colors ${
                contactType === "phone"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              <Phone className="size-3.5" />
              Mobile Phone
            </button>
            <button
              type="button"
              onClick={() => setContactType("messenger")}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border py-1.5 text-xs font-medium transition-colors ${
                contactType === "messenger"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              <MessageSquare className="size-3.5" />
              Messenger
            </button>
          </div>

          <div>
            <input
              type="text"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder={
                contactType === "phone"
                  ? "e.g. 0917 123 4567"
                  : "e.g. m.me/juan.delacruz or Facebook name"
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <label className="flex cursor-pointer items-start gap-2.5 pt-1">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 size-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-[11px] leading-snug text-muted-foreground">
              I consent to Tuguegarao City LGU using this contact info strictly
              for SMS/Messenger status updates regarding this ticket.
            </span>
          </label>
        </section>

        {/* SUBMIT BUTTON */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full cursor-pointer gap-2 bg-primary text-sm font-bold text-primary-foreground shadow-md hover:bg-primary/90"
        >
          {isSubmitting
            ? "Submitting..."
            : !isOnline
              ? "Queue Report (Save Offline)"
              : "Submit Complaint"}
        </Button>
      </form>

      {/* Duplicate Check Bottom Sheet */}
      {duplicateCandidate && (
        <DuplicateSheet
          existingTicket={duplicateCandidate.ticket}
          distanceMeters={duplicateCandidate.distance}
          onFollowExisting={handleFollowDuplicate}
          onCreateNew={() => {
            if (!category) return
            const finalPhoto =
              photo ||
              createSvgPlaceholder(
                "T-NEW",
                CATEGORIES[category].name,
                description || "Citizen Report",
                CATEGORIES[category].color
              )
            proceedCreateNewTicket(finalPhoto)
          }}
          onCancel={() => setDuplicateCandidate(null)}
        />
      )}
    </main>
  )
}
