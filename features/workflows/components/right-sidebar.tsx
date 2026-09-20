"use client"

import { Play } from "lucide-react"

import { Button } from "@/components/ui/button"

export function RightSidebar() {
  return (
    <div className="flex size-full items-center justify-center">
      <Button>
        <Play />
        Run
      </Button>
    </div>
  )
}
