"use server"

import { createClient } from "@supabase/supabase-js"

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function createUserProfile(data: {
  userId: string
  email: string
  fullName: string
  phone: string
  referredBy: string
}) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable")
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
  }

  console.log("[v0] Creating profile for user:", data.userId)

  // Use service role client to bypass RLS
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  let lastError: any
  const maxRetries = 5

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { error: upsertError } = await supabase.from("user_profiles").upsert(
        {
          id: data.userId,
          email: data.email,
          full_name: data.fullName,
          phone: data.phone,
          referred_by: data.referredBy,
        },
        {
          onConflict: "id",
        },
      )

      if (upsertError) {
        lastError = upsertError
        // If it's a foreign key error and we have retries left, wait and try again
        if (upsertError.code === "23503" && attempt < maxRetries) {
          console.log(`[v0] Foreign key error on attempt ${attempt}, retrying after delay...`)
          await sleep(1000 * attempt) // Exponential backoff: 1s, 2s, 3s, etc.
          continue
        }
        throw upsertError
      }

      // Verify the profile was created by fetching it
      const { data: profile, error: fetchError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", data.userId)
        .single()

      if (fetchError || !profile) {
        console.error("[v0] Profile verification error:", fetchError)
        throw new Error("Profile was not created successfully")
      }

      console.log("[v0] Profile created and verified successfully:", profile)
      return profile
    } catch (error: any) {
      lastError = error
      if (error.code === "23503" && attempt < maxRetries) {
        console.log(`[v0] Foreign key error on attempt ${attempt}, retrying after delay...`)
        await sleep(1000 * attempt)
        continue
      }
      break
    }
  }

  console.error("[v0] Profile creation failed after all retries:", lastError)
  throw new Error(`Failed to create profile: ${lastError?.message || "Unknown error"}`)
}
