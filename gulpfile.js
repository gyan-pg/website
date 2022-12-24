const gulp = require("gulp")
// scssをコンパイルする
const sass = require("gulp-sass")(require("sass"))
// ブラウザの自動リロード
const browserSync = require('browser-sync')
// webpackを使ってjsファイルをひとまとめにする
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const webpackConfig = require('./webpack.config')
// css変換時にエラーが出ても、gulpの処理を止めないようにする。
const plumber = require('gulp-plumber')

// 画像圧縮関係
const imagemin = require('gulp-imagemin')
const mozjpeg = require('imagemin-mozjpeg')
const pngquant = require('imagemin-pngquant')
const changed = require('gulp-changed')

gulp.task("build", function () {
  webpackStream(webpackConfig, webpack)
      .pipe(gulp.dest('./dist/js/')) // パス間違うとエラー
})

gulp.task("build-sass", function () {
  return (
  gulp.src("./src/scss/style.scss")
      .pipe(plumber())
      .pipe(sass({
        outputStyle: "expanded" // compressed、nested、compactを指定可能。
      }))
      // 吐き出し先のフォルダを指定する。
      .pipe(gulp.dest("./dist/css"))
  )
})


gulp.task("browser-sync", function () {
  browserSync.init({
    server: {
      baseDir: "./",
      index: "index.html"
    }
  })
})

gulp.task("bs-reload", function () {
  browserSync.reload()
})

gulp.task("imagemin", function () {
  return gulp
    .src('./src/images/**')
    .pipe(changed('./dist/images'))
    .pipe(
      imagemin([
        pngquant({
          quality: [.60, .70], //画質
          speed: 1 // スピード
        }),
        mozjpeg({quality: 65}),
        imagemin.svgo(),
        imagemin.optipng(),
        imagemin.gifsicle({optimizationLevel: 3})// 圧縮率
      ])
    )
    .pipe(gulp.dest('./dist/images'))
})

gulp.task("default", ["build", "build-sass", "browser-sync", "imagemin"] , function () {
  gulp.watch("./src/js/*.js", ["build"])
  gulp.watch("./src/js/components/*.js", ["build"])
  gulp.watch("./src/scss/style.scss", ["build-sass"])
  gulp.watch("./src/scss/*/*.scss", ["build-sass"])
  gulp.watch("./src/scss/object/*/*.scss", ["build-sass"])
  gulp.watch("./*.html", ["bs-reload"])
  gulp.watch("./dist/*/*.+(js|css)", ["bs-reload"])
  gulp.watch("./src/images/**", gulp.task('imagemin'))
})
