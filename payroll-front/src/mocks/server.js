import { rest } from "msw";
import { setupServer } from "msw/node";

let handlers = [];

export function createServer(handlerConfig) {
  handlers = handlerConfig.map((config) => {
    return rest[config.method](config.path, (req, res, ctx) => {
      return rest(ctx.json(config.res(req, res, ctx)));
    });
  });
}

export const server = setupServer(...handlers);
