const gulp = require('gulp');
	plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
	sass = require('gulp-sass');
	minifycss = require('gulp-minify-css');
	htmlmin = require('gulp-htmlmin');
	autoprefixer = require('gulp-autoprefixer');
	babel = require('gulp-babel');
	concat = require('gulp-concat');
	jshint = require('gulp-jshint');
	uglify = require('gulp-uglify');
	nunjucksRender = require('gulp-nunjucks-render');
	newer = require('gulp-newer');
	data = require('gulp-data');
	imagemin = require('gulp-imagemin');



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
        .pipe(browserSync.reload({stream:true}))


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


gulp.task('watch', ['browserSync', 'sass', 'scripts', 'nunjucks'], function (){
    gulp.watch('src/assets/styles/**/*.scss', ['sass']);
    gulp.watch("src/assets/templates/pages/**/*.njx)", ['nunjucks']);
    gulp.watch("src/assets/scripts/**/*.js", ['scripts']);
    gulp.watch("*.html", ['bs-reload']);
    // Other watchers
});
