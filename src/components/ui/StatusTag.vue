<script setup lang="ts">
import { computed } from 'vue'
import { STATUT_LABEL, STATUT_FACTURE_LABEL, type StatutDossier, type StatutFacture } from '@/types'

const props = defineProps<{ statut: StatutDossier | StatutFacture }>()

/** Chaque statut a une couleur fixe, cohérente d'un écran à l'autre. */
const TON: Record<string, 'red' | 'amber' | 'green' | 'blue' | 'neutre'> = {
  en_retard: 'red', echue: 'red', annulee: 'red', refuse: 'red',
  prioritaire: 'amber', partielle: 'amber', expire: 'amber',
  pret: 'green', payee: 'green', accepte: 'green',
  en_cours: 'blue', emise: 'blue', envoye: 'blue',
  cloture: 'neutre', brouillon: 'neutre',
}

const ton = computed(() => TON[props.statut] ?? 'neutre')
const libelle = computed(
  () =>
    STATUT_LABEL[props.statut as StatutDossier] ??
    STATUT_FACTURE_LABEL[props.statut as StatutFacture] ??
    props.statut,
)
</script>

<template>
  <span class="tag" :class="ton">{{ libelle }}</span>
</template>

<style scoped>
.tag {
  font-size: 9.5px;
  font-weight: 700;
  border-radius: 999px;
  padding: 3px 8px;
  white-space: nowrap;
  display: inline-block;
}
.red { background: var(--t-red-bg); color: var(--tag-r-fg); }
.amber { background: var(--tag-a-bg); color: var(--tag-a-fg); }
.green { background: var(--t-grn-bg); color: var(--tag-g-fg); }
.blue { background: var(--t-blue-bg); color: var(--tag-b-fg); }
.neutre { background: var(--panel2); color: var(--dim); }
</style>
