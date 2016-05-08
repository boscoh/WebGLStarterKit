#!/usr/bin/env node

"use strict";

let fs = require("fs");
let path = require("path");

let nopt = require("nopt");

let browserify = require("browserify");
let babelify = require("babelify");

let gulp = require('gulp');
let rename = require("gulp-rename");
let source = require('vinyl-source-stream');
let transform = require('vinyl-transform');

let prettyHtml = require("html");


let doc = `
buildwebgl.js - compiles a WebGLStartKit ES2015 file into a working website

usage: buildwebgl.js [--watch -w] sample.js

 --watch - watchify mode, run continuously, and recompile if sample.js
           has changed

Will compile downto sample.compiled.js and create sample.html that will
display the WebGL graphics.
`;


function buildHtml(html, selector, outScript) {
    let outScriptBase = path.basename(outScript);

    let htmlText =
        `<html>
    <head>
    <style>
        body {
            margin: 0
        }
    </style>
    </head>
    <body>
        <div id="${selector}"
             style="width:100%; height:100%;">
        </div>
    </body>
    <script src="${outScriptBase}"></script>
    </html>`;

    fs.writeFile(
        html,
        prettyHtml.prettyPrint(
            htmlText,
            { indent_size: 2 }
        )
    );
}


function buildErrorHtml(html, errorString) {
    let htmlText =
        `<html>
    <head>
    <style>
        body {
            margin: 10px;
            font-family: Arial;
        }
    </style>
    </head>
    <body>
        <h2>There were errors in compiling:</h2>
        <div style="font-family:monospace">
             ${errorString}
        </div>
    </body>
    </html>`;

    fs.writeFile(
        html,
        prettyHtml.prettyPrint(
            htmlText,
            { indent_size: 2 }
        )
    );
}

function swallowError (error) {
    isError = true;
    errorString = error.toString();
    this.emit('end');
}

let knownOpts = { "watch": [Boolean, false] };
let shortHands = { "w": ["--watch"] };
let parsed = nopt(knownOpts, shortHands, process.argv, 2);
let remain = parsed.argv.remain;

if ( remain.length === 0 ) {
    console.log(doc);
    process.exit();
}

const inputScript = remain[0];
const ext = path.extname(inputScript);
const base = inputScript.replace(ext, "");
const outScript = `${base}.compiled${ext}`;
const html = `${base}.html`;

const selector = "widget";

let isError = false;
let errorString = "";


gulp.task('build', () => {
    console.log( `Bundling and transpiling ${inputScript} to ${outScript}` );
    isError = false;
    return (
        browserify({entries: inputScript, debug: true})
            .transform(babelify, { presets: "es2015" })
            .bundle()
            .on('error', swallowError)
            .pipe(source(outScript))
            .pipe(gulp.dest('.'))
    );
});

gulp.task('make-html', ['build'], () => {
    if (!isError) {
        console.log("Succesfully made", outScript);
        console.log(
            `Creating ${html} with elemnt #${selector} for ${outScript}`);
        buildHtml(html, selector, outScript);
    } else {
        console.log(`Error in building ${outScript}`);
        buildErrorHtml(html, errorString);
    }
});

if (parsed.watch) {
    gulp.task(
        'watch',
        ['build', 'make-html'],
        () => {
            gulp.watch(inputScript, ['make-html']);
        });
    gulp.start('watch');
} else {
    gulp.start(['build', 'make-html']);
}

