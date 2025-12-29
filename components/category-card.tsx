import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CategoryCardProps {
  name: string
  description: string
  index: number
}

export function CategoryCard({ name, description, index }: CategoryCardProps) {
  return (
    <Card className="group bg-card/50 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm">
            {index + 1}
          </div>
          <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors">{name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground text-sm">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
