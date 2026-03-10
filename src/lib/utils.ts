import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function isValidImageUrl(url: string | undefined | null): boolean {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim().toLowerCase();
    if (
        trimmed === "" ||
        trimmed === "null" ||
        trimmed === "undefined" ||
        trimmed.includes("null") ||
        trimmed.includes("undefined")
    ) return false;
    return trimmed.startsWith("http") || trimmed.startsWith("blob:") || trimmed.startsWith("data:") || trimmed.startsWith("/");
}
