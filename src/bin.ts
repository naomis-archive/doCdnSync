#!/usr/bin/env node
import { join } from "path";

import { config } from "dotenv";

import { main as setupMain } from "./setup";
import { main as syncMain } from "./sync";
import { validateEnv } from "./utils/validateEnv";

(async () => {
  config({ path: join(process.cwd(), ".env") });
  const credentials = validateEnv();
  const [, , commandToInvoke, ..._args] = process.argv;
  if (!commandToInvoke) {
    console.error(
      "You did not specify which command to run! Your options are setup or sync."
    );
    process.exit(1);
  }
  switch (commandToInvoke) {
    case "setup": {
      console.log(`Setting up a new folder in ${process.cwd()}`);
      await setupMain(process.cwd(), credentials);
      break;
    }
    case "sync": {
      console.log(`Syncing files in ${process.cwd()}`);
      await syncMain(process.cwd(), credentials);
      break;
    }
    default: {
      throw new Error(
        "Invalid command supplied. Please pass either setup or sync."
      );
    }
  }
})();
