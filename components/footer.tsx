import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              Your nominations remain anonymous. Names may be changed but we will make sure you know who you are...
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/categories" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Categories
            </Link>
            <Link href="/nominate" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Nominate
            </Link>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">Anon Awards 2026. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
