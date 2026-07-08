<template>
  <div class="export">
    <div class="export__header">
      <h3 class="export__title">Esporta CSS</h3>
      <button
        class="export__copy-btn"
        @click="copy"
        :aria-label="copied ? 'Copiato!' : 'Copia codice CSS'"
      >
        <svg v-if="!copied" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>{{ copied ? 'Copiato' : 'Copia' }}</span>
      </button>
    </div>

    <pre class="export__code"><code>{{ cssCode }}</code></pre>

    <details class="export__details">
      <summary class="export__summary">Anteprima palette</summary>
      <div class="export__preview" :style="{ backgroundColor: bg }">
        <div
          v-for="c in textColors"
          :key="c.hex"
          class="export__preview-swatch"
          :style="{ color: c.hex }"
        >
          <span class="export__preview-label">{{ c.name }}</span>
          <span class="export__preview-hex">{{ c.hex }}</span>
        </div>
      </div>
    </details>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  bg: { type: String, required: true },
  textColors: { type: Array, required: true },
})

const copied = ref(false)

const cssCode = computed(() => {
  const lines = [
    '/* Palette generata con Contrastino */',
    '/* https://cristianporco.it/app/contrastino/ */',
    '',
    ':root {',
    `  --color-background: ${props.bg};`,
  ]

  for (const c of props.textColors) {
    const varName = '--color-text-' + c.name.toLowerCase().replace(/\s+/g, '-')
    lines.push(`  ${varName}: ${c.hex};`)
  }

  lines.push('}', '', 'body {', `  background-color: var(--color-background);`)
  lines.push(`  color: var(--color-text-${props.textColors[0]?.name?.toLowerCase().replace(/\s+/g, '-') || 'black'});`)
  lines.push('}')

  return lines.join('\n')
})

async function copy() {
  try {
    await navigator.clipboard.writeText(cssCode.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // Fallback
    const ta = document.createElement('textarea')
    ta.value = cssCode.value
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}
</script>

<style scoped>
.export {
  background: #F5F2EB;
  border-radius: 8px;
  overflow: hidden;
}

.export__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #E2DFD5;
}

.export__title {
  margin: 0;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 17px;
  font-weight: 600;
  color: #1A1D2E;
}

.export__copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1.5px solid #1A1D2E;
  border-radius: 6px;
  background: transparent;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #1A1D2E;
  cursor: pointer;
  transition: background 150ms ease, color 150ms ease;
  min-height: 44px;
}

.export__copy-btn:hover {
  background: #1A1D2E;
  color: #FEFDF9;
}

.export__copy-btn:focus-visible {
  outline: 2px solid #1A1D2E;
  outline-offset: 2px;
}

.export__code {
  margin: 0;
  padding: 16px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
  line-height: 1.65;
  color: #1A1D2E;
  background: #FEFDF9;
  overflow-x: auto;
  white-space: pre;
  tab-size: 2;
  border-bottom: 1px solid #E2DFD5;
}

.export__code code {
  font-family: inherit;
}

.export__details {
  border-top: 1px solid #E2DFD5;
}

.export__summary {
  padding: 12px 16px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #5A5D6E;
  cursor: pointer;
  user-select: none;
  min-height: 44px;
  display: flex;
  align-items: center;
}

.export__summary:focus-visible {
  outline: 2px solid #1A1D2E;
  outline-offset: -2px;
}

.export__preview {
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: background-color 300ms ease;
}

.export__preview-swatch {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  font-family: 'Inter', system-ui, sans-serif;
}

.export__preview-label {
  font-size: 15px;
  font-weight: 600;
}

.export__preview-hex {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 12px;
  opacity: 0.7;
}

@media (max-width: 480px) {
  .export__code {
    font-size: 11px;
    padding: 12px;
  }
  .export__header {
    padding: 12px;
  }
}
</style>
