const { createClient } = require('@supabase/supabase-js')

async function seedAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing env vars: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  console.log('Seeding admin user...')
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin@siteflowpro.app',
    password: 'SiteFlowPro2026!',
    email_confirm: true
  })

  if (error) {
    console.error('Error seeding admin:', error.message)
  } else {
    console.log('Admin user created successfully:', data.user.email)
  }
}

seedAdmin()
