import { Liveblocks } from "@liveblocks/node";

import { roomIdForWorkflow } from "./liveblocks";

export { roomIdForWorkflow };

let singleton: Liveblocks | null = null;

export function getLiveblocksClient() {
  if (!singleton) {
    const secret = process.env.LIVEBLOCKS_SECRET_KEY;
    if (!secret) {
      throw new Error(
        "Missing LIVEBLOCKS_SECRET_KEY. Add it to .env.local (see https://liveblocks.io/dashboard)."
      );
    }
    singleton = new Liveblocks({ secret });
  }
  return singleton;
}

const CURSOR_PALETTE = [
  "#0ea5e9",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#6366f1",
  "#14b8a6",
];

export function colorForUserId(userId: string) {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) | 0;
  }
  return CURSOR_PALETTE[Math.abs(hash) % CURSOR_PALETTE.length];
}

/**
 * ID-token auth requires rooms to exist with permissions set server-side.
 * Every org member gets write access; rooms are compartmentalized per
 * Clerk organization via `organizationId`.
 */
export async function ensureWorkflowRoom(workflowId: string, orgId: string) {
  const liveblocks = getLiveblocksClient();
  const roomId = roomIdForWorkflow(workflowId);
  try {
    return await liveblocks.getOrCreateRoom(roomId, {
      defaultAccesses: ["room:write"],
      organizationId: orgId,
      metadata: { workflowId },
    });
  } catch (error) {
    console.error(`Liveblocks: failed to getOrCreateRoom ${roomId}`, error);
    throw error;
  }
}
