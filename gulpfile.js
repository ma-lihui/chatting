/**
 * Created by Administrator on 2017/4/18.
 */
var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),       //图片压缩
    sass = require('gulp-ruby-sass'),          //sass
    minifycss = require('gulp-clean-css'),    //css压缩
    jshint = require('gulp-jshint'),           //js检查
    uglify  = require('gulp-uglify'),          //js压缩
    rename = require('gulp-rename'),           //重命名
    concat  = require('gulp-concat'),          //合并文件
    gulpif = require('gulp-if'),
    clean = require('gulp-clean'),             //清空文件夹
    useref = require('gulp-useref'),           //合并html里的文件引入
    livereload = require('gulp-livereload'),   //livereload
    tinylr = require('tiny-lr'),               //livereload
    server = tinylr();
const port = 88;
var browserSync = require('browser-sync');
var reload = browserSync.reload;

//依赖包处理
// gulp.task('lib', ['clean'], function() {
//     gulp.src(['bower_components/jquery/dist/jquery.min.js',
//         'bower_components/jquery.nicescroll/jquery.nicescroll.min.js',
//         'bower_components/socket.io-client/dist/socket.io.min.js'
//     ]).pipe(gulp.dest('dist/lib'));
// });
// js处理
// gulp.task('js', ['clean'],function () {
//     var jsSrc = './src/js/*.js',
//         jsDst ='./dist/js';
//
//     gulp.src(jsSrc)
//         .pipe(jshint.reporter('default'))
//         .pipe(concat('main.js'))
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(uglify())
//         .pipe(gulp.dest(jsDst));
//
//
// });
// css处理
// gulp.task('css', ['clean'] ,function () {
//     var cssSrc = './src/css/*.css',
//         cssDst ='./dist/css';
//
//     gulp.src(cssSrc)
//         .pipe(minifycss())
//         .pipe(concat('main.css'))
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(gulp.dest(cssDst));
// });

// html处理
gulp.task('html', ['clean'], function () {
    gulp.src('src/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifycss()))
        .pipe(gulp.dest('dist'));
});
// image处理
gulp.task('img', ['clean'], function () {
    gulp.src('src/img/**')
        .pipe(gulp.dest('dist/img'));
});
//清空文件
gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});
//实时刷新
gulp.task('server', function () {
    browserSync({
        server: {
            baseDir: 'src'
        }
    });
    gulp.watch(['src/js/**', 'src/css/**', 'src/*.html']).on('change', reload);
});
gulp.task('default', ['clean', 'html', 'img']);