import { Command } from "commander";
import { serve } from "local-api";
import path from "path";

interface LocalApiError {
  code: string;
}

// running on user machine
const isProduction = process.env.NODE_ENV === "production";

export const serveCommand = new Command()
  .command("serve [filename]") //[] = optional value, <> = required value
  .description("open a file for editing")
  .option("-p, --port <number>", "port to run server", "4005")
  .action(async (filename = "notebook.js", options: { port: string }) => {
    const isLocalApiError = (error: any): error is LocalApiError => {
      return typeof error.code === "string";
    };

    try {
      const dir = path.join(process.cwd(), path.dirname(filename));
      await serve(
        parseInt(options.port),
        path.basename(filename),
        dir,
        !isProduction
      );
      console.log(
        `Opened ${filename}. Navigate to http://localhost:${options.port} to access the file.`
      );
    } catch (error) {
      if (isLocalApiError(error)) {
        if (error.code === "EADDRINUSE") {
          console.error("Port is in use. Try running on a different port.");
        }
      } else if (error instanceof Error) {
        console.error(error.message);
      }
      process.exit(1); //force exit the program
    }
  });
