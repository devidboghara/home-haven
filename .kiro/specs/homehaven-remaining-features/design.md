# Design Document

## Overview

This document describes the technical design for all remaining HomeHaven features: four admin pages, ten API route handlers, auth middleware, and nine third-party integrations. All work targets the existing Next.js 15 App Router codebase with Supabase, Tailwind CSS, Lucide React, and Recharts.

---

## Architecture

### Component Pattern (all admin pages)

Every admin page follows this exact structure:

```
"use client"
↓
Imports (react hooks → lucide → supabase → recharts)
↓
TypeScript interfaces
↓
Config constants (STATUS_CFG, colour maps)
↓
MOCK_* arrays (fallback data)
↓
Sub-components (modals, cards, rows)
↓
Main page component (useEffect → Supabase fetch → fallback to mock)
↓
export default PageName
```

### Mock Data + Sample Banner Pattern

```tsx
const [data, setData] = useState(MOCK_DATA);
const [usingMock, setUsingMock] = useState(true);

useEffect(() => {
  supabase.from("table").select("*").then(({ data: rows }) => {
    if (rows && rows.length > 0) {
      setData(rows);
      setUsingMock(false);
    }
  });
}, []);

// In JSX:
{usingMock && (
  <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-[13px] text-amber-700 flex items-center gap-2">
    <AlertCircle size={14} /> Showing sample data
  </div>
)}
```

### API Route Pattern (Next.js 15)

```ts
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const { data, error } = await supabase.from("table").select("*");
    if (error) throw error;
    return Response.json({ data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
```

Dynamic route params are awaited as a Promise per Next.js 15:
```ts
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  ...
}
```

---

## Page Designs

### 1. Payments Page (`/admin/payments/page.tsx`)

**Layout:** Header → KPI Cards (4) → Filter Bar → Timeline/Table → Mark Paid Modal

**KPI Cards:**
- Total Scheduled (sum of all payment amounts)
- Total Collected (sum where status = "Completed")
- Total Outstanding (sum where status = "Pending")
- Overdue Count (Pending payments where payment_date < today)

**Timeline View:** Payments grouped by `deal_id`, sorted Deposit → Installment → Final Payment. Each group renders as a horizontal step-progress row with connecting lines.

**Filters:** Pill toggles for `PaymentStatus` (All / Completed / Pending / Failed / Refunded) and `PaymentType` (All / Deposit / Installment / Final Payment). Text search across `reference_no`, contact name, property address.

**Actions:**
- "Mark Paid" → optimistic UI update + `supabase.from("payments").update({ status: "Completed", payment_date: today })`
- "Send Reminder" → `POST /api/send-email` with `template: "appointment_reminder"`

**Mock data shape:**
```ts
interface PaymentRow {
  id: string;
  reference_no: string;
  contact_name: string;
  property_address: string;
  payment_type: PaymentType;
  amount: number;
  status: PaymentStatus;
  payment_date: string | null;
  deal_id: string | null;
}
```

---

### 2. Orders Page (`/admin/orders/page.tsx`)

**Layout:** Header → KPI Cards (4) → Filter Bar → Orders Table with expandable rows

**KPI Cards:** Total Orders, Active Orders, Pending Close, Closed Won, Total Order Value

**Order Row:** Property address + contact name + deal type + Pipeline_Stage step indicator (8 steps, current step highlighted in indigo) + payment summary (deposit / installments / balance).

**Stage Dropdown:** `<select>` with all 8 `PipelineStage` values. On change → `PUT /api/deals` with `{ id, pipeline_stage }` → optimistic update.

**Supabase query:**
```ts
supabase.from("deals")
  .select("*, properties(address, city), contacts(full_name, email)")
  .order("created_at", { ascending: false })
```

**Filters:** Pill toggles for Pipeline_Stage groups (Active / Pending Close / Closed) and DealType. Text search across address, contact name, deal ID.

---

### 3. Leads Page (`/admin/leads/page.tsx`)

**Layout:** Header → KPI Cards (4) → Charts Row (source breakdown + conversion funnel) → Filter Bar → Leads Table → Match Properties Modal

**KPI Cards:** Total Leads, Hot count (rose), Warm count (amber), Cold count (slate), Conversion Rate %, New This Week

**Charts:**
- `PieChart` (Recharts) — lead source breakdown from `contacts.source`
- Horizontal bar funnel — count per Pipeline_Stage from joined deals

**Lead Score Badge:**
```ts
const SCORE_CFG = {
  Hot:  { bg: "bg-rose-100",  text: "text-rose-700"  },
  Warm: { bg: "bg-amber-100", text: "text-amber-700" },
  Cold: { bg: "bg-slate-100", text: "text-slate-600" },
};
```

**Match Properties Modal:** Queries `properties` where `list_price BETWEEN budget_min AND budget_max`. Renders property cards with address, price, beds/baths.

**Supabase query:**
```ts
supabase.from("contacts")
  .select("*")
  .in("contact_type", ["Buyer", "Investor", "Tenant"])
  .order("created_at", { ascending: false })
```

---

### 4. Marketing Page (`/admin/marketing/page.tsx`)

**Layout:** Header → KPI Cards (4) → Analytics Chart → Filter Bar → Campaign Table → Template Library → New Campaign Modal

**KPI Cards:** Total Campaigns, Emails Sent, Avg Open Rate %, Avg Click Rate %

**Analytics Chart:** `LineChart` (Recharts) — 30-day trend of sent/opened/clicked counts. Uses mock time-series data.

**Campaign Table columns:** Name, Status badge, Audience, Scheduled Date, Sent, Open Rate, Click Rate, Actions (Send Now / Edit / Delete)

**Status badges:**
- Draft → slate, Scheduled → indigo, Sent → emerald, Paused → amber

**New Campaign Modal fields:** name, subject, audience segment (select), scheduled datetime (input), template (select from 5 templates)

**Template Library:** 5 cards in a grid — Invoice Email, Contract Signature Request, Lead Welcome, Appointment Reminder, Weekly Report. Each card shows a preview snippet and a "Use Template" button.

**Send Now flow:** Sets campaign status to "Sent" optimistically, then calls `POST /api/send-email` for each contact in the segment.

---

## API Route Designs

### Properties (`/api/properties/route.ts`)

```
GET  /api/properties?status=Available&deal_type=Rental&city=Toronto
POST /api/properties  { body: Partial<Property> }
```

```
GET  /api/properties/[id]
PUT  /api/properties/[id]  { body: Partial<Property> }
DELETE /api/properties/[id]
```

### Contacts (`/api/contacts/route.ts`)

```
GET  /api/contacts?type=Buyer
POST /api/contacts  { body: Partial<Contact> }
```

### Deals (`/api/deals/route.ts`)

```
GET /api/deals  → select("*, properties(address), contacts(full_name)")
PUT /api/deals  { id, pipeline_stage }
```

### Invoices (`/api/invoices/route.ts`)

```
GET  /api/invoices  → select("*, invoice_line_items(*)")
POST /api/invoices  { invoice: Partial<Invoice>, lineItems: Partial<InvoiceLineItem>[] }
```
POST inserts invoice first, gets returned `id`, then bulk-inserts line items with that `invoice_id`.

### Dashboard Stats (`/api/dashboard/stats/route.ts`)

Runs `Promise.all` over four Supabase queries and returns:
```ts
{
  totalProperties: number;
  availableProperties: number;
  totalContacts: number;
  hotLeads: number;
  activeDeals: number;
  closedDeals: number;
  totalRevenue: number;
  pendingInvoices: number;
}
```

### Send Email (`/api/send-email/route.ts`)

```
POST /api/send-email
Body: { to: string, subject?: string, html?: string, template?: string, data?: object }
```

Checks `RESEND_API_KEY` → if missing returns 503. If `template` is provided, imports from `src/lib/email-templates.ts` and generates HTML. Calls Resend API: `POST https://api.resend.com/emails`.

### Upload (`/api/upload/route.ts`)

```
POST /api/upload  (multipart/form-data)
Fields: file (File), folder? ("properties"|"documents"|"avatars")
```

Checks three Cloudinary env vars → if any missing returns 503. Uses Cloudinary SDK `v2.uploader.upload_stream`. Returns `{ url, public_id }`.

### AI Generate (`/api/ai/generate/route.ts`)

```
POST /api/ai/generate
Body: { type: "description"|"lead_score"|"draft_email", data: object }
```

Checks `OPENAI_API_KEY` → if missing returns 503. Uses `openai` SDK `chat.completions.create` with `gpt-4o-mini`. Returns typed response per `type`.

### Stripe Webhook (`/api/stripe/webhook/route.ts`)

```
POST /api/stripe/webhook
Headers: stripe-signature
```

Reads raw body via `request.text()`. Verifies with `stripe.webhooks.constructEvent`. Handles `payment_intent.succeeded` and `payment_intent.payment_failed` by updating `payments` table.

### Stripe Create Payment Intent (`/api/stripe/create-payment-intent/route.ts`)

```
POST /api/stripe/create-payment-intent
Body: { amount: number, currency: string, metadata: object }
```

### Send SMS (`/api/send-sms/route.ts`)

```
POST /api/send-sms
Body: { to: string, message: string, type: "appointment_reminder"|"offer_update"|"otp" }
```

---

## Middleware Design (`src/middleware.ts`)

```
Runtime: Edge (default for middleware)
Matcher: ["/admin/:path*", "/api/:path*"]
```

**Flow:**
1. If path starts with `/api/stripe/webhook` → pass through immediately (no auth, no rate limit)
2. If path starts with `/api/` → check rate limit (in-memory Map, 100 req/min per IP). Return 429 if exceeded.
3. If path starts with `/admin/` → create Supabase server client via `@supabase/ssr`, get session from cookies. If no session → redirect to `/login`.
4. If session exists and role is `"read_only"` and path is `/admin/settings` or `/admin/team` → redirect to `/admin?error=forbidden`.

**Rate limit store:**
```ts
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
```
Resets per IP every 60 seconds.

**Supabase SSR client** (consistent with `auth/callback/route.ts`):
```ts
import { createServerClient } from "@supabase/ssr";
```

---

## Integration Designs

### Email Templates (`src/lib/email-templates.ts`)

Five typed functions returning HTML strings:

```ts
export function invoiceEmail(data: { invoiceNumber: string; amount: number; dueDate: string; contactName: string }): string
export function contractSignatureEmail(data: { contractTitle: string; contactName: string; signUrl: string }): string
export function leadWelcomeEmail(data: { contactName: string; agentName: string }): string
export function appointmentReminderEmail(data: { contactName: string; date: string; location: string }): string
export function weeklyReportEmail(data: { agentName: string; dealsCount: number; revenue: number }): string
```

All templates use inline styles (email-safe), HomeHaven branding, and `#6366F1` accent colour.

### ImageUpload Component (`src/components/ImageUpload.tsx`)

```tsx
interface ImageUploadProps {
  folder: "properties" | "documents" | "avatars";
  onUpload: (url: string) => void;
  label?: string;
}
```

States: `idle | uploading | success | error`. Drag-and-drop via HTML5 `onDragOver`/`onDrop`. Progress shown as a simple animated bar. On success calls `onUpload(url)`.

### Google Maps (`src/lib/maps.ts` + components)

```ts
// Haversine formula
export function calculateDistance(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number  // returns km
```

`PropertyLocationPicker` component: loads Google Maps JS API via `<script>` tag using `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`. Renders a `<div id="map">` and initialises `google.maps.Map` + draggable `Marker` in `useEffect`. Falls back to placeholder card if key not set.

### PDF Components (`src/components/pdf/`)

Three components using `@react-pdf/renderer`:
- `InvoicePDF` — line items table, totals, HomeHaven logo text, branding colours
- `ContractPDF` — contract terms, parties section, signature lines
- `PropertyReportPDF` — property details, financial summary

All wrapped in a `try/catch` dynamic import guard to show "PDF generation unavailable" if package missing.

Download trigger:
```ts
import { pdf } from "@react-pdf/renderer";
const blob = await pdf(<InvoicePDF data={invoice} />).toBlob();
const url = URL.createObjectURL(blob);
// trigger <a download> click
```

### PaymentForm Component (`src/components/PaymentForm.tsx`)

Uses `@stripe/react-stripe-js` `Elements` provider + `CardElement`. On submit: calls `/api/stripe/create-payment-intent`, then `stripe.confirmCardPayment(clientSecret)`. Shows success/error state inline.

### GlobalSearch Component (`src/components/GlobalSearch.tsx`)

```tsx
interface SearchResult {
  type: "property" | "contact" | "deal";
  id: string;
  title: string;
  subtitle: string;
  href: string;
}
```

300ms debounce via `useRef` timeout. If Algolia keys set → searches three indices in parallel. If not → filters locally loaded data arrays. Results grouped by type with icons. Closes on Escape or outside click via `useEffect` event listener.

---

## File Structure (new files only)

```
src/
├── app/
│   ├── admin/
│   │   ├── payments/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── leads/page.tsx
│   │   └── marketing/page.tsx
│   └── api/
│       ├── properties/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── contacts/route.ts
│       ├── deals/route.ts
│       ├── invoices/route.ts
│       ├── dashboard/stats/route.ts
│       ├── send-email/route.ts
│       ├── send-sms/route.ts
│       ├── upload/route.ts
│       ├── ai/generate/route.ts
│       └── stripe/
│           ├── webhook/route.ts
│           └── create-payment-intent/route.ts
├── components/
│   ├── ImageUpload.tsx
│   ├── PaymentForm.tsx
│   ├── GlobalSearch.tsx
│   └── pdf/
│       ├── InvoicePDF.tsx
│       ├── ContractPDF.tsx
│       └── PropertyReportPDF.tsx
├── lib/
│   ├── email-templates.ts
│   └── maps.ts
└── middleware.ts
```

---

## Correctness Properties

1. **Mock fallback invariant** — If Supabase returns 0 rows or an error, the page MUST render mock data and the amber sample banner. The page MUST NOT render empty.
2. **Optimistic update consistency** — After "Mark Paid" or stage change, the UI reflects the new state immediately. If the Supabase call fails, the UI reverts to the previous state.
3. **API error propagation** — Every route handler MUST return a structured `{ error: string }` JSON body with an appropriate HTTP status (400/404/500/503) on failure. It MUST NOT throw unhandled exceptions.
4. **Service key guard** — Routes that depend on third-party keys (Resend, Cloudinary, OpenAI, Stripe, Twilio) MUST check for the key before attempting the API call and return 503 if missing.
5. **Middleware pass-through** — `/api/stripe/webhook` MUST bypass auth and rate limiting. All other `/admin/*` routes MUST redirect to `/login` when unauthenticated.
6. **Rate limit correctness** — The in-memory rate limit counter MUST reset after 60 seconds per IP. Requests within the window after the 100th MUST receive 429.
7. **Realtime cleanup** — Every component that subscribes to a Supabase Realtime channel MUST call `supabase.removeChannel(channel)` in its `useEffect` cleanup function.
8. **Next.js 15 params** — All dynamic route handlers MUST await `params` as a Promise before accessing route segment values.
