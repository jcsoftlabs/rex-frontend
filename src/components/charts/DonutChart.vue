<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  parts: { part: number; couleur: string }[]
  /** Affichés au centre de l'anneau. */
  total?: string
  legende?: string
}>()

const R = 44
const C = 2 * Math.PI * R

/** Chaque segment est un arc obtenu par `stroke-dasharray`, décalé du cumul précédent. */
const segments = computed(() => {
  let cumul = 0
  return props.parts.map((p) => {
    const longueur = (C * p.part) / 100
    const segment = { couleur: p.couleur, dash: `${longueur - 3} ${C - longueur + 3}`, offset: -cumul }
    cumul += longueur
    return segment
  })
})
</script>

<template>
  <svg viewBox="0 0 120 120" class="donut" role="img">
    <circle
      v-for="(s, i) in segments" :key="i"
      cx="60" cy="60" :r="R" fill="none" :stroke="s.couleur" stroke-width="17"
      :stroke-dasharray="s.dash" :stroke-dashoffset="s.offset"
      transform="rotate(-90 60 60)"
    />
    <text v-if="total" x="60" y="56" class="total">{{ total }}</text>
    <text v-if="legende" x="60" y="70" class="legende">{{ legende }}</text>
  </svg>
</template>

<style scoped>
.donut { display: block; }
text { font-family: 'Inter', sans-serif; text-anchor: middle; }
.total { font-size: 17px; font-weight: 700; fill: var(--txt); }
.legende { font-size: 8.5px; fill: var(--dim); }
</style>
