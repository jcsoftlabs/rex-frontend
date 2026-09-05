<script setup lang="ts">
import { computed } from 'vue'
import { ETAPE_LABEL, type Etape, type FluxEtape } from '@/types'

/**
 * Parcours de dédouanement : la largeur du ruban suit le volume de dossiers,
 * et le liseré rouge au pied de chaque barre marque ceux qui sont en retard.
 */
const props = defineProps<{ flux: FluxEtape[]; etapeMiseEnAvant?: Etape }>()

const W = 760
const CY = 104
const MAXH = 132
const BW = 17
const X0 = 54

/* Les couleurs viennent des jetons CSS (--s1..--s6) : le thème peut les changer
   sans toucher au composant, et `currentColor` ne suffit pas ici. */
const TEINTES = ['var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)', 'var(--s5)', 'var(--s6)']

const dx = computed(() => (W - 2 * X0) / Math.max(props.flux.length - 1, 1))
const max = computed(() => Math.max(...props.flux.map((f) => f.passes), 1))

const x = (i: number) => X0 + i * dx.value
const h = (v: number) => (v / max.value) * MAXH

const barres = computed(() =>
  props.flux.map((f, i) => {
    const hauteur = h(f.passes)
    const enAvant = f.etape === props.etapeMiseEnAvant
    return {
      ...f,
      libelle: ETAPE_LABEL[f.etape],
      x: x(i), y: CY - hauteur / 2, h: hauteur,
      teinte: TEINTES[i % TEINTES.length],
      enAvant,
      hRetard: f.enRetard ? Math.max(7, (hauteur * f.enRetard) / 12) : 0,
    }
  }),
)

/** Un ruban par intervalle, reliant les bords haut et bas de deux barres. */
const rubans = computed(() =>
  props.flux.slice(0, -1).map((f, i) => {
    const xa = x(i) + BW / 2
    const xb = x(i + 1) - BW / 2
    const ha = h(f.passes) / 2
    const hb = h(props.flux[i + 1].passes) / 2
    const m = (xa + xb) / 2
    return {
      surface: `M${xa} ${CY - ha} C${m} ${CY - ha},${m} ${CY - hb},${xb} ${CY - hb}` +
               ` L${xb} ${CY + hb} C${m} ${CY + hb},${m} ${CY + ha},${xa} ${CY + ha} Z`,
      haut: `M${xa} ${CY - ha} C${m} ${CY - ha},${m} ${CY - hb},${xb} ${CY - hb}`,
      bas: `M${xa} ${CY + ha} C${m} ${CY + ha},${m} ${CY + hb},${xb} ${CY + hb}`,
    }
  }),
)
</script>

<template>
  <svg :viewBox="`0 0 ${W} 236`" class="flow" role="img" aria-label="Flux des dossiers par étape">
    <defs>
      <linearGradient id="ribFill" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="var(--s1)" :stop-opacity="0.3" />
        <stop offset="1" stop-color="var(--s6)" :stop-opacity="0.26" />
      </linearGradient>
      <linearGradient id="ribLine" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="var(--s1)" />
        <stop offset="1" stop-color="var(--s6)" />
      </linearGradient>
    </defs>

    <g class="rubans">
      <template v-for="(r, i) in rubans" :key="`r${i}`">
        <path :d="r.surface" fill="url(#ribFill)" />
        <path :d="r.haut" fill="none" stroke="url(#ribLine)" stroke-width="1.4" opacity=".55" />
        <path :d="r.bas" fill="none" stroke="url(#ribLine)" stroke-width="1.4" opacity=".55" />
      </template>
    </g>

    <g v-for="b in barres" :key="b.etape">
      <rect
        :x="b.x - BW / 2" :y="b.y" :width="BW" :height="b.h" rx="6"
        :fill="b.teinte"
        :stroke="b.enAvant ? 'var(--txt)' : 'none'"
        :stroke-opacity="b.enAvant ? 0.45 : 0"
        stroke-width="1.5"
      />
      <rect
        v-if="b.hRetard"
        :x="b.x - BW / 2" :y="b.y + b.h - b.hRetard" :width="BW" :height="b.hRetard"
        rx="6" fill="var(--red)"
      />
      <text :x="b.x" :y="b.y - 11" class="valeur">{{ b.passes }}</text>
      <text :x="b.x" :y="CY + MAXH / 2 + 30" class="etape" :class="{ avant: b.enAvant }">
        {{ b.libelle }}
      </text>
      <text :x="b.x" :y="CY + MAXH / 2 + 45" class="attente">{{ b.enAttente }} en attente</text>
    </g>

    <circle cx="20" cy="229" r="4" fill="var(--red)" />
    <text x="30" y="233" class="legende">dossiers en retard</text>
  </svg>
</template>

<style scoped>
.flow { display: block; width: 100%; height: auto; }
text { font-family: 'Inter', sans-serif; }
.valeur { text-anchor: middle; font-size: 15px; font-weight: 700; fill: var(--txt); }
.etape { text-anchor: middle; font-size: 10.5px; font-weight: 600; fill: var(--mut); }
.etape.avant { fill: var(--txt); }
.attente { text-anchor: middle; font-size: 9.5px; fill: var(--dim); }
.legende { font-size: 9.5px; fill: var(--mut); }
</style>
