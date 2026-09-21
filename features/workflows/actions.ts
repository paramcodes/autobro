"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createWorkflow, deleteWorkflow } from "@/features/workflows/data";
import { tasks } from "@trigger.dev/sdk";
import type { helloWorld } from "@/src/trigger/hello";
import { getLiveblocksClient, roomIdForWorkflow } from "@/lib/liveblocks-server";

export async function createWorkflowAction(name: string) {
  const { orgId } = await auth();
  if (!orgId) throw new Error("No active organization");
  const workflow = await createWorkflow(orgId, name);
  revalidatePath("/", "layout");
  redirect(`/workflows/${workflow.id}`);
}

export async function deleteWorkflowAction(workflowId: string) {
  const { orgId } = await auth();
  if (!orgId) throw new Error("No active organization");
  await deleteWorkflow(orgId, workflowId);
  try {
    const liveblocks = getLiveblocksClient();
    await liveblocks.deleteRoom(roomIdForWorkflow(workflowId));
  } catch (error) {
    console.error(
      `Liveblocks: failed to delete room for workflow ${workflowId}`,
      error
    );
  }
  revalidatePath("/", "layout");
  redirect("/");
}

export async function runWorkflowAction(name?: string) {
  const handle = await tasks.trigger<typeof helloWorld>("hello-world", {
    name: name ?? "autobro",
  });
  return { id: handle.id, publicAccessToken: handle.publicAccessToken };
}
