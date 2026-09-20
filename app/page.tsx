import { Plus, Workflow } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <Empty className="border-0">
        <EmptyHeader>
          <EmptyMedia
            variant="icon"
            className="mb-2 size-16 rounded-2xl [&_svg:not([class*='size-'])]:size-8"
          >
            <Workflow />
          </EmptyMedia>
          <EmptyTitle className="text-2xl font-semibold">
            No workflow selected
          </EmptyTitle>
          <EmptyDescription className="text-base">
            Select a workflow from the sidebar
            <br />
            or create a new one to get started.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="lg">
            <Plus />
            New workflow
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
