requirejs.config({
  baseUrl: "../js/modules",
  paths: {
    helpers: "helpers",
    jquery: "https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min",
    bs: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min",
    fireworks: "https://cdn.jsdelivr.net/npm/fireworks-js@2.x/dist/index.umd",
    fireworks2: "https://unpkg.com/fireworks-js@2.x/dist/index.umd",
    extended: "extended",
    confetti: "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min",
    puzzle: "./puzzle",
    gallery: "./gallery",
  },
  shim: {
    bs: ["jquery"],
    helpers: ["jquery"],
    fireworks: ["jquery"],
    puzzle: ["jquery"],
    gallery: ["jquery"]
  },
});
