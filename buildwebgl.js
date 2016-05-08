#!/usr/bin/env node

"use strict";

let fs = require("fs");
let path = require("path");

let nopt = require("nopt");

let browserify = require("browserify");
let babelify = require("babelify");

let gulp = require('gulp');
let source = require('vinyl-source-stream');
let transform = require('vinyl-transform');

let prettyHtml = require("html");


let doc = `
buildwebgl.js - compiles a WebGLStartKit ES2015 file into a working website

usage: buildwebgl.js [--watch -w] sample.js

 --watch - watchify mode, run continuously, and recompile if sample.js
           has changed

 --debug - write out source-map for debugging

Will compile downto sample.compiled.js and create sample.html that will
display the WebGL graphics.
`;


function fileExists(filePath)
{
    try
    {
        return fs.statSync(filePath).isFile();
    }
    catch (err)
    {
        return false;
    }
}

function writePrettyHtml(html, htmlText) {
    fs.writeFile(
        html,
        prettyHtml.prettyPrint(
            htmlText,
            { indent_size: 2 }
        )
    );
}

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
    writePrettyHtml(html, htmlText);
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
    writePrettyHtml(html, htmlText);
}

let knownOpts = { "watch": [Boolean, false], "debug": [Boolean, false] };
let shortHands = { "w": ["--watch"], "d": ["--debug"] };
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

gulp.task('build-js', () => {
    if (!fileExists(inputScript)) {
        return;
    }
    isError = false;
    return (
        browserify({entries: inputScript, debug: parsed.debug})
            .transform(babelify, { presets: "es2015" })
            .bundle()
            .on('error', function(error) {
                isError = true;
                errorString = error.toString();
                this.emit('end');
            })
            .pipe(source(outScript))
            .pipe(gulp.dest('.'))
    );
});

gulp.task('build-html', ['build-js'], () => {
    if (!fileExists(inputScript)) {
        console.log(`Couldn't find ${outScript}`);
    } else if (!isError) {
        console.log(`Made ${outScript}`);
        buildHtml(html, selector, outScript);
        console.log(`Made ${html} that binds ${outScript} to #${selector}`);
    } else {
        console.log(`Could not build ${outScript}`);
        console.log(errorString);
        buildErrorHtml(html, errorString);
    }
});

gulp.start('build-html');
if (parsed.watch) {
    gulp.watch(inputScript, ['build-html']);
}

