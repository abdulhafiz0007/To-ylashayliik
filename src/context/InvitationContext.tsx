import { createContext, useContext, useState, type ReactNode } from "react"

export interface InvitationData {
    brideName: string
    groomName: string
    date: string
    time: string
    location: string
    message: string
    templateId: string
}

interface InvitationContextType {
    data: InvitationData
    updateData: (updates: Partial<InvitationData>) => void
    resetData: () => void
    saveInvitation: (id: string) => void
    getInvitation: (id: string) => InvitationData | null
}

const defaultData: InvitationData = {
    brideName: "",
    groomName: "",
    date: "",
    time: "",
    location: "",
    message: "We invite you to celebrate our wedding...",
    templateId: "default",
}

const InvitationContext = createContext<InvitationContextType | undefined>(undefined)

export function InvitationProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<InvitationData>(defaultData)

    const updateData = (updates: Partial<InvitationData>) => {
        setData((prev) => ({ ...prev, ...updates }))
    }

    const resetData = () => {
        setData(defaultData)
    }

    const saveInvitation = (id: string) => {
        try {
            localStorage.setItem(`invitation_${id}`, JSON.stringify(data))
        } catch (error) {
            console.error("Failed to save invitation", error)
        }
    }

    const getInvitation = (id: string): InvitationData | null => {
        try {
            const stored = localStorage.getItem(`invitation_${id}`)
            return stored ? JSON.parse(stored) : null
        } catch (error) {
            console.error("Failed to get invitation", error)
            return null
        }
    }

    return (
        <InvitationContext.Provider value={{ data, updateData, resetData, saveInvitation, getInvitation }}>
            {children}
        </InvitationContext.Provider>
    )
}

export function useInvitation() {
    const context = useContext(InvitationContext)
    if (context === undefined) {
        throw new Error("useInvitation must be used within an InvitationProvider")
    }
    return context
}
