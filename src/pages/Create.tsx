import { useNavigate } from "react-router-dom"
import { useInvitation } from "../context/InvitationContext"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/Card"
import { Calendar, MapPin, MessageSquare, Users, Clock } from "lucide-react"

export function Create() {
    const navigate = useNavigate()
    const { data, updateData } = useInvitation()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Navigate to template selection page
        navigate('/select-template')
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-serif font-bold text-center text-primary-800 mb-8">
                Create Your Invitation
            </h1>

            <form onSubmit={handleSubmit}>
                <Card className="border-gold-200 shadow-lg">
                    <CardHeader>
                        <CardTitle>Wedding Details</CardTitle>
                        <CardDescription>Enter the details for your special day.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gold-900 flex items-center gap-2">
                                    <Users className="h-4 w-4" /> Bride's Name
                                </label>
                                <Input
                                    placeholder="e.g. Sarah Algorithm"
                                    value={data.brideName}
                                    onChange={(e) => updateData({ brideName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gold-900 flex items-center gap-2">
                                    <Users className="h-4 w-4" /> Groom's Name
                                </label>
                                <Input
                                    placeholder="e.g. John Coder"
                                    value={data.groomName}
                                    onChange={(e) => updateData({ groomName: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gold-900 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" /> Date
                                </label>
                                <Input
                                    type="date"
                                    value={data.date}
                                    onChange={(e) => updateData({ date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gold-900 flex items-center gap-2">
                                    <Clock className="h-4 w-4" /> Time
                                </label>
                                <Input
                                    type="time"
                                    value={data.time}
                                    onChange={(e) => updateData({ time: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gold-900 flex items-center gap-2">
                                <MapPin className="h-4 w-4" /> Location
                            </label>
                            <Input
                                placeholder="e.g. Grand Hotel, Tashkent"
                                value={data.location}
                                onChange={(e) => updateData({ location: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gold-900 flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" /> Personal Message
                            </label>
                            <textarea
                                className="flex min-h-[100px] w-full rounded-md border border-gold-200 bg-white px-3 py-2 text-sm placeholder:text-gold-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm"
                                placeholder="We invite you to celebrate our wedding..."
                                value={data.message}
                                onChange={(e) => updateData({ message: e.target.value })}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4 border-t border-gold-100 bg-gold-50/30 p-6">
                        <Button type="button" variant="secondary" onClick={() => navigate("/")}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Preview Invitation
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}
