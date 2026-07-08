<template>
  <div
    class="row"
    :style="{ backgroundColor: bg }"
    :class="{ 'row--active': isBest }"
  >
    <div class="row__preview" :style="{ color: fg }">
      <span class="row__sample-text">Aa</span>
    </div>

    <div class="row__info">
      <div class="row__color-name">
        <span class="row__swatch-dot" :style="{ backgroundColor: fg }"></span>
        <span class="row__name">{{ name }}</span>
        <code class="row__hex">{{ fg }}</code>
      </div>

      <div class="row__results">
        <!-- Normal text -->
        <div class="row__level" :class="'row__level--' + normalLevel.toLowerCase()">
          <span class="row__level-badge">{{ normalLevel }}</span>
          <span class="row__level-detail">
            {{ ratioText }} — Testo normale
            <template v-if="normalLevel === 'FAIL'">(min 4.5:1)</template>
            <template v-else-if="normalLevel === 'AA'">(AAA: 7:1)</template>
          </span>
        </div>

        <!-- Large text -->
        <div class="row__level row__level--sm" :class="'row__level--' + largeLevel.toLowerCase()">
          <span class="row__level-badge row__level-badge--sm">{{ largeLevel }}</span>
          <span class="row__level-detail">
            Testo grande
            <template v-if="largeLevel === 'FAIL'">(min 3:1)</template>
            <template v-else-if="largeLevel === 'AA'">(AAA: 4.5:1)</template>
          </span>
        </div>
      </div>
    </div>

    <!-- Best indicator -->
    <div v-if="isBest" class="row__best-tag">Migliore</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { contrastRatio, wcagLevel, wcagLevelLarge } from '../utils/contrast.js'

const props = defineProps({
  bg: { type: String, required: true },
  fg: { type: String, required: true },
  name: { type: String, required: true },
  isBest: { type: Boolean, default: false },
})

const ratio = computed(() => contrastRatio(props.bg, props.fg))

const ratioText = computed(() => {
  if (ratio.value === null) return '—'
  return ratio.value.toFixed(1) + ':1'
})

const normalLevel = computed(() => {
  if (ratio.value === null) return 'FAIL'
  return wcagLevel(ratio.value)
})

const largeLevel = computed(() => {
  if (ratio.value === null) return 'FAIL'
  return wcagLevelLarge(ratio.value)
})
</script>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1.5px solid #E2DFD5;
  transition: border-color 200ms ease, box-shadow 200ms ease;
  position: relative;
  min-height: 44px;
}

.row--active {
  border-color: #319795;
  box-shadow: 0 0 0 3px rgba(49, 151, 149, 0.12);
}

.row__preview {
  width: 44px;
  height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(0,0,0,0.04);
}

.row__sample-text {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
}

.row__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.row__color-name {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.row__swatch-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.1);
  flex-shrink: 0;
}

.row__name {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #1A1D2E;
}

.row__hex {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 12px;
  font-weight: 500;
  color: #5A5D6E;
  background: rgba(0,0,0,0.04);
  padding: 2px 6px;
  border-radius: 3px;
}

.row__results {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.row__level {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.4;
}

.row__level--sm {
  font-size: 12px;
}

.row__level-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 22px;
  padding: 0 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.row__level-badge--sm {
  min-width: 32px;
  height: 20px;
  font-size: 10px;
}

.row__level--aaa .row__level-badge {
  background: #E6FFFA;
  color: #1A6B6A;
}

.row__level--aa .row__level-badge {
  background: #FFFBEB;
  color: #8B6914;
}

.row__level--fail .row__level-badge {
  background: #FFF5F5;
  color: #C53030;
}

.row__level-detail {
  color: #5A5D6E;
}

.row__best-tag {
  position: absolute;
  top: -8px;
  right: 12px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: #319795;
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
}

@media (max-width: 480px) {
  .row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .row__preview {
    align-self: flex-start;
  }
}
</style>
