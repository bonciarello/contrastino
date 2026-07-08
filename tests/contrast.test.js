/**
 * Test suite for contrast utility functions.
 * Run with: node tests/contrast.test.js
 */

import {
  parseHex,
  relativeLuminance,
  contrastRatio,
  wcagLevel,
  wcagLevelLarge,
  normalizeHex,
  sanitizeHexInput,
} from '../src/utils/contrast.js'

let passed = 0
let failed = 0

function test(name, fn) {
  try {
    fn()
    passed++
    console.log(`  ✓ ${name}`)
  } catch (e) {
    failed++
    console.log(`  ✗ ${name}`)
    console.log(`    ${e.message}`)
  }
}

function assertEqual(actual, expected, msg = '') {
  if (actual !== expected) {
    throw new Error(`${msg ? msg + ': ' : ''}expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
  }
}

function assertClose(actual, expected, epsilon = 0.01, msg = '') {
  if (Math.abs(actual - expected) > epsilon) {
    throw new Error(`${msg ? msg + ': ' : ''}expected ~${expected}, got ${actual}`)
  }
}

function assertNull(actual, msg = '') {
  if (actual !== null) {
    throw new Error(`${msg ? msg + ': ' : ''}expected null, got ${JSON.stringify(actual)}`)
  }
}

console.log('\n🧪 Contrastino — Test suite\n')

// ── parseHex ──
console.log('parseHex')
test('parses #000000', () => {
  const result = parseHex('#000000')
  assertEqual(result.r, 0)
  assertEqual(result.g, 0)
  assertEqual(result.b, 0)
})
test('parses #FFFFFF', () => {
  const result = parseHex('#FFFFFF')
  assertEqual(result.r, 255)
  assertEqual(result.g, 255)
  assertEqual(result.b, 255)
})
test('parses without #', () => {
  const result = parseHex('1A2B3C')
  assertEqual(result.r, 0x1A)
  assertEqual(result.g, 0x2B)
  assertEqual(result.b, 0x3C)
})
test('rejects invalid hex', () => {
  assertNull(parseHex('#GGG'))
  assertNull(parseHex('#12345'))
  assertNull(parseHex('hello'))
})

// ── relativeLuminance ──
console.log('\nrelativeLuminance')
test('black luminance is 0', () => {
  assertClose(relativeLuminance('#000000'), 0)
})
test('white luminance is 1', () => {
  assertClose(relativeLuminance('#FFFFFF'), 1)
})
test('red luminance is ~0.2126', () => {
  assertClose(relativeLuminance('#FF0000'), 0.2126, 0.01)
})

// ── contrastRatio ──
console.log('\ncontrastRatio')
test('CRITERIO 1: #000000 bg + #FFFFFF fg = 21', () => {
  const ratio = contrastRatio('#000000', '#FFFFFF')
  assertClose(ratio, 21, 0.1, 'nero su bianco')
})
test('#FFFFFF bg + #000000 fg = 21 (inverse)', () => {
  const ratio = contrastRatio('#FFFFFF', '#000000')
  assertClose(ratio, 21, 0.1, 'bianco su nero')
})
test('#FFFFFF bg + #FFFFFF fg = 1', () => {
  const ratio = contrastRatio('#FFFFFF', '#FFFFFF')
  assertClose(ratio, 1, 0.01)
})
test('#000000 bg + #808080 fg ~ 5.3', () => {
  const ratio = contrastRatio('#000000', '#808080')
  assertClose(ratio, 5.3, 0.2)
})
test('invalid hex returns null', () => {
  assertNull(contrastRatio('#GGG', '#000'))
})

// ── wcagLevel ──
console.log('\nwcagLevel (normal text)')
test('21:1 → AAA', () => {
  assertEqual(wcagLevel(21), 'AAA')
})
test('7:1 → AAA', () => {
  assertEqual(wcagLevel(7), 'AAA')
})
test('6.9:1 → AA', () => {
  assertEqual(wcagLevel(6.9), 'AA')
})
test('4.5:1 → AA', () => {
  assertEqual(wcagLevel(4.5), 'AA')
})
test('CRITERIO 2: 4.4:1 → FAIL (insufficiente)', () => {
  assertEqual(wcagLevel(4.4), 'FAIL')
})
test('3:1 → FAIL', () => {
  assertEqual(wcagLevel(3), 'FAIL')
})
test('1:1 → FAIL', () => {
  assertEqual(wcagLevel(1), 'FAIL')
})

// ── wcagLevelLarge ──
console.log('\nwcagLevelLarge (large text)')
test('4.5:1 large → AAA', () => {
  assertEqual(wcagLevelLarge(4.5), 'AAA')
})
test('3:1 large → AA', () => {
  assertEqual(wcagLevelLarge(3), 'AA')
})
test('2.9:1 large → FAIL', () => {
  assertEqual(wcagLevelLarge(2.9), 'FAIL')
})

// ── normalizeHex ──
console.log('\nnormalizeHex')
test('adds # prefix', () => {
  assertEqual(normalizeHex('1A2B3C'), '#1A2B3C')
})
test('uppercases', () => {
  assertEqual(normalizeHex('#aabbcc'), '#AABBCC')
})

// ── sanitizeHexInput ──
console.log('\nsanitizeHexInput')
test('strips non-hex chars', () => {
  assertEqual(sanitizeHexInput('g1h2j3k4l5m6'), '123456')
})
test('truncates to 6', () => {
  assertEqual(sanitizeHexInput('123456789'), '123456')
})
test('preserves valid hex', () => {
  assertEqual(sanitizeHexInput('AbC123'), 'AbC123')
})

// ── Summary ──
console.log(`\n${'─'.repeat(40)}`)
console.log(`Risultati: ${passed} passati, ${failed} falliti su ${passed + failed} test`)
console.log(`${failed === 0 ? '✅ Tutti i test superati!' : '❌ Ci sono test falliti.'}`)
console.log()

process.exit(failed > 0 ? 1 : 0)
