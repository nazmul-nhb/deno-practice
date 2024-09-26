import {
    Application,
    Context,
    Next,
    Router,
} from "https://deno.land/x/oak@v17.0.0/mod.ts";

const app = new Application();
const router = new Router();
const port = 4242;

// Logger Middleware
app.use(async (ctx: Context, next: Next) => {
    await next();
    const rt = ctx.response.headers.get("X-Response-Time");
    console.log(`${ctx.request.method} ${ctx.request.url.pathname} - ${rt}`);
});

// Timing Middleware - Adding response time in headers and body
app.use(async (ctx: Context, next: Next) => {
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
    .get("/", (ctx: Context) => {
        ctx.response.body = { success: true, message: "Hello Deno!" };
    })
    .get("/response", (ctx: Context) => {
        ctx.response.body = {
            success: true,
            message: "Response Endpoint to Test!",
        };
    });

// Middleware to handle 404 Not Found
app.use(async (ctx: Context, next: Next) => {
    await next();
    if (ctx.response.status === 404 || ctx.response.body === undefined) {
        ctx.response.status = 404;
        ctx.response.body = {
            success: false,
            message: "Requested URL Not Found!",
        };
    }
});

// General error-handling middleware
app.use(async (ctx: Context, next: Next) => {
    try {
        await next();
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
            ctx.response.body = {
                success: false,
                message: err.message || "Internal Server Error",
            };
        }
    }
});

// Use the router
app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Server is Running on http://localhost:${port}`);

await app.listen({ port });
