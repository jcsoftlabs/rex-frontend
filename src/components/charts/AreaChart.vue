<script setup lang="ts">
import { computed } from 'vue'
import { lisser } from './courbe'

/** Aires empilées : chaque série est tracée cumulée, la plus haute d'abord. */
const props = withDefaults(
  defineProps<{
    series: { valeurs: number[]; couleur: string; opacite?: number }[]
    max: number
    lignes?: number
  }>(),
  { lignes: 4 },
)

const W = 320
const H = 118

const nbPoints = computed(() => props.series[0]?.valeurs.length ?? 0)
const px = (i: number) => 8 + i * ((W - 16) / Math.max(nbPoints.value - 1, 1))
const py = (v: number) => H - 8 - (v / props.max) * (H - 20)

/** Cumule les séries pour que les aires s'empilent au lieu de se recouvrir. */
const couches = computed(() => {
  const cumul = new Array(nbPoints.value).fill(0)
  const resultat = props.series.map((s) => {
    const total = s.valeurs.map((v, i) => (cumul[i] += v))
    return { ...s, points: total.map((v, i) => [px(i), py(v)] as [number, number]) }
  })
  /* Dessin du plus haut au plus bas, sinon les aires se masquent entre elles. */
  return resultat.reverse()
})

const grille = computed(() =>
  Array.from({ length: props.lignes + 1 }, (_, i) => 8 + i * ((H - 20) / props.lignes)),
)
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${H}`" class="area" role="img">
    <defs>
      <linearGradient v-for="(c, i) in couches" :key="`g${i}`" :id="`aire${i}`" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" :stop-color="c.couleur" :stop-opacity="c.opacite ?? 0.4" />
        <stop offset="1" :stop-color="c.couleur" stop-opacity="0" />
      </linearGradient>
    </defs>

    <line v-for="(y, i) in grille" :key="`l${i}`" x1="0" :x2="W" :y1="y" :y2="y" stroke="var(--grid)" stroke-width="1" />

    <template v-for="(c, i) in couches" :key="`c${i}`">
      <path
        :d="`${lisser(c.points)} L${c.points[c.points.length - 1][0]} ${H} L${c.points[0][0]} ${H} Z`"
        :fill="`url(#aire${i})`"
      />
      <path :d="lisser(c.points)" fill="none" :stroke="c.couleur" stroke-width="2.3" stroke-linecap="round" />
      <circle
        :cx="c.points[c.points.length - 1][0]" :cy="c.points[c.points.length - 1][1]"
        r="4.5" :fill="c.couleur" stroke="var(--panel)" stroke-width="2.4"
      />
    </template>
  </svg>
</template>

<style scoped>
.area { display: block; width: 100%; height: auto; }
</style>
