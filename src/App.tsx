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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Heart as _Heart, X } from "lucide-react"
import { Button } from "./components/ui/Button"
import { LanguageProvider } from "./context/LanguageContext"
import { ThemeProvider } from "./context/ThemeContext"

function App() {
  const { onReady, isTelegram, initData } = useTelegram()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_isAuth, setIsAuth] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    onReady()

    if (isTelegram && initData) {
      console.log("DEBUG: Starting authTelegram with initData length:", initData.length);
      api.authTelegram(initData)
        .then(() => {
          // Check if token was actually set in localStorage by setAuthToken
          const token = localStorage.getItem('auth_token');
          if (token) {
            console.log("DEBUG: Auth success and token verified.");
            setIsAuth(true);
          } else {
            setAuthError("Auth success but token missing in storage.");
          }
        })
        .catch((err) => {
          console.error("DEBUG: Auth failed details:", err);
          if (err.message.includes('401')) {
            setAuthError(`Kirishda xatolik (401): Telegram ma'lumotlari server tomonidan qabul qilinmadi.`);
          } else {
            setAuthError(`Kirishda xatolik: ${err.message}`);
          }
        });
    } else if (!isTelegram) {
      // For development outside Telegram, check if token exists
      const token = localStorage.getItem('auth_token');
      if (token) {
        setIsAuth(true);
      }
    }
  }, [onReady, isTelegram, initData])

  /*
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
  */

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background text-center">
        <div className="max-w-md space-y-4 text-red-600">
          <X className="h-12 w-12 mx-auto" />
          <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100">Xatolik yuz berdi</h1>
          <p className="text-gray-600 dark:text-gray-400">{authError}</p>
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

  if (!_isAuth && isTelegram) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="h-12 w-12 text-primary-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin w-full h-full opacity-20">
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <p className="text-gray-400 font-medium">Kirish amalga oshirilmoqda...</p>
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
