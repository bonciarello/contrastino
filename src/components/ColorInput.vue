<template>
  <div class="color-input">
    <label :for="id" class="color-input__label">{{ label }}</label>
    <div class="color-input__row">
      <div class="color-input__swatch" :style="{ backgroundColor: modelValue }">
        <input
          type="color"
          :id="id"
          :value="modelValue"
          @input="onPicker"
          class="color-input__picker"
          :aria-label="'Selettore colore ' + label.toLowerCase()"
        />
      </div>
      <div class="color-input__hex-wrap">
        <span class="color-input__hash" aria-hidden="true">#</span>
        <input
          type="text"
          :value="hexDigits"
          @input="onHexInput"
          @blur="onHexBlur"
          @paste="onHexPaste"
          class="color-input__hex"
          maxlength="6"
          spellcheck="false"
          autocomplete="off"
          :aria-label="'Codice esadecimale ' + label.toLowerCase()"
          :aria-invalid="!valid"
        />
      </div>
    </div>
    <p v-if="!valid && hexDigits.length > 0" class="color-input__error" role="alert">
      Inserisci 6 caratteri esadecimali (0–9, A–F).
    </p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { parseHex, normalizeHex, sanitizeHexInput } from '../utils/contrast.js'

const props = defineProps({
  modelValue: { type: String, required: true },
  label: { type: String, default: 'Colore' },
  id: { type: String, required: true },
})

const emit = defineEmits(['update:modelValue'])

const hexDigits = ref(props.modelValue.replace(/^#/, ''))

const valid = computed(() => {
  if (hexDigits.value.length !== 6) return false
  return parseHex('#' + hexDigits.value) !== null
})

function onPicker(e) {
  const v = e.target.value.toUpperCase()
  hexDigits.value = v.replace(/^#/, '')
  emit('update:modelValue', v)
}

function onHexInput(e) {
  const cleaned = sanitizeHexInput(e.target.value)
  hexDigits.value = cleaned
  if (cleaned.length === 6) {
    emit('update:modelValue', normalizeHex(cleaned))
  }
}

function onHexBlur() {
  if (hexDigits.value.length === 6 && valid.value) {
    emit('update:modelValue', normalizeHex(hexDigits.value))
  } else if (hexDigits.value.length > 0 && hexDigits.value.length < 6) {
    // Pad with zeros
    const padded = hexDigits.value.padEnd(6, '0')
    hexDigits.value = padded
    emit('update:modelValue', normalizeHex(padded))
  }
}

function onHexPaste(e) {
  const pasted = (e.clipboardData || window.clipboardData).getData('text')
  const cleaned = sanitizeHexInput(pasted)
  if (cleaned.length === 6) {
    e.preventDefault()
    hexDigits.value = cleaned
    emit('update:modelValue', normalizeHex(cleaned))
  }
}
</script>

<style scoped>
.color-input {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.color-input__label {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #5A5D6E;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.color-input__row {
  display: flex;
  align-items: stretch;
  gap: 0;
  border: 1.5px solid #E2DFD5;
  border-radius: 6px;
  overflow: hidden;
  transition: border-color 200ms ease;
  background: #FEFDF9;
}

.color-input__row:focus-within {
  border-color: #1A1D2E;
  box-shadow: 0 0 0 3px rgba(26, 29, 46, 0.08);
}

.color-input__swatch {
  position: relative;
  width: 44px;
  min-width: 44px;
  border-right: 1.5px solid #E2DFD5;
}

.color-input__picker {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  border: none;
  padding: 0;
}

.color-input__hex-wrap {
  display: flex;
  align-items: center;
  flex: 1;
  padding: 0 10px;
  gap: 2px;
}

.color-input__hash {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 15px;
  color: #5A5D6E;
  user-select: none;
}

.color-input__hex {
  flex: 1;
  border: none;
  background: transparent;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 15px;
  font-weight: 500;
  color: #1A1D2E;
  outline: none;
  padding: 10px 0;
  min-width: 0;
  letter-spacing: 0.02em;
}

.color-input__hex::placeholder {
  color: #C4C0B5;
}

.color-input__error {
  margin: 0;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12px;
  color: #E53E3E;
  line-height: 1.4;
}
</style>
