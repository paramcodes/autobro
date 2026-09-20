import { task } from "@trigger.dev/sdk";

export const helloWorld = task({
  id: "hello-world",
  run: async (payload: { name?: string }) => {
    const name = payload.name ?? "autobro";
    console.log(`Hello ${name}!`);

    return {
      message: `Hello ${name}!`,
      timestamp: new Date().toISOString(),
    };
  },
});
