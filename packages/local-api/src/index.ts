import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import { createCellsRouter } from "./routes/cells";

export const serve = (
  port: number,
  filename: string,
  dir: string,
  useProxy: boolean
) => {
  const app = express();

  app.use(createCellsRouter(filename, dir));
  if (useProxy) {
    app.use(
      createProxyMiddleware({
        target: "http://localhost:5173",
        ws: true,
        logger: console,
      })
    );
  } else {
    const packagePath = require.resolve(
      "@nestjsnote/local-client/dist/index.html"
    ); // figure out the file dir
    app.use(express.static(path.dirname(packagePath)));
  }

  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on("error", reject);
  });
};
