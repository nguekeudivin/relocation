import { cn } from "@/lib/utils"

export const Card = ({children, className}: {children: React.ReactNode, className: string}) => {
    return <div className={cn("rounded-lg", className)}>{children}</div>
}

export const CardContent = ({children, className}: {children: React.ReactNode, className: string}) => {
    return <div className={cn(className)}>{children}</div>
}
