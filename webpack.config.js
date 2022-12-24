module.exports = {
  mode: 'development',
  entry: './src/js/app.js',// バンドルする起点のファイル
  output: {
    path: __dirname + '/dist/js',// 出力先の絶対パス
    filename: 'bundle.js'// ファイル名
  }
}