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