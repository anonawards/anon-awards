"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setMessage(null)

    try {
      const redirectUrl = `https://anonawards.com/auth/reset-password`

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      })

      if (error) throw error

      setMessage({
        type: "success",
        text: "Password reset link sent! Check your email inbox (and spam folder).",
      })
      setEmail("")
    } catch (error: unknown) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to send reset email. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-md">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>Enter your email to receive a password reset link</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {message && (
                  <div
                    className={`p-4 rounded-lg text-sm ${
                      message.type === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
