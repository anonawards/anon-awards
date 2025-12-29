"use server"

import { createClient } from "@supabase/supabase-js"
import { createClient as createAuthClient } from "@/lib/supabase/server"

export async function getAdminNominations() {
  // First verify the user is an admin using regular auth client
  const supabase = await createAuthClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.log("[v0] Admin action - No user found")
    return { nominations: [], error: "Unauthorized" }
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("user_profiles").select("is_admin").eq("id", user.id).single()

  if (!profile?.is_admin) {
    console.log("[v0] Admin action - User is not admin")
    return { nominations: [], error: "Unauthorized - Not an admin" }
  }

  // Use service role client to bypass RLS and fetch all nominations
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("[v0] Admin action - Service role key not configured")
    return { nominations: [], error: "Server configuration error" }
  }

  const adminClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  // Fetch all nominations
  const { data: nominations, error: nomError } = await adminClient
    .from("nominations")
    .select("*")
    .order("created_at", { ascending: false })

  if (nomError) {
    console.error("[v0] Admin action - Error fetching nominations:", nomError)
    return { nominations: [], error: nomError.message }
  }

  // Fetch all user profiles
  const { data: profiles, error: profileError } = await adminClient
    .from("user_profiles")
    .select("id, full_name, email, phone")

  if (profileError) {
    console.error("[v0] Admin action - Error fetching profiles:", profileError)
  }

  // Create a map of user profiles
  const profileMap = new Map(profiles?.map((p) => [p.id, p]) || [])

  // Join nominations with user data
  const nominationsWithUsers =
    nominations?.map((nom) => ({
      ...nom,
      user_profiles: profileMap.get(nom.user_id) || null,
    })) || []

  console.log("[v0] Admin action - Successfully fetched", nominationsWithUsers.length, "nominations")

  return { nominations: nominationsWithUsers, error: null }
}
