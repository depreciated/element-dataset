/* eslint-env mocha */
/* global fixture   */
/* eslint-disable no-unused-expressions, max-params, no-implicit-coercion */

'use strict'

const chai = require('chai')
const elementDataset = require('../src')

describe('element-dataset', () => {
	before(function () {
		fixture.setBase('test')
	})

	beforeEach(function () {
		fixture.load('index.html')
	})

	afterEach(function () {
		fixture.cleanup()
	})

	it('karma has loaded the html fixtures', function () {
		chai.expect(fixture.el.firstChild.id).to.equal('3c9e1092-e880-11e5-9ce9-5e5517507c66')
	})

	it('get', function () {
		elementDataset()
		const el = document.getElementById('element-dataset-test')

		chai.expect(el.dataset.user).to.equal('john doe')
		chai.expect(el.dataset.id).to.equal('1234567890')
		chai.expect(el.dataset.dateOfBirth).to.equal('')
	})

	it('set', function () {
		elementDataset()
		const el = document.getElementById('element-dataset-test')

		el.dataset.dateOfBirth = '1960-10-03'
		chai.expect(el.dataset.dateOfBirth).to.equal('1960-10-03')
		chai.expect(el.getAttribute('data-date-of-birth')).to.equal('1960-10-03')
	})
})
