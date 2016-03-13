#!/usr/bin/env node

/* eslint-disable no-console */

'use strict'

const denodeify       = require('denodeify')
const browserify      = require('browserify')
const collapse        = require('bundle-collapser/plugin')
const babelify        = require('babelify')
const rollup          = require('rollup')
const derequire       = require('derequire')
const fs              = require('fs')
const writeFileAsync  = denodeify(fs.writeFile)
const renameAsync     = denodeify(fs.rename)
const ncp             = denodeify(require('ncp').ncp)
const rimraf          = denodeify(require('rimraf'))
const mkdirp          = denodeify(require('mkdirp'))
const streamToPromise = require('stream-to-promise')
const findit          = require('findit')
const spawn           = require('child_process').spawn

const pkg             = require('../package.json')
const version         = pkg.version

const external = Object.keys(pkg.dependencies || {}).concat([])

const currentYear = new Date().getFullYear()

const comments = `
//
// ${pkg.name} ${pkg.version}
//
// ${pkg.name} is released under the terms of the ${pkg.license} license.
// (c) 2015 - ${currentYear} Mark Milstein <mark@epiloque.com>
//
// For all details and documentation: ${pkg.homepage}
//

`
function writeFile (filename, contents) {
	const tmp = filename + '.tmp'
	return writeFileAsync(tmp, contents, 'utf-8').then(function () {
		return renameAsync(tmp, filename)
	}).then(function () {
		console.log('Wrote ' + filename)
	})
}

function addVersion (code) {
	return code.replace('__VERSION__', version)
}

// do uglify in a separate process for better perf
function doUglify (code, prepend, fileOut) {
	const binPath = require.resolve('uglify-js/bin/uglifyjs')
	const args = [binPath, '-c', '-m', 'warnings=false', '-']

	const child = spawn(process.execPath, args, {stdio: 'pipe'})
	child.stdin.setEncoding('utf-8')
	child.stdin.write(code)
	child.stdin.end()
	return streamToPromise(child.stdout).then(function (min) {
		min = prepend + min
		return writeFile(fileOut, min)
	})
}

function doBrowserify (path, opts, exclude) {
	const b = browserify(path, opts)
	b.transform(babelify, pkg.babel).plugin(collapse)

	if (exclude) {
		b.external(exclude)
	}

	return streamToPromise(b.bundle()).then(function (code) {
		code = derequire(code)
		return code
	})
}

function doRollup (entry, fileOut) {
	return rollup.rollup({
		entry,
		external,
		plugins: [
			require('rollup-plugin-babel')({
				exclude: 'node_modules/**',
				babelrc: false,
				plugins: [
					require('babel-plugin-transform-es2015-template-literals'),
					require('babel-plugin-transform-es2015-literals'),
					require('babel-plugin-transform-es2015-function-name'),
					require('babel-plugin-transform-es2015-arrow-functions'),
					require('babel-plugin-transform-es2015-block-scoped-functions'),
					require('babel-plugin-transform-es2015-classes'),
					require('babel-plugin-transform-es2015-object-super'),
					require('babel-plugin-transform-es2015-shorthand-properties'),
					require('babel-plugin-transform-es2015-duplicate-keys'),
					require('babel-plugin-transform-es2015-computed-properties'),
					require('babel-plugin-transform-es2015-for-of'),
					require('babel-plugin-transform-es2015-sticky-regex'),
					require('babel-plugin-transform-es2015-unicode-regex'),
					require('babel-plugin-check-es2015-constants'),
					require('babel-plugin-transform-es2015-spread'),
					require('babel-plugin-transform-es2015-parameters'),
					require('babel-plugin-transform-es2015-destructuring'),
					require('babel-plugin-transform-es2015-block-scoping'),
					require('babel-plugin-transform-es2015-typeof-symbol'),
					// require('babel-plugin-transform-es2015-modules-commonjs'),
					[require('babel-plugin-transform-regenerator'), { async: false, asyncGenerators: false }],
				]
			})
		]
	}).then(function (bundle) {
		const code = bundle.generate({format: 'cjs'}).code
		return writeFile(fileOut, addVersion(code))
	})
}

// build for Node (index.js)
function buildForNode () {
	return mkdirp('lib').then(function () {
		return doRollup('src/index.js', 'lib/index.js')
	})
}

// build for Browserify/Webpack (index-browser.js)
function buildForBrowserify () {
	return ncp('src', 'src_browser').then(function () {
		return new Promise(function (resolve, reject) {
			const files = []
			findit('src_browser').on('file', function (file) {
				files.push(file)
			}).on('end', function () {
				resolve(files)
			}).on('error', reject)
		})
	}).then(function (files) {
		return Promise.all(files.map(function (file) {
			return renameAsync(file, file.replace('-browser', ''))
		}))
	}).then(function () {
		return doRollup('src_browser/index.js', 'lib/index-browser.js')
	})
}

// build for the browser (dist)
function buildForBrowser () {
	return mkdirp('dist').then(function () {
		return doBrowserify('.', {standalone: `${pkg.name}`})
	}).then(function (code) {
		code = comments + code
		return Promise.all([
			writeFile(`dist/${pkg.name}.js`, code),
			doUglify(code, comments, `dist/${pkg.name}.min.js`)
		])
	})
}

function cleanup () {
	return rimraf('src_browser')
}

if (process.argv[2] === 'node') {
	buildForNode()
	process.exit(0)
}

Promise.resolve()
.then(function () { return rimraf('lib') })
.then(function () { return rimraf('dist') })
.then(buildForNode)
.then(buildForBrowserify)
.then(buildForBrowser)
.then(cleanup)
.catch(function (err) {
	console.log(err.stack)
	process.exit(1)
})
