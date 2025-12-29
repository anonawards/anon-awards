import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { CategoryCard } from "@/components/category-card"
import { categories } from "@/lib/categories"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: async () => {
          return (await cookies()).getAll()
        },
        setAll: async (cookiesToSet) => {
          try {
            const cookieStore = await cookies()
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // Handle cookie setting errors
          }
        },
      },
    },
  )

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Hero />

      {/* Featured Categories Preview */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Award <span className="text-primary">Categories</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              16 unique categories celebrating the quirks, talents, and personalities that made 2025 unforgettable.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((category, index) => (
              <CategoryCard key={category.id} name={category.name} description={category.description} index={index} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline" className="border-primary/50 hover:bg-primary/10 bg-transparent">
              <Link href="/categories">
                View All 16 Categories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How It <span className="text-primary">Works</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Browse Categories</h3>
              <p className="text-muted-foreground">
                Explore 16 unique award categories and decide who deserves recognition.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Submit Nominations</h3>
              <p className="text-muted-foreground">
                Fill out the form anonymously. Add reasons if you want - they stay secret too.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Winners Revealed</h3>
              <p className="text-muted-foreground">
                Ring in 2026 with the big reveal! Winners announced on New Year's Day to celebrate the best of 2025.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
