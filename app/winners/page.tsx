import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Trophy } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CountdownTimer } from "@/components/countdown-timer"

export default function WinnersPage() {
  // Check if we're past January 1st, 2026
  const revealDate = new Date("2026-01-01T00:00:00")
  const now = new Date()
  const isRevealed = now >= revealDate

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-20 min-h-[80vh] flex items-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {isRevealed ? (
            // Winners will be shown here after January 1st, 2026
            <div className="text-center">
              <Trophy className="w-20 h-20 text-primary mx-auto mb-6" />
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                <span className="text-primary">Winners</span> of 2026
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                The results are in! Here are your Anon Awards 2026 winners.
              </p>
              {/* Winners list would go here */}
            </div>
          ) : (
            // Countdown/Coming Soon
            <Card className="bg-card/50 border-primary/30">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                  Coming <span className="text-primary">Soon</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8">Winners will be announced on January 1st, 2026.</p>

                <CountdownTimer targetDate={revealDate} />

                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  The votes are being counted. Make sure you&apos;ve submitted your nominations before the deadline!
                </p>

                <Button asChild size="lg" className="min-h-[48px]">
                  <Link href="/nominate">Submit Nominations</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
