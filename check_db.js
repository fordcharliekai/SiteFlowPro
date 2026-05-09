const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching leads:', error);
  } else if (data && data.length > 0) {
    console.log('Columns in leads table:', Object.keys(data[0]));
  } else {
    console.log('No data in leads table, checking schema via rpc if possible or assuming columns from schema.sql');
    // Try to get one even if empty to see keys? Not possible if empty.
  }
}

checkColumns();
