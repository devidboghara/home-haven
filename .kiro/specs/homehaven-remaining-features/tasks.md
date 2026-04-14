# Implementation Tasks

## Tasks

- [x] 1. Build Payments Page
  - [x] 1.1 Create `src/app/admin/payments/page.tsx` with KPI cards (total scheduled, collected, outstanding, overdue count)
  - [x] 1.2 Add timeline view grouping payments by PaymentType per deal with step-progress rows
  - [x] 1.3 Implement "Mark Paid" optimistic update (Supabase update + UI state)
  - [x] 1.4 Implement "Send Reminder" button calling `POST /api/send-email`
  - [x] 1.5 Add pill-toggle filters for PaymentStatus and PaymentType plus text search
  - [x] 1.6 Add mock data fallback with amber sample banner

- [x] 2. Build Orders Page
  - [x] 2.1 Create `src/app/admin/orders/page.tsx` with KPI cards (total orders, active, pending close, closed won, total value)
  - [x] 2.2 Render order rows with horizontal Pipeline_Stage step indicator (8 steps)
  - [x] 2.3 Implement stage dropdown calling `PUT /api/deals` with optimistic update
  - [x] 2.4 Display linked payment summary (deposit / installments / balance) per order
  - [x] 2.5 Add pill-toggle filters for Pipeline_Stage and DealType plus text search
  - [x] 2.6 Add mock data fallback with amber sample banner

- [x] 3. Build Leads Page
  - [x] 3.1 Create `src/app/admin/leads/page.tsx` with KPI cards (total, Hot/Warm/Cold counts, conversion rate, new this week)
  - [x] 3.2 Add Recharts PieChart for lead source breakdown
  - [x] 3.3 Add horizontal bar conversion funnel by Pipeline_Stage
  - [x] 3.4 Render lead score badges (Hot = rose, Warm = amber, Cold = slate)
  - [x] 3.5 Implement "Match Properties" modal filtering by budget_min/budget_max
  - [x] 3.6 Add filters for Lead_Score, source, assigned agent plus text search
  - [x] 3.7 Add mock data fallback with amber sample banner

- [x] 4. Build Marketing Page
  - [x] 4.1 Create `src/app/admin/marketing/page.tsx` with KPI cards (campaigns, emails sent, avg open rate, avg click rate)
  - [x] 4.2 Add Recharts LineChart showing 30-day sent/open/click trends
  - [x] 4.3 Render campaign list table with status badges and action buttons
  - [x] 4.4 Implement "New Campaign" modal with all required fields
  - [x] 4.5 Implement "Send Now" flow calling `POST /api/send-email` per contact
  - [x] 4.6 Render template library section with 5 pre-built template cards
  - [x] 4.7 Add pill-toggle filters for campaign status plus mock data fallback

- [x] 5. Create Properties API Routes
  - [x] 5.1 Create `src/app/api/properties/route.ts` with GET (with status/deal_type/city filters) and POST
  - [x] 5.2 Create `src/app/api/properties/[id]/route.ts` with GET, PUT, DELETE (params awaited as Promise)

- [x] 6. Create Contacts API Route
  - [x] 6.1 Create `src/app/api/contacts/route.ts` with GET (with type filter) and POST

- [x] 7. Create Deals API Route
  - [x] 7.1 Create `src/app/api/deals/route.ts` with GET (joined with properties + contacts) and PUT (pipeline_stage update)

- [x] 8. Create Invoices API Route
  - [x] 8.1 Create `src/app/api/invoices/route.ts` with GET (joined with line items) and POST (invoice + line items transaction)

- [x] 9. Create Dashboard Stats API Route
  - [x] 9.1 Create `src/app/api/dashboard/stats/route.ts` running parallel Supabase queries and returning all KPI fields

- [x] 10. Create Send Email API Route + Email Templates
  - [x] 10.1 Create `src/lib/email-templates.ts` with five typed template functions (invoiceEmail, contractSignatureEmail, leadWelcomeEmail, appointmentReminderEmail, weeklyReportEmail)
  - [x] 10.2 Create `src/app/api/send-email/route.ts` checking RESEND_API_KEY, resolving templates, calling Resend API

- [x] 11. Create File Upload API Route + ImageUpload Component
  - [x] 11.1 Create `src/app/api/upload/route.ts` checking Cloudinary env vars and uploading via Cloudinary SDK
  - [x] 11.2 Create `src/components/ImageUpload.tsx` with drag-and-drop, progress indicator, onUpload callback, and folder prop

- [x] 12. Create AI Generate API Route
  - [x] 12.1 Create `src/app/api/ai/generate/route.ts` handling description, lead_score, and draft_email types via OpenAI SDK

- [x] 13. Create Stripe Routes + PaymentForm Component
  - [x] 13.1 Create `src/app/api/stripe/create-payment-intent/route.ts` reading amount/currency/metadata and calling Stripe API
  - [x] 13.2 Create `src/app/api/stripe/webhook/route.ts` verifying signature and handling payment_intent.succeeded / payment_intent.payment_failed
  - [x] 13.3 Create `src/components/PaymentForm.tsx` using Stripe Elements with CardElement and confirmCardPayment flow

- [x] 14. Create Send SMS API Route
  - [x] 14.1 Create `src/app/api/send-sms/route.ts` checking Twilio env vars, prepending type prefix, sending via Twilio REST API

- [x] 15. Create Auth Middleware
  - [x] 15.1 Create `src/middleware.ts` with matcher for /admin/:path* and /api/:path*
  - [x] 15.2 Implement Supabase SSR session check redirecting unauthenticated requests to /login
  - [x] 15.3 Implement read_only role redirect for /admin/settings and /admin/team
  - [x] 15.4 Implement in-memory rate limiting (100 req/min per IP) for /api/* routes
  - [x] 15.5 Pass through /api/stripe/webhook without auth or rate limiting

- [x] 16. Add Google Maps Integration
  - [x] 16.1 Create `src/lib/maps.ts` with calculateDistance Haversine utility function
  - [x] 16.2 Create `PropertyLocationPicker` component loading Google Maps JS API with draggable marker
  - [x] 16.3 Add map embed to Comps tab in `src/app/admin/properties/[id]/page.tsx` with fallback placeholder

- [x] 17. Add PDF Generation
  - [x] 17.1 Create `src/components/pdf/InvoicePDF.tsx` using @react-pdf/renderer with line items, totals, branding
  - [x] 17.2 Create `src/components/pdf/ContractPDF.tsx` with contract terms, parties, signature fields
  - [x] 17.3 Create `src/components/pdf/PropertyReportPDF.tsx` with property details and financial summary
  - [x] 17.4 Wire "Download PDF" buttons on invoices and contracts pages using pdf().toBlob() + browser download

- [x] 18. Add Supabase Realtime
  - [x] 18.1 Add Realtime subscription to `deals` table in pipeline/page.tsx (INSERT/UPDATE/DELETE)
  - [x] 18.2 Add Realtime subscription to `messages` table in messages/page.tsx (INSERT prepend)
  - [x] 18.3 Add Realtime subscription to `notifications` table in notifications/page.tsx (INSERT badge increment)
  - [x] 18.4 Ensure all subscriptions call supabase.removeChannel(channel) on component unmount

- [x] 19. Add Algolia Global Search
  - [x] 19.1 Create `src/components/GlobalSearch.tsx` with 300ms debounce, Algolia multi-index search, and local fallback
  - [x] 19.2 Wire GlobalSearch into the topbar search area in `src/app/admin/layout.tsx`
