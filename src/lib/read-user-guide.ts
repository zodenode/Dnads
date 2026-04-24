import { readFile } from "fs/promises";
import path from "path";

export async function readUserGuideMarkdown(): Promise<string> {
  const p = path.join(process.cwd(), "USER_GUIDE.md");
  return readFile(p, "utf-8");
}
