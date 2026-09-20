import { Spinner } from "@/components/ui/spinner"

export default function Loading() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <Spinner className="size-8" />
    </div>
  )
}
