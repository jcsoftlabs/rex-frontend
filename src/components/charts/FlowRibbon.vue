<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import { ETAPE_LABEL, type Etape, type FluxEtape } from '@/types'
import { formaterNombre } from '@/composables/useFormat'

/**
 * Parcours de dédouanement : la largeur du ruban suit le volume de dossiers,
 * et le liseré rouge au pied de chaque barre marque ceux qui sont en retard.
 *
 * Le détail d'une étape s'affiche au survol et se fixe au clic. La carte se
 * place du côté où il reste de la place, et reste déplaçable à la souris —
 * sans quoi elle masquerait les étapes voisines.
 */
const props = defineProps<{ flux: FluxEtape[]; etapeMiseEnAvant?: Etape }>()

const W = 760
const H = 236
const CY = 104
const MAXH = 132
const BW = 17
const X0 = 54

const TEINTES = ['var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)', 'var(--s5)', 'var(--s6)']

const dx = computed(() => (W - 2 * X0) / Math.max(props.flux.length - 1, 1))
const max = computed(() => Math.max(...props.flux.map((f) => f.passes), 1))

const x = (i: number) => X0 + i * dx.value
const h = (v: number) => (v / max.value) * MAXH

/* ---------------- interaction ---------------- */

const survolee = ref<Etape | null>(null)
const epinglee = ref<Etape | null>(null)

/** L'épinglage l'emporte : survoler une autre étape ne vole pas la sélection. */
const affichee = computed(() => epinglee.value ?? survolee.value)
const detail = computed(() => props.flux.find((f) => f.etape === affichee.value) ?? null)
const indexAffiche = computed(() => props.flux.findIndex((f) => f.etape === affichee.value))

function basculer(etape: Etape): void {
  epinglee.value = epinglee.value === etape ? null : etape
  decalage.value = { x: 0, y: 0 }
}

function fermer(): void {
  epinglee.value = null
  survolee.value = null
  decalage.value = { x: 0, y: 0 }
}

/* ---------------- déplacement ---------------- */

const decalage = ref({ x: 0, y: 0 })
const enDeplacement = ref(false)
let depart = { sourisX: 0, sourisY: 0, x: 0, y: 0 }

function debutDeplacement(e: PointerEvent): void {
  const cible = e.currentTarget as HTMLElement
  cible.setPointerCapture(e.pointerId)
  depart = { sourisX: e.clientX, sourisY: e.clientY, x: decalage.value.x, y: decalage.value.y }
  enDeplacement.value = true
  /* Déplacer une carte survolée l'épingle, sinon elle disparaîtrait en cours de route. */
  if (!epinglee.value && affichee.value) epinglee.value = affichee.value
}

function deplacer(e: PointerEvent): void {
  if (!enDeplacement.value) return
  decalage.value = {
    x: depart.x + (e.clientX - depart.sourisX),
    y: depart.y + (e.clientY - depart.sourisY),
  }
}

function finDeplacement(e: PointerEvent): void {
  if (!enDeplacement.value) return
  ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
  enDeplacement.value = false
}

/* La carte revient à sa place quand elle change d'étape. */
watch(affichee, () => {
  if (!enDeplacement.value) decalage.value = { x: 0, y: 0 }
})

/* ---------------- géométrie ---------------- */

const barres = computed(() =>
  props.flux.map((f, i) => {
    const hauteur = h(f.passes)
    return {
      ...f,
      libelle: ETAPE_LABEL[f.etape],
      x: x(i), y: CY - hauteur / 2, h: hauteur,
      teinte: TEINTES[i % TEINTES.length],
      /* Mise en avant : l'étape affichée, ou celle par défaut si rien n'est affiché. */
      enAvant: affichee.value ? f.etape === affichee.value : f.etape === props.etapeMiseEnAvant,
      hRetard: f.enRetard ? Math.max(7, (hauteur * f.enRetard) / 12) : 0,
    }
  }),
)

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

/** Zones de survol larges : les barres seules seraient trop fines à viser. */
const zones = computed(() =>
  props.flux.map((f, i) => ({
    etape: f.etape,
    libelle: ETAPE_LABEL[f.etape],
    x: x(i) - dx.value / 2,
    largeur: dx.value,
  })),
)

/**
 * La carte se pose du côté où il reste de la place : à droite tant que l'étape
 * est dans les deux premiers tiers, à gauche ensuite. Elle ne recouvre jamais
 * la barre qu'elle décrit.
 */
const ancrage = computed(() => {
  const i = indexAffiche.value
  if (i < 0) return { gauche: '0%', versLaGauche: false }
  const xBarre = x(i)
  const versLaGauche = xBarre / W > 0.58
  const xCarte = versLaGauche ? xBarre - BW / 2 - 14 : xBarre + BW / 2 + 14
  return { gauche: `${(xCarte / W) * 100}%`, versLaGauche }
})

const styleCarte = computed(() => ({
  left: ancrage.value.gauche,
  transform:
    `translate(${ancrage.value.versLaGauche ? '-100%' : '0'}, -50%)` +
    ` translate(${decalage.value.x}px, ${decalage.value.y}px)`,
}))
</script>

<template>
  <div class="enveloppe">
    <svg :viewBox="`0 0 ${W} ${H}`" class="flow" role="img" aria-label="Flux des dossiers par étape">
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

      <g>
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

      <!-- Cibles de survol, transparentes et plus larges que les barres -->
      <rect
        v-for="z in zones" :key="`z${z.etape}`"
        :x="z.x" y="0" :width="z.largeur" :height="H"
        fill="transparent" class="zone"
        role="button" tabindex="0"
        :aria-label="`Détail de l'étape ${z.libelle}`"
        @mouseenter="survolee = z.etape"
        @mouseleave="survolee = null"
        @click="basculer(z.etape)"
        @keydown.enter.prevent="basculer(z.etape)"
        @keydown.space.prevent="basculer(z.etape)"
      />

      <circle cx="20" cy="229" r="4" fill="var(--red)" />
      <text x="30" y="233" class="legende">dossiers en retard</text>
    </svg>

    <div
      v-if="detail"
      class="ftip"
      :class="{ epinglee: epinglee !== null, deplacement: enDeplacement }"
      :style="styleCarte"
    >
      <header
        class="poignee"
        @pointerdown="debutDeplacement"
        @pointermove="deplacer"
        @pointerup="finDeplacement"
        @pointercancel="finDeplacement"
      >
        <h5>{{ ETAPE_LABEL[detail.etape] }}</h5>
        <button
          v-if="epinglee"
          class="fermer" aria-label="Fermer" title="Fermer"
          @pointerdown.stop @click.stop="fermer"
        >×</button>
      </header>

      <dl>
        <dt>Dossiers passés</dt><dd>{{ detail.passes }}</dd>
        <dt>En attente</dt>
        <dd>{{ detail.enAttente }}<template v-if="detail.enRetard"> dont {{ detail.enRetard }} en retard</template></dd>
        <dt>Délai moyen</dt><dd>{{ formaterNombre(detail.delaiMoyenJours, 1) }} jours</dd>
      </dl>

      <RouterLink :to="{ path: '/dossiers', query: { etape: detail.etape } }" class="btn-gold">
        Voir les dossiers <AppIcon name="arrowRight" :size="13" :width="2.4" />
      </RouterLink>

      <p v-if="!epinglee" class="astuce">Cliquez pour fixer · glissez pour déplacer</p>
    </div>
  </div>
</template>

<style scoped>
.enveloppe { position: relative; }
.flow { display: block; width: 100%; height: auto; }
text { font-family: 'Inter', sans-serif; }
.valeur { text-anchor: middle; font-size: 15px; font-weight: 700; fill: var(--txt); }
.etape { text-anchor: middle; font-size: 10.5px; font-weight: 600; fill: var(--mut); }
.etape.avant { fill: var(--txt); }
.attente { text-anchor: middle; font-size: 9.5px; fill: var(--dim); }
.legende { font-size: 9.5px; fill: var(--mut); }
.zone { cursor: pointer; }

.ftip {
  position: absolute;
  top: 44%;
  width: 202px;
  background: var(--tipbg);
  border: 1px solid var(--tipbd);
  border-radius: 12px;
  padding: 0 14px 13px;
  box-shadow: 0 22px 44px var(--shadow);
  z-index: 2;
}
/* Non épinglée, la carte laisse passer la souris : elle ne peut pas se
   retrouver sous le curseur et bloquer le survol de l'étape voisine. */
.ftip:not(.epinglee) { pointer-events: none; }
.ftip:not(.epinglee) .poignee { pointer-events: auto; }
.ftip.deplacement { user-select: none; }

.poignee {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 0 9px;
  cursor: grab;
  touch-action: none;
}
.ftip.deplacement .poignee { cursor: grabbing; }
.poignee h5 { font-size: 13px; font-weight: 600; }
.fermer {
  margin-left: auto; width: 20px; height: 20px;
  border: 0; background: var(--panel2); color: var(--mut);
  border-radius: 6px; font-size: 14px; line-height: 1; cursor: pointer;
}
.fermer:hover { color: var(--txt); }

dl { display: grid; grid-template-columns: auto 1fr; gap: 7px 10px; font-size: 11px; margin-bottom: 12px; }
dt { color: var(--dim); }
dd { text-align: right; font-weight: 600; }

.btn-gold { font-size: 11.5px; padding: 8px; text-decoration: none; }
.astuce { font-size: 9.5px; color: var(--dim); text-align: center; margin-top: 8px; }
</style>
