"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createWorkflow } from "@/features/workflows/data";
import { tasks } from "@trigger.dev/sdk";
import type { helloWorld } from "@/src/trigger/hello";

export async function createWorkflowAction(name: string) {
  const { orgId } = await auth();
  if (!orgId) throw new Error("No active organization");
  const workflow = await createWorkflow(orgId, name);
  revalidatePath("/", "layout");
  redirect(`/workflows/${workflow.id}`);
}

export async function runWorkflowAction(name?: string) {
  const handle = await tasks.trigger<typeof helloWorld>("hello-world", {
    name: name ?? "autobro",
  });
  return { id: handle.id };
}
