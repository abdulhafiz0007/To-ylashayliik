import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "./components/ui/Layout"
import { Home } from "./pages/Home"
import { InvitationProvider } from "./context/InvitationContext"
import { Create } from "./pages/Create"
import { Invitation } from "./pages/Invitation"
import { TemplateSelection } from "./pages/TemplateSelection"

import { useEffect } from "react"
import { useTelegram } from "./hooks/useTelegram"

function App() {
  const { onReady } = useTelegram()

  useEffect(() => {
    onReady()
  }, [onReady])

  return (
    <InvitationProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/select-template" element={<TemplateSelection />} />
            <Route path="/invitation/:id" element={<Invitation />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </InvitationProvider>
  )
}

export default App
