import { auth } from "@clerk/nextjs/server";

import { ensureWorkflowRoom } from "@/lib/liveblocks-server";
import { WorkflowRoom } from "@/features/workflows/components/workflow-room";
import { WorkflowShell } from "@/features/workflows/components/workflow-shell";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { orgId } = await auth()

  // ID-token auth requires the room to exist with permissions set
  // server-side. Skip (render anyway) when there's no org or no key —
  // the Room will surface the auth error instead of crashing the page.
  if (orgId) {
    try {
      await ensureWorkflowRoom(id, orgId)
    } catch {
      // ClientSideSuspense error path handles it; see console for details.
    }
  }

  return (
    <WorkflowRoom workflowId={id}>
      <WorkflowShell workflowId={id} />
    </WorkflowRoom>
  )
}
