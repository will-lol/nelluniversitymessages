import { MiddlewareHandlerContext } from "$fresh/server.ts";

//this middleware just sets appropriate cache headers for assets without cache headers already. 
export async function handler(req: Request, ctx: MiddlewareHandlerContext) {
    const resp = await ctx.next();
    if (!resp.headers.get("Cache-Control")) {
        resp.headers.set("Cache-Control", "max-age=31536000, immutable");
    }
    return resp;
}