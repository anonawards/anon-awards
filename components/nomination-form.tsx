"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { categories } from "@/lib/categories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Loader2, Send, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { ImageUpload } from "@/components/image-upload"

interface NominationData {
  [key: string]: {
    nominee: string
    reason: string
    image_url?: string
  }
}

export function NominationForm() {
  const [nominations, setNominations] = useState<NominationData>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadDraft = () => {
      try {
        const saved = localStorage.getItem("anon_awards_nominations_draft")
        if (saved) {
          const draft = JSON.parse(saved)
          setNominations(draft)
          setHasLoadedDraft(true)
        }
      } catch (err) {
        console.error("Failed to load draft:", err)
      }
    }
    loadDraft()
  }, [])

  useEffect(() => {
    if (Object.keys(nominations).length > 0) {
      try {
        localStorage.setItem("anon_awards_nominations_draft", JSON.stringify(nominations))
        setLastSaved(new Date())
      } catch (err) {
        console.error("Failed to autosave:", err)
      }
    }
  }, [nominations])

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (!user) {
        router.push("/auth/login")
      }
    }
    checkUser()
  }, [router])

  const handleNomineeChange = (categoryId: string, value: string) => {
    setNominations((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        nominee: value,
        reason: prev[categoryId]?.reason || "",
        image_url: prev[categoryId]?.image_url || undefined,
      },
    }))
  }

  const handleReasonChange = (categoryId: string, value: string) => {
    setNominations((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        nominee: prev[categoryId]?.nominee || "",
        reason: value,
        image_url: prev[categoryId]?.image_url || undefined,
      },
    }))
  }

  const handleImageUpload = (categoryId: string, url: string) => {
    setNominations((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        nominee: prev[categoryId]?.nominee || "",
        reason: prev[categoryId]?.reason || "",
        image_url: url,
      },
    }))
  }

  const handleImageRemove = (categoryId: string) => {
    setNominations((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        image_url: undefined,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!user) {
      setError("You must be logged in to submit nominations.")
      setIsSubmitting(false)
      router.push("/auth/login")
      return
    }

    const supabase = createClient()

    const validNominations = Object.entries(nominations)
      .filter(([_, data]) => data.nominee.trim() !== "")
      .map(([categoryId, data]) => ({
        category: categoryId,
        nominee: data.nominee.trim(),
        reason: data.reason.trim() || null,
        user_id: user.id,
        image_url: data.image_url || null,
      }))

    try {
      const { error: insertError } = await supabase.from("nominations").insert(validNominations)

      if (insertError) throw insertError

      localStorage.removeItem("anon_awards_nominations_draft")
      setIsSubmitted(true)
    } catch (err) {
      console.error("Error submitting nominations:", err)
      setError("Failed to submit nominations. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <Card className="bg-card/50 border-border">
        <CardContent className="pt-12 pb-12 text-center">
          <Loader2 className="w-16 h-16 text-primary mx-auto mb-6 animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  if (isSubmitted) {
    return (
      <Card className="bg-card/50 border-primary/30">
        <CardContent className="pt-12 pb-12 text-center">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-foreground mb-2">Nominations Submitted!</h3>
          <p className="text-muted-foreground mb-6">
            Your nominations have been recorded. Thank you for participating in Anon Awards 2026!
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => {
                setIsSubmitted(false)
                setNominations({})
              }}
              variant="outline"
            >
              Submit More Nominations
            </Button>
            <Button onClick={() => router.push("/dashboard")}>View Your Dashboard</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="bg-card/50 border-border mb-6">
        <CardHeader>
          <CardTitle className="text-foreground">Nomination Guidelines</CardTitle>
          <CardDescription>
            You can nominate in as many or as few categories as you like - there's no requirement to fill them all. Add
            brief reasons for your nominations if you wish. Your submissions are completely anonymous, though names may
            be changed to protect identities.
          </CardDescription>
        </CardHeader>
      </Card>

      {hasLoadedDraft && (
        <div className="mb-4 p-3 bg-primary/10 border border-primary/30 rounded-lg flex items-center gap-2">
          <Save className="h-4 w-4 text-primary" />
          <p className="text-sm text-foreground">
            Your draft has been restored. Your progress is automatically saved as you type.
          </p>
        </div>
      )}

      {lastSaved && !hasLoadedDraft && (
        <div className="mb-4 p-2 bg-muted/50 border border-border rounded-lg flex items-center gap-2 justify-center">
          <Save className="h-3 w-3 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Last saved: {lastSaved.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {categories.map((category, index) => (
          <Card key={category.id} className="bg-card/50 border-border hover:border-primary/30 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <CardTitle className="text-lg text-foreground">{category.name}</CardTitle>
                  <CardDescription className="text-sm">{category.brief}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor={`nominee-${category.id}`} className="text-sm text-muted-foreground">
                  Nominee Name
                </Label>
                <Input
                  id={`nominee-${category.id}`}
                  placeholder="Enter nominee's name"
                  value={nominations[category.id]?.nominee || ""}
                  onChange={(e) => handleNomineeChange(category.id, e.target.value)}
                  className="bg-input border-border"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Nominee Photo (Optional)</Label>
                <ImageUpload
                  onImageUpload={(url) => handleImageUpload(category.id, url)}
                  currentImageUrl={nominations[category.id]?.image_url}
                  onImageRemove={() => handleImageRemove(category.id)}
                />
              </div>
              <div>
                <Label htmlFor={`reason-${category.id}`} className="text-sm text-muted-foreground">
                  Reason (Optional)
                </Label>
                <Textarea
                  id={`reason-${category.id}`}
                  placeholder="Why are you nominating this person?"
                  value={nominations[category.id]?.reason || ""}
                  onChange={(e) => handleReasonChange(category.id, e.target.value)}
                  className="bg-input border-border resize-none"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {error && (
        <div className="mt-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      <div className="mt-8 text-center">
        <Button type="submit" size="lg" className="min-h-[48px] px-12" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Submit Nominations
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
