"use client"

import { useEffect } from "react"
import { TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <Empty className="border-0">
        <EmptyHeader>
          <EmptyMedia
            variant="icon"
            className="mb-2 size-16 rounded-2xl [&_svg:not([class*='size-'])]:size-8"
          >
            <TriangleAlert />
          </EmptyMedia>
          <EmptyTitle className="text-2xl font-semibold">
            Something went wrong
          </EmptyTitle>
          <EmptyDescription className="text-base">
            {error.digest
              ? `Workflow failed to load (digest: ${error.digest}).`
              : "Workflow failed to load."}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="lg" onClick={() => retry()}>
            Try again
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
