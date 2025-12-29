"use server"

import { createClient } from "@supabase/supabase-js"

export async function updateUserProfile(data: {
  userId: string
  fullName: string
  phone: string
}) {
  // Use service role client to bypass RLS
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const { error } = await supabase
    .from("user_profiles")
    .update({
      full_name: data.fullName,
      phone: data.phone,
    })
    .eq("id", data.userId)

  if (error) {
    console.error("[v0] Server action profile update error:", error)
    throw new Error(error.message)
  }

  return { success: true }
}
