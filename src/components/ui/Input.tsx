import { type InputHTMLAttributes, forwardRef } from "react"
import { cn } from "../../lib/utils"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, id, ...props }, ref) => {
        const inputId = id || props.name

        return (
            <div className="w-full space-y-1">
                {label && (
                    <label htmlFor={inputId} className="text-sm font-medium text-gold-900">
                        {label}
                    </label>
                )}
                <input
                    id={inputId}
                    type={type}
                    className={cn(
                        "flex h-10 w-full rounded-md border border-gold-200 bg-white px-3 py-2 text-sm placeholder:text-gold-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm",
                        error && "border-red-500 focus:ring-red-500",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
        )
    }
)

Input.displayName = "Input"

export { Input }
