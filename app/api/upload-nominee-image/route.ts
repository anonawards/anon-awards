import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    console.log("[v0] Image upload - Request received")
    console.log("[v0] Image upload - Checking Blob token:", {
      hasToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      tokenPrefix: process.env.BLOB_READ_WRITE_TOKEN?.substring(0, 10) + "...",
    })

    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) {
      console.error("[v0] Image upload - BLOB_READ_WRITE_TOKEN not found in environment")
      return NextResponse.json(
        {
          error: "Image upload not configured",
          hint: "Please ensure BLOB_READ_WRITE_TOKEN is set in your environment variables",
        },
        { status: 500 },
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.log("[v0] Image upload - No file provided")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("[v0] Image upload - File details:", {
      name: file.name,
      type: file.type,
      size: file.size,
    })

    // Validate file type
    if (!file.type.startsWith("image/")) {
      console.log("[v0] Image upload - Invalid file type:", file.type)
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log("[v0] Image upload - File too large:", file.size)
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    console.log("[v0] Image upload - Uploading to Vercel Blob...")

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
      token, // Explicitly pass the token to ensure it's used
    })

    console.log("[v0] Image upload - Success:", blob.url)
    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("[v0] Image upload error:", error)
    return NextResponse.json(
      {
        error: "Failed to upload image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
