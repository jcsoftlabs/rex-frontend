<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import StatusTag from '@/components/ui/StatusTag.vue'
import { api } from '@/api/endpoints'
import type { Facture } from '@/types'
import { formaterDate, formaterMontant, formaterNombre } from '@/composables/useFormat'

const factures = ref<Facture[]>([])
const chargement = ref(true)
const erreur = ref<string | null>(null)

onMounted(async () => {
  try {
    factures.value = (await api.factures()).items
  } catch (e) {
    erreur.value = e instanceof Error ? e.message : 'Chargement impossible'
  } finally {
    chargement.value = false
  }
})

/** Reste dû = total facturé moins ce qui a déjà été encaissé. */
const resteDu = (f: Facture) => f.total.valeur - f.montantPaye.valeur

const totalImpaye = computed(() =>
  factures.value
    .filter((f) => f.statut !== 'payee' && f.statut !== 'annulee')
    .reduce((somme, f) => somme + resteDu(f), 0),
)
</script>

<template>
  <AppTopbar
    titre="Factures"
    :sous-titre="`${formaterNombre(totalImpaye)} HTG restant à encaisser`"
  />
  <section class="card">
    <div class="card-hd"><h3>Toutes les factures</h3></div>
    <p v-if="chargement" class="etat">Chargement…</p>
    <p v-else-if="erreur" class="etat erreur">{{ erreur }}</p>
    <table v-else class="tbl">
      <thead>
        <tr>
          <th>FACTURE</th><th>CLIENT</th><th>DOSSIER</th>
          <th style="text-align: right">HONORAIRES</th>
          <th style="text-align: right">DÉBOURS</th>
          <th style="text-align: right">TOTAL</th>
          <th style="text-align: right">RESTE DÛ</th>
          <th>ÉCHÉANCE</th><th>STATUT</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="f in factures" :key="f.id">
          <td class="strong">{{ f.reference }}</td>
          <td>{{ f.clientNom }}</td>
          <td>{{ f.dossierReference ?? '—' }}</td>
          <td class="num">{{ formaterNombre(f.honoraires.valeur) }}</td>
          <td class="num">{{ formaterNombre(f.debours.valeur) }}</td>
          <td class="num">{{ formaterMontant(f.total) }}</td>
          <td class="num" :class="{ retard: f.joursRetard > 0 && resteDu(f) > 0 }">
            {{ formaterNombre(resteDu(f)) }}
          </td>
          <td>
            {{ formaterDate(f.echeanceLe) }}
            <span v-if="f.joursRetard > 0" class="jr">+{{ f.joursRetard }} j</span>
          </td>
          <td><StatusTag :statut="f.statut" /></td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
.etat { font-size: 12.5px; color: var(--mut); padding: 34px 0; text-align: center; }
.etat.erreur { color: var(--red); }
.retard { color: var(--red); }
.jr { color: var(--red); font-weight: 600; font-size: 10px; margin-left: 5px; }
</style>
