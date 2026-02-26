// Version: 1.0.3 (Deep linking & Sharing fix)
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"
import { Layout } from "./components/ui/Layout"
import { Home } from "./pages/Home"
import { InvitationProvider } from "./context/InvitationContext"
import { Create } from "./pages/Create"
import { Invitation } from "./pages/Invitation"
import { Profile } from "./pages/Profile"
import { Templates } from "./pages/Templates"

import { useEffect, useRef } from "react"
import { useTelegram } from "./hooks/useTelegram"
import { api } from "./lib/api"
import { LanguageProvider } from "./context/LanguageContext"
import { ThemeProvider } from "./context/ThemeContext"
import { useInvitation } from "./context/InvitationContext"
import { ErrorBoundary } from "./components/ErrorBoundary"

import { TemplatePreview } from "./pages/TemplatePreview"

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

function TelegramDeeplinkHandler() {
  const { tg } = useTelegram()
  const navigate = useNavigate()
  const hasRedirected = useRef(false)

  useEffect(() => {
    if (tg?.initDataUnsafe?.start_param && !hasRedirected.current) {
      const startParam = tg.initDataUnsafe.start_param;
      console.log("DEBUG: Telegram start_param detected:", startParam);

      // If start_param is like 'inv_123' or just '123'
      const id = startParam.startsWith('inv_') ? startParam.replace('inv_', '') : startParam;

      if (id) {
        console.log("DEBUG: Redirecting to invitation:", id);
        hasRedirected.current = true;
        navigate(`/invitation/${id}`);
      }
    }
  }, [tg, navigate]);

  return null
}

function App() {
  const { onReady, isTelegram, initData } = useTelegram()

  useEffect(() => {
    onReady()

    if (isTelegram && initData) {
      console.log("DEBUG: Starting authTelegram with initData length:", initData.length);
      // Refresh the token in the background - don't block the UI
      api.authTelegram(initData)
        .then((result) => {
          console.log("DEBUG: authTelegram success:", result);
        })
        .catch((err) => {
          // Only log the error - don't block the UI if a token already exists
          console.error("DEBUG: Auth refresh failed (non-blocking):", err);
        });
    } else if (!isTelegram) {
      console.log("DEBUG: Not in Telegram environment. Using localStorage token if available.");
    }
  }, [onReady, isTelegram, initData])

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <InvitationProvider>
            <AuthInitializer />
            <BrowserRouter>
              <TelegramDeeplinkHandler />
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/create" element={<Create />} />
                  <Route path="/templates" element={<Templates />} />
                  <Route path="/templates/preview/:id" element={<TemplatePreview />} />
                  <Route path="/invitation/:id" element={<Invitation />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </InvitationProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
