import Link from "next/link"
import { SearchX } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <Empty className="border-0">
        <EmptyHeader>
          <EmptyMedia
            variant="icon"
            className="mb-2 size-16 rounded-2xl [&_svg:not([class*='size-'])]:size-8"
          >
            <SearchX />
          </EmptyMedia>
          <EmptyTitle className="text-2xl font-semibold">
            Workflow not found
          </EmptyTitle>
          <EmptyDescription className="text-base">
            This workflow does not exist or you do not have access to it.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="lg" asChild>
            <Link href="/">Back to workflows</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
