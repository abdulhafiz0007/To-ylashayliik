import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Search, MapPin, X, Check, Navigation } from 'lucide-react'
import { Button } from './ui/Button'
import 'leaflet/dist/leaflet.css'

// Fix default marker icon issue with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface LocationPickerProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (location: { lat: number; lng: number; address: string }) => void
    initialLocation?: { lat: number; lng: number } | null
}

// Component to handle map clicks
function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng)
        },
    })
    return null
}

// Component to fly to a position
function FlyTo({ position }: { position: [number, number] | null }) {
    const map = useMap()
    useEffect(() => {
        if (position) {
            map.flyTo(position, 16, { duration: 1 })
        }
    }, [position, map])
    return null
}

export function LocationPicker({ isOpen, onClose, onSelect, initialLocation }: LocationPickerProps) {
    // Default center: Tashkent, Uzbekistan
    const defaultCenter: [number, number] = [41.2995, 69.2401]
    const [marker, setMarker] = useState<[number, number] | null>(
        initialLocation ? [initialLocation.lat, initialLocation.lng] : null
    )
    const [address, setAddress] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [searching, setSearching] = useState(false)
    const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null)
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Reverse geocode to get address
    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                { headers: { 'Accept-Language': 'uz,ru,en' } }
            )
            const data = await res.json()
            if (data.display_name) {
                setAddress(data.display_name)
            }
        } catch (err) {
            console.warn('Reverse geocode failed:', err)
            setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`)
        }
    }

    const handleMapClick = (lat: number, lng: number) => {
        setMarker([lat, lng])
        reverseGeocode(lat, lng)
    }

    // Search for places
    const handleSearch = async (query: string) => {
        setSearchQuery(query)
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)

        if (!query.trim()) {
            setSearchResults([])
            return
        }

        searchTimeoutRef.current = setTimeout(async () => {
            setSearching(true)
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=uz&limit=5&addressdetails=1`,
                    { headers: { 'Accept-Language': 'uz,ru,en' } }
                )
                const data = await res.json()
                setSearchResults(data)
            } catch (err) {
                console.warn('Search failed:', err)
            } finally {
                setSearching(false)
            }
        }, 500)
    }

    const handleSelectSearchResult = (result: any) => {
        const lat = parseFloat(result.lat)
        const lng = parseFloat(result.lon)
        setMarker([lat, lng])
        setAddress(result.display_name)
        setSearchResults([])
        setSearchQuery(result.display_name.split(',')[0])
        setFlyTarget([lat, lng])
    }

    const handleConfirm = () => {
        if (marker && address) {
            onSelect({ lat: marker[0], lng: marker[1], address })
            onClose()
        }
    }

    // Locate user
    const handleLocateMe = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude
                    const lng = pos.coords.longitude
                    setMarker([lat, lng])
                    reverseGeocode(lat, lng)
                    setFlyTarget([lat, lng])
                },
                (err) => console.warn('Geolocation failed:', err),
                { enableHighAccuracy: true }
            )
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-slate-950">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0">
                <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <X className="h-5 w-5 text-gray-500" />
                </button>
                <h2 className="font-bold text-lg dark:text-white flex-1">Lokatsiya tanlang</h2>
                {marker && (
                    <Button
                        onClick={handleConfirm}
                        className="h-9 px-4 rounded-full bg-pink-500 hover:bg-pink-600 text-white text-sm font-bold gap-1.5"
                    >
                        <Check className="h-4 w-4" /> Tasdiqlash
                    </Button>
                )}
            </div>

            {/* Search */}
            <div className="px-4 py-3 bg-white dark:bg-slate-950 shrink-0 space-y-1 relative z-[110]">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Joy qidirish..."
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-base outline-none focus:ring-2 focus:ring-pink-300 dark:text-white transition-all"
                    />
                    {searching && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="animate-spin h-4 w-4 border-2 border-pink-500 border-t-transparent rounded-full" />
                        </div>
                    )}
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                    <div className="absolute left-4 right-4 top-[calc(100%)] bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-700 max-h-60 overflow-y-auto">
                        {searchResults.map((result, i) => (
                            <button
                                key={i}
                                onClick={() => handleSelectSearchResult(result)}
                                className="w-full text-left px-4 py-3 hover:bg-pink-50 dark:hover:bg-slate-800 transition-colors flex items-start gap-3 border-b border-gray-50 dark:border-slate-800 last:border-b-0"
                            >
                                <MapPin className="h-4 w-4 text-pink-500 shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{result.display_name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Selected Address Display */}
            {address && (
                <div className="px-4 py-2 bg-pink-50 dark:bg-pink-900/10 shrink-0 mx-4 mb-2 rounded-xl flex items-start gap-2 border border-pink-100 dark:border-pink-900/20">
                    <MapPin className="h-4 w-4 text-pink-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-pink-900 dark:text-pink-300 line-clamp-2">{address}</p>
                </div>
            )}

            {/* Map Container */}
            <div className="flex-1 relative mx-4 mb-6 rounded-3xl overflow-hidden border border-gray-100 dark:border-slate-800 shadow-xl shadow-gray-200/50 dark:shadow-none bg-gray-50 dark:bg-slate-900">
                <MapContainer
                    center={marker || defaultCenter}
                    zoom={marker ? 16 : 12}
                    className="h-full w-full"
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapClickHandler onLocationSelect={handleMapClick} />
                    <FlyTo position={flyTarget} />
                    {marker && <Marker position={marker} />}
                </MapContainer>

                {/* Locate Me Button */}
                <button
                    onClick={handleLocateMe}
                    className="absolute bottom-4 right-4 z-[500] h-12 w-12 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-lg border border-gray-200 dark:border-slate-700 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 transition-all active:scale-95"
                    title="Mening joylashuvim"
                >
                    <Navigation className="h-5 w-5 text-pink-500" />
                </button>
            </div>
        </div>
    )
}
