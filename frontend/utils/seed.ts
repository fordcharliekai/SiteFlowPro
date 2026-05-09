import { createAdminClient } from './supabase/admin'

export async function ensureAdminExists() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@siteflowpro.app'
  const adminPassword = process.env.ADMIN_PASSWORD || 'SiteFlowPro2026!'
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY not set. Skipping admin seed check.')
    return
  }

  const supabase = createAdminClient()

  // Check if user exists
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
  
  if (listError) {
    console.error('Error listing users during seed check:', listError.message)
    return
  }

  const adminUser = users.find(u => u.email === adminEmail)

  if (!adminUser) {
    console.log(`Admin user ${adminEmail} not found. Creating...`)
    const { error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true
    })

    if (createError) {
      console.error('Failed to create admin user:', createError.message)
    } else {
      console.log('Admin user created successfully.')
    }
  }
}
