import { Command } from "commander";
import { serve } from "local-api";
import path from "path";

export const serveCommand = new Command()
  .command("serve [filename]") //[] = optional value, <> = required value
  .description("open a file for editing")
  .option("-p, --port <number>", "port to run server", "4005")
  .action(
    (
      filename = "notebook.js",
      options: {
        port: string;
      }
    ) => {
      const dir = path.join(process.cwd(), path.dirname(filename));
      serve(parseInt(options.port), path.basename(filename), dir);
    }
  );
