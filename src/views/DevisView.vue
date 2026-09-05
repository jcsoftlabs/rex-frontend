<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import { api } from '@/api/endpoints'
import type { Devis } from '@/types'
import { formaterDate, formaterMontant } from '@/composables/useFormat'

const devis = ref<Devis[]>([])
const chargement = ref(true)

const LIBELLE: Record<string, string> = {
  brouillon: 'Brouillon', envoye: 'Envoyé', accepte: 'Accepté', refuse: 'Refusé', expire: 'Expiré',
}
const TON: Record<string, string> = {
  brouillon: 'neutre', envoye: 'blue', accepte: 'green', refuse: 'red', expire: 'amber',
}

onMounted(async () => {
  devis.value = (await api.devis()).items
  chargement.value = false
})
</script>

<template>
  <AppTopbar titre="Devis" sous-titre="Suivi commercial et relances." />
  <section class="card">
    <div class="card-hd"><h3>{{ devis.length }} devis</h3></div>
    <p v-if="chargement" class="etat">Chargement…</p>
    <table v-else class="tbl">
      <thead>
        <tr>
          <th>DEVIS</th><th>CLIENT</th>
          <th style="text-align: right">MONTANT</th>
          <th>ÉMIS LE</th><th>VALABLE JUSQU'AU</th>
          <th style="text-align: center">RELANCES</th>
          <th>STATUT</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="dv in devis" :key="dv.id">
          <td class="strong">{{ dv.reference }}</td>
          <td>{{ dv.clientNom }}</td>
          <td class="num">{{ formaterMontant(dv.total) }}</td>
          <td>{{ formaterDate(dv.emisLe) }}</td>
          <td>{{ formaterDate(dv.valableJusquau) }}</td>
          <td class="center">{{ dv.nombreRelances }}</td>
          <td><span class="tag" :class="TON[dv.statut]">{{ LIBELLE[dv.statut] }}</span></td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
.etat { font-size: 12.5px; color: var(--mut); padding: 34px 0; text-align: center; }
.tag { font-size: 9.5px; font-weight: 700; border-radius: 999px; padding: 3px 8px; white-space: nowrap; }
.red { background: var(--t-red-bg); color: var(--tag-r-fg); }
.amber { background: var(--tag-a-bg); color: var(--tag-a-fg); }
.green { background: var(--t-grn-bg); color: var(--tag-g-fg); }
.blue { background: var(--t-blue-bg); color: var(--tag-b-fg); }
.neutre { background: var(--panel2); color: var(--dim); }
</style>
