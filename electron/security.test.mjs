import assert from 'node:assert/strict'
import path from 'node:path'
import test from 'node:test'
import {
  isAllowedExternalUrl,
  isTrustedRendererUrl,
  MAX_COMPANION_FILE_BYTES,
  normalizeCompanionFile,
  resolveAppAsset,
} from './security.mjs'

test('external URL policy allows only project GitHub destinations', () => {
  assert.equal(isAllowedExternalUrl('https://github.com/AKaturu/InHouseRx/releases'), true)
  assert.equal(isAllowedExternalUrl('https://github.com/AKaturu/local-content-transcriber'), true)
  assert.equal(isAllowedExternalUrl('https://github.com/AKaturu/another-project'), false)
  assert.equal(isAllowedExternalUrl('https://github.com.evil.example/AKaturu/InHouseRx'), false)
  assert.equal(isAllowedExternalUrl('javascript:alert(1)'), false)
})

test('renderer URL policy accepts packaged pages and the exact loopback dev origin', () => {
  assert.equal(isTrustedRendererUrl('inhouserx://app/index.html'), true)
  assert.equal(isTrustedRendererUrl('http://127.0.0.1:5173/src/main.tsx', 'http://127.0.0.1:5173'), true)
  assert.equal(isTrustedRendererUrl('http://127.0.0.1:5174', 'http://127.0.0.1:5173'), false)
  assert.equal(isTrustedRendererUrl('https://example.com', 'http://127.0.0.1:5173'), false)
})

test('asset resolution stays below the renderer root and falls back for client routes', () => {
  const root = path.resolve('dist')
  const index = path.join(root, 'index.html')
  const asset = path.join(root, 'assets', 'app.js')
  assert.equal(resolveAppAsset(root, 'inhouserx://app/assets/app.js', (candidate) => candidate === asset), asset)
  assert.equal(resolveAppAsset(root, 'inhouserx://app/report/123', () => false), index)
  assert.throws(
    () => resolveAppAsset(root, 'inhouserx://app/%2e%2e%2fsecrets.txt', () => true),
    /traversal/,
  )
  assert.throws(() => resolveAppAsset(root, 'https://example.com/app.js', () => true), /Invalid application URL/)
})

test('companion payload validation constrains filenames and file size', () => {
  const valid = normalizeCompanionFile({ name: 'exam scan.png', type: 'image/png', bytes: new Uint8Array([1, 2]) })
  assert.equal(valid.name, 'exam scan.png')
  assert.equal(valid.content.byteLength, 2)
  assert.throws(() => normalizeCompanionFile({ name: '../exam.png', bytes: new Uint8Array([1]) }), /filename/)
  assert.throws(() => normalizeCompanionFile({ name: 'empty.txt', bytes: new Uint8Array() }), /empty/)
  assert.throws(
    () => normalizeCompanionFile({ name: 'large.bin', bytes: new Uint8Array(MAX_COMPANION_FILE_BYTES + 1) }),
    /20 MB/,
  )
})
