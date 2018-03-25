/******************************************************
 * PATTERN LAB NODE
 * EDITION-NODE-GULP
 * The gulp wrapper around patternlab-node core, providing tasks to interact with the core library.
 ******************************************************/
const gulp = require('gulp');
const argv = require('minimist')(process.argv.slice(2));

const browserSync = require('browser-sync');
const minifyCSS = require('gulp-minify-css');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const sass = require('gulp-sass');
const gutil = require('gulp-util');
const prefix = require('gulp-autoprefixer');
const rename = require('gulp-rename');

const messages = {
  cssError: '<span style="color: grey">CSS SYNTAX</span> SCSS build error',
};


/******************************************************
 * PATTERN LAB  NODE WRAPPER TASKS with core library
 ******************************************************/
const config = require('./patternlab-config.json');
const patternlab = require('@pattern-lab/core')(config);


var onError = function(err) {
    var lineNumber = (err.lineNumber) ? 'LINE ' + err.lineNumber + ' -- ' : '';

    // macOS Native notification
    // Wait & timeout make notifications go away from the panel, so they don't linger
    notify({
        title: 'Task failed [' + err.plugin + ']',
        message: lineNumber + 'See console.',
        sound: 'Basso',
        wait: false,
        timeout: 5
    }).write(err);

    // Report the error on the console
    var report = '';
    var chalk = gutil.colors.bgMagenta.white;

    // Pretty reporting for easier spotting
    report += chalk('TASK:') + ' [' + err.plugin + ']\n';
    report += chalk('ISSUE:') + ' ' + err.message + '\n';
    if (err.lineNumber) { report += chalk('LINE:') + ' ' + err.lineNumber + '\n'; }
    if (err.fileName) { report += chalk('FILE:') + ' ' + err.fileName + '\n'; }
    console.log(report);

    // Prevent the 'watch' task from stopping
    this.emit('end');
};

gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: 'public'
    }
  });
});

gulp.task('sass', function () {
  return gulp.src('source/scss/style.scss')
    .pipe(plumber({errorHandler: onError}))
    .pipe(sass({
      errLogToConsole: true,
      includePaths: ['scss'],
      onError: onError
    }))
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest('source/css'))
    .pipe(minifyCSS())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('source/css'))
});

gulp.task('sass:watch', function () {
  gulp.watch('source/scss/*.scss', gulp.series('sass'));
});

function build() {
  return patternlab
    .build({
      watch: argv.watch,
      cleanPublic: config.cleanPublic,
    })
    .then(() => {
      // do something else when this promise resolves
    });
}

function serve() {
  return patternlab
    .serve({
      cleanPublic: config.cleanPublic,
    })
    .then(() => {
      // do something else when this promise resolves
    });
}

gulp.task('patternlab:version', function() {
  patternlab.version();
});

gulp.task('patternlab:help', function() {
  patternlab.help();
});

gulp.task('patternlab:patternsonly', function() {
  patternlab.patternsonly(config.cleanPublic);
});

gulp.task('patternlab:liststarterkits', function() {
  patternlab.liststarterkits();
});

gulp.task('patternlab:loadstarterkit', function() {
  patternlab.loadstarterkit(argv.kit, argv.clean);
});

gulp.task('patternlab:build', function() {
  build().then(() => {
    // do something else when this promise resolves
  });
});

gulp.task('patternlab:serve', function() {
  serve().then(() => {
    // do something else when this promise resolves
  });
});

gulp.task('patternlab:installplugin', function() {
  patternlab.installplugin(argv.plugin);
});

// gulp.task('default', ['sass','patternlab:serve']);

gulp.task('default', gulp.parallel(
	'sass:watch',
	'patternlab:serve'
	)
);

