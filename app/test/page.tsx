export default function TestPage() {
  return (
    <div className="flex min-h-svh flex-col gap-2 p-6 text-sm leading-loose">
      <h1 className="font-medium">Protected test page</h1>
      <p>Dummy page — requires sign-in (enforced in proxy.ts).</p>
    </div>
  )
}
