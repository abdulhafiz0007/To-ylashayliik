import { Link } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card"
import { Heart, Calendar, Share2, Palette } from "lucide-react"

export function Home() {
    return (
        <div className="flex flex-col space-y-12 pb-12">
            {/* Hero Section */}
            <section className="relative py-20 px-4 text-center overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-custom-gradient opacity-30 blur-3xl" />
                <div className="container mx-auto max-w-4xl space-y-6">
                    <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-gold-200">
                        <Heart className="h-4 w-4 text-primary-500 fill-current" />
                        <span className="text-sm font-medium text-gold-800">The easiest way to invite your loved ones</span>
                    </div>
                    <h1 className="font-serif text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 via-primary-500 to-gold-600 animate-slide-up">
                        Create Elegant <br /> Wedding Invitations
                    </h1>
                    <p className="text-xl md:text-2xl text-gold-800 max-w-2xl mx-auto font-light animate-fade-in delay-100">
                        Design stunning digital invitations in minutes. Share instantly via Telegram and track RSVPs effortlessly.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in delay-200">
                        <Link to="/create">
                            <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                                Create Implementation
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8">
                            View Examples
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="hover:shadow-2xl transition-shadow bg-white/80 backdrop-blur-sm border-gold-200">
                        <CardHeader>
                            <div className="h-12 w-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
                                <Palette className="h-6 w-6 text-primary-600" />
                            </div>
                            <CardTitle>Beautiful Templates</CardTitle>
                            <CardDescription>Choose from our curated collection of elegant designs.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">Customize fonts, colors, and layouts to match your wedding theme perfectly.</p>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-2xl transition-shadow bg-white/80 backdrop-blur-sm border-gold-200">
                        <CardHeader>
                            <div className="h-12 w-12 rounded-xl bg-gold-100 flex items-center justify-center mb-4">
                                <Share2 className="h-6 w-6 text-gold-600" />
                            </div>
                            <CardTitle>Instant Sharing</CardTitle>
                            <CardDescription>Share directly to Telegram contacts and groups.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">No more postage stamps. Send your invitations instantly to everyone you love.</p>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-2xl transition-shadow bg-white/80 backdrop-blur-sm border-gold-200">
                        <CardHeader>
                            <div className="h-12 w-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
                                <Calendar className="h-6 w-6 text-primary-600" />
                            </div>
                            <CardTitle>Date & Time</CardTitle>
                            <CardDescription>Clear and beautiful event details.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">Ensure your guests save the date with integrated calendar links.</p>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    )
}
