import { Credentials } from "../interfaces/Credentials";

/**
 * Validates that the environment variables are found, and if not,
 * displays instructions in the terminal.
 *
 * @returns { Credentials } A credentials object.
 */
export const validateEnv = (): Credentials => {
  if (
    !process.env.SPACES_KEY ||
    !process.env.SPACES_SECRET ||
    !process.env.SPACES_NAME ||
    !process.env.SPACES_REGION
  ) {
    console.error(
      `You appear to be missing environment variables.\n\nEnsure that you have created a .env file in your current directory, and that it contains the following:\n\nSPACES_KEY="<your-key>"\nSPACES_SECRET="<your-secret>"\nSPACES_NAME="<your-bucket-name>\nSPACES_REGION="<your-spaces-region e.g. sfo3>"`
    );
    process.exit(1);
  }

  return {
    key: process.env.SPACES_KEY as string,
    secret: process.env.SPACES_SECRET as string,
    name: process.env.SPACES_NAME as string,
    region: process.env.SPACES_REGION as string,
  };
};
