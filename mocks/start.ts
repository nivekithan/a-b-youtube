import { config } from "dotenv";
import { rest } from "msw";
import { setupServer } from "msw/lib/node";

config();

const server = setupServer(
  rest.get<{}>(/.*/, async (req, res, ctx) => {
    const url = req.url;
    console.count("Request count");
    console.log(url);
    return req.passthrough();
  })
);

server.listen({ onUnhandledRequest: "bypass" });
console.info("🔶 Mock server running");

process.once("SIGINT", () => server.close());
process.once("SIGTERM", () => server.close());
