import { type ReactNode } from "react"
import { Heart } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "./Button"

interface LayoutProps {
    children: ReactNode
}


export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-background font-sans">
            <header className="sticky top-0 z-50 w-full border-b border-gold-100 bg-white/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2">
                        <Heart className="h-6 w-6 text-primary-500 fill-current" />
                        <span className="font-serif text-xl font-bold text-gray-900">
                            To'ylashaylik                     </span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
                            Home
                        </Link>
                        <Link to="/create" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
                            Templates
                        </Link>
                        <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
                            About
                        </Link>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <Link to="/create">
                            <Button size="sm">Create Invitation</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {children}
            </main>

            <footer className="border-t border-gold-100 bg-gold-50/50">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <Heart className="h-5 w-5 text-primary-400" />
                            <span className="font-serif text-lg font-semibold text-gray-800">
                                Forever & Always
                            </span>
                        </div>
                        <p className="text-sm text-gold-600">
                            © {new Date().getFullYear()} Wedding Mini App. Made with love.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
