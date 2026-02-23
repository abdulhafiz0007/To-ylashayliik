import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { api } from "../lib/api"

export interface InvitationData {
    id?: string | number
    _id?: string
    brideName: string
    brideLastname: string
    groomName: string
    groomLastname: string
    date: string
    time: string
    location: string
    hall: string
    text: string
    backgroundMusic: string
    template: string
    [key: string]: unknown;
}

interface InvitationContextType {
    data: InvitationData
    currentUser: any | null
    receivedInvitations: InvitationData[]
    setCurrentUser: (user: any) => void
    loading: boolean
    error: string | null
    updateData: (updates: Partial<InvitationData>) => void
    resetData: () => void
    saveInvitation: (data?: any) => Promise<string | null>
    getInvitation: (id: string) => Promise<InvitationData | null>
    addReceivedInvitation: (inv: InvitationData) => void
}

const defaultData: InvitationData = {
    brideName: "",
    brideLastname: "",
    groomName: "",
    groomLastname: "",
    date: "",
    time: "",
    location: "",
    hall: "",
    text: "Bizning to'yimizga taklif etamiz...",
    backgroundMusic: "music1",
    template: "classic",
}

const InvitationContext = createContext<InvitationContextType | undefined>(undefined)

export function InvitationProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<InvitationData>(defaultData)
    const [currentUser, setCurrentUser] = useState<any | null>(null)
    const [receivedInvitations, setReceivedInvitations] = useState<InvitationData[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Load received invitations from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('received_invitations')
        if (saved) {
            try {
                setReceivedInvitations(JSON.parse(saved))
            } catch (e) {
                console.error("Failed to parse received invitations", e)
            }
        }
    }, [])

    const updateData = (updates: Partial<InvitationData>) => {
        setData((prev) => ({ ...prev, ...updates }))
    }

    const resetData = () => {
        setData(defaultData)
        setError(null)
    }

    const addReceivedInvitation = (inv: InvitationData) => {
        if (!inv.id) return

        setReceivedInvitations(prev => {
            // Check if already exists
            const exists = prev.find(item => String(item.id) === String(inv.id))
            if (exists) return prev

            const updated = [inv, ...prev]
            localStorage.setItem('received_invitations', JSON.stringify(updated))
            return updated
        })
    }

    const saveInvitation = async (overrideData?: any): Promise<string | null> => {
        setLoading(true)
        setError(null)
        try {
            const inviteData = overrideData || data;
            // IMPORTANT: Inject internal user ID if we have it
            if (currentUser && !inviteData.backendUserId) {
                inviteData.backendUserId = currentUser.id;
            }

            console.log("DEBUG: InvitationContext saving with data:", inviteData);
            const result = await api.saveInvitation(inviteData)
            console.log("DEBUG: saveInvitation success. Raw result:", result);

            // Extract ID from result (might be {id: 123} or just 123 or {data: {id: 123}})
            const id = result?.id || result?._id || (typeof result === 'string' || typeof result === 'number' ? result : null);

            console.log("DEBUG: Extracted ID for navigation:", id);
            setLoading(false)
            if (id !== undefined && id !== null) {
                // Return as string to satisfy navigate calls
                return id.toString()
            }
            console.warn("DEBUG: No ID found in save result!");
            return null;
        } catch (err: any) {
            console.error("Failed to save invitation", err)
            setError(err.message)
            setLoading(false)
            return null
        }
    }

    const getInvitation = async (id: string): Promise<InvitationData | null> => {
        setLoading(true)
        setError(null)
        try {
            const result = await api.getInvitation(id)
            if (result) {
                // Backend might not return the ID in the body sometimes
                result.id = result.id || id
                setData(result)
            }
            setLoading(false)
            return result
        } catch (err: any) {
            console.error("Failed to get invitation", err)
            setError(err.message)
            setLoading(false)
            return null
        }
    }

    return (
        <InvitationContext.Provider value={{
            data,
            currentUser,
            receivedInvitations,
            setCurrentUser,
            loading,
            error,
            updateData,
            resetData,
            saveInvitation,
            getInvitation,
            addReceivedInvitation
        }}>
            {children}
        </InvitationContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useInvitation() {
    const context = useContext(InvitationContext)
    if (context === undefined) {
        throw new Error("useInvitation must be used within an InvitationProvider")
    }
    return context
}
