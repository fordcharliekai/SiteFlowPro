const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim();

const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase
    .from('leads')
    .upsert({
      business_name: 'Test Plumber',
      slug: 'test-plumber',
      city: 'London',
      address: '123 Test St',
      phone: '0123456789',
      email: 'test@example.com'
    }, { onConflict: 'slug' })
    .select();

  console.log('Insert Result:', { data, error });
}

run();
