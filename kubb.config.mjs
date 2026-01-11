import { defineConfig } from "@kubb/core";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginTs } from "@kubb/plugin-ts";
import { pluginReactQuery } from "@kubb/plugin-react-query";

export default defineConfig({
  input: {
    path: "./collection-endpoint/open-api/versi1.yaml",
  },
  output: {
    path: "./src/gen",
    clean: true,
  },
  plugins: [
    pluginOas({ validate: true }),
    pluginTs(),
    pluginReactQuery({
      framework: "react",
      version: 5,
    }),
  ],
});
