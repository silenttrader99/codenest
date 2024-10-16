import express from "express";
import path from "path";
import fs from "fs/promises";

interface Cell {
  id: string;
  content: string;
  type: "text" | "code";
}

interface LocalApiError {
  code: string;
}

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  router.use(express.json());

  const fullPath = path.join(dir, filename);

  router.get("/cells", async (req, res) => {
    const isLocalApiError = (error: any): error is LocalApiError => {
      return typeof error.code === "string";
    };

    try {
      // read the file
      const result = await fs.readFile(fullPath, { encoding: "utf-8" });
      res.send(JSON.parse(result));
    } catch (error) {
      if (isLocalApiError(error)) {
        if (error.code === "ENOENT") {
          // create a file and add default cells
          await fs.writeFile(fullPath, "[]", "utf-8");
          res.send([]);
        } else {
          throw error;
        }
      }
    }
  });

  router.post("/cells", async (req, res) => {
    // retrieve the list of cells from the request obj and format
    const { cells }: { cells: Cell[] } = req.body;

    // write the cells into the file
    await fs.writeFile(fullPath, JSON.stringify(cells), "utf-8");

    res.send({
      status: "ok",
    });
  });

  return router;
};
