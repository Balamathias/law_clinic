'use client'

import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])
 
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
            <div className="max-w-md w-full space-y-8 p-10">
                <div>
                    <h2 className="mt-6 text-center text-xl font-bold text-muted-foreground">
                        Oops! Something went wrong
                    </h2>
                    {error.digest && (
                        <p className="mt-2 text-center text-xs text-red-500">
                            Error ID: {error.digest}
                        </p>
                    )}
                </div>
                <div className="mt-8 flex justify-center">
                    <Button
                        onClick={() => window.location.reload()}
                        className="rounded-full"
                    >
                        Try again
                    </Button>
                </div>
                <div className="text-center mt-4">
                    <p className="text-sm text-muted-foreground/70">
                        If this issue persists, please contact our support team.
                    </p>
                </div>
            </div>
        </div>
    )
}