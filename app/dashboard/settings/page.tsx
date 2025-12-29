"use client"

import type React from "react"
import { updateUserProfile } from "./actions"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Navigation } from "@/components/navigation"

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

export default function SettingsPage() {
  const [fullName, setFullName] = useState("")
  const [countryCode, setCountryCode] = useState("+44") // Default country code changed from +1 to +44 UK
  const [phoneNumber, setPhoneNumber] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

      if (profile) {
        setFullName(profile.full_name || "")
        if (profile.phone) {
          // Extract country code and phone number
          const match = profile.phone.match(/^(\+\d{1,3})(.+)$/)
          if (match) {
            setCountryCode(match[1])
            setPhoneNumber(match[2])
          }
        }
      }
    } catch (error) {
      console.error("[v0] Error loading profile:", error)
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    if (!fullName.trim()) {
      setMessage({ type: "error", text: "Name is required" })
      setIsLoading(false)
      return
    }

    if (!phoneNumber.trim()) {
      setMessage({ type: "error", text: "Phone number is required" })
      setIsLoading(false)
      return
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const fullPhone = `${countryCode}${phoneNumber}`

      await updateUserProfile({
        userId: user.id,
        fullName: fullName,
        phone: fullPhone,
      })

      setMessage({ type: "success", text: "Profile updated successfully!" })
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 1500)
    } catch (error) {
      console.error("[v0] Profile update error:", error)
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Failed to update profile" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" })
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      setMessage({ type: "success", text: "Password changed successfully!" })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Failed to change password" })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingProfile) {
    return (
      <>
        <Navigation />
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <h1 className="text-4xl font-bold text-foreground mb-8">Account Settings</h1>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Update Profile */}
          <Card className="mb-6 border-border">
            <CardHeader>
              <CardTitle>Update Profile</CardTitle>
              <CardDescription>Change your name and phone number</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile}>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="full-name">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="full-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
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
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="flex-1"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Profile"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword}>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Changing..." : "Change Password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
