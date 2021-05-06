const gulp = require("gulp");
const del = require("del");
const less = require("gulp-less");
const template = require("gulp-art-template4");
const browserSync = require("browser-sync").create();

const paths = {
  copy: {
    src: "src/public/**/*.*",
    dev: "dev/public/",
    dest: "dest/public/",
  },
  styles: {
    src: "src/styles/**/*.less",
    dev: "dev/styles/",
    dest: "dest/styles/",
  },
  scripts: {
    src: "src/scripts/**/*.js",
    dev: "dev/scripts/",
    dest: "dest/scripts/",
  },
  html: {
    src: "src/html/**/*.art",
    dev: "dev/html/",
    dest: "dest/html/",
  },
  index: {
    src: "src/index.art",
    dev: "dev/",
    dest: "dest/",
  },
};

const cleanDev = () => del(["dev"]);

const copyDev = () =>
  gulp
    .src(paths.copy.src)
    .pipe(gulp.dest(paths.copy.dev))
    .pipe(browserSync.stream());

const styles = () =>
  gulp
    .src(paths.styles.src)
    .pipe(less())
    .pipe(gulp.dest(paths.styles.dev))
    .pipe(browserSync.stream());

const htmlDev = () =>
  gulp
    .src(paths.html.src)
    .pipe(
      template(
        {},
        {
          extname: ".art", // some art-template options
        },
        {
          ext: ".html",
        }
      )
    )
    .pipe(gulp.dest(paths.html.dev))
    .pipe(browserSync.stream());
//TODO 换成html更酷
const indexDev = () =>
  gulp
    .src(paths.index.src)
    .pipe(
      template(
        {},
        {
          extname: ".art", // some art-template options
        },
        {
          ext: ".html",
        }
      )
    )
    .pipe(gulp.dest(paths.index.dev))
    .pipe(browserSync.stream());

const scripts = () =>
  gulp
    .src(paths.scripts.src)
    .pipe(gulp.dest(paths.scripts.dev))
    .pipe(browserSync.stream());

const devServer = () => {
  browserSync.init({
    server: {
      baseDir: "dev",
    },
    open: false,
  });
  gulp.watch(paths.copy.src).on("change", copyDev);
  gulp.watch(paths.index.src).on("change", indexDev);
  gulp.watch(paths.html.src).on("change", htmlDev);
  gulp.watch(paths.scripts.src).on("change", scripts);
  gulp.watch(paths.styles.src).on("change", styles);
};

const devTask = gulp.parallel(copyDev, scripts, styles, indexDev, htmlDev);

module.exports = {
  cleanDev,
  paths,
  devTask,
  devServer,
};
