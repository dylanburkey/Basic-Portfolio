var gulp = require('gulp');
plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var sass = require('gulp-sass');
var minifycss = require('gulp-minify-css');
var htmlmin = require('gulp-htmlmin');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var nunjucksRender = require('gulp-nunjucks-render');
var newer = require('gulp-newer');
var data = require('gulp-data');
const imagemin = require('gulp-imagemin');



var browserSync = require('browser-sync').create();


gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'dist/'
        },
    })
})

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('minify', function() {
    return gulp.src('./*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist/'));
});

gulp.task('nunjucks', function() {
    return gulp.src('src/assets/templates/pages/**/*.+(html|njk|nunjucks)')
    // We do not need the data.json for this demo but you can use it if you wanna
       /* .pipe(data(function(){
        return require('./src/data/data.json');
        }))*/
        .pipe(nunjucksRender({
            path: ['src/assets/templates/']
        }))
        .pipe(gulp.dest('dist/'))

});



gulp.task('images', function(){
    return gulp.src('src/assets/media/images/**/*.+(png|jpg|gif|svg)')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/assets/media/images/'))
});


gulp.task('sass', function() {
  gulp.src(['src/assets/styles/**/*.scss'])
      .pipe(sass({
          outputStyle: 'compressed'
      }).on('error', sass.logError))
        .pipe(autoprefixer('last 3 versions'))
        .pipe(gulp.dest('dist/assets/styles/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/assets/styles/'))
         .pipe(browserSync.reload({stream:true}))
});
gulp.task('scripts', function(){
    return gulp.src('src/assets/scripts/**/*.js')
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }}))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(babel())
        .pipe(gulp.dest('dist/assets/scripts/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/assets/scripts/'))
        .pipe(browserSync.reload({stream:true}))
});


gulp.task('watch', ['browserSync', 'sass'], function (){
    gulp.watch('src/assets/styles/**/*.scss', ['sass']);
    gulp.watch("src/assets/scripts/**/*.js", ['scripts']);
    gulp.watch("*.html", ['bs-reload']);
    // Other watchers
});
