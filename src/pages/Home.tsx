import { Link } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card"
import { Calendar, Share2, Palette } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"

export function Home() {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col space-y-12 pb-12">
            {/* Hero Section */}
            <section className="relative py-20 px-4 text-center overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-custom-gradient opacity-30 blur-3xl" />
                <div className="container mx-auto max-w-4xl space-y-6">
                    <h1 className="font-serif text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 via-primary-500 to-gold-600 animate-slide-up">
                        {t('heroTitle')}
                    </h1>
                    <p className="text-xl md:text-2xl text-gold-800 max-w-2xl mx-auto font-light animate-fade-in delay-100">
                        {t('heroSubtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in delay-200">
                        <Link to="/create">
                            <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                                {t('createBtn')}
                            </Button>
                        </Link>
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
                            <CardTitle>{t('features.templates.title')}</CardTitle>
                            <CardDescription>{t('features.templates.desc')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">{t('features.templates.desc')}</p>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-2xl transition-shadow bg-white/80 backdrop-blur-sm border-gold-200">
                        <CardHeader>
                            <div className="h-12 w-12 rounded-xl bg-gold-100 flex items-center justify-center mb-4">
                                <Share2 className="h-6 w-6 text-gold-600" />
                            </div>
                            <CardTitle>{t('features.sharing.title')}</CardTitle>
                            <CardDescription>{t('features.sharing.desc')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">{t('features.sharing.desc')}</p>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-2xl transition-shadow bg-white/80 backdrop-blur-sm border-gold-200">
                        <CardHeader>
                            <div className="h-12 w-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
                                <Calendar className="h-6 w-6 text-primary-600" />
                            </div>
                            <CardTitle>{t('features.details.title')}</CardTitle>
                            <CardDescription>{t('features.details.desc')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">{t('features.details.desc')}</p>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    )
}
