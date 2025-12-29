import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { categories } from "@/lib/categories"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Award, User, LogOut, Settings } from "lucide-react"
import { Navigation } from "@/components/navigation"

export const dynamic = "force-dynamic"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { verified?: string }
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: nominations, error } = await supabase
    .from("nominations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

  console.log("[v0] User ID:", user.id)
  console.log("[v0] Profile data:", profile)

  const nominationsByCategory = nominations?.reduce(
    (acc, nom) => {
      if (!acc[nom.category]) {
        acc[nom.category] = []
      }
      acc[nom.category].push(nom)
      return acc
    },
    {} as Record<string, any[]>,
  )

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/")
  }

  const userEmail = profile?.email || user.email
  const userName = profile?.full_name || user.user_metadata?.full_name || "User"
  const userPhone = profile?.phone || "N/A"

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {searchParams.verified === "true" && (
            <div className="mb-6 rounded-lg border border-green-500/50 bg-green-500/10 p-4">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                Email verified successfully! Welcome to Anon Awards 2026.
              </p>
            </div>
          )}

          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Welcome, {userName}</h1>
                <p className="text-muted-foreground">View and manage your nominations</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </Button>
                <form action={handleSignOut}>
                  <Button type="submit" variant="outline">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </form>
              </div>
            </div>

            {/* User Info Card */}
            <Card className="bg-card/50 border-primary/30">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 shrink-0">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="grid gap-1">
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="text-foreground font-medium">{userName}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-6">
                    <div className="grid gap-1">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-foreground font-medium text-sm sm:text-base break-all">{userEmail}</p>
                    </div>
                    <div className="grid gap-1">
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="text-foreground font-medium text-sm sm:text-base">{userPhone}</p>
                    </div>
                    {profile?.referred_by && (
                      <div className="grid gap-1 col-span-2 sm:col-span-1 sm:ml-auto">
                        <p className="text-sm text-muted-foreground">Referred by</p>
                        <p className="text-foreground font-medium">{profile.referred_by}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-card/50 border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Award className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{nominations?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Total Nominations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Award className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {Object.keys(nominationsByCategory || {}).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Categories Voted</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardContent className="pt-6 flex items-center justify-center">
                <Button asChild className="w-full">
                  <Link href="/nominate">Add More Nominations</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Nominations List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground mb-4">Your Nominations</h2>

            {!nominations || nominations.length === 0 ? (
              <Card className="bg-card/50 border-border">
                <CardContent className="pt-12 pb-12 text-center">
                  <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground mb-4">You haven't submitted any nominations yet.</p>
                  <Button asChild>
                    <Link href="/nominate">Submit Your First Nomination</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              categories
                .filter((cat) => nominationsByCategory?.[cat.id])
                .map((category) => (
                  <Card key={category.id} className="bg-card/50 border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-foreground">
                        <Award className="h-5 w-5 text-primary" />
                        {category.name}
                      </CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {nominationsByCategory[category.id].map((nomination) => (
                          <div key={nomination.id} className="p-4 rounded-lg bg-background/50 border border-border/50">
                            <div className="flex flex-col sm:flex-row gap-4">
                              {nomination.image_url && (
                                <div className="w-full sm:w-40 aspect-video sm:aspect-square shrink-0 overflow-hidden rounded-lg">
                                  <img
                                    src={nomination.image_url || "/placeholder.svg"}
                                    alt={nomination.nominee}
                                    className="w-full h-full object-cover border-2 border-primary/20"
                                  />
                                </div>
                              )}
                              <div className="flex-1 flex flex-col sm:flex-row items-start justify-between gap-4">
                                <div className="flex-1">
                                  <p className="font-medium text-foreground mb-1">
                                    <span className="text-muted-foreground text-sm">Nominee:</span> {nomination.nominee}
                                  </p>
                                  {nomination.reason && (
                                    <p className="text-sm text-muted-foreground">
                                      <span className="font-medium">Reason:</span> {nomination.reason}
                                    </p>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground whitespace-nowrap">
                                  {new Date(nomination.created_at).toLocaleString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
