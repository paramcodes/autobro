"use client"

import { AvatarStack } from "@liveblocks/react-ui"

export function CollaboratorsPanel() {
  return (
    <div className="pointer-events-auto flex items-center rounded-full border bg-background/80 py-1 pr-2 pl-2 shadow-sm backdrop-blur">
      <AvatarStack max={4} size={28} />
    </div>
  )
}
