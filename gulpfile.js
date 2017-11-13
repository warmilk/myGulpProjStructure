/** 
||| @gulp官方教程
||| https://github.com/gulpjs/gulp/tree/master/docs
**/



const gulp = require('gulp');

/** 
    ====================开发相关=========================
**/

// sass和js语法检查、报错、错误定位
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
// sass编译、代码加前缀
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
// js编译、打包
const babel = require('gulp-babel');
const webpack = require('webpack-stream');
// browser-sync
const browserSync = require('browser-sync').create();
// 代理中间件（解决发请求时跨域）
const proxyMiddleware = require('http-proxy-middleware');


/** 
    ====================上线相关=========================
**/
// 清空旧版本
const clean = require('gulp-clean');
// css文件压缩
const cssnano = require('gulp-cssnano');
// js文件压缩
const uglify = require('gulp-uglify');
// css,js的压缩文件加后缀
const rename = require('gulp-rename');
// html压缩
const htmlmin = require('gulp-htmlmin');
// 去除js和html的console.log
const removeConsolelog = require("gulp-remove-logging");








/** 
    ====================开发相关=========================
**/
gulp.task('test-clean_static', function() {
    return gulp.src(['test/static/*'], {
            read: false,
        })
        .pipe(plumber({
            errorHandler: notify.onError('你清理test下的static目录出错了: <%= error.message %>')
        }))
        .pipe(clean())
        .pipe(browserSync.stream());
});
gulp.task('test-clean_lib', function() {
    return gulp.src(['test/lib/*'], {
            read: false,
        })
        .pipe(plumber({
            errorHandler: notify.onError('你清理test下的lib目录出错了: <%= error.message %>')
        }))
        .pipe(clean())
        .pipe(browserSync.stream());
});
gulp.task('test-clean_devtool', function() {
    return gulp.src(['test/devtool/*'], {
            read: false,
        })
        .pipe(plumber({
            errorHandler: notify.onError('你清理test下的devtool目录出错了: <%= error.message %>')
        }))
        .pipe(clean())
        .pipe(browserSync.stream());
});
gulp.task('test-sass', function() {
    return gulp.src('src/css/*.scss')
        .pipe(plumber({
            errorHandler: notify.onError('你写的scss有猫病: <%= error.message %>'),
        }))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: false,
        }))
        // .pipe(concat('main.css'))
        .pipe(sourcemaps.write('.'))
        // .pipe(assetRev())
        .pipe(gulp.dest('test/css'))
        .pipe(browserSync.stream());
});
gulp.task('test-script', function() {
    return gulp.src('src/js/*.js')
        .pipe(plumber({
            errorHandler: notify.onError('你写的js有猫病: <%= error.message %>'),
        }))
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(webpack({
            // https://www.npmjs.com/package/webpack-stream
            // entry: {
            //     app: 'src/app.js',
            //     test: 'test/test.js',
            // },
            // output: {
            //     filename: '[name].js',
            // },
            entry: './src/js/main.js',
            output: {
                filename: 'main.js',
            },
            module: {
                loaders: [{
                    test: /\.js$/,
                    loader: 'babel-loader',
                }],
            },
            plugins: [],
        }))
        .pipe(sourcemaps.write('.'))
        // .pipe(assetRev())
        .pipe(gulp.dest('test/js'))
        .pipe(browserSync.stream());
});
gulp.task('test-copy-static', function() {
    return gulp.src('src/static/**/*')
        .pipe(plumber({
            errorHandler: notify.onError('你的static目录搬家出错了: <%= error.message %>')
        }))
        // .pipe(assetRev())
        .pipe(gulp.dest('test/static/'))
        .pipe(browserSync.stream());
});
gulp.task('test-copy-lib', function() {
    return gulp.src('src/lib/**/*')
        .pipe(plumber({
            errorHandler: notify.onError('你的lib目录搬家出错了: <%= error.message %>')
        }))
        // .pipe(assetRev())
        .pipe(gulp.dest('test/lib/'))
        .pipe(browserSync.stream());
});
gulp.task('test-copy-devtool', function() {
    return gulp.src('src/devtool/**/*')
        .pipe(plumber({
            errorHandler: notify.onError('你的devtool目录搬家出错了: <%= error.message %>')
        }))
        // .pipe(assetRev())
        .pipe(gulp.dest('test/devtool/'))
        .pipe(browserSync.stream());
});
gulp.task('test-copy-html', function() {
    return gulp.src('src/*.html')
        .pipe(plumber({
            errorHandler: notify.onError('你的index.html搬家出错了: <%= error.message %>')
        }))
        // .pipe(assetRev())
        .pipe(gulp.dest('test'))
        .pipe(browserSync.stream());
});
/**配置代理中间件开始 */
const proxyTable = {
    '/aaticket/api': {
        target: 'http://aaticket.dyyz1993.com/',
        changeOrigin: true,
        logLevel: 'debug'
    }
}
const proxyArr = [];
Object.keys(proxyTable).forEach(function(context) {
    var options = proxyTable[context];
    if (typeof options === 'string') {
        options = {
            target: options
        }
    }
    proxyArr.push(proxyMiddleware(context, options));
});
/**配置代理中间件结束 */
gulp.task('browser-sync', ['test-sass', 'test-script', 'test-copy-static', 'test-copy-lib', 'test-copy-devtool', 'test-copy-html'], function() {
    browserSync.init({
        server: {
            baseDir: './',
            port: 4000,
            middleware: proxyArr
        },
        // middleware: proxyArr,
        port: '3005',
        browser: ["C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"], //指定打开的浏览器(填上你浏览器的exe的本地路径)
        // open: true,
        // host: '192.168.199.1',
        startPath: '/test/?debug=true', // 打开的位置
    });
    // 监听
    gulp.watch('src/css/**/*.scss', ['test-sass']);
    gulp.watch('src/js/**/*.js', ['test-script']);
    gulp.watch('src/index.html', ['test-copy-html']);
    gulp.watch('src/static/**/*', ['test-clean_static', 'test-copy-static']);
    gulp.watch('src/lib/**/*', ['test-clean_lib', 'test-copy-lib']);
    gulp.watch('src/devtool/**/*', ['test-clean_devtool', 'test-copy-devtool']);
});






/** 
    ====================上线相关=========================
**/
// 清除旧版本的js/和css/和static/和lib/
gulp.task('sass', function() {
    return gulp.src('src/css/*.scss')
        .pipe(plumber({
            errorHandler: notify.onError('你写的scss有猫病: <%= error.message %>'),
        }))
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: false,
        }))
        // .pipe(concat('main.css'))
        // .pipe(assetRev())
        .pipe(cssnano())
        // .pipe(rename({
        //     suffix: '.min',
        // }))
        .pipe(gulp.dest('dest/css'));
});
gulp.task('script', function() {
    return gulp.src('src/js/*.js')
        .pipe(plumber({
            errorHandler: notify.onError('你写的js有猫饼: <%= error.message %>'),
        }))
        .pipe(
            removeConsolelog({
                // Options (optional) 
                // eg: 
                // namespace: ['console', 'window.console'] 
            })
        )
        .pipe(babel())
        .pipe(webpack({
            // https://www.npmjs.com/package/webpack-stream
            // entry: {
            //     app: 'src/app.js',
            //     test: 'test/test.js',
            // },
            // output: {
            //     filename: '[name].js',
            // },
            entry: './src/js/main.js',
            output: {
                filename: 'main.js',
            },
            module: {
                loaders: [{
                    test: /\.js$/,
                    loader: 'babel-loader',
                }],
            },
            plugins: [],
        }))
        // .pipe(assetRev())
        .pipe(uglify())
        // .pipe(rename({
        //     suffix: '.min',
        // }))
        .pipe(gulp.dest('dest/js'));
});
gulp.task('copy-lib', function() {
    return gulp.src('test/lib/**/*')
        .pipe(plumber({
            errorHandler: notify.onError('你复制lib到dest出错了: <%= error.message %>'),
        }))
        // .pipe(assetRev())
        .pipe(gulp.dest('dest/lib'))
        .pipe(browserSync.stream());
});
gulp.task('copy-static', function() {
    return gulp.src('test/static/**/*')
        .pipe(plumber({
            errorHandler: notify.onError('你复制static到dest出错了: <%= error.message %>'),
        }))
        // .pipe(assetRev())
        .pipe(gulp.dest('dest/static'));
});
gulp.task('minihtml', function() {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };
    return gulp.src('src/*.html')
        .pipe(plumber({
            errorHandler: notify.onError('你压缩html到dest出错了: <%= error.message %>'),
        }))
        .pipe(
            removeConsolelog({
                // Options (optional) 
                // eg: 
                // namespace: ['console', 'window.console'] 
            })
        )
        .pipe(htmlmin(options))
        // .pipe(assetRev())
        .pipe(gulp.dest('dest'));
});



// 编译好的dest/js下的js文件压缩、压缩文件加后缀
// gulp.task('js-compress', function () {
//     gulp.src('dest/js/main.js')
//         .pipe(uglify())
//         .pipe(rename({
//             suffix: '.min',
//         }))
//         .pipe(gulp.dest('dest/js'));
// });
// 编译好的dest/css下的css文件压缩、压缩文件加后缀
// gulp.task('css-compress', function () {
//     gulp.src('dest/css/main.css')
//         .pipe(cssnano())
//         .pipe(rename({
//             suffix: '.min',
//         }))
//         .pipe(gulp.dest('dest/css'));
// });
// 生成最终上线代码
gulp.task('release', ['sass', 'script', 'copy-static', 'copy-lib', 'minihtml'], function() {
    return notify({
        message: '大吉大利！代码release已完成！'
    });
});










gulp.task('default', ['browser-sync']);