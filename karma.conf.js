/* eslint-disable camelcase */

'use strict'

const options = require('./package.json')
const isCi    = require('is-ci')

module.exports = function (config) {
	const browserStack = {
		chrome: {
			base: 'BrowserStack',
			os: 'OS X',
			os_version: 'El Capitan',
			browser: 'chrome',
			browser_version: '16.0'
		},
		firefox: {
			base: 'BrowserStack',
			os: 'OS X',
			os_version: 'El Capitan',
			browser: 'firefox',
			browser_version: '5.0'
		},
		ie9: {
			base: 'BrowserStack',
			os: 'Windows',
			os_version: '7',
			browser: 'ie',
			browser_version: '9.0'
		},
		ie10: {
			base: 'BrowserStack',
			os: 'Windows',
			os_version: '8',
			browser: 'ie',
			browser_version: '10.0'
		},
		ie11: {
			base: 'BrowserStack',
			os: 'Windows',
			os_version: '10',
			browser: 'ie',
			browser_version: '11.0'
		},
	}

	if (isCi) {
		config.singleRun = true
	}

	config.set({
		frameworks: ['browserify', 'mocha', 'fixture'],
		reporters: ['mocha'],
		files: [
			'test/*.js',
			'test/*.html'
		],
		preprocessors: {
			'test/*.js': ['browserify'],
			'test/*.html': ['html2js']
		},
		browserify: {
			debug: true,
			transform: [
				[
					'babelify', {
						presets: options.babel.presets || [],
						plugins: options.babel.plugins || [],
					}
				]
			],
			configure: (bundle) => {
				bundle.on('prebundle', () => {
					bundle.external('mocha')
				})
			}
		},
		phantomjsLauncher: {
			// useful if karma exits without killing phantom
			exitOnResourceError: true
		}
	})

	if (process.env.BROWSER_STACK_USERNAME &&
		process.env.BROWSER_STACK_ACCESS_KEY) {
		config.singleRun = true
		config.reporters[0] = 'dots'
		config.browserDisconnectTimeout = 10000
		config.browserDisconnectTolerance = 3
		config.browserNoActivityTimeout = 30000
		config.captureTimeout = 120000

		config.customLaunchers = browserStack
		config.browserStack = {
			username: process.env.BROWSER_STACK_USERNAME,
			accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
			pollingTimeout: 10000,
			startTunnel: true,
			project: options.name,
		}

		config.browsers = [].concat(Object.keys(browserStack), ['PhantomJS'])
	}
	else {
		config.browsers = ['PhantomJS']
	}
}
