"use client"

import { useState, useTransition } from "react"
import { Play } from "lucide-react"
import { toast } from "sonner"
import { useRealtimeRun } from "@trigger.dev/react-hooks"

import { Button } from "@/components/ui/button"
import { runWorkflowAction } from "@/features/workflows/actions"
import type { helloWorld } from "@/src/trigger/hello"

type TriggeredRun = {
  id: string
  publicAccessToken: string
}

const TERMINAL_FAILURE_STATUSES = new Set([
  "FAILED",
  "CRASHED",
  "SYSTEM_FAILURE",
  "TIMED_OUT",
  "EXPIRED",
  "INTERRUPTED",
  "CANCELED",
])

function RunFeedback({ runId, publicAccessToken }: { runId: string; publicAccessToken: string }) {
  const { run, error } = useRealtimeRun<typeof helloWorld>(runId, {
    accessToken: publicAccessToken,
  })

  if (error) return <p className="text-sm text-red-600">Error: {error.message}</p>
  if (!run) return <p className="text-sm text-muted-foreground">Connecting to run…</p>

  const isComplete = run.status === "COMPLETED"
  const isFailed = TERMINAL_FAILURE_STATUSES.has(run.status)

  return (
    <div className="w-full space-y-2 rounded-md border p-3 text-sm">
      <div className="flex items-center justify-between gap-2">
        <span
          className={
            isComplete
              ? "text-green-600"
              : isFailed
                ? "text-red-600"
                : "text-blue-600"
          }
        >
          {run.status}
        </span>
        <span className="truncate font-mono text-xs text-muted-foreground">{run.id}</span>
      </div>
      {run.output?.message ? (
        <p>{run.output.message}</p>
      ) : (
        !isComplete && !isFailed && <p className="text-muted-foreground">Waiting for output…</p>
      )}
      {run.output && "timestamp" in run.output && typeof run.output.timestamp === "string" && (
        <p className="font-mono text-xs text-muted-foreground">{run.output.timestamp}</p>
      )}
    </div>
  )
}

export function RightSidebar() {
  const [isPending, startTransition] = useTransition()
  const [triggeredRun, setTriggeredRun] = useState<TriggeredRun | null>(null)

  function handleRun() {
    startTransition(async () => {
      try {
        const result = await runWorkflowAction()
        setTriggeredRun(result)
      } catch {
        toast.error("Failed to trigger workflow run")
      }
    })
  }

  return (
    <div className="flex size-full flex-col items-center justify-center gap-4 p-4">
      <Button onClick={handleRun} disabled={isPending}>
        <Play />
        {isPending ? "Running..." : "Run"}
      </Button>
      {triggeredRun && (
        <RunFeedback runId={triggeredRun.id} publicAccessToken={triggeredRun.publicAccessToken} />
      )}
    </div>
  )
}
