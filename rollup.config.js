import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "index.ts",
  output: {
    dir: "dist",
    format: "es",
    preserveModules: true,
    preserveModulesRoot: ".",
    sourcemap: true,
  },
  external: ["@linear/sdk", "easy-agent"],
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "dist",
      moduleResolution: "node",
    }),
    resolve(),
    commonjs(),
  ],
};
