import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Award, User, Calendar, ImageIcon } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { getAdminNominations } from "./actions"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("user_profiles").select("is_admin").eq("id", user.id).single()

  if (!profile?.is_admin) {
    redirect("/dashboard")
  }

  const { nominations: enrichedNominations, error } = await getAdminNominations()

  if (error) {
    console.error("[v0] Admin page - Error:", error)
  }

  // Calculate statistics using enriched nominations
  const totalNominations = enrichedNominations.length
  const uniqueUsers = new Set(enrichedNominations.map((n) => n.user_id)).size
  const nominationsWithImages = enrichedNominations.filter((n) => n.image_url).length
  const categoryCounts: Record<string, number> = {}
  enrichedNominations.forEach((n) => {
    categoryCounts[n.category] = (categoryCounts[n.category] || 0) + 1
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-amber-950/20 to-black">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-amber-400 mb-2">Admin Dashboard</h1>
          <p className="text-amber-100/60">View and manage all nominations</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-amber-900/20 to-amber-950/20 border border-amber-700/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="text-amber-200 font-medium">Total Nominations</h3>
            </div>
            <p className="text-3xl font-bold text-amber-400">{totalNominations}</p>
          </div>

          <div className="bg-gradient-to-br from-amber-900/20 to-amber-950/20 border border-amber-700/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <User className="w-5 h-5 text-amber-400" />
              <h3 className="text-amber-200 font-medium">Unique Users</h3>
            </div>
            <p className="text-3xl font-bold text-amber-400">{uniqueUsers}</p>
          </div>

          <div className="bg-gradient-to-br from-amber-900/20 to-amber-950/20 border border-amber-700/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <ImageIcon className="w-5 h-5 text-amber-400" />
              <h3 className="text-amber-200 font-medium">With Images</h3>
            </div>
            <p className="text-3xl font-bold text-amber-400">{nominationsWithImages}</p>
          </div>

          <div className="bg-gradient-to-br from-amber-900/20 to-amber-950/20 border border-amber-700/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <h3 className="text-amber-200 font-medium">Categories</h3>
            </div>
            <p className="text-3xl font-bold text-amber-400">{Object.keys(categoryCounts).length}</p>
          </div>
        </div>

        {/* All Nominations */}
        <div className="bg-gradient-to-br from-amber-900/10 to-amber-950/10 border border-amber-700/30 rounded-lg p-6">
          <h2 className="text-2xl font-serif text-amber-400 mb-6">All Nominations</h2>

          {enrichedNominations.length > 0 ? (
            <div className="space-y-4">
              {enrichedNominations.map((nomination) => (
                <div
                  key={nomination.id}
                  className="bg-black/40 border border-amber-700/20 rounded-lg p-4 hover:border-amber-700/40 transition-colors"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Image */}
                    {nomination.image_url && (
                      <div className="w-full md:w-32 h-32 flex-shrink-0">
                        <img
                          src={nomination.image_url || "/placeholder.svg"}
                          alt={nomination.nominee}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-amber-400">{nomination.nominee}</h3>
                          <p className="text-sm text-amber-200/60">{nomination.category}</p>
                        </div>
                        <span className="text-xs text-amber-200/40">
                          {new Date(nomination.created_at).toLocaleString("en-GB")}
                        </span>
                      </div>

                      {nomination.reason && (
                        <p className="text-amber-100/80 text-sm mb-3 line-clamp-2">{nomination.reason}</p>
                      )}

                      {/* User Info */}
                      <div className="flex flex-wrap gap-4 text-xs text-amber-200/50">
                        <span>
                          Submitted by:{" "}
                          <span className="text-amber-300">{nomination.user_profiles?.full_name || "Unknown"}</span>
                        </span>
                        <span>
                          Email: <span className="text-amber-300">{nomination.user_profiles?.email || "N/A"}</span>
                        </span>
                        {nomination.user_profiles?.phone && (
                          <span>
                            Phone: <span className="text-amber-300">{nomination.user_profiles.phone}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-amber-200/60 text-center py-8">No nominations yet.</p>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="bg-gradient-to-br from-amber-900/10 to-amber-950/10 border border-amber-700/30 rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-serif text-amber-400 mb-6">Category Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(categoryCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([category, count]) => (
                <div key={category} className="bg-black/40 border border-amber-700/20 rounded-lg p-4">
                  <h3 className="text-amber-400 font-medium mb-1">{category}</h3>
                  <p className="text-2xl font-bold text-amber-300">{count}</p>
                  <p className="text-xs text-amber-200/40">{((count / totalNominations) * 100).toFixed(1)}% of total</p>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  )
}
