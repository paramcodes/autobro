"use client"

import { useTransition } from "react"
import { Play } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { runWorkflowAction } from "@/features/workflows/actions"

export function RightSidebar() {
  const [isPending, startTransition] = useTransition()

  function handleRun() {
    startTransition(async () => {
      try {
        const result = await runWorkflowAction()
        toast.success(`Workflow run triggered: ${result.id}`)
      } catch {
        toast.error("Failed to trigger workflow run")
      }
    })
  }

  return (
    <div className="flex size-full items-center justify-center">
      <Button onClick={handleRun} disabled={isPending}>
        <Play />
        {isPending ? "Running..." : "Run"}
      </Button>
    </div>
  )
}
