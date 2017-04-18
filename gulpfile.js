/**
 * Created by Administrator on 2017/4/18.
 */
var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),       //图片压缩
    sass = require('gulp-ruby-sass'),          //sass
    minifycss = require('gulp-minify-css'),    //css压缩
    jshint = require('gulp-jshint'),           //js检查
    uglify  = require('gulp-uglify'),          //js压缩
    rename = require('gulp-rename'),           //重命名
    concat  = require('gulp-concat'),          //合并文件
    clean = require('gulp-clean'),             //清空文件夹
    useref = require('gulp-useref'),           //合并html里的文件引入
    livereload = require('gulp-livereload'),   //livereload
    tinylr = require('tiny-lr'),               //livereload
    server = tinylr(),
    port = 3000;

var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('default', ['bower','js']);

gulp.task('bower', function() {
    gulp.src(['bower_components/jquery/dist/jquery.min.js','bower_components/jquery.nicescroll/jquery.nicescroll.min.js'])
        .pipe(gulp.dest('dist/lib'));
});

gulp.task('serve', ['js'], function() {
    browserSync({
        server: {
            baseDir: 'dist'
        }
    });

    gulp.watch('src/**', ['js']);
});

// js处理
gulp.task('js', function () {
    var jsSrc = './src/js/*.js',
        jsDst ='./dist/js';

    gulp.src(jsSrc)
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(jsDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(livereload(server))
        .pipe(gulp.dest(jsDst));

    gulp.src('src/*.html')
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});
