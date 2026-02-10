import { createContext, useContext, useState, type ReactNode } from "react"
import { api } from "../lib/api"

export interface InvitationData {
    id?: string
    _id?: string
    brideName: string
    groomName: string
    date: string
    time: string
    location: string
    message: string
    templateId: string
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
    groomName: "",
    date: "",
    time: "",
    location: "",
    message: "Bizning to'yimizga taklif etamiz...",
    templateId: "classic",
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
            setLoading(false)
            return result._id || result.id
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            setLoading(false)
            return result
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
