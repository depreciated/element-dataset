/* eslint-env browser */

import test from 'tape'
import $ from 'jquery'
import polyfill from '../lib/browser/index.es'

polyfill()

$('body').append(`<div>
  <h1 id="element-dataset-test" data-id="1234567890" data-user="john doe" data-date-of-birth>element-dataset</h1>
</div>`)

test('get', (assert) => {
  const element = $('#element-dataset-test')[0]
  assert.equal(element.dataset.user, 'john doe', 'get user')
  assert.equal(element.dataset.id, '1234567890', 'get id')
  assert.equal(element.dataset.dateOfBirth, '', 'blank date-of-birth')
  assert.end()
})

test('set', (assert) => {
  const element = $('#element-dataset-test')[0]
  element.dataset.dateOfBirth = '1960-10-03'
  assert.equal(element.dataset.dateOfBirth, '1960-10-03', 'set date-of-birth')
  assert.equal(element.getAttribute('data-date-of-birth'), '1960-10-03', 'get date-of-birth')
  assert.end()
})

test('reverse set', (assert) => {
  const element = $('#element-dataset-test')[0]
  element.setAttribute('data-a-new-attribute', '3c9e1092-e880-11e5-9ce9-5e5517507c66')
  assert.equal(element.dataset.aNewAttribute, '3c9e1092-e880-11e5-9ce9-5e5517507c66', 'set new attribute')
  assert.end()
})
