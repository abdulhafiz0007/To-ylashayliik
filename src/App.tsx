// Version: 1.0.1 (Build trigger after lint fix)
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "./components/ui/Layout"
import { Home } from "./pages/Home"
import { InvitationProvider } from "./context/InvitationContext"
import { Create } from "./pages/Create"
import { Invitation } from "./pages/Invitation"
import { Profile } from "./pages/Profile"
import { Templates } from "./pages/Templates"

import { useEffect, useState } from "react"
import { useTelegram } from "./hooks/useTelegram"
import { api } from "./lib/api"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Heart, X } from "lucide-react"
import { Button } from "./components/ui/Button"
import { LanguageProvider } from "./context/LanguageContext"
import { ThemeProvider } from "./context/ThemeContext"
import { useInvitation } from "./context/InvitationContext"

function AuthInitializer() {
  const { user: tgUser } = useTelegram()
  const { setCurrentUser } = useInvitation()

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token && tgUser?.id) {
      console.log("DEBUG: AuthInitializer fetching backend user for telegramId:", tgUser.id)
      api.getUserByTelegramId(tgUser.id.toString())
        .then(user => {
          console.log("DEBUG: AuthInitializer fetched backend user:", user)
          setCurrentUser(user)
        })
        .catch(err => {
          console.error("DEBUG: AuthInitializer failed to fetch backend user:", err)
        })
    }
  }, [tgUser, setCurrentUser])

  return null
}

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
        .then((result) => {
          console.log("DEBUG: authTelegram result:", result);
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
        console.log("DEBUG: Found existing token in localStorage, authenticating...");
        setIsAuth(true);
      } else {
        console.log("DEBUG: No token found. In development, you can use the dev bypass button.");
      }
    }
  }, [onReady, isTelegram, initData])

  // Development helper function
  const handleDevBypass = () => {
    // Set a fake token for development testing (ONLY for dev, remove in production)
    const devToken = 'dev_token_' + Date.now();
    localStorage.setItem('auth_token', devToken);
    setIsAuth(true);
    console.log("DEBUG: Dev bypass activated with fake token");
  }

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

  const isInvitationPath = window.location.pathname.startsWith('/invitation/');

  if (!_isAuth && !isInvitationPath) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <Heart className="h-12 w-12 text-primary-300 animate-pulse mb-4" />
        <p className="text-gray-500 font-medium">
          {isTelegram ? "Kirish amalga oshirilmoqda..." : "Iltimos, Telegram orqali kiring."}
        </p>
        {!isTelegram && (
          <>
            <p className="text-xs text-gray-400 mt-2 max-w-xs text-center">
              Ushbu xabar faqat brauzerda ko'rinadi. Telegram Mini App ichida bu avtomatik o'tadi.
            </p>
            {/* Development bypass button - REMOVE IN PRODUCTION */}
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-xs text-yellow-800 dark:text-yellow-200 mb-2 text-center font-semibold">
                Development Mode
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDevBypass}
                className="w-full"
              >
                🔧 Dev Bypass (Testlash uchun)
              </Button>
              <p className="text-[10px] text-yellow-700 dark:text-yellow-300 mt-2 text-center">
                Produksiyada bu tugma ko'rinmaydi
              </p>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <InvitationProvider>
          <AuthInitializer />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<Create />} />
                <Route path="/templates" element={<Templates />} />
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
