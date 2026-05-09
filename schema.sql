-- Leads Table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name TEXT NOT NULL,
    slug TEXT UNIQUE, -- Added for direct slug-based access
    phone TEXT,
    email TEXT,
    address TEXT,
    city TEXT,
    website_status TEXT DEFAULT 'no-website', -- 'no-website', 'draft', 'live', 'no-email', 'contacted'
    stripe_checkout_id TEXT,
    subscription_status TEXT DEFAULT 'inactive', -- 'inactive', 'active'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sites Table (stores content for the auto-generated one-pagers)
CREATE TABLE sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    content JSONB NOT NULL, -- { header: "", services: [], contact_info: {} }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Config (optional, for pausing/resuming cron)
CREATE TABLE config (
    key TEXT PRIMARY KEY,
    value TEXT
);
INSERT INTO config (key, value) VALUES ('cron_enabled', 'true');
