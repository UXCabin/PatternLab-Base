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
const path = require('path');


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


// JS copy
gulp.task('build-copy:js', function(){
  return gulp.src('**/*.js', {cwd: path.resolve(paths().source.js)} )
    .pipe(gulp.dest(path.resolve(paths().public.js)));
});

// Images copy
gulp.task('build-copy:img', function(){
  return gulp.src('**/*.*',{cwd: path.resolve(paths().source.images)} )
    .pipe(gulp.dest(path.resolve(paths().public.images)));
});

// Favicon copy
gulp.task('build-copy:favicon', function(){
  return gulp.src('favicon.ico', {cwd: path.resolve(paths().source.root)} )
    .pipe(gulp.dest(path.resolve(paths().public.root)));
});

// Fonts copy
gulp.task('build-copy:font', function(){
  return gulp.src('*', {cwd: path.resolve(paths().source.fonts)})
    .pipe(gulp.dest(path.resolve(paths().public.fonts)));
});

// Styleguide Copy everything but css
gulp.task('build-copy:styleguide', function(){
  return gulp.src(path.resolve(paths().source.styleguide, '**/!(*.css)'))
    .pipe(gulp.dest(path.resolve(paths().public.root)))
    .pipe(browserSync.stream());
});

gulp.task('build-copy:css', function(){
  return gulp.src(path.resolve(paths().source.css, '*.css'))
    .pipe(gulp.dest(path.resolve(paths().public.css)))
    .pipe(browserSync.stream());
});

gulp.task('build-copy:styleguide-css', function(){
  return gulp.src(path.resolve(paths().source.styleguide, '**/*.css'))
    .pipe(gulp.dest(function(file){
      //flatten anything inside the styleguide into a single output dir per http://stackoverflow.com/a/34317320/1790362
      file.path = path.join(file.base, path.basename(file.path));
      return path.resolve(path.join(paths().public.styleguide, 'css'));
    }))
    .pipe(browserSync.stream());
});


gulp.task('asset-builder', gulp.series(
  gulp.parallel(
    'build-copy:js',
    'build-copy:img',
    'build-copy:favicon',
    'build-copy:font',
    gulp.series('sass', 'build-copy:css', function(done){done();}),
    'build-copy:styleguide',
    'build-copy:styleguide-css'
  ),
  function(done){
    done();
  })
);




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

function paths() {
  return config.paths;
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

gulp.task('production', gulp.series('asset-builder', build, function(done){
  done();
}));





