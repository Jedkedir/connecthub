import { BrowserRouter } from "react-router-dom"

import { ThemeProvider } from "@/shared/components/theme-provider"

export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </ThemeProvider>
  )
}
