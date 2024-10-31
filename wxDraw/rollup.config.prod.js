import { babel } from "@rollup/plugin-babel";
import { uglify } from "rollup-plugin-uglify";

/** @type {import('rollup').RollupOptions} */
export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/wxdraw.cjs.min.js",
      format: "cjs",
    },
    {
      file: "dist/wxdraw.esm.min.js",
      format: "es",
    },
  ],
  plugins: [
    babel({
      exclude: "node_modules/**",
      babelHelpers: "bundled",
    }),
    uglify(),
  ],
};
