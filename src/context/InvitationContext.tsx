import { createContext, useContext, useState, type ReactNode } from "react"
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
    loading: boolean
    error: string | null
    updateData: (updates: Partial<InvitationData>) => void
    resetData: () => void
    saveInvitation: (data?: InvitationData) => Promise<string | null>
    getInvitation: (id: string) => Promise<InvitationData | null>
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
    backgroundMusic: "MUSIC_1",
    template: "classic",
}

const InvitationContext = createContext<InvitationContextType | undefined>(undefined)

export function InvitationProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<InvitationData>(defaultData)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const updateData = (updates: Partial<InvitationData>) => {
        setData((prev) => ({ ...prev, ...updates }))
    }

    const resetData = () => {
        setData(defaultData)
        setError(null)
    }

    const saveInvitation = async (overrideData?: InvitationData): Promise<string | null> => {
        setLoading(true)
        setError(null)
        try {
            const result = await api.saveInvitation(overrideData || data)
            console.log("DEBUG: saveInvitation result:", result);
            setLoading(false)
            const id = result.id || result._id
            if (id) {
                // Return as string to satisfy navigate calls
                return id.toString()
            }
            return null
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
        <InvitationContext.Provider value={{ data, loading, error, updateData, resetData, saveInvitation, getInvitation }}>
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
