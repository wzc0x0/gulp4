const gulp = require("gulp");
const less = require("gulp-less");
const browserSync = require("browser-sync").create();

/**
 * 新建public文件夹，不做任何编译，直接copy dist
 *
 * 必须指定文件夹比较多
 * dev 不加hash?
 * 启动服务到dev文件夹?
 * 在当前文件夹启动服务？
 *
 */

const paths = {
  styles: {
    src: "src/styles/**/*.less",
    dev: "src/styles/",
    dest: "dest/styles/",
  },
  scripts: {
    src: "src/scripts/**/*.js",
    dev: "src/scripts/",
    dest: "dest/scripts/",
  },
  html: {
    src: "src/html/**/*.html",
    dest: "dest/html/",
  },
  index: {
    src: "src/index.html",
    dest: "dest/",
  },
};

const styles = () =>
  gulp
    .src(paths.styles.src)
    .pipe(less())
    .pipe(gulp.dest(paths.styles.dev))
    .pipe(browserSync.stream());

const dev = () => {
  browserSync.init({
    server: {
      baseDir: "src",
    },
    open: false,
  });
  gulp.watch(paths.index.src).on("change", browserSync.reload);
  gulp.watch(paths.html.src).on("change", browserSync.reload);
  gulp.watch(paths.scripts.src).on("change", browserSync.reload);
  gulp.watch(paths.styles.src).on("change", styles);
};

exports.dev = dev;

/*build */
const rev = require("gulp-rev");
const revCollector = require("gulp-rev-collector");
const del = require("del");

const clean = () => del(["dest"]);

const css = () =>
  gulp
    .src("src/styles/**/*.css")
    .pipe(rev())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(rev.manifest())
    .pipe(gulp.dest("rev/css"));

const js = () =>
  gulp
    .src(paths.scripts.src)
    .pipe(rev())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(rev.manifest())
    .pipe(gulp.dest("rev/js"));

const html = () => gulp.src(paths.html.src).pipe(gulp.dest(paths.html.dest));

const indexHtml = () =>
  gulp.src(paths.index.src).pipe(gulp.dest(paths.index.dest));

const collector = () =>
  gulp
    .src(["rev/**/*.json", "dest/**/*.html"])
    .pipe(
      revCollector({
        replaceReved: true,
      })
    )
    .pipe(gulp.dest("dest"));

exports.build = gulp.series(
  clean,
  gulp.parallel(css, js, html, indexHtml),
  collector
);
