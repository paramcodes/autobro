import { auth, currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";

import { colorForUserId } from "@/lib/liveblocks-server";

export async function POST() {
  const { userId, orgId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const secret = process.env.LIVEBLOCKS_SECRET_KEY;
  if (!secret) {
    return new Response("Missing LIVEBLOCKS_SECRET_KEY", { status: 500 });
  }

  const liveblocks = new Liveblocks({ secret });
  const user = await currentUser();
  const name =
    user?.fullName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress ||
    "Anonymous";
  const avatar = user?.imageUrl ?? "";

  const { status, body } = await liveblocks.identifyUser(
    {
      userId,
      organizationId: orgId ?? undefined,
      groupIds: [],
    },
    {
      userInfo: {
        name,
        avatar,
        color: colorForUserId(userId),
      },
    }
  );

  return new Response(body, { status });
}
