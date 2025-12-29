"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LogIn, UserPlus, LayoutDashboard } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profile } = await supabase.from("user_profiles").select("is_admin").eq("id", user.id).single()
        setIsAdmin(profile?.is_admin || false)
      } else {
        setIsAdmin(false)
      }
    }

    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        checkUser()
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const links = [
    { href: "/", label: "Home" },
    { href: "/categories", label: "Categories" },
    { href: "/nominate", label: "Nominate" },
    { href: "/winners", label: "Winners" },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Anon Awards Logo" width={40} height={40} className="object-contain" />
            <span className="text-xl font-bold text-primary">ANON AWARDS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 ml-4">
              {user ? (
                <>
                  <Button asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                  {isAdmin && (
                    <Button asChild variant="outline">
                      <Link href="/admin">Admin</Link>
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/auth/login">
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/auth/signup">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="px-4 py-4 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-3 px-4 rounded-lg text-base font-medium transition-colors ${
                  pathname === link.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 space-y-2 border-t border-border mt-4">
              {user ? (
                <>
                  <Button asChild className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                    <Link href="/dashboard">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                  {isAdmin && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href="/admin">Admin</Link>
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link href="/auth/login">
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                    <Link href="/auth/signup">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
