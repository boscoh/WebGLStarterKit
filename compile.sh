browserify main.js -v --debug -t babelify --outfile main.compiled.js
browserify pyramid.js -v --debug -t babelify --outfile pyramid.compiled.js
# watchify main.js -v --debug --outfile main.min.js
