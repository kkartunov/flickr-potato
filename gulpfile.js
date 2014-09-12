var pkg = require('./package.json'),
    argv = require('yargs').argv,
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minCSS = require('gulp-minify-css'),
    webserver = require('gulp-webserver'),
    concat = require('gulp-concat'),
    del = require('delete'),
    jade = require('gulp-jade'),
    uglify = require('gulp-uglify'),
    docco = require('gulp-docco'),
    spawn = require('child_process').spawn,
    say_something = function (event) {
        gutil.log('Changed:' + event.path);
    },
    watching = {
        js: false,
        css: false,
        jade: false
    };


// Vendors.
gulp.task('vendors', function () {
    var vendors = {
        js: [
            './bower_components/angular/angular.min.js',
            './bower_components/angular-ui-router/release/angular-ui-router.min.js',
            './bower_components/angular-loading-bar/build/loading-bar.min.js'
        ],
        css: [
            './bower_components/bootstrap/dist/css/bootstrap.min.css',
            './bower_components/angular-loading-bar/build/loading-bar.min.css'
        ]
    };

    // Concat and copy them to save on HTTP requests.
    Object.keys(vendors).forEach(function (dir) {
        gulp.src(vendors[dir])
            .pipe(concat('vendors.min.' + dir))
            .pipe(gulp.dest('./dist/' + dir));
    });
});


// Templates.
gulp.task('jade', function () {
    gulp.src('./src/templates/index.jade')
        .pipe(jade({
            pretty: argv.dev === true,
            locals: {
                pkg: pkg
            }
        }))
        .pipe(gulp.dest('./dist'));

    gulp.src('./src/templates/routes/*.jade')
        .pipe(jade({
            pretty: argv.dev === true
        }))
        .pipe(gulp.dest('./dist/templates/'));

    // Jade dev.
    if (argv.dev === true && !watching.jade) {
        gulp
            .watch('./src/templates/**/*.jade', ['jade'])
            .on('change', say_something);
        watching.jade = true;
    }
});


// Less/CSS.
gulp.task('css', function () {
    gulp.src('./src/less/style.less')
        .pipe(less())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(argv.dev === true ? gutil.noop() : minCSS())
        .pipe(gulp.dest('./dist/css/'));

    // Less dev.
    if (argv.dev === true && !watching.css) {
        gulp
            .watch('./src/less/**/*.less', ['css'])
            .on('change', say_something);
        watching.css = true;
    }
});


// JS.
gulp.task('js', function () {
    gulp.src('./src/js/**/*.js')
        .pipe(argv.dev === true ? gutil.noop() : uglify())
        .pipe(gulp.dest('./dist/js/'));

    // JS dev.
    if (argv.dev === true && !watching.js) {
        gulp
            .watch('./src/js/**/*.js', ['js'])
            .on('change', say_something);
        watching.js = true;
    }
});


// Docs.
gulp.task('docs', function () {
    gulp.src('./src/js/**/*.js')
        .pipe(docco())
        .pipe(gulp.dest('./dist/docs/code/'));
});


// Serve it.
gulp.task('serve', function () {
    webserver_streem = gulp.src('./dist/')
        .pipe(webserver());
    return webserver_streem;
});


// Development.
gulp.task('default', ['clean', 'vendors', 'jade', 'css', 'js']);
gulp.task('clean', function () {
    del.sync('./dist');
});

gulp.task('tests', ['serve'], function () {
    var tests = ['./tests/test.js'],
        casper = spawn('casperjs', ['test'].concat(tests), {
            stdio: 'inherit'
        });
    casper.on('exit', function () {
        gutil.log('Tesing done!');
        webserver_streem.emit('kill');
    });
});
