import { auth, clerkClient } from "@clerk/nextjs/server";

import { colorForUserId } from "@/lib/liveblocks-server";

type ResolveUsersBody = {
  userIds?: string[];
};

/**
 * Backs `resolveUsers` in `LiveblocksProvider` — returns UserMeta["info"]
 * in the same order as the requested IDs.
 */
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  let userIds: string[] = [];
  try {
    userIds = ((await request.json()) as ResolveUsersBody).userIds ?? [];
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  if (userIds.length === 0) {
    return Response.json([]);
  }

  const client = await clerkClient();
  const { data } = await client.users.getUserList({
    userId: userIds,
    limit: Math.min(Math.max(userIds.length, 1), 100),
  });
  const byId = new Map(data.map((u) => [u.id, u]));

  return Response.json(
    userIds.map((id) => {
      const u = byId.get(id);
      return {
        name:
          u?.fullName ||
          u?.username ||
          u?.primaryEmailAddress?.emailAddress ||
          "Anonymous",
        avatar: u?.imageUrl ?? "",
        color: colorForUserId(id),
      };
    })
  );
}
