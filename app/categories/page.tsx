import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CategoryCard } from "@/components/category-card"
import { categories } from "@/lib/categories"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Award <span className="text-primary">Categories</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              16 prestigious categories celebrating the diverse personalities and qualities that defined 2025. You do
              not need to nominate in every category.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {categories.map((category, index) => (
              <CategoryCard key={category.id} name={category.name} description={category.description} index={index} />
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button asChild size="lg" className="min-h-[48px] px-8">
              <Link href="/nominate">
                Start Nominating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
