// kubb.config.mjs
import { defineConfig } from "@kubb/core";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginTs } from "@kubb/plugin-ts";
import { pluginReactQuery } from "@kubb/plugin-react-query";

export default defineConfig({
  input: {
    path: "./collection-endpoint/open-api/versi1.yaml",
  },
  output: {
    path: "./app/lib/generated", // atau "./app/lib/generated" jika tanpa src/
    clean: true,
  },
  plugins: [
    pluginOas({ validate: true }),
    pluginTs(),
    pluginReactQuery({
      framework: "react",
      version: 5,
      client: {
        importPath: "../../api-client",
      },
      query: {
        // Optional: tambah query options
        enabled: true,
        staleTime: 1000 * 60 * 5, // 5 menit
      },
      // Untuk grouping by tag
      groupBy: {
        type: "tag",
        output: "./{tag}",
      },
    }),
  ],
});
