"use client"

import type React from "react"
import { createUserProfile } from "./actions"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

const COUNTRY_CODES = [
  { code: "+1", country: "US/Canada" },
  { code: "+44", country: "UK" },
  { code: "+91", country: "India" },
  { code: "+92", country: "Pakistan" },
  { code: "+971", country: "UAE" },
  { code: "+966", country: "Saudi Arabia" },
  { code: "+974", country: "Qatar" },
  { code: "+965", country: "Kuwait" },
  { code: "+61", country: "Australia" },
  { code: "+64", country: "New Zealand" },
  { code: "+27", country: "South Africa" },
  { code: "+234", country: "Nigeria" },
  { code: "+254", country: "Kenya" },
  { code: "+86", country: "China" },
  { code: "+81", country: "Japan" },
  { code: "+82", country: "South Korea" },
  { code: "+65", country: "Singapore" },
  { code: "+60", country: "Malaysia" },
  { code: "+33", country: "France" },
  { code: "+49", country: "Germany" },
]

export default function SignUpPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [countryCode, setCountryCode] = useState("+44")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [referredBy, setReferredBy] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)
  const [passwordAttempts, setPasswordAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (!fullName.trim()) {
      setError("Name is required")
      setIsLoading(false)
      return
    }

    if (!phoneNumber.trim()) {
      setError("Phone number is required")
      setIsLoading(false)
      return
    }

    if (!password) {
      setError("Password is required")
      setIsLoading(false)
      return
    }

    if (password !== repeatPassword) {
      const newAttempts = passwordAttempts + 1
      setPasswordAttempts(newAttempts)

      if (newAttempts >= 3) {
        setIsBlocked(true)
        setError("Too many failed attempts. Please refresh the page to try again.")
        setIsLoading(false)
        return
      }

      setError(`Passwords do not match. ${3 - newAttempts} attempt${3 - newAttempts !== 1 ? "s" : ""} remaining.`)
      setIsLoading(false)
      return
    }

    if (!referredBy.trim()) {
      setError("Please enter who referred you")
      setIsLoading(false)
      return
    }

    if (!email.trim()) {
      setError("Email is required")
      setIsLoading(false)
      return
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `https://anonawards.com/auth/callback`,
          data: {
            referred_by: referredBy,
            full_name: fullName,
          },
        },
      })

      if (signUpError) {
        if (
          signUpError.message.includes("already registered") ||
          signUpError.message.includes("already been registered") ||
          signUpError.message.includes("User already registered") ||
          signUpError.message.includes("duplicate key value")
        ) {
          setError("This email is already registered. Please use a different email or login instead.")
          setIsLoading(false)
          return
        }
        throw signUpError
      }

      if (data.user) {
        try {
          const fullPhone = `${countryCode}${phoneNumber}`
          await createUserProfile({
            userId: data.user.id,
            email: email,
            fullName: fullName,
            phone: fullPhone,
            referredBy: referredBy,
          })
          console.log("[v0] Profile created successfully via server action")
        } catch (profileError) {
          console.error("[v0] Profile creation error:", profileError)
          setError(
            `Account created but profile setup failed: ${profileError instanceof Error ? profileError.message : "Unknown error"}`,
          )
          setIsLoading(false)
          return
        }
      }

      router.push("/auth/verify-email")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Sign up for Anon Awards 2026. Email verification required.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="full-name">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="full-name"
                    type="text"
                    placeholder="Your full name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Select value={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRY_CODES.map((item) => (
                          <SelectItem key={item.code} value={item.code}>
                            {item.code} {item.country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="1234567890"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Enter your phone number without country code</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">
                    Password <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isBlocked}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="repeat-password">
                    Confirm Password <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="repeat-password"
                      type={showRepeatPassword ? "text" : "password"}
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      disabled={isBlocked}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showRepeatPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="referred-by">
                    Who referred you? <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="referred-by"
                    type="text"
                    placeholder="Name of person who referred you"
                    required
                    value={referredBy}
                    onChange={(e) => setReferredBy(e.target.value)}
                  />
                </div>
                {error && (
                  <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                    <p className="text-sm font-medium text-destructive">{error}</p>
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading || isBlocked}>
                  {isLoading ? "Creating account..." : "Sign up"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary underline underline-offset-4 hover:text-primary/80">
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
