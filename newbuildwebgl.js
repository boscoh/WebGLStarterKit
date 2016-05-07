#!/usr/bin/env node

"use strict";

let fs = require("fs");
let path = require("path");

let nopt = require("nopt");

let browserify = require("browserify");
let watchify = require("watchify");
let babelify = require("babelify");

let gulp = require('gulp');
let rename = require("gulp-rename");
let source = require('vinyl-source-stream');

let cheerio = require("cheerio");
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


function checkHtml(html, selector, outScript) {
    let tree = cheerio.load(fs.readFileSync(html));

    let root = tree.root();
    let outScriptBase = path.basename(outScript);

    if ( tree( `script[src="${outScriptBase}"]`).length === 0 ) {
        root.append(`<script src="${outScriptBase}"></script>`);
    }

    if ( tree( `div[id="${selector}"]`).length === 0 ) {
        let body = tree( "body" );
        if ( body.length === 0 ) {
            root.append("<body>");
            body = tree( "body");
        }

        body.append(`<div id="${selector}" style="width:100%; height:100%;">`);
    }

    fs.writeFile(html, tree.html());
}


let knownOpts = { "watch": [Boolean, false] };
let shortHands = { "w": ["--watch"] };
let parsed = nopt(knownOpts, shortHands, process.argv, 2);
let remain = parsed.argv.remain;

if ( remain.length === 0 ) {

    console.log(doc);
    process.exit();
}

const es6Script = remain[0];
const ext = path.extname(es6Script);
const base = es6Script.replace(ext, "");
const outScript = `${base}.compiled${ext}`;
const html = `${base}.html`;
const selector = "widget";

gulp.task('build', () => {
    console.log( `Bundling and transpiling ${es6Script} to ${outScript}` );
    return (
        browserify({entries: es6Script, debug: true})
        .transform(babelify, { presets: "es2015" })
        .bundle()
        .pipe(source(outScript))
        .pipe(gulp.dest('.'))
    );
});

gulp.task('make-html', ['build'], () => {
    console.log( "Succesfully made", outScript );
    if (!fs.existsSync(html)) {
        console.log(
            `Creating ${html} with elemnt #${selector} for ${outScript}`);
        buildHtml(html, selector, outScript);
    }
    else {
        console.log(
            `Checking ${html} has selector #${selector} to load ${outScript}` );
        checkHtml(html, selector, outScript);
    }
});

if (parsed.watch) {
    gulp.task(
        'watch',
        ['build', 'make-html'],
        () => { gulp.watch(es6Script, ['build']); });
    gulp.start('watch');
} else {
    gulp.start(['build', 'make-html']);
}

