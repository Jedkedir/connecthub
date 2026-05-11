import { Separator } from "@/components/ui/separator"

export default function Footer() {
  return (
    <footer className="bg-background">
      <Separator />
      <div className="mx-auto max-w-screen-2xl px-4 py-4 text-center text-xs text-muted-foreground md:px-8">
        <p>© {new Date().getFullYear()} ConnectHub. All rights reserved.</p>
      </div>
    </footer>
  )
}
