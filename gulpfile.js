var gulp = require('gulp'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    browserSync = require ('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),

    htmlmin = require('gulp-htmlmin');

gulp.task('sass', function() {
    gulp.src('./app/styles/sass/**/*.scss')
    .pipe(sass())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'],{cascade:true}))
    .pipe(gulp.dest('./app/styles/css'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function() {
    gulp.src([
        'app/libs/jquery/dist/jquery.min.js',
        'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
        'app/libs/bootstrap/dist/js/bootstrap.js'
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'));
});

gulp.task('css-libs', ['sass'], function() {
    gulp.src('app/styles/css/libs.css')
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/styles/css'))
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

gulp.task('clean', function() {
    del.sync('dist');
});

gulp.task('clear', function() {
    cache.clearAll();
});

gulp.task('img', function() {
    gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            interlaced:true,
            progressive:true,
            svgoPlugins: [{removeViewBox:false}],
            une: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('watch', ['browser-sync','css-libs', 'scripts'], function() {
    gulp.watch('./app/styles/sass/**/*.scss', ['sass']);
    gulp.watch('./app/*.html', browserSync.reload);
    gulp.watch('./app/**/*.js', browserSync.reload);
});

gulp.task('build',['clean','img', 'sass', 'scripts'], function() {
    var buildCss = gulp.src([
        'app/styles/css/main.css',
        'app/styles/css/libs.min.css'
    ])
    .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));

    var buildJs = gulp.src('app/js/**/*')
        .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src('app/*html')
        .pipe(gulp.dest('dist'));
});





















