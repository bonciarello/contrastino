<template>
  <div class="app">
    <header class="header">
      <div class="header__inner">
        <div class="header__brand">
          <h1 class="header__title">Contrastino</h1>
          <p class="header__tagline">Misura la leggibilità della tua palette in tempo reale. Scegli uno sfondo e verifica il contrasto con i colori del testo secondo gli standard WCAG&nbsp;2.1.</p>
        </div>
      </div>
    </header>

    <main class="main">
      <!-- Panel: Background color -->
      <section class="panel panel--bg" aria-labelledby="bg-heading">
        <h2 id="bg-heading" class="panel__heading">Sfondo</h2>
        <ColorInput
          id="bg-color"
          v-model="backgroundColor"
          label="Colore di sfondo"
        />
        <div class="panel__swatch-preview" :style="{ backgroundColor: backgroundColor }" aria-hidden="true"></div>
      </section>

      <!-- Signature: contrast badge -->
      <section class="panel panel--badge" aria-labelledby="badge-heading">
        <h2 id="badge-heading" class="panel__heading">Rapporto di contrasto</h2>
        <div class="badge-wrap">
          <ContrastBadge :ratio="bestRatio" />
          <p class="badge-wrap__note">
            {{ bestTextName }} su {{ bestRatio ? 'questo' : '—' }} sfondo
          </p>
        </div>
      </section>

      <!-- Panel: text colors rows -->
      <section class="panel panel--rows" aria-labelledby="rows-heading">
        <h2 id="rows-heading" class="panel__heading">Colori del testo</h2>
        <div class="rows-list">
          <ContrastRow
            v-for="(tc, i) in textColors"
            :key="tc.hex"
            :bg="backgroundColor"
            :fg="tc.hex"
            :name="tc.name"
            :is-best="bestIndex === i"
          />
        </div>

        <!-- Custom color -->
        <details class="custom-color">
          <summary class="custom-color__summary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            Colore personalizzato
          </summary>
          <div class="custom-color__body">
            <ColorInput
              id="custom-color"
              v-model="customColor"
              label="Colore testo personalizzato"
            />
            <ContrastRow
              v-if="customColor && customColor.match(/^#[0-9A-Fa-f]{6}$/)"
              :bg="backgroundColor"
              :fg="customColor"
              name="Personalizzato"
              :is-best="false"
            />
          </div>
        </details>
      </section>

      <!-- Panel: CSS export -->
      <section class="panel panel--export" aria-labelledby="export-heading">
        <h2 id="export-heading" class="panel__heading">Codice</h2>
        <CssExport :bg="backgroundColor" :textColors="allTextColors" />
      </section>
    </main>

    <footer class="footer">
      <p class="footer__text">
        Ispirato alle <a href="https://www.w3.org/TR/WCAG21/" target="_blank" rel="noopener">linee guida WCAG&nbsp;2.1</a>.
        Calcoli basati sulla luminanza relativa sRGB.
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ColorInput from './components/ColorInput.vue'
import ContrastBadge from './components/ContrastBadge.vue'
import ContrastRow from './components/ContrastRow.vue'
import CssExport from './components/CssExport.vue'
import { contrastRatio, parseHex } from './utils/contrast.js'

const backgroundColor = ref('#FFFFFF')
const customColor = ref('#000000')

const defaultTextColors = [
  { name: 'Nero', hex: '#000000' },
  { name: 'Bianco', hex: '#FFFFFF' },
  { name: 'Grigio medio', hex: '#808080' },
]

const textColors = computed(() => defaultTextColors)

const allTextColors = computed(() => {
  const colors = [...textColors.value]
  if (customColor.value && parseHex(customColor.value)) {
    colors.push({ name: 'Personalizzato', hex: customColor.value })
  }
  return colors
})

const ratios = computed(() => {
  return textColors.value.map(tc => contrastRatio(backgroundColor.value, tc.hex))
})

const bestIndex = computed(() => {
  let best = -1
  let bestVal = -1
  ratios.value.forEach((r, i) => {
    if (r !== null && r > bestVal) {
      bestVal = r
      best = i
    }
  })
  return best
})

const bestRatio = computed(() => {
  if (bestIndex.value === -1) return null
  return ratios.value[bestIndex.value]
})

const bestTextName = computed(() => {
  if (bestIndex.value === -1) return 'Nessun testo'
  return textColors.value[bestIndex.value].name
})
</script>

<style>
/* ── Reset & global ── */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 100%;
  -webkit-text-size-adjust: 100%;
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #1A1D2E;
  background: #FEFDF9;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

:focus-visible {
  outline: 2px solid #1A1D2E;
  outline-offset: 2px;
}

/* ── App layout ── */
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ── Header ── */
.header {
  border-bottom: 1px solid #E2DFD5;
  background: #FEFDF9;
}

.header__inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 28px 20px 24px;
}

.header__title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.15;
  color: #1A1D2E;
  letter-spacing: -0.01em;
}

.header__tagline {
  margin-top: 6px;
  font-size: 15px;
  line-height: 1.55;
  color: #5A5D6E;
  max-width: 58ch;
}

/* ── Main ── */
.main {
  flex: 1;
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    "bg badge"
    "rows export";
  gap: 16px;
  align-items: start;
}

@media (max-width: 720px) {
  .main {
    grid-template-columns: 1fr;
    grid-template-areas:
      "bg"
      "badge"
      "rows"
      "export";
    gap: 12px;
    padding: 12px;
  }
}

/* ── Panels ── */
.panel {
  background: #FEFDF9;
  border: 1px solid #E2DFD5;
  border-radius: 10px;
  padding: 18px;
  min-width: 0;
}

.panel__heading {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #5A5D6E;
  margin-bottom: 14px;
}

.panel--bg {
  grid-area: bg;
}

.panel--badge {
  grid-area: badge;
  display: flex;
  flex-direction: column;
}

.panel--rows {
  grid-area: rows;
}

.panel--export {
  grid-area: export;
}

/* ── Swatch preview ── */
.panel__swatch-preview {
  margin-top: 12px;
  height: 44px;
  border-radius: 6px;
  border: 1px solid #E2DFD5;
  transition: background-color 300ms ease;
}

/* ── Badge wrap ── */
.badge-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 8px 0;
}

.badge-wrap__note {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 13px;
  color: #5A5D6E;
  text-align: center;
}

/* ── Rows list ── */
.rows-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ── Custom color ── */
.custom-color {
  margin-top: 12px;
  border-top: 1px solid #E2DFD5;
  padding-top: 12px;
}

.custom-color__summary {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #5A5D6E;
  cursor: pointer;
  user-select: none;
  min-height: 44px;
  list-style: none;
}

.custom-color__summary::-webkit-details-marker {
  display: none;
}

.custom-color__summary:focus-visible {
  outline: 2px solid #1A1D2E;
  outline-offset: 2px;
}

.custom-color__body {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ── Footer ── */
.footer {
  border-top: 1px solid #E2DFD5;
  text-align: center;
  padding: 16px 20px;
}

.footer__text {
  font-size: 12px;
  color: #5A5D6E;
  line-height: 1.5;
}

.footer__text a {
  color: #1A1D2E;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.footer__text a:hover {
  color: #E53E3E;
}
</style>
