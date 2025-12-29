import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { NominationForm } from "@/components/nomination-form"

export default function NominatePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Submit Your <span className="text-primary">Nominations</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Nominate your picks for any categories you choose. You don't need to fill them all - just the ones you
              care about. Your identity remains completely anonymous.
            </p>
          </div>

          {/* Nomination Form */}
          <NominationForm />
        </div>
      </div>

      <Footer />
    </main>
  )
}
