// Version: 1.0.1 (Build trigger after lint fix)
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "./components/ui/Layout"
import { Home } from "./pages/Home"
import { InvitationProvider } from "./context/InvitationContext"
import { Create } from "./pages/Create"
import { Invitation } from "./pages/Invitation"
import { Profile } from "./pages/Profile"

import { useEffect, useState } from "react"
import { useTelegram } from "./hooks/useTelegram"
import { api } from "./lib/api"
import { Heart, X } from "lucide-react"
import { Button } from "./components/ui/Button"
import { LanguageProvider } from "./context/LanguageContext"
import { ThemeProvider } from "./context/ThemeContext"

function App() {
  const { onReady, isTelegram, initData } = useTelegram()
  const [isAuth, setIsAuth] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    onReady()

    if (isTelegram && initData) {
      console.log("DEBUG: Starting authTelegram with initData length:", initData.length);
      api.authTelegram(initData)
        .then((res) => {
          console.log("DEBUG: Auth success response structure:", Object.keys(res));
          setIsAuth(true);
        })
        .catch((err) => {
          console.error("DEBUG: Auth failed details:", err);
          if (err.message.includes('401')) {
            setAuthError(`Kirishda xatolik (401): Telegram ma'lumotlari server tomonidan qabul qilinmadi.`);
          } else {
            setAuthError(`Kirishda xatolik: ${err.message}`);
          }
        });
    }
  }, [onReady, isTelegram, initData])

  if (!isTelegram) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background text-center">
        <div className="max-w-md space-y-4">
          <Heart className="h-12 w-12 text-primary-500 mx-auto animate-pulse" />
          <h1 className="text-2xl font-serif font-bold text-gray-900">Iltimos, Telegram orqali kiring</h1>
          <p className="text-gray-600">Ushbu dastur faqat Telegram Mini App ichida ishlaydi.</p>
        </div>
      </div>
    )
  }

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background text-center">
        <div className="max-w-md space-y-4 text-red-600">
          <X className="h-12 w-12 mx-auto" />
          <h1 className="text-2xl font-serif font-bold">Xatolik yuz berdi</h1>
          <p>{authError}</p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => window.location.reload()}>Qayta urinish</Button>
            <Button variant="secondary" onClick={() => {
              localStorage.removeItem('auth_token');
              window.location.reload();
            }}>
              Keshni tozalash va qayta kirish
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <Heart className="h-12 w-12 text-primary-300" />
          <p className="text-gray-400 font-medium">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <InvitationProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<Create />} />
                <Route path="/invitation/:id" element={<Invitation />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </InvitationProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
