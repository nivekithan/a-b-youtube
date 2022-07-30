import { config } from "dotenv";
import { rest } from "msw";
import { setupServer } from "msw/lib/node";

config();

const server =
  setupServer();
  // rest.get<{}>(/.*/, async (req, res, ctx) => {
  //   const url = req.url;
  //   console.count("Request count");
  //   console.log(req.headers);
  //   console.log(url);
  //   return res(ctx.json("Hello there"));
  // }),
  // rest.post(/.*/, async (req, res, ctx) => {
  //   const url = req.url;
  //   console.count("Request count Post");
  //   console.log(url);
  //   return res(ctx.json("Hello there Post"));
  // })

server.listen({ onUnhandledRequest: "bypass" });
console.info("🔶 Mock server running");

process.once("SIGINT", () => server.close());
process.once("SIGTERM", () => server.close());
