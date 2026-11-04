import test from 'node:test'
import assert from 'node:assert/strict'
import { videoSource, resolveVideoQuality } from '../src/videoSources.js'

const desktop = { compact: false, limited: false, reduced: false }
const mobile = { compact: true, limited: false, reduced: false }
const slow = { ...mobile, limited: true }
const path = '/XIAOKAI/media/films/example.mp4'

test('normal desktop defaults to the HD master', () => {
  assert.equal(resolveVideoQuality(desktop), 'high')
  assert.match(videoSource(path, desktop), /\/films\/example\.mp4\?v=/)
})
test('ordinary mobile chooses 720P, not the data-saving tier', () => {
  assert.equal(resolveVideoQuality(mobile), 'balanced')
  assert.match(videoSource(path, mobile), /\/previews\//)
})
test('limited connections remain data-saving until explicitly overridden', () => {
  assert.match(videoSource(path, slow), /\/mobile\//)
  assert.match(videoSource(path, slow, 'high'), /\/films\//)
})
test('all devices can explicitly select a different quality', () => {
  assert.match(videoSource(path, desktop, 'balanced'), /\/previews\//)
  assert.match(videoSource(path, desktop, 'data'), /\/mobile\//)
  assert.match(videoSource(path, mobile, 'high'), /\/films\//)
})
test('reduced motion does not force low quality; base path is preserved', () => {
  assert.equal(resolveVideoQuality({ ...desktop, reduced: true }), 'high')
  assert.ok(videoSource(path, desktop).startsWith('/XIAOKAI/'))
  assert.equal(videoSource('/media/example.webp', desktop), '/media/example.webp')
})
