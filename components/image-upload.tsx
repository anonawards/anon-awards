"use client"

import type React from "react"

import { useState } from "react"
import { X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  onImageUpload: (url: string) => void
  currentImageUrl?: string
  onImageRemove: () => void
}

export function ImageUpload({ onImageUpload, currentImageUrl, onImageRemove }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      await uploadFile(files[0])
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await uploadFile(files[0])
    }
  }

  const uploadFile = async (file: File) => {
    console.log("[v0] ImageUpload - Starting upload:", file.name, file.type, file.size)

    if (!file.type.startsWith("image/")) {
      console.log("[v0] ImageUpload - Invalid file type")
      setError("Please upload an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      console.log("[v0] ImageUpload - File too large")
      setError("Image must be less than 5MB")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      console.log("[v0] ImageUpload - Sending request to API")
      const response = await fetch("/api/upload-nominee-image", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      console.log("[v0] ImageUpload - API response:", { status: response.status, data })

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload")
      }

      console.log("[v0] ImageUpload - Upload successful:", data.url)
      onImageUpload(data.url)
    } catch (err) {
      console.error("[v0] ImageUpload - Error:", err)
      setError(err instanceof Error ? err.message : "Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  if (currentImageUrl) {
    return (
      <div className="relative w-full aspect-video max-w-[300px] mx-auto overflow-hidden rounded-lg">
        <img
          src={currentImageUrl || "/placeholder.svg"}
          alt="Nominee"
          className="w-full h-full object-contain bg-background/50 border-2 border-amber-500/20 rounded-lg"
        />
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 z-10"
          onClick={onImageRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragging ? "border-amber-500 bg-amber-500/10" : "border-amber-900/30 hover:border-amber-500/50"}
          ${isUploading ? "opacity-50 pointer-events-none" : ""}
        `}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        <div className="flex flex-col items-center gap-2">
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500" />
              <p className="text-sm text-amber-100/70">Uploading...</p>
            </>
          ) : (
            <>
              <ImageIcon className="h-10 w-10 text-amber-500/50" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-100">Drop image here or tap to browse</p>
                <p className="text-xs text-amber-100/50">PNG, JPG up to 5MB</p>
              </div>
            </>
          )}
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  )
}
