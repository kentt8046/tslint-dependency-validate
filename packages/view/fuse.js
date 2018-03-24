const path = require("path");

const { FuseBox, Sparky } = require("fuse-box");
const { TypeHelper } = require("fuse-box-typechecker");
const express = require("express");

const rootDir = __dirname;
const outDir = "public/assets";
const fuse = FuseBox.init({
  homeDir: "src",
  output: `${outDir}/$name.js`,
  target: "browser@es5",
  useTypescriptCompiler: true,
  sourceMaps: {
    inline: true,
  },
});

fuse.bundle("vendor").instructions("~ index.tsx");
const app = fuse.bundle("app").instructions("!> [index.tsx]");

Sparky.task("build", () => {
  TypeHelper({
    tsConfig: "./tsconfig.json",
    basePath: "./",
    tsLint: "./tslint.json",
    name: "App typechecker",
  }).runWatch("./src");

  fuse.dev({ root: "public", port: 8080 }, routeDevServer);
  app.watch().hmr({ reload: true });

  return fuse.run();
});

const routeDevServer = server => {
  const app = server.httpServer.app;
  app
    .use("/assets/", express.static(path.resolve(rootDir, "public/assets")))
    .use("/images/", express.static(path.resolve(rootDir, "public/images")))
    .get("*", function(req, res) {
      res.sendFile(path.resolve(rootDir, "public/index.html"));
    });
};
