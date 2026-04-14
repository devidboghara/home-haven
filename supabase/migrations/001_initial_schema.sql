-- Supabase Database Schema for Home Haven
-- Execute this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'agent' CHECK (role IN ('super_admin', 'manager', 'agent', 'read_only')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  commission_pct DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'manager')
  );

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================================
-- PROPERTIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  address TEXT NOT NULL,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  beds INTEGER,
  baths INTEGER,
  sqft INTEGER,
  year_built INTEGER,
  property_type TEXT,
  deal_type TEXT CHECK (deal_type IN ('Wholesale', 'Fix & Flip', 'Rental', 'Primary')),
  status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Pending', 'Sold', 'Off Market', 'Rented', 'Under Contract')),
  list_price DECIMAL(15,2),
  arv DECIMAL(15,2),
  rehab_cost DECIMAL(15,2),
  purchase_price DECIMAL(15,2),
  tour_url TEXT,
  assigned_agent_id UUID REFERENCES profiles(id),
  published BOOLEAN DEFAULT false,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published properties" ON properties
  FOR SELECT USING (published = true);

CREATE POLICY "Agents can view all properties" ON properties
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'manager', 'agent')
  );

CREATE POLICY "Agents can create properties" ON properties
  FOR INSERT WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'manager', 'agent')
  );

CREATE POLICY "Agents can update own properties" ON properties
  FOR UPDATE USING (
    assigned_agent_id = auth.uid() OR 
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'manager')
  );

-- ============================================================================
-- CONTACTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  contact_type TEXT NOT NULL,
  lead_score TEXT DEFAULT 'Cold' CHECK (lead_score IN ('Hot', 'Warm', 'Cold')),
  status TEXT DEFAULT 'Active',
  city TEXT,
  province TEXT,
  budget_min DECIMAL(15,2),
  budget_max DECIMAL(15,2),
  source TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  assigned_agent_id UUID REFERENCES profiles(id),
  last_contact_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents can view assigned contacts" ON contacts
  FOR SELECT USING (
    assigned_agent_id = auth.uid() OR
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'manager')
  );

CREATE POLICY "Agents can create contacts" ON contacts
  FOR INSERT WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'manager', 'agent')
  );

-- ============================================================================
-- DEALS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id),
  contact_id UUID REFERENCES contacts(id),
  assigned_agent_id UUID REFERENCES profiles(id),
  deal_type TEXT CHECK (deal_type IN ('Wholesale', 'Fix & Flip', 'Rental', 'Primary')),
  pipeline_stage TEXT DEFAULT 'New Leads' CHECK (pipeline_stage IN ('New Leads', 'No Contact Made', 'Contact Made', 'Appointment Set', 'Follow Up', 'Due Diligence', 'Closed Won', 'Closed Lost')),
  asking_price DECIMAL(15,2),
  offered_price DECIMAL(15,2),
  accepted_price DECIMAL(15,2),
  commission_amt DECIMAL(15,2),
  expected_close_date DATE,
  actual_close_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents can view assigned deals" ON deals
  FOR SELECT USING (
    assigned_agent_id = auth.uid() OR
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'manager')
  );

-- ============================================================================
-- PAYMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID,
  deal_id UUID REFERENCES deals(id),
  contact_id UUID REFERENCES contacts(id),
  payment_type TEXT NOT NULL CHECK (payment_type IN ('Deposit', 'Installment', 'Final Payment', 'Commission', 'Refund')),
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'CAD',
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Completed', 'Pending', 'Failed', 'Refunded')),
  payment_method TEXT CHECK (payment_method IN ('Bank Transfer', 'Cheque', 'Credit Card', 'Cash', 'Wire')),
  reference_no TEXT,
  payment_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents can view payments" ON payments
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'manager', 'agent')
  );

-- ============================================================================
-- MESSAGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_name TEXT,
  from_email TEXT,
  from_phone TEXT,
  to_agent_id UUID REFERENCES profiles(id),
  contact_id UUID REFERENCES contacts(id),
  property_id UUID REFERENCES properties(id),
  channel TEXT DEFAULT 'Email',
  subject TEXT,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  is_starred BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  reply_to_id UUID REFERENCES messages(id),
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents can view their messages" ON messages
  FOR SELECT USING (
    to_agent_id = auth.uid() OR
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'manager')
  );

-- ============================================================================
-- TASKS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'Todo' CHECK (status IN ('Todo', 'In Progress', 'Done', 'Cancelled')),
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
  due_date DATE,
  completed_at TIMESTAMP,
  assigned_to UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  property_id UUID REFERENCES properties(id),
  deal_id UUID REFERENCES deals(id),
  contact_id UUID REFERENCES contacts(id),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view assigned tasks" ON tasks
  FOR SELECT USING (
    assigned_to = auth.uid() OR
    created_by = auth.uid() OR
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'manager')
  );

-- ============================================================================
-- APPOINTMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  appointment_type TEXT DEFAULT 'Meeting' CHECK (appointment_type IN ('Site Visit', 'Client Meeting', 'Contract Signing', 'Inspection', 'Open House', 'Team Meeting', 'Call', 'Other')),
  status TEXT DEFAULT 'Scheduled',
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  location TEXT,
  is_virtual BOOLEAN DEFAULT false,
  meeting_url TEXT,
  property_id UUID REFERENCES properties(id),
  contact_id UUID REFERENCES contacts(id),
  deal_id UUID REFERENCES deals(id),
  agent_id UUID REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view appointments" ON appointments
  FOR SELECT USING (
    agent_id = auth.uid() OR
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'manager')
  );

-- ============================================================================
-- INVOICES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE NOT NULL,
  contact_id UUID REFERENCES contacts(id),
  property_id UUID REFERENCES properties(id),
  deal_id UUID REFERENCES deals(id),
  agent_id UUID REFERENCES profiles(id),
  invoice_type TEXT,
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Sent', 'Viewed', 'Paid', 'Overdue', 'Cancelled')),
  issue_date DATE NOT NULL,
  due_date DATE,
  paid_date DATE,
  subtotal DECIMAL(15,2) NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  tax_amount DECIMAL(15,2) DEFAULT 0,
  total_amount DECIMAL(15,2) NOT NULL,
  amount_paid DECIMAL(15,2) DEFAULT 0,
  currency TEXT DEFAULT 'CAD',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents can view invoices" ON invoices
  FOR SELECT USING (
    agent_id = auth.uid() OR
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'manager')
  );

-- ============================================================================
-- DOCUMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  file_url TEXT NOT NULL,
  document_type TEXT,
  related_entity_type TEXT,
  related_entity_id UUID,
  property_id UUID REFERENCES properties(id),
  deal_id UUID REFERENCES deals(id),
  contact_id UUID REFERENCES contacts(id),
  uploaded_by UUID REFERENCES profiles(id),
  uploadedAt TIMESTAMP DEFAULT NOW(),
  expiry_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view documents" ON documents
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'manager', 'agent')
  );

-- ============================================================================
-- MAINTENANCE_REQUESTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id),
  contact_id UUID REFERENCES contacts(id),
  assigned_to UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Emergency')),
  status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Pending Parts', 'Completed', 'Cancelled')),
  estimated_cost DECIMAL(15,2),
  actual_cost DECIMAL(15,2),
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  vendor_name TEXT,
  scheduled_date DATE,
  completed_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view maintenance requests" ON maintenance_requests
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'manager', 'agent')
  );

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  type TEXT DEFAULT 'system' CHECK (type IN ('new_lead', 'offer_update', 'deal_closed', 'task_due', 'appointment', 'contract', 'payment', 'system', 'workflow')),
  is_read BOOLEAN DEFAULT false,
  link TEXT,
  related_id UUID,
  related_type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

-- ============================================================================
-- CONTRACTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID REFERENCES deals(id),
  property_id UUID REFERENCES properties(id),
  contact_id UUID REFERENCES contacts(id),
  agent_id UUID REFERENCES profiles(id),
  contract_type TEXT,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Sent', 'Viewed', 'Signed', 'Expired', 'Cancelled')),
  file_url TEXT,
  signed_url TEXT,
  expiry_date DATE,
  signed_at TIMESTAMP,
  sent_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view contracts" ON contracts
  FOR SELECT USING (
    agent_id = auth.uid() OR
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('super_admin', 'manager')
  );

-- ============================================================================
-- Create indexes for better query performance
-- ============================================================================
CREATE INDEX idx_properties_agent ON properties(assigned_agent_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_contacts_agent ON contacts(assigned_agent_id);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_deals_agent ON deals(assigned_agent_id);
CREATE INDEX idx_deals_stage ON deals(pipeline_stage);
CREATE INDEX idx_messages_agent ON messages(to_agent_id);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX idx_appointments_agent ON appointments(agent_id);
CREATE INDEX idx_invoices_agent ON invoices(agent_id);
