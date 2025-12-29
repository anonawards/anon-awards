import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function VerifyPhonePage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-md">
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle className="text-2xl">Check Your Phone</CardTitle>
            <CardDescription>We sent you a verification code via SMS</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Please check your messages for a verification code. Enter the code to complete your registration.
              </p>
              <p className="text-sm text-muted-foreground">
                If you don't receive the code within a few minutes, please try signing up again.
              </p>
              <Button asChild className="w-full">
                <Link href="/auth/login">Go to Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
