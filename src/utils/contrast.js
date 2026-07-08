/**
 * WCAG 2.1 contrast ratio utilities.
 * Relative luminance and contrast ratio per:
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */

/**
 * Linearize an sRGB channel value (0-255) for luminance calculation.
 */
function linearize(channel) {
  const c = channel / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

/**
 * Parse a hex string like "#1A2B3C" or "1A2B3C" into { r, g, b }.
 * Returns null for invalid input.
 */
export function parseHex(hex) {
  const h = hex.replace(/^#/, '')
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  }
}

/**
 * Relative luminance of an sRGB color (0–1).
 * Accepts a hex string or { r, g, b } object.
 */
export function relativeLuminance(color) {
  const rgb = typeof color === 'string' ? parseHex(color) : color
  if (!rgb) return null
  return 0.2126 * linearize(rgb.r) + 0.7152 * linearize(rgb.g) + 0.0722 * linearize(rgb.b)
}

/**
 * WCAG contrast ratio between two colors (hex strings or rgb objects).
 * Lighter luminance goes first per spec.
 * Returns a number like 4.52, or null on invalid input.
 */
export function contrastRatio(bg, fg) {
  const L1 = relativeLuminance(bg)
  const L2 = relativeLuminance(fg)
  if (L1 === null || L2 === null) return null
  const lighter = Math.max(L1, L2)
  const darker = Math.min(L1, L2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * WCAG level achieved for normal text (not large).
 * Returns 'FAIL', 'AA', or 'AAA'.
 */
export function wcagLevel(ratio) {
  if (ratio === null) return 'FAIL'
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  return 'FAIL'
}

/**
 * WCAG level achieved for large text (>= 18.66px bold or >= 24px).
 * Returns 'FAIL', 'AA', or 'AAA'.
 */
export function wcagLevelLarge(ratio) {
  if (ratio === null) return 'FAIL'
  if (ratio >= 4.5) return 'AAA'
  if (ratio >= 3) return 'AA'
  return 'FAIL'
}

/**
 * Ensure a hex string has a leading "#".
 */
export function normalizeHex(hex) {
  const h = hex.replace(/^#/, '')
  return '#' + h.toUpperCase()
}

/**
 * Validate a hex input during typing: returns the cleaned hex or null.
 */
export function sanitizeHexInput(value) {
  const cleaned = value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6)
  return cleaned
}
