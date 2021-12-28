import esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";
import { createServer } from "http";
import postcssPlugin from "esbuild-postcss";
import postcssConfig from "./postcss.config.cjs";

const isProd = process.argv.includes("--prod");

const config = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  outfile: "./public/build/bundle.js",
  loader: {
    ".sql": "text",
  },
  plugins: [
    esbuildSvelte({
      preprocess: [
        sveltePreprocess({
          defaults: {
            style: "postcss",
          },
          postcss: true,
        }),
      ],
    }),
    postcssPlugin({
      extensions: [".css", ".postcss"],
    }),
  ],
  banner: {
    js: ' (() => new EventSource("http://localhost:8090").onmessage = () => location.reload())();',
  },
  ...(isProd
    ? {}
    : {
        watch: {
          onRebuild(error) {
            clients.forEach((res) => res.write("data: update\n\n"));
            clients.length = 0;
            console.log(error ? error : "...");
          },
        },
      }),
};

esbuild.build(config).catch((err) => {
  console.error(err);
  process.exit(1);
});

if (!isProd) {
  esbuild.serve(
    {
      servedir: "./public",
      port: 3000,
    },
    {}
  );
}

const clients = [];

if (!isProd) {
  createServer((req, res) => {
    return clients.push(
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Access-Control-Allow-Origin": "*",
        Connection: "keep-alive",
      })
    );
  }).listen(8090);
}
