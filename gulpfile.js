const { src, dest, series } = require('gulp');
//const concat = require('gulp-concat');
const replace = require('gulp-replace');

function removeImportExport() {
    return src(
        [
            'compiledTypescript/validation.js',
            'compiledTypescript/backgroundState.js',
            'compiledTypescript/contentState.js',
            'compiledTypescript/backgroundEvent.js',
            'compiledTypescript/excludedURLManager.js',
            'compiledTypescript/contentEvent.js',
            'compiledTypescript/background.js',
            'compiledTypescript/pageActionMaker.js',
        ]
    ).pipe(
        replace(new RegExp(/export.*\n|export.*\r\n|import.*\n|import.*\r\n/, "g"), (match) => { return ""; },)
    ).pipe(
        dest('./build/js')
    )
}

function removeImportExportSites() {
    return src(
        [
            'compiledTypescript/sites/google.js'
        ]
    ).pipe(
        replace(new RegExp(/export.*\n|export.*\r\n|import.*\n|import.*\r\n/, "g"), (match) => { return ""; },)
    ).pipe(
        dest('./build/js/sites')
    )
}

exports.task = series(removeImportExport, removeImportExportSites);