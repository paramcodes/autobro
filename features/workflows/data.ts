import {and, desc,eq} from 'drizzle-orm';

import { db } from '@/db';
import { workflows } from '@/db/schema';

export function listWorkflows(orgId: string) {
    return db
      .select()
      .from(workflows)
      .where(eq(workflows.orgId, orgId))
      .orderBy(desc(workflows.createdAt))
  }

export async function getWorkflow(orgId: string, id: string) {
    const [workflow] = await db
      .select()
      .from(workflows)
      .where(and(eq(workflows.orgId, orgId), eq(workflows.id, id)))
      .limit(1);
    return workflow;
  }

export async function createWorkflow(orgId: string, name: string) {
    const [workflow] = await db
      .insert(workflows)
      .values({ orgId, name })
      .returning();
    return workflow;
  }

export async function deleteWorkflow(orgId: string, id: string) {
    await db
      .delete(workflows)
      .where(and(eq(workflows.orgId, orgId), eq(workflows.id, id)));
  }
