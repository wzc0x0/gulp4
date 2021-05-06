const gulp = require("gulp");
const { cleanDev, paths, devTask, devServer } = require("./gulpfile-dev");

exports.dev = gulp.series(cleanDev, devTask, devServer);

/*build */
const rev = require("gulp-rev");
const revCollector = require("gulp-rev-collector");
const del = require("del");

const clean = () => del(["dest"]);

const css = () =>
  gulp
    .src("dev/styles/**/*.css")
    .pipe(rev())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(rev.manifest())
    .pipe(gulp.dest("rev/css"));

const js = () =>
  gulp
    .src("dev/scripts/**/*.js")
    .pipe(rev())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(rev.manifest())
    .pipe(gulp.dest("rev/js"));

const copyRev = () =>
  gulp
    .src("dev/public/**/*.*")
    .pipe(rev())
    .pipe(gulp.dest(paths.copy.dest))
    .pipe(rev.manifest())
    .pipe(gulp.dest("rev/public"));

const html = () =>
  gulp.src("dev/html/**/*.html").pipe(gulp.dest(paths.html.dest));

const index = () =>
  gulp.src("dev/index.html").pipe(gulp.dest(paths.index.dest));

const collector = () =>
  gulp
    .src(["rev/**/*.json", "dest/**/*.html"])
    .pipe(
      revCollector({
        replaceReved: true,
      })
    )
    .pipe(gulp.dest("dest"));

const buildTask = gulp.parallel(copyRev, css, js, html, index);

exports.build = gulp.series(clean, devTask, buildTask, collector);
