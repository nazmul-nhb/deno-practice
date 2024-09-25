import { Application } from "https://deno.land/x/oak@v17.0.0/mod.ts";

const app = new Application();

const port = 4242;

app.use((ctx) => {
    ctx.response.body = { success: true, message: "Hello Deno!" };
});

console.log(`OAK Server is Running on http://localhost:${port}`);

await app.listen({ port });
