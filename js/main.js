requirejs.config({
  baseUrl: "/js/modules",
  paths: {
    helpers: "helpers",
    jquery: "//ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min",
    bs: "//cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min",
    fireworks: "//cdn.jsdelivr.net/npm/fireworks-js@2.x/dist/index.umd",
    fireworks2: "//unpkg.com/fireworks-js@2.x/dist/index.umd",
    extended: "extended",
    confetti:
      "//cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min",
  },
  shim: {
    bs: ["jquery"],
    helpers: ["jquery"],
    fireworks: ["jquery"],
  },
});
