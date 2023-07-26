import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import html from "@rollup/plugin-html";
import dev from "rollup-plugin-dev";
import postcss from "rollup-plugin-postcss";
import replace from "@rollup/plugin-replace";

import copy from "./plugins/copy.js";

const isPrd = process.env.NODE_ENV === "production";

const plugins = [
  nodeResolve(),
  typescript(),
  commonjs(),
  replace({
    preventAssignment: true,
    "process.env.NODE_ENV": JSON.stringify(
      isPrd ? "production" : "development"
    ),
  }),
  copy({
    source: "public",
    target: '.'
  })
];

if (isPrd) {
  plugins.push(postcss({ extract: true }));
} else {
  plugins.push(postcss());
  plugins.push(
    dev({
      dirs: ["dist"],
    })
  );
}

plugins.push(
  html({
    title: "React TS SPA",
  }),
);

export default {
  input: "./src/index.tsx",
  output: {
    dir: "dist",
    format: "es",
  },
  plugins,
};
