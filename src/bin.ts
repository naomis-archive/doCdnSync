#!/usr/bin/env node
import { main as setupMain } from "./setup";
import { main as syncMain } from "./sync";

(async () => {
  const [, , commandToInvoke, ..._args] = process.argv;
  if (!commandToInvoke) {
    throw new Error(
      "You did not specify which command to run! Your options are setup or sync."
    );
  }
  switch (commandToInvoke) {
    case "setup": {
      await setupMain({ baseDir: process.cwd() });
      break;
    }
    case "sync": {
      await syncMain({ baseDir: process.cwd() });
      break;
    }
    default: {
      throw new Error(
        "Invalid command supplied. Please pass either setup or sync."
      );
    }
  }
})();
