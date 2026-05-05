import { BrowserRouter } from "react-router-dom"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/shared/components/theme-provider"
export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  )
}
