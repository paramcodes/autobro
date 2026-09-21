"use client";

import type { ReactNode } from "react";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense";

import { roomIdForWorkflow } from "@/lib/liveblocks";

async function fetchUsers(userIds: string[]) {
  const response = await fetch("/api/liveblocks-users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userIds }),
  });
  if (!response.ok) {
    return userIds.map(() => ({
      name: "Anonymous",
      avatar: "",
      color: "#71717a",
    }));
  }
  return response.json();
}

export function WorkflowRoom({
  workflowId,
  children,
}: {
  workflowId: string;
  children: ReactNode;
}) {
  return (
    <LiveblocksProvider
      throttle={16}
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={async ({ userIds }) => fetchUsers(userIds)}
    >
      <RoomProvider id={roomIdForWorkflow(workflowId)}>
        <ClientSideSuspense
          fallback={
            <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
              Loading collaborative session…
            </div>
          }
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
