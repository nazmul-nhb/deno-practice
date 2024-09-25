import { Application, Router } from "https://deno.land/x/oak@v17.0.0/mod.ts";

const app = new Application();
const router = new Router();
const port = 4242;

// Logger Middleware
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.headers.get("X-Response-Time");
    console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

// Timing Middleware - Adding response time in headers and body
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${ms}ms`);

    // If response body already exists, add response time to the body
    if (ctx.response.body && typeof ctx.response.body === "object") {
        ctx.response.body = {
            ...ctx.response.body,
            responseTime: `${ms}ms`,
        };
    } else {
        // If no body exists, just return response time
        ctx.response.body = { responseTime: `${ms}ms` };
    }
});

// Routes
router
    .get("/", (ctx) => {
        ctx.response.body = { success: true, message: "Hello Deno!" };
    })
    .get("/response", (ctx) => {
        ctx.response.body = { success: true, message: "Response Endpoint!" };
    });

// Use the router
app.use(router.routes());
app.use(router.allowedMethods());

console.log(`OAK Server is Running on http://localhost:${port}`);

await app.listen({ port });
