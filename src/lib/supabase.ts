import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Types ─────────────────────────────────────────────────────────────────────

export type Role = "super_admin" | "manager" | "agent" | "read_only";
export type DealType = "Wholesale" | "Fix & Flip" | "Rental" | "Primary";
export type LeadScore = "Hot" | "Warm" | "Cold";
export type PropertyStatus = "Available" | "Pending" | "Sold" | "Off Market" | "Rented" | "Under Contract";
export type PipelineStage = "New Leads" | "No Contact Made" | "Contact Made" | "Appointment Set" | "Follow Up" | "Due Diligence" | "Closed Won" | "Closed Lost";
export type TaskStatus = "Todo" | "In Progress" | "Done" | "Cancelled";
export type TaskPriority = "Low" | "Medium" | "High" | "Urgent";
export type AppointmentType = "Site Visit" | "Client Meeting" | "Contract Signing" | "Inspection" | "Open House" | "Team Meeting" | "Call" | "Other";
export type InvoiceStatus = "Draft" | "Sent" | "Viewed" | "Paid" | "Overdue" | "Cancelled";
export type ContractStatus = "Draft" | "Sent" | "Viewed" | "Signed" | "Expired" | "Cancelled";
export type MaintenancePriority = "Low" | "Medium" | "High" | "Emergency";
export type MaintenanceStatus = "Open" | "In Progress" | "Pending Parts" | "Completed" | "Cancelled";
export type NotificationType = "new_lead" | "offer_update" | "deal_closed" | "task_due" | "appointment" | "contract" | "payment" | "system" | "workflow";

export type PaymentStatus = "Completed" | "Pending" | "Failed" | "Refunded";
export type PaymentType = "Deposit" | "Installment" | "Final Payment" | "Commission" | "Refund";
export type PaymentMethod = "Bank Transfer" | "Cheque" | "Credit Card" | "Cash" | "Wire";

export interface Payment {
  id: string;
  invoice_id: string | null;
  deal_id: string | null;
  contact_id: string | null;
  payment_type: PaymentType;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method: PaymentMethod;
  reference_no: string;
  payment_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: Role;
  status: "active" | "inactive";
  commission_pct: number;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  address: string;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  year_built: number | null;
  property_type: string;
  deal_type: DealType | null;
  status: PropertyStatus;
  list_price: number | null;
  arv: number | null;
  rehab_cost: number | null;
  purchase_price: number | null;
  images: string[] | null;
  tour_url: string | null;
  assigned_agent_id: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  contact_type: string;
  lead_score: LeadScore;
  status: string;
  city: string | null;
  province: string | null;
  budget_min: number | null;
  budget_max: number | null;
  source: string | null;
  tags: string[] | null;
  assigned_agent_id: string | null;
  last_contact_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  property_id: string | null;
  contact_id: string | null;
  assigned_agent_id: string | null;
  deal_type: DealType | null;
  pipeline_stage: PipelineStage;
  asking_price: number | null;
  offered_price: number | null;
  accepted_price: number | null;
  commission_amt: number | null;
  expected_close_date: string | null;
  actual_close_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  completed_at: string | null;
  assigned_to: string | null;
  created_by: string | null;
  property_id: string | null;
  deal_id: string | null;
  contact_id: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  title: string;
  description: string | null;
  appointment_type: AppointmentType;
  status: string;
  start_time: string;
  end_time: string;
  location: string | null;
  is_virtual: boolean;
  meeting_url: string | null;
  property_id: string | null;
  contact_id: string | null;
  deal_id: string | null;
  agent_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  contact_id: string | null;
  property_id: string | null;
  deal_id: string | null;
  agent_id: string | null;
  invoice_type: string | null;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string | null;
  paid_date: string | null;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  amount_paid: number;
  currency: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceLineItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  created_at: string;
}

export interface Message {
  id: string;
  from_name: string | null;
  from_email: string | null;
  from_phone: string | null;
  to_agent_id: string | null;
  contact_id: string | null;
  property_id: string | null;
  channel: string;
  subject: string | null;
  body: string;
  is_read: boolean;
  is_starred: boolean;
  is_archived: boolean;
  reply_to_id: string | null;
  sent_at: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  type: NotificationType;
  is_read: boolean;
  link: string | null;
  related_id: string | null;
  related_type: string | null;
  created_at: string;
}

export interface Contract {
  id: string;
  deal_id: string | null;
  property_id: string | null;
  contact_id: string | null;
  agent_id: string | null;
  contract_type: string | null;
  title: string;
  status: ContractStatus;
  file_url: string | null;
  signed_url: string | null;
  expiry_date: string | null;
  signed_at: string | null;
  sent_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceRequest {
  id: string;
  property_id: string;
  contact_id: string | null;
  assigned_to: string | null;
  title: string;
  description: string | null;
  category: string | null;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  estimated_cost: number | null;
  actual_cost: number | null;
  images: string[] | null;
  vendor_name: string | null;
  scheduled_date: string | null;
  completed_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ── Helper functions ──────────────────────────────────────────────────────────

// Properties
export const getProperties = () =>
  supabase.from("properties").select("*").order("created_at", { ascending: false });

export const getProperty = (id: string) =>
  supabase.from("properties").select("*").eq("id", id).single();

export const createProperty = (data: Partial<Property>) =>
  supabase.from("properties").insert(data).select().single();

export const updateProperty = (id: string, data: Partial<Property>) =>
  supabase.from("properties").update(data).eq("id", id).select().single();

export const deleteProperty = (id: string) =>
  supabase.from("properties").delete().eq("id", id);

// Contacts
export const getContacts = () =>
  supabase.from("contacts").select("*").order("created_at", { ascending: false });

export const getContact = (id: string) =>
  supabase.from("contacts").select("*").eq("id", id).single();

export const createContact = (data: Partial<Contact>) =>
  supabase.from("contacts").insert(data).select().single();

export const updateContact = (id: string, data: Partial<Contact>) =>
  supabase.from("contacts").update(data).eq("id", id).select().single();

// Tasks
export const getTasks = () =>
  supabase.from("tasks").select("*, profiles!assigned_to(full_name)").order("due_date", { ascending: true });

export const createTask = (data: Partial<Task>) =>
  supabase.from("tasks").insert(data).select().single();

export const updateTask = (id: string, data: Partial<Task>) =>
  supabase.from("tasks").update(data).eq("id", id).select().single();

export const deleteTask = (id: string) =>
  supabase.from("tasks").delete().eq("id", id);

// Appointments
export const getAppointments = () =>
  supabase.from("appointments").select("*").order("start_time", { ascending: true });

export const createAppointment = (data: Partial<Appointment>) =>
  supabase.from("appointments").insert(data).select().single();

export const updateAppointment = (id: string, data: Partial<Appointment>) =>
  supabase.from("appointments").update(data).eq("id", id).select().single();

export const deleteAppointment = (id: string) =>
  supabase.from("appointments").delete().eq("id", id);

// Invoices
export const getInvoices = () =>
  supabase.from("invoices").select("*, invoice_line_items(*)").order("created_at", { ascending: false });

export const createInvoice = (data: Partial<Invoice>) =>
  supabase.from("invoices").insert(data).select().single();

export const updateInvoice = (id: string, data: Partial<Invoice>) =>
  supabase.from("invoices").update(data).eq("id", id).select().single();

// Messages
export const getMessages = () =>
  supabase.from("messages").select("*").eq("is_archived", false).order("sent_at", { ascending: false });

export const markMessageRead = (id: string) =>
  supabase.from("messages").update({ is_read: true }).eq("id", id);

export const archiveMessage = (id: string) =>
  supabase.from("messages").update({ is_archived: true }).eq("id", id);

// Notifications
export const getNotifications = (userId: string) =>
  supabase.from("notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false });

export const markNotificationRead = (id: string) =>
  supabase.from("notifications").update({ is_read: true }).eq("id", id);

export const markAllNotificationsRead = (userId: string) =>
  supabase.from("notifications").update({ is_read: true }).eq("user_id", userId);

// Contracts
export const getContracts = () =>
  supabase.from("contracts").select("*").order("created_at", { ascending: false });

export const createContract = (data: Partial<Contract>) =>
  supabase.from("contracts").insert(data).select().single();

export const updateContract = (id: string, data: Partial<Contract>) =>
  supabase.from("contracts").update(data).eq("id", id).select().single();

// Activity log
export const logActivity = (data: {
  user_id: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  entity_label?: string;
  metadata?: Record<string, unknown>;
}) => supabase.from("activity_log").insert(data);

// Dashboard stats
export const getDashboardStats = async () => {
  const [properties, contacts, deals, invoices] = await Promise.all([
    supabase.from("properties").select("id, status, list_price"),
    supabase.from("contacts").select("id, lead_score, contact_type"),
    supabase.from("deals").select("id, pipeline_stage, accepted_price"),
    supabase.from("invoices").select("id, status, total_amount"),
  ]);
  return { properties, contacts, deals, invoices };
};