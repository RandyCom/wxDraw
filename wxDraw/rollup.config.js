export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/wxdraw.cjs.js",
      format: "cjs",
    },
    {
      file: "dist/wxdraw.esm.js",
      format: "es",
    },
  ],
  plugins: [
    // babel({
    //     exclude: 'node_modules/**',
    //     runtimeHelpers: true,
    //     babelrc: true
    // })
  ],
  watch: {
    include: "src/**",
  },
};
