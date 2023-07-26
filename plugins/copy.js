import fs from "fs/promises";
import path from "path";

export default function copy(options) {
  const { source, target } = options;

  return {
    name: "copy",
    async generateBundle({ dir }) {
      await fs.cp(path.join(process.cwd(), source), path.join(dir, target), {
        errorOnExist: false,
        recursive: true,
      });
    },
  };
}
