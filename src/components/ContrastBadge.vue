<template>
  <div class="badge" :class="badgeClass" :aria-label="ariaLabel">
    <svg class="badge__ring" viewBox="0 0 120 120" aria-hidden="true">
      <circle
        cx="60" cy="60" r="54"
        fill="none"
        stroke="currentColor"
        stroke-width="6"
        class="badge__track"
      />
      <circle
        cx="60" cy="60" r="54"
        fill="none"
        stroke="currentColor"
        stroke-width="6"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        class="badge__fill"
        :style="{ transition: 'stroke-dashoffset 400ms ease' }"
      />
    </svg>
    <div class="badge__content">
      <span class="badge__ratio">{{ displayRatio }}</span>
      <span class="badge__label">{{ levelLabel }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { wcagLevel, wcagLevelLarge } from '../utils/contrast.js'

const props = defineProps({
  ratio: { type: Number, default: null },
  isLarge: { type: Boolean, default: false },
})

const circumference = 2 * Math.PI * 54 // ~339.29

const displayRatio = computed(() => {
  if (props.ratio === null) return '—'
  return props.ratio.toFixed(1)
})

const level = computed(() => {
  if (props.ratio === null) return 'FAIL'
  return props.isLarge ? wcagLevelLarge(props.ratio) : wcagLevel(props.ratio)
})

const levelLabel = computed(() => {
  if (level.value === 'AAA') return 'AAA'
  if (level.value === 'AA') return 'AA'
  return 'Non conforme'
})

const badgeClass = computed(() => ({
  'badge--pass': level.value === 'AAA',
  'badge--aa': level.value === 'AA',
  'badge--fail': level.value === 'FAIL',
}))

const dashOffset = computed(() => {
  if (props.ratio === null) return circumference
  // Max fill at ratio 21 (max possible). Map ratio 0..21 to fraction 0..1
  const fraction = Math.min(props.ratio / 21, 1)
  return circumference * (1 - fraction)
})

const ariaLabel = computed(() => {
  if (props.ratio === null) return 'Nessun rapporto di contrasto calcolato'
  return `Rapporto di contrasto ${props.ratio.toFixed(1)} a 1, livello ${levelLabel.value}`
})
</script>

<style scoped>
.badge {
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.badge__ring {
  width: 100%;
  height: 100%;
}

.badge__track {
  color: #E2DFD5;
}

.badge__fill {
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}

.badge--pass .badge__fill {
  color: #319795;
}

.badge--aa .badge__fill {
  color: #D69E2E;
}

.badge--fail .badge__fill {
  color: #E53E3E;
}

.badge__content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.badge__ratio {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
  color: #1A1D2E;
}

.badge__label {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-top: 2px;
  color: #5A5D6E;
}

.badge--pass .badge__ratio { color: #1A6B6A; }
.badge--aa .badge__ratio { color: #8B6914; }
.badge--fail .badge__ratio { color: #C53030; }

.badge--pass .badge__label { color: #319795; }
.badge--aa .badge__label { color: #D69E2E; }
.badge--fail .badge__label { color: #E53E3E; }

@media (max-width: 480px) {
  .badge {
    width: 96px;
    height: 96px;
  }
  .badge__ratio {
    font-size: 22px;
  }
  .badge__label {
    font-size: 10px;
  }
}
</style>
