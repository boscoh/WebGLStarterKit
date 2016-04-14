#!/usr/bin/env node

"use strict";

var fs = require('fs');
var path = require('path');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var cheerio = require('cheerio');
var prettyHtml = require("html");
let nopt = require('nopt');


let doc = `

buildwebgl.js - compiles a WebGLStartKit ES2015 file into a working website

usage: buildwebgl.js [--watch -w] sample.js

 --watch - watchify mode, run continuously, and recompile if sample.js
           has changed

Will compile downto sample.compiled.js and create sample.html that will
display the WebGL graphics.

`


function buildHtml(html, selector, outScript) {

    var outScriptBase = path.basename(outScript);

    var htmlText =
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

    var tree = cheerio.load(fs.readFileSync(html));

    var root = tree.root();
    var outScriptBase = path.basename(outScript);

    if ( tree( `script[src="${outScriptBase}"]`).length === 0 ) {
        root.append(`<script src="${outScriptBase}"></script>`);
    }

    if ( tree( `div[id="${selector}"]`).length === 0 ) {
        let body = tree( 'body' );
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

}
else {

    const es6Script = remain[0];

    var ext = path.extname(es6Script);
    var base = es6Script.replace(ext, '');
    var outScript = `${base}.compiled${ext}`;

    var html = `${base}.html`;

    let selector = "widget";

    if (!fs.existsSync(html)) {
        console.log( "Creating", outScript, '->', selector, '->', html);
        buildHtml(html, selector, outScript);
    }
    else {
        console.log( "Checking", outScript, '->', selector, '->', html);
        checkHtml(html, selector, outScript);
    }

    console.log( es6Script, '->', outScript);

    var plugins = [];
    if (parsed.watch) {
        plugins.push(watchify);
    }
    var bundler = browserify({
        cache: {},
        packageCache: {},
        entries: [es6Script],
        plugin: plugins,
        debug: true
    });

    function bundle() {
        bundler.bundle().pipe(fs.createWriteStream(outScript));
    }

    bundler.on('update', bundle);
    bundler.on('error', (err) => {
        console.log(err.message);
        this.emit('end');
    });

    bundler.transform(babelify, { presets: "es2015" });

    bundle();

}


