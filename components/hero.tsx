import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Award } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

      {/* Animated particles/sparkles effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-primary/50 rounded-full animate-pulse delay-150" />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-primary/40 rounded-full animate-pulse delay-300" />
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-primary/60 rounded-full animate-pulse delay-500" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Logo */}
        <div className="mb-8 float">
          <Image
            src="/images/0896561a-9b00-4a48-9cd7.jpeg"
            alt="Anon Awards 2026 Trophy"
            width={400}
            height={400}
            className="mx-auto rounded-2xl shadow-2xl shadow-primary/20"
            priority
          />
        </div>

        <div className="mb-6 inline-block">
          <div className="px-6 py-2 rounded-full bg-primary/20 border border-primary/40">
            <p className="text-sm sm:text-base text-primary font-semibold">
              Celebrating the Best of 2025 • Revealed New Year's Day 2026
            </p>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
          <span className="text-primary">Anonymous</span> Nominations.
          <br />
          <span className="text-primary">Real</span> Recognition.
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
          Looking back at 2025, your identity stays secret while your nominations speak volumes. Cast your vote for the
          most deserving individuals across 16 prestigious categories.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="min-h-[48px] px-8 text-lg group">
            <Link href="/nominate">
              <Award className="mr-2 h-5 w-5" />
              Start Nominating
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="min-h-[48px] px-8 text-lg border-primary/50 hover:bg-primary/10 bg-transparent"
          >
            <Link href="/categories">View Categories</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold text-primary">16</p>
            <p className="text-sm text-muted-foreground">Categories</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold text-primary">100%</p>
            <p className="text-sm text-muted-foreground">Anonymous</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold text-primary">2026</p>
            <p className="text-sm text-muted-foreground">Edition</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold text-primary">Jan 1</p>
            <p className="text-sm text-muted-foreground">Winners Announced</p>
          </div>
        </div>
      </div>
    </section>
  )
}
