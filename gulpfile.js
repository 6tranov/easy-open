const { src, dest, series } = require('gulp');
//const concat = require('gulp-concat');
const replace = require('gulp-replace');

function removeImportExport() {
    return src(
        [
            'compiledTypescript/*.js',
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
            'compiledTypescript/sites/*.js'
        ]
    ).pipe(
        replace(new RegExp(/export.*\n|export.*\r\n|import.*\n|import.*\r\n/, "g"), (match) => { return ""; },)
    ).pipe(
        dest('./build/js/sites')
    )
}

exports.task = series(removeImportExport, removeImportExportSites);