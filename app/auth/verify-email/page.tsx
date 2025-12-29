import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-md">
        <Card className="border-accent/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>We&apos;ve sent you a verification link</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Please check your email and click the verification link to complete your registration. The link will
              expire in 24 hours.
            </p>
            <p className="text-xs text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <Link href="/auth/signup" className="text-primary underline underline-offset-4">
                try signing up again
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
