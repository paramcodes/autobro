import { auth } from "@clerk/nextjs/server"

export default async function TestPage() {
  const { userId } = await auth.protect()

  return (
    <div className="flex min-h-svh flex-col gap-2 p-6 text-sm leading-loose">
      <h1 className="font-medium">Protected test page</h1>
      <p>
        Signed in as <span className="font-mono text-xs">{userId}</span>
      </p>
    </div>
  )
}
