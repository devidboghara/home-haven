# Requirements Document

## Introduction

This document covers all remaining features for the HomeHaven Real Estate Admin Panel — a Next.js 15 App Router application using Supabase, Tailwind CSS, Lucide React, Recharts, and dnd-kit. The work spans four new admin pages, ten API route handlers, middleware-based auth/security, and nine third-party integrations. Every page follows the established design system (bg-[#F4F5F7], white cards, border-[#E8E6E0], rounded-xl, accent #6366F1) and must include mock data with an amber "Showing sample data" banner when Supabase returns empty results.

## Glossary

- **Admin_Panel**: The Next.js App Router application at `/admin/*`
- **Middleware**: `src/middleware.ts` — Edge Runtime file that runs before every request
- **Route_Handler**: A `route.ts` file under `src/app/api/` exporting HTTP method functions using the Web Request/Response API (Next.js 15 convention — `params` is a Promise)
- **Supabase_Client**: The singleton exported from `src/lib/supabase.ts`
- **Mock_Data**: Hardcoded TypeScript arrays used as fallback when Supabase returns zero rows
- **Sample_Banner**: An amber-coloured banner rendered at the top of a page when Mock_Data is active
- **Design_System**: Tailwind classes: `bg-[#F4F5F7]` page background, `bg-white border border-[#E8E6E0] rounded-xl` cards, `#6366F1` accent, `text-[#111]` primary text, `text-[#7C7870]` secondary text
- **KPI_Card**: A stat summary card matching the pattern used in existing pages (icon + label + value)
- **Pipeline_Stage**: One of the eight stages defined in `src/lib/supabase.ts`
- **Lead_Score**: `"Hot" | "Warm" | "Cold"` as defined in `src/lib/supabase.ts`
- **PaymentStatus**: `"Completed" | "Pending" | "Failed" | "Refunded"` as defined in `src/lib/supabase.ts`
- **PaymentType**: `"Deposit" | "Installment" | "Final Payment" | "Commission" | "Refund"` as defined in `src/lib/supabase.ts`
- **Role**: `"super_admin" | "manager" | "agent" | "read_only"` as defined in `src/lib/supabase.ts`

---

## Requirements

### Requirement 1: Payments Page

**User Story:** As an admin, I want a payment schedule tracker, so that I can monitor deposit → installment → final payment timelines, mark payments as paid, and send reminders.

#### Acceptance Criteria

1. THE Admin_Panel SHALL render `/admin/payments/page.tsx` as a `"use client"` component following the Design_System.
2. WHEN the Payments page mounts, THE Admin_Panel SHALL query the Supabase `payments` table ordered by `payment_date` ascending.
3. IF the Supabase query returns zero rows, THEN THE Admin_Panel SHALL display Mock_Data and render the Sample_Banner.
4. THE Admin_Panel SHALL display KPI_Cards for: total scheduled amount, total collected, total outstanding, and count of overdue payments.
5. THE Admin_Panel SHALL render a timeline view grouping payments by PaymentType (Deposit → Installment → Final Payment) per deal.
6. WHEN an admin clicks "Mark Paid" on a pending payment, THE Admin_Panel SHALL update the payment `status` to `"Completed"` and `payment_date` to today in Supabase, then reflect the change optimistically in the UI.
7. WHEN an admin clicks "Send Reminder" on a payment, THE Admin_Panel SHALL call `POST /api/send-email` with the contact's email and a reminder template.
8. THE Admin_Panel SHALL support filtering payments by PaymentStatus and PaymentType using pill-style toggle buttons matching the Design_System.
9. THE Admin_Panel SHALL support text search across `reference_no`, contact name, and property address.

---

### Requirement 2: Orders Page

**User Story:** As an admin, I want a property purchase orders view, so that I can track order status workflow connected to deals and payments.

#### Acceptance Criteria

1. THE Admin_Panel SHALL render `/admin/orders/page.tsx` as a `"use client"` component following the Design_System.
2. WHEN the Orders page mounts, THE Admin_Panel SHALL query Supabase `deals` joined with `properties` and `contacts`, ordered by `created_at` descending.
3. IF the Supabase query returns zero rows, THEN THE Admin_Panel SHALL display Mock_Data and render the Sample_Banner.
4. THE Admin_Panel SHALL display KPI_Cards for: total orders, orders by Pipeline_Stage (active, pending close, closed won), and total order value.
5. THE Admin_Panel SHALL render an order status workflow showing the Pipeline_Stage progression for each deal as a horizontal step indicator.
6. WHEN an admin changes a deal's Pipeline_Stage via a dropdown, THE Admin_Panel SHALL call `PUT /api/deals` to persist the change and update the UI optimistically.
7. THE Admin_Panel SHALL display linked payment summary (deposit paid, installments, balance due) for each order by querying the `payments` table filtered by `deal_id`.
8. THE Admin_Panel SHALL support filtering by Pipeline_Stage and deal type using the Design_System pill toggles.
9. THE Admin_Panel SHALL support text search across property address, contact name, and deal ID.

---

### Requirement 3: Leads Page

**User Story:** As an admin, I want a lead management dashboard with scoring and conversion tracking, so that I can prioritise outreach and match buyers to properties.

#### Acceptance Criteria

1. THE Admin_Panel SHALL render `/admin/leads/page.tsx` as a `"use client"` component following the Design_System.
2. WHEN the Leads page mounts, THE Admin_Panel SHALL query the Supabase `contacts` table filtered to `contact_type IN ('Buyer','Investor','Tenant')`, ordered by `created_at` descending.
3. IF the Supabase query returns zero rows, THEN THE Admin_Panel SHALL display Mock_Data and render the Sample_Banner.
4. THE Admin_Panel SHALL display KPI_Cards for: total leads, Hot/Warm/Cold counts, conversion rate (contacts with a linked closed-won deal / total contacts), and new leads this week.
5. THE Admin_Panel SHALL render a lead scoring badge (Hot = rose, Warm = amber, Cold = slate) derived from the contact's `lead_score` field.
6. THE Admin_Panel SHALL render a lead source breakdown chart (Recharts BarChart or PieChart) using the `source` field from the `contacts` table.
7. THE Admin_Panel SHALL render a conversion funnel showing count of contacts at each Pipeline_Stage by joining `contacts` with `deals`.
8. WHEN an admin clicks "Match Properties" on a lead, THE Admin_Panel SHALL display a modal listing properties whose `list_price` falls within the contact's `budget_min`–`budget_max` range.
9. THE Admin_Panel SHALL support filtering by Lead_Score, source, and assigned agent using the Design_System controls.
10. THE Admin_Panel SHALL support text search across `full_name`, `email`, and `phone`.

---

### Requirement 4: Marketing Page

**User Story:** As an admin, I want an email campaign manager, so that I can create, schedule, and analyse email campaigns with audience segmentation.

#### Acceptance Criteria

1. THE Admin_Panel SHALL render `/admin/marketing/page.tsx` as a `"use client"` component following the Design_System.
2. THE Admin_Panel SHALL display KPI_Cards for: total campaigns, total emails sent, average open rate, and average click rate — sourced from a `campaigns` mock dataset when no Supabase table exists.
3. IF no live campaign data is available, THEN THE Admin_Panel SHALL display Mock_Data and render the Sample_Banner.
4. THE Admin_Panel SHALL render a campaign list table with columns: name, status (Draft/Scheduled/Sent/Paused), audience segment, scheduled date, sent count, open rate, click rate.
5. THE Admin_Panel SHALL provide a "New Campaign" modal with fields: campaign name, subject line, audience segment (All Contacts / Hot Leads / Buyers / Investors), scheduled date/time, and template selection.
6. WHEN an admin clicks "Send Now" on a Draft campaign, THE Admin_Panel SHALL call `POST /api/send-email` for each contact in the selected segment and update the campaign status to `"Sent"`.
7. THE Admin_Panel SHALL render a template library section showing at least five pre-built email templates: Invoice Email, Contract Signature Request, Lead Welcome, Appointment Reminder, Weekly Report.
8. THE Admin_Panel SHALL render a campaign analytics chart (Recharts LineChart) showing sent/open/click trends over the last 30 days.
9. THE Admin_Panel SHALL support filtering campaigns by status using pill toggles.

---

### Requirement 5: Properties API Routes

**User Story:** As a developer, I want REST API routes for properties, so that client components and external tools can read and write property data.

#### Acceptance Criteria

1. THE Route_Handler at `src/app/api/properties/route.ts` SHALL export a `GET` function that queries all properties from Supabase and returns `Response.json({ data })`.
2. WHEN `GET /api/properties` receives query parameters (`status`, `deal_type`, `city`), THE Route_Handler SHALL apply them as Supabase `.eq()` filters before returning results.
3. THE Route_Handler at `src/app/api/properties/route.ts` SHALL export a `POST` function that reads `request.json()`, inserts a new property into Supabase, and returns `Response.json({ data }, { status: 201 })`.
4. IF a Supabase operation fails, THEN THE Route_Handler SHALL return `Response.json({ error: message }, { status: 500 })`.
5. THE Route_Handler at `src/app/api/properties/[id]/route.ts` SHALL export `GET`, `PUT`, and `DELETE` functions; `params` SHALL be awaited as a Promise per Next.js 15 convention.
6. WHEN `DELETE /api/properties/[id]` is called, THE Route_Handler SHALL delete the record and return `Response.json({ success: true })`.

---

### Requirement 6: Contacts API Route

**User Story:** As a developer, I want REST API routes for contacts, so that lead data can be read and created programmatically.

#### Acceptance Criteria

1. THE Route_Handler at `src/app/api/contacts/route.ts` SHALL export a `GET` function returning all contacts ordered by `created_at` descending.
2. WHEN `GET /api/contacts` receives a `type` query parameter, THE Route_Handler SHALL filter by `contact_type`.
3. THE Route_Handler SHALL export a `POST` function that inserts a new contact and returns `Response.json({ data }, { status: 201 })`.
4. IF a Supabase operation fails, THEN THE Route_Handler SHALL return `Response.json({ error: message }, { status: 500 })`.

---

### Requirement 7: Deals API Route

**User Story:** As a developer, I want REST API routes for deals, so that pipeline data can be read and stage updates can be persisted.

#### Acceptance Criteria

1. THE Route_Handler at `src/app/api/deals/route.ts` SHALL export a `GET` function returning all deals with their linked property and contact via Supabase joins.
2. THE Route_Handler SHALL export a `PUT` function that reads `{ id, pipeline_stage }` from `request.json()` and updates the deal's `pipeline_stage` in Supabase.
3. IF the deal ID does not exist, THEN THE Route_Handler SHALL return `Response.json({ error: "Not found" }, { status: 404 })`.

---

### Requirement 8: Invoices API Route

**User Story:** As a developer, I want REST API routes for invoices with line items, so that invoice data can be created and retrieved.

#### Acceptance Criteria

1. THE Route_Handler at `src/app/api/invoices/route.ts` SHALL export a `GET` function returning all invoices joined with `invoice_line_items`.
2. THE Route_Handler SHALL export a `POST` function that accepts `{ invoice, lineItems }` in the request body, inserts the invoice, then inserts all line items with the returned `invoice_id`.
3. IF any insert fails, THEN THE Route_Handler SHALL return `Response.json({ error: message }, { status: 500 })`.

---

### Requirement 9: Dashboard Stats API Route

**User Story:** As a developer, I want a single API endpoint that returns all KPI numbers, so that the dashboard can load stats in one network call.

#### Acceptance Criteria

1. THE Route_Handler at `src/app/api/dashboard/stats/route.ts` SHALL export a `GET` function that runs parallel Supabase queries for properties, contacts, deals, and invoices using `Promise.all`.
2. THE Route_Handler SHALL return a single JSON object with keys: `totalProperties`, `availableProperties`, `totalContacts`, `hotLeads`, `activeDeals`, `closedDeals`, `totalRevenue`, `pendingInvoices`.
3. IF any Supabase query fails, THEN THE Route_Handler SHALL return `Response.json({ error: message }, { status: 500 })`.

---

### Requirement 10: Send Email API Route (Resend)

**User Story:** As a developer, I want an API route that sends emails via Resend, so that the admin panel can trigger transactional emails.

#### Acceptance Criteria

1. THE Route_Handler at `src/app/api/send-email/route.ts` SHALL export a `POST` function that reads `{ to, subject, html, template }` from `request.json()`.
2. WHEN `RESEND_API_KEY` is set in environment variables, THE Route_Handler SHALL call the Resend API and return `Response.json({ id })` on success.
3. IF `RESEND_API_KEY` is not set, THEN THE Route_Handler SHALL return `Response.json({ error: "Email service not configured" }, { status: 503 })`.
4. THE Route_Handler SHALL support five named templates: `invoice`, `contract_signature`, `lead_welcome`, `appointment_reminder`, `weekly_report` — each returning a pre-built HTML string when `template` is provided.
5. IF the Resend API call fails, THEN THE Route_Handler SHALL return `Response.json({ error: message }, { status: 500 })`.

---

### Requirement 11: File Upload API Route (Cloudinary)

**User Story:** As a developer, I want an API route that uploads files to Cloudinary, so that property photos, documents, and agent avatars can be stored in the cloud.

#### Acceptance Criteria

1. THE Route_Handler at `src/app/api/upload/route.ts` SHALL export a `POST` function that reads a `FormData` body containing a `file` field.
2. WHEN `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are set, THE Route_Handler SHALL upload the file to Cloudinary and return `Response.json({ url, public_id })`.
3. IF any required Cloudinary environment variable is missing, THEN THE Route_Handler SHALL return `Response.json({ error: "Upload service not configured" }, { status: 503 })`.
4. THE Route_Handler SHALL accept an optional `folder` field in the FormData to organise uploads (e.g. `properties`, `documents`, `avatars`).
5. IF the upload fails, THEN THE Route_Handler SHALL return `Response.json({ error: message }, { status: 500 })`.

---

### Requirement 12: AI Generate API Route (OpenAI)

**User Story:** As a developer, I want API routes for AI-powered features, so that admins can generate property descriptions, score leads, and draft emails.

#### Acceptance Criteria

1. THE Route_Handler at `src/app/api/ai/generate/route.ts` SHALL export a `POST` function that reads `{ type, data }` from `request.json()`, where `type` is one of `"description"`, `"lead_score"`, or `"draft_email"`.
2. WHEN `OPENAI_API_KEY` is set and `type` is `"description"`, THE Route_Handler SHALL call the OpenAI Chat Completions API with a prompt built from the property `data` and return `Response.json({ result })`.
3. WHEN `type` is `"lead_score"`, THE Route_Handler SHALL return a JSON object with `{ score: "Hot"|"Warm"|"Cold", reasoning: string }`.
4. WHEN `type` is `"draft_email"`, THE Route_Handler SHALL return `Response.json({ subject, body })`.
5. IF `OPENAI_API_KEY` is not set, THEN THE Route_Handler SHALL return `Response.json({ error: "AI service not configured" }, { status: 503 })`.

---

### Requirement 13: Stripe Webhook API Route

**User Story:** As a developer, I want a Stripe webhook handler, so that payment events from Stripe can update the database automatically.

#### Acceptance Criteria

1. THE Route_Handler at `src/app/api/stripe/webhook/route.ts` SHALL export a `POST` function that reads the raw request body using `request.text()`.
2. WHEN `STRIPE_WEBHOOK_SECRET` is set, THE Route_Handler SHALL verify the Stripe signature from the `stripe-signature` header before processing any event.
3. IF signature verification fails, THEN THE Route_Handler SHALL return `new Response("Webhook signature invalid", { status: 400 })`.
4. WHEN a `payment_intent.succeeded` event is received, THE Route_Handler SHALL update the corresponding payment record in Supabase to `status: "Completed"`.
5. WHEN a `payment_intent.payment_failed` event is received, THE Route_Handler SHALL update the corresponding payment record in Supabase to `status: "Failed"`.
6. THE Route_Handler SHALL return `new Response("OK", { status: 200 })` after successfully processing any event.

---

### Requirement 14: Middleware — Auth & Security

**User Story:** As a security engineer, I want middleware that protects all admin routes, validates sessions, enforces role-based access, and rate-limits API routes, so that unauthenticated and unauthorised users cannot access sensitive data.

#### Acceptance Criteria

1. THE Middleware SHALL be defined in `src/middleware.ts` and export a `middleware` function and a `config` object with `matcher: ["/admin/:path*", "/api/:path*"]`.
2. WHEN a request matches `/admin/:path*` and no valid Supabase session cookie is present, THE Middleware SHALL redirect the request to `/login` using `NextResponse.redirect`.
3. WHEN a valid session exists and the user's Role is `"read_only"`, THE Middleware SHALL redirect requests to write-only admin paths (e.g. `/admin/settings`, `/admin/team`) to `/admin` with a `?error=forbidden` query parameter.
4. WHEN a request matches `/api/:path*`, THE Middleware SHALL enforce rate limiting by tracking request counts per IP using an in-memory Map, returning `new Response("Too Many Requests", { status: 429 })` when a single IP exceeds 100 requests per minute.
5. THE Middleware SHALL use `@supabase/ssr` to create a Supabase server client from cookies for session validation, consistent with the existing `src/app/auth/callback/route.ts` pattern.
6. THE Middleware SHALL pass through all requests to `/api/stripe/webhook` without rate limiting or auth checks, as Stripe requires raw body access.

---

### Requirement 15: Resend Email Integration

**User Story:** As an admin, I want email sending powered by Resend with pre-built templates, so that transactional emails are consistent and professional.

#### Acceptance Criteria

1. THE Admin_Panel SHALL define five HTML email template functions in `src/lib/email-templates.ts`: `invoiceEmail`, `contractSignatureEmail`, `leadWelcomeEmail`, `appointmentReminderEmail`, `weeklyReportEmail`.
2. EACH template function SHALL accept a typed `data` parameter and return a valid HTML string.
3. THE `send-email` Route_Handler SHALL import and use these templates when a `template` key is provided in the request body.
4. WHERE `RESEND_API_KEY` is configured, THE Admin_Panel SHALL send emails from a configurable `from` address defaulting to `"HomeHaven <noreply@homehaven.app>"`.

---

### Requirement 16: Cloudinary Image Upload Integration

**User Story:** As an admin, I want to upload property photos and documents to Cloudinary, so that media is stored reliably and served via CDN.

#### Acceptance Criteria

1. THE Admin_Panel SHALL provide a reusable `ImageUpload` component at `src/components/ImageUpload.tsx` that renders a drag-and-drop zone and a file input.
2. WHEN a file is selected or dropped, THE ImageUpload component SHALL call `POST /api/upload` with a `FormData` body and display an upload progress indicator.
3. WHEN the upload succeeds, THE ImageUpload component SHALL call an `onUpload(url: string)` callback prop with the returned Cloudinary URL.
4. IF the upload fails, THEN THE ImageUpload component SHALL display an error message inline without crashing.
5. THE ImageUpload component SHALL accept a `folder` prop (`"properties" | "documents" | "avatars"`) passed through to the API route.

---

### Requirement 17: Google Maps Integration

**User Story:** As an admin, I want real maps in the property detail Comps tab, a location picker, and a distance calculator, so that spatial context is available without leaving the admin panel.

#### Acceptance Criteria

1. WHERE `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set, THE Admin_Panel SHALL render a Google Maps embed in the Comps tab of `/admin/properties/[id]` showing the property's location.
2. THE Admin_Panel SHALL provide a `PropertyLocationPicker` component that renders a map with a draggable marker and calls an `onLocationChange({ lat, lng })` callback when the marker is moved.
3. THE Admin_Panel SHALL provide a `DistanceCalculator` utility function in `src/lib/maps.ts` that accepts two `{ lat, lng }` objects and returns the straight-line distance in kilometres.
4. IF `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is not set, THEN THE Admin_Panel SHALL render a placeholder card with the text "Map unavailable — configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY".

---

### Requirement 18: PDF Generation

**User Story:** As an admin, I want to generate PDF documents for invoices, contracts, and property reports, so that professional documents can be downloaded or emailed.

#### Acceptance Criteria

1. THE Admin_Panel SHALL provide an `InvoicePDF` component at `src/components/pdf/InvoicePDF.tsx` using `@react-pdf/renderer` that renders invoice data including line items, totals, and branding.
2. THE Admin_Panel SHALL provide a `ContractPDF` component at `src/components/pdf/ContractPDF.tsx` that renders contract terms, parties, and signature fields.
3. THE Admin_Panel SHALL provide a `PropertyReportPDF` component at `src/components/pdf/PropertyReportPDF.tsx` that renders property details, images, and financial summary.
4. WHEN an admin clicks "Download PDF" on an invoice or contract, THE Admin_Panel SHALL use `@react-pdf/renderer`'s `pdf()` function to generate a Blob and trigger a browser download.
5. WHERE `@react-pdf/renderer` is not installed, THE Admin_Panel SHALL display a "PDF generation unavailable" message rather than crashing.

---

### Requirement 19: Stripe Payments Integration

**User Story:** As an admin, I want Stripe payment processing with a payment form and webhook handling, so that online payments can be collected and tracked.

#### Acceptance Criteria

1. THE Admin_Panel SHALL provide a `PaymentForm` component at `src/components/PaymentForm.tsx` that uses Stripe Elements to collect card details.
2. WHEN the PaymentForm is submitted, THE Admin_Panel SHALL call a `POST /api/stripe/create-payment-intent` route that creates a Stripe PaymentIntent and returns the `client_secret`.
3. THE Route_Handler at `src/app/api/stripe/create-payment-intent/route.ts` SHALL read `{ amount, currency, metadata }` from `request.json()` and call the Stripe API.
4. IF `STRIPE_SECRET_KEY` is not set, THEN THE Route_Handler SHALL return `Response.json({ error: "Payment service not configured" }, { status: 503 })`.
5. THE Stripe webhook handler (Requirement 13) SHALL handle `payment_intent.succeeded` and `payment_intent.payment_failed` events as specified.

---

### Requirement 20: Twilio SMS Integration

**User Story:** As an admin, I want to send SMS messages for appointment reminders, offer updates, and OTP, so that contacts receive timely notifications on their phones.

#### Acceptance Criteria

1. THE Route_Handler at `src/app/api/send-sms/route.ts` SHALL export a `POST` function that reads `{ to, message, type }` from `request.json()`.
2. WHEN `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER` are set, THE Route_Handler SHALL send an SMS via the Twilio REST API and return `Response.json({ sid })`.
3. IF any required Twilio environment variable is missing, THEN THE Route_Handler SHALL return `Response.json({ error: "SMS service not configured" }, { status: 503 })`.
4. THE Route_Handler SHALL support `type` values of `"appointment_reminder"`, `"offer_update"`, and `"otp"`, prepending an appropriate prefix to the message body for each type.

---

### Requirement 21: Supabase Realtime

**User Story:** As an admin, I want live updates for the pipeline, messages, notifications, and dashboard, so that data changes made by other users are reflected immediately without a page refresh.

#### Acceptance Criteria

1. THE Admin_Panel SHALL subscribe to Supabase Realtime channels for the `deals` table on the Pipeline page, updating the board state when INSERT, UPDATE, or DELETE events are received.
2. THE Admin_Panel SHALL subscribe to Supabase Realtime channels for the `messages` table on the Messages page, prepending new messages to the list when an INSERT event is received.
3. THE Admin_Panel SHALL subscribe to Supabase Realtime channels for the `notifications` table on the Notifications page, incrementing the unread badge count when an INSERT event is received.
4. WHEN a component unmounts, THE Admin_Panel SHALL call `supabase.removeChannel(channel)` to clean up all Realtime subscriptions.
5. THE Admin_Panel SHALL use the existing `supabase` singleton from `src/lib/supabase.ts` for all Realtime subscriptions.

---

### Requirement 22: Algolia Search Integration

**User Story:** As an admin, I want instant search across properties, contacts, and deals, so that I can find any record in milliseconds from a global search bar.

#### Acceptance Criteria

1. THE Admin_Panel SHALL provide a `GlobalSearch` component at `src/components/GlobalSearch.tsx` that renders a search input and a results dropdown.
2. WHEN the user types in the GlobalSearch input, THE GlobalSearch component SHALL debounce the query by 300ms before calling the Algolia search API.
3. WHERE `NEXT_PUBLIC_ALGOLIA_APP_ID` and `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY` are set, THE GlobalSearch component SHALL search across three Algolia indices: `properties`, `contacts`, `deals`.
4. THE GlobalSearch component SHALL display results grouped by index type with an icon and a link to the relevant admin page.
5. IF Algolia environment variables are not set, THEN THE GlobalSearch component SHALL fall back to client-side filtering of locally loaded data.
6. WHEN the user presses Escape or clicks outside the dropdown, THE GlobalSearch component SHALL close the results panel.
